<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { GridApi, themeAlpine } from 'ag-grid-community'
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import { accountType } from '@/types/components/account'

import { ctr_time_zone } from '@/services/ctr_time_zone'
import { ctr_account } from '@/services/ctr_account'
import MdArrowRoundBack from '@/assets/icons/MdArrowRoundBack.vue'
import MdArrowRoundForward from '@/assets/icons/MdArrowRoundForward.vue'
import { TS } from '@/enum/campaign'

const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const current = ref<number | undefined>(1)
const currentStatus = ref<'process' | 'error' | 'wait' | 'finish' | undefined>(
  'process'
)
const account = ref<accountType>({
  id: 0,
  name: '',
  email: '',
  object: '',
  account_ads: [],
  client_id: '',
  client_secret: '',
  access_token: '',
  pixel_id: '',
  pixel_token: '',
  time_zone: 'UTC',
})
const gridApi = ref<GridApi | null>(null) // Optional - for accessing Grid's API
const gridColumnApi = ref<any>() // Optional - for accessing Grid's Column API
const page = ref<number>(1)
const pageSize = ref<number>(100)
const isSubmitBtnLoading = ref<boolean>(false)
const timezoneOptions = ref<SelectOption[]>([])

const isDisabelNextStep = computed<boolean>(() => {
  return (
    account.value.client_id === '' ||
    account.value.client_secret === '' ||
    account.value.access_token === '' ||
    (current.value !== undefined && current.value > 2)
  )
})
const defaultColDef = computed(() => {
  return {
    resizable: true,
  }
})
const columnDefs = computed(() => {
  return [
    {
      headerName: 'ACCOUNT ID',
      field: 'account_id',
    },
    {
      headerName: 'NAME',
      field: 'show_name',
    },
    {
      headerName: 'PIXEL ID',
      field: 'pixel_id',
    },
    {
      headerName: 'PIXEL TOKEN',
      field: 'pixel_token',
    },
  ]
})
const pageCount = computed<number>(() => {
  const ads = account.value?.account_ads ?? []
  if (ads.length === 0) return 1
  return Math.ceil(ads.length / pageSize.value)
})

const nextStep = async () => {
  if (current.value === undefined) {
    current.value = 1
  } else if (current.value >= 3) {
    current.value = undefined
  } else {
    if (current.value === 2) {
      const result = await ctr_account.Connect(TS.FACEBOOK, {
        params: {
          client_id: `${account.value.client_id}`,
          client_secret: `${account.value.client_secret}`,
          access_token: `${account.value.access_token}`,
          time_zone: `${account.value.time_zone}`,
        },
      })

      if (result?.data) {
        const { pixel_id, pixel_token, time_zone } = account.value
        account.value = result.data
        account.value.pixel_id = pixel_id
        account.value.pixel_token = pixel_token
        account.value.time_zone = time_zone
        gridApi.value?.sizeColumnsToFit()
      }
    }
    current.value++
  }
}

const prevStep = () => {
  if (current.value === 0) {
    current.value = undefined
  } else if (current.value === undefined) {
    current.value = 3
  } else {
    current.value!--
  }
}
const onGridReady = (params: any) => {
  gridApi.value = params.api
  gridColumnApi.value = params.columnApi
}
const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_account.Add(account.value)
  isSubmitBtnLoading.value = false

  if (result?.status) {
    window.message.success('Submit successfully!')
    window.router.push({ path: '/accounts' })
    return
  }
}

