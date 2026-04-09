<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import { StatusClass } from '@/types/components/base'
import {
  testBudgetType,
  testBudgetSelectOptions,
  testBudgetStatusManager,
} from '@/types/components/test-budget'

import { debounceV2 } from '@/utils'
import { ctr_test_budget } from '@/services/ctr_test_budget'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { useLocale } from '@/lang/messages'
const TestBudgetDetail = useLocale(
  () => import('@/lang/vi/test_budget_detail'),
  () => import('@/lang/en/test_budget_detail')
)
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)
const statusData = ref(new StatusClass('test budget'))
const selectData = ref<testBudgetSelectOptions>(new testBudgetSelectOptions())

const managerCenter = ref<testBudgetStatusManager>(
  new testBudgetStatusManager()
)
const initialPath = ref('') // Biến lưu trữ path của route khi mount

const dataConfig = ref(new testBudgetType())

const submitForm = async () => {
  statusData.value.isSubmitBtnLoading = true
  const result = await ctr_test_budget.SaveTrialBudget(dataConfig.value)

  if (result?.status) {
    window.message.success(`Submit success!`)
  }

  statusData.value.isSubmitBtnLoading = false
}

const handleSearch = debounceV2(async (query: string) => {
  selectData.value.getUsersChild(query)
}, 300)

onMounted(async () => {
  initialPath.value = window.route.path

  selectData.value.getUsersChild('', window.route.query.user_id as string)
  statusData.value.isLoading = true

  if (window.route.query.user_id) {
    await getDataByUser()
  }

  managerCenter.value.loadingAmount = false

  statusData.value.isLoading = false
})

const getDataByUser = async () => {
  managerCenter.value.loadingAmount = true
  managerCenter.value.errorAmount = false

  const res = await ctr_test_budget.GetByUser(window.route.query.user_id)
  if (res?.status) {
    dataConfig.value = new testBudgetType(res?.data || {})

    if (!res?.data?.status && !dataConfig.value.amount) {
      dataConfig.value.status = 'on'
    }
    dataConfig.value.user_id = Number(window.route.query.user_id) || undefined
  } else {
    managerCenter.value.errorAmount = true
  }

  managerCenter.value.loadingAmount = false
}

const changeRouteByUser = async (value: any) => {
  window.router.push({
    path: `/test-budget/update`,
    query: { user_id: value },
  })
}

const stopWatch = watch(
  () => window.route.query,
  (newQuery) => {
    if (window.route.path === initialPath.value) {
      getDataByUser()
    }
  },
  { immediate: true }
)

// Dừng watcher khi component bị hủy tránh memory leak
onBeforeUnmount(() => {
  stopWatch()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 items-center">
    <div
      class="h-screen flex flex-col bg-base my-12 flex-1 gap-4 w-full 2xl:w-1/2 4xl:w-1/3"
    >
      <BackPage
        :url="feSettings?.page_list"
        :name="statusData.name"
        v-if="feSettings?.page_list"
      />
      <Skeleton v-if="statusData.isLoading" />
      <n-grid x-gap="14" y-gap="14" cols="1" v-else>
        <n-gi class="flex flex-col gap-4">
          <n-card class="card-flex-gap-4">
            <div class="flex items-center gap-4">
              <div class="w-full">
                <FloatingWrapper name="User">
                  <n-select
                    :loading="selectData.loadingUser"
                    filterable
                    remote
                    placeholder=""
                    v-model:value="dataConfig.user_id"
                    :options="selectData.users"
                    @search="handleSearch"
                    :on-update:value="changeRouteByUser"
                  />
                </FloatingWrapper>
              </div>
            </div>

            <div class="flex items-center gap-5">
              <div class="font-bold text-right text-xs">Status</div>
              <div>
                <CustomSwitch
                  v-model="dataConfig.status"
                  type="onoff"
                  true-label="On"
                  false-label="Off"
                  size="small"
                />
              </div>
            </div>

            <div class="flex items-center gap-4">
              <div class="w-full">
                <FloatingWrapper name="Amount">
                  <n-input-number
                    v-model:value="dataConfig.amount"
                    placeholder="Enter Amount"
                    :loading="managerCenter.loadingAmount"
                    :disabled="managerCenter.errorAmount"
                    max="100000"
                  >
                    <template #prefix> $ </template>
                  </n-input-number>
                </FloatingWrapper>
              </div>
            </div>

            <n-divider />

            <div class="flex justify-center gap-4">
              <div class="italic gap-2 flex flex-col">
                <p>
                  {{ TestBudgetDetail.amount }}
                </p>
                <p>
                  {{ TestBudgetDetail.spending }}
                </p>
                <p>
                  {{ TestBudgetDetail.profit }}
                </p>
              </div>
            </div>
          </n-card>
        </n-gi>
      </n-grid>
      <div class="flex flex-row-reverse sticky bottom-0 py-2">
        <div class="flex items-center gap-4">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="statusData.isLoading || managerCenter.errorAmount"
            :loading="statusData.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
