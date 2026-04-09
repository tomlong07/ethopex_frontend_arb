<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { accountTypeGG, addSubAccountEvents } from '@/types/components/account'

import { ctr_account } from '@/services/ctr_account'
import MdArrowRoundBack from '@/assets/icons/MdArrowRoundBack.vue'
import MdArrowRoundForward from '@/assets/icons/MdArrowRoundForward.vue'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { TS } from '@/enum/campaign'

const typeAddAccount = computed<any>(() => window.route.params.type)
const nameAddAccount = computed<any>(() =>
  helper.capitalizeFirstLetter(typeAddAccount.value)
)
const isGoogleAddAccount = computed<any>(
  () => typeAddAccount.value == TS.GOOGLE
)

const isGeneralAddAccount = computed<any>(
  () => typeAddAccount.value == 'general'
)

const trafficSourceOptions = ref<SelectOption[]>([])

const fetchTrafficIsGeneral = async () => {
  const traffics = await ctr_filter_v2.FilterTrafficSource({
    is_general: 'on',
  })

  trafficSourceOptions.value = traffics?.data || []
}

const id = computed<number>(() => Number(window.route.params.id || 0))

const isAddPage = computed<boolean>(() => id.value === 0)
const isEditPage = computed<boolean>(() => !isAddPage.value)

const current = ref<number | undefined>(1)
const currentStatus = ref<'process' | 'error' | 'wait' | 'finish' | undefined>(
  'process'
)
const newSubAccount = () => {
  return {
    show_name: '',
    account_id: '',
    domain: '',
    account_adsense_accept: '',
  } as addSubAccountEvents
}
const accountgg = ref<accountTypeGG>({
  name: '',
  account_id: '',
  object: isGoogleAddAccount.value ? TS.GOOGLE : undefined,
  time_zone: 'UTC',
  account_ads: [newSubAccount()],
})

const isSubmitBtnLoading = ref<boolean>(false)

const isDisabelNextStep = computed<boolean>(() => {
  return (
    accountgg.value.name === '' ||
    accountgg.value.account_id === '' ||
    (current.value != undefined && current.value > 1)
  )
})

const removeCondition = function (e: Event) {
  e.preventDefault()
  let thisElement = e.target as HTMLElement
  if (!thisElement) return
  let ruleCdtn = document.querySelectorAll('.rows-condition')
  if (ruleCdtn.length <= 1) return
  let parentElement: any = thisElement.closest('div.rows-condition')
  let index = parentElement.getAttribute('index')
  if (parentElement && index) {
    let dataCondition = accountgg.value.account_ads as addSubAccountEvents[]
    dataCondition.splice(index, 1)
  }
  return true
}

const addCondition = () => {
  if (!accountgg.value) return
  let dataCondition = accountgg.value.account_ads as addSubAccountEvents[]
  dataCondition.push({
    show_name: '',
    account_id: '',
    domain: '',
    account_adsense_accept: '',
  })
}

const nextStep = async () => {
  if (!current.value) {
    current.value = 1
  } else if (current.value >= 2) {
    current.value = undefined
  } else {
    current.value++
  }
}

const prevStep = () => {
  if (current.value === undefined) current.value = 3
  else if (current.value === 0) current.value = undefined
  else current.value!--
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_account.Add(accountgg.value)
  isSubmitBtnLoading.value = false
  if (result?.status) {
    window.message.success('Submit successfully!')
    window.router.push({ path: '/accounts' })
    return
  }
}

onMounted(async () => {
  if (isGeneralAddAccount.value) {
    fetchTrafficIsGeneral()
  }
})
</script>
<template>
  <!-- steps map -->
  <div class="mt-12">
    <n-steps :current="current" :status="currentStatus">
      <n-step
        :title="`${nameAddAccount} Ads Account`"
        :description="`Enter your ${nameAddAccount} Ads account `"
      />
      <n-step
        title="Sub Account"
        :description="`Enter your ${nameAddAccount} Sub Account in Mcc Account`"
      />
    </n-steps>
  </div>
  <!-- step 1 -->
  <div v-show="current === 1" class="mt-6">
    <n-card title="Account MCC">
      <div class="flex items-center my-4" v-if="isGeneralAddAccount">
        <div class="w-1/4 font-bold required">Traffic Source</div>
        <div class="w-3/4">
          <n-select
            v-model:value="accountgg.object"
            :disabled="isEditPage"
            :options="trafficSourceOptions"
          />
        </div>
      </div>
      <!-- Name -->

      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Name</div>
        <div class="w-3/4">
          <n-input
            v-model:value="accountgg.name"
            placeholder="Enter the name account MCC"
            class="w-96"
          />
        </div>
      </div>
      <!-- Account ID -->
      <div class="flex items-center my-4">
        <div class="w-1/4 font-bold required">Account ID</div>
        <div class="w-3/4">
          <n-input
            v-model:value="accountgg.account_id"
            placeholder="Enter the Account ID"
            class="w-96"
          />
        </div>
      </div>
      <div class="flex items-center my-4" v-if="isGeneralAddAccount">
        <div class="w-1/4 font-bold">Client ID</div>
        <div class="w-3/4">
          <n-input
            v-model:value="accountgg.client_id"
            placeholder="Enter the Client ID of Facebook App"
            class="w-96"
          />
        </div>
      </div>
      <!-- Client Secret -->
      <div class="flex items-center my-4" v-if="isGeneralAddAccount">
        <div class="w-1/4 font-bold">Client Secret</div>
        <div class="w-3/4">
          <n-input
            v-model:value="accountgg.client_secret"
            placeholder="Enter the Client Secret of Facebook App"
            class="w-96"
            type="password"
            show-password-on="click"
            :input-props="{ autocomplete: 'new-password' }"
          />
        </div>
      </div>
    </n-card>
  </div>
  <!-- step 2 -->
  <div v-show="current === 2" class="mt-6">
    <n-card title="Account" class="mb-4 mt-4 card-rule-condition">
      <div
        v-for="(row, index) in accountgg.account_ads"
        :key="index"
        :index="index"
        class="rows-condition my-4 flex"
      >
        <div class="flex items-center w-full">
          <div style="width: 48%">
            <div class="bold text-gray-500">Name</div>
            <div class="pr-2">
              <n-input
                v-model:value="row.show_name"
                placeholder="Enter the name account"
                class="w-96"
              />
            </div>
          </div>
          <div style="width: 48%" class="mx-2">
            <div class="bold text-gray-500">Account Id</div>
            <div class="pr-2">
              <n-input
                v-model:value="row.account_id"
                placeholder="Enter the account id"
                class="w-96"
              />
            </div>
          </div>
        </div>
        <div>
          <div class="font-bold">&nbsp;</div>
          <n-button
            class="remove-condition"
            icon-placement="left"
            tertiary
            @click="removeCondition"
          >
            <template #icon>
              <n-icon>
                <Close2 />
              </n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <n-button icon-placement="left" @click="addCondition">
        <template #icon>
          <n-icon>
            <PlusSmall />
          </n-icon>
        </template>
        Add
      </n-button>
    </n-card>
  </div>

  <!-- group button -->
  <div class="flex flex-row-reverse sticky bottom-0 p-2">
    <n-button
      v-show="current !== undefined && current > 1"
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