onMounted(async () => {
  const result = await ctr_time_zone.List()
  if (result?.status) {
    timezoneOptions.value = result.data
  }
})
</script>
<template>
  <!-- steps map -->
  <div class="mt-12">
    <n-steps :current="current" :status="currentStatus">
      <n-step
        title="Facebook App"
        description="Enter your Facebook App ID and App Secret"
      />
      <n-step
        title="Pixel Center"
        description="Enter your Facebook Pixel ID and Pixel Token"
      />
      <n-step
        title="Preview"
        description="Verify and preview your Facebook Ads Account and Pixel"
      />
    </n-steps>
  </div>
  <!-- step 1 -->
  <div v-show="current === 1" class="mt-6">
    <n-card title="Facebook App">
      <!-- Client ID -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Client ID</div>
        <div class="w-3/4">
          <n-input
            v-model:value="account.client_id"
            placeholder="Enter the Client ID of Facebook App"
            class="w-96"
          />
        </div>
      </div>
      <!-- Client Secret -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Client Secret</div>
        <div class="w-3/4">
          <n-input
            v-model:value="account.client_secret"
            placeholder="Enter the Client Secret of Facebook App"
            class="w-96"
            type="password"
            show-password-on="click"
          />
        </div>
      </div>
      <!-- Access Token -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Access Token</div>
        <div class="w-3/4">
          <n-input
            v-model:value="account.access_token"
            placeholder="Enter the Access Token of Facebook App"
            class="w-96"
          />
        </div>
      </div>
      <!-- Time Zone -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Time Zone</div>
        <div class="w-3/4">
          <n-select
            v-model:value="account.time_zone"
            filterable
            value-field="utc"
            label-field="text"
            :options="timezoneOptions"
          />
        </div>
      </div>
    </n-card>
  </div>
  <!-- step 2 -->
  <div v-show="current === 2" class="mt-6">
    <n-card title="Facebook Pixel Center">
      <!-- Pixel ID -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold">Pixel ID</div>
        <div class="w-3/4">
          <n-input
            v-model:value="account.pixel_id"
            placeholder="Enter the Pixel ID of Facebook App"
            class="w-96"
          />
        </div>
      </div>
      <!-- Pixel Token -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold">Pixel Token</div>
        <div class="w-3/4">
          <n-input
            v-model:value="account.pixel_token"
            placeholder="Enter the Pixel Token of Facebook App"
            class="w-96"
            type="password"
            show-password-on="click"
          />
        </div>
      </div>
    </n-card>
  </div>
  <!-- step 3 -->
  <div v-show="current === 3">
    <n-grid class="mt-4" x-gap="12" :cols="2">
      <n-gi>
        <!-- account detail -->
        <n-card title="Facebook" class="mb-4">
          <!-- name -->
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Name</div>
            <div class="w-3/4">
              <n-input
                v-model:value="account.name"
                disabled
                placeholder="Name"
                class="w-96"
              />
            </div>
          </div>
          <!-- Pixel ID -->
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Pixel ID</div>
            <div class="w-3/4">
              <n-input
                v-model:value="account.pixel_id"
                disabled
                placeholder="Enter the Pixel ID of Facebook App"
                class="w-96"
              />
            </div>
          </div>
          <!-- Pixel Token -->
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Pixel Token</div>
            <div class="w-3/4">
              <n-input
                v-model:value="account.pixel_token"
                disabled
                type="password"
                show-password-on="click"
                placeholder="Enter the Pixel Token of Facebook App"
                :input-props="{ autocomplete: 'new-password' }"
                class="w-96"
              />
            </div>
          </div>
          <!-- Timezone -->
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Timezone</div>
            <div class="w-3/4">
              <n-input
                v-model:value="account.time_zone"
                disabled
                class="w-96"
              />
            </div>
          </div>
        </n-card>
      </n-gi>
      <n-gi>
        <!-- Account ads -->
        <n-card title="Account Ads" class="mb-4">
          <div class="w-full">
            <ag-grid-vue
              id="myGrid"
              :theme="customTheme"
              :animate-rows="true"
              dom-layout="autoHeight"
              :column-defs="columnDefs"
              :row-data="account.account_ads"
              :default-col-def="defaultColDef"
              @grid-ready="onGridReady"
            >
            </ag-grid-vue>
            <!-- pagination -->
            <n-pagination
              v-model:page="page"
              v-model:page-size="pageSize"
              show-size-picker
              class="bg-card pt-3 justify-end items-center"
              :page-count="pageCount"
              :page-sizes="[10, 20, 30, 50, 100]"
            />
          </div>
        </n-card>
      </n-gi>
    </n-grid>
  </div>
  <!-- group button -->
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      v-show="current !== undefined && current > 2"
      color="#f43f5e"
      size="medium"
      type="success"
      class="ml-2"
      :loading="isSubmitBtnLoading"
      @click="submitForm"
    >
      Submit
    </n-button>
    <n-button-group>
      <n-button :disabled="current === 1" @click="prevStep">
        <template #icon>
          <n-icon>
            <MdArrowRoundBack />
          </n-icon>
        </template>
      </n-button>
      <n-button :disabled="isDisabelNextStep" @click="nextStep">
        <template #icon>
          <n-icon>
            <MdArrowRoundForward />
          </n-icon>
        </template>
      </n-button>
    </n-button-group>
  </div>
</template>
<style lang="scss">
.required:after {
  content: ' *';
  color: red;
}
</style>
