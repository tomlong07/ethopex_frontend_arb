<script setup lang="ts">
import { ctr_domain } from '@/services/ctr_domain'
import { ctr_report } from '@/services/ctr_report'
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainConfigStore()

const isLoadingAdsenseAccount = ref(false)
const showHistory = ref(false)

onMounted(async () => {
  await getDomainOptions()

  getRPM()
})
const getDomainOptions = async () => {
  const result = await ctr_domain.GetAllDomain()

  domainConfig.domainOptions = result?.data
    ? result.data.map((item: any) => {
        return {
          label: item.domain,
          value: item.id,
          text: 'loading...',
        }
      })
    : []
}

function mergeByKey(
  baseArr: SelectOption[],
  extraArr: any[],
  key: keyof { label: string } = 'label'
) {
  return baseArr.map((item) => {
    const found = extraArr.find((extra) => extra.domain === item[key])
    return {
      ...item,
      text: found ? found.rpm : 'N/A',
    }
  })
}

const getRPM = async () => {
  const result = await ctr_report.GetRPMByDomain({
    domains: domainConfig.domainOptions?.map((item) => item.label),
  })

  domainConfig.domainOptions = mergeByKey(
    domainConfig.domainOptions,
    result.data || []
  )
}
const handleChangeDomain = (value: number) => {
  domainConfig.dataConfig.domain_id = value
  domainConfig.dataConfig.adsense_accounts = []

  domainConfig.getListAdsenseAccountByDomainIds(value)
}

const formatNumberShow = (val: number) => {
  return helper.formatNumber(val)
}
</script>

<template>
  <n-card title="Configs" class="rounded-md">
    <div class="space-y-6 my-2">
      <FloatingWrapper name="Domain" rounded>
        <n-select
          v-model:value="domainConfig.dataConfig.domain_id"
          filterable
          :disabled="domainConfig.isLoading"
          :options="domainConfig.domainOptions"
          :on-update:value="handleChangeDomain"
      /></FloatingWrapper>

      <FloatingWrapper name="Adsense Accounts" rounded>
        <n-select
          v-model:value="domainConfig.dataConfig.adsense_accounts"
          filterable
          multiple
          :disabled="
            domainConfig.isLoading || !domainConfig.dataConfig.domain_id
          "
          :loading="isLoadingAdsenseAccount"
          :options="domainConfig.adsenseAccountOptions"
        />
      </FloatingWrapper>

      <!-- HISTORY TOGGLE -->
      <div
        v-if="domainConfig.dataConfig.history_domain_config?.length"
        class="mt-2"
      >
        <!-- TOGGLE BUTTON -->
        <div class="flex justify-end mb-2">
          <n-button text size="tiny" @click="showHistory = !showHistory">
            {{
              showHistory
                ? 'Hide History'
                : `View History (${domainConfig.dataConfig.history_domain_config.length})`
            }}
          </n-button>
        </div>

        <!-- LIST -->
        <n-collapse-transition :show="showHistory">
          <n-list
            bordered
            hoverable
            class="max-h-40 overflow-y-auto !rounded-lg text-xs"
          >
            <n-list-item
              v-for="item in domainConfig.dataConfig.history_domain_config"
              :key="item.created_at"
              class="py-2"
            >
              <div
                class="grid grid-cols-[80px_1.5fr_120px_120px_160px] items-center gap-2"
              >
                <!-- ID -->
                <div class="text-gray-500 text-center">
                  {{ item.domain_id }}
                </div>

                <!-- DOMAIN NAME -->
                <div class="truncate font-medium">
                  {{ item.domain_name || 'Unknown Domain' }}
                </div>

                <!-- CAMPAIGN -->
                <div class="text-gray-500 text-center">
                  Campaign: {{ formatNumberShow(item.campaign_number) }}
                </div>

                <!-- CREATIVE -->
                <div class="text-gray-500 text-center">
                  Creative: {{ formatNumberShow(item.creative_number) }}
                </div>

                <!-- DATE -->
                <div class="text-gray-400 text-center whitespace-nowrap">
                  {{ item.created_at }}
                </div>
              </div>
            </n-list-item>
          </n-list>
        </n-collapse-transition>
      </div>
    </div>
  </n-card>
</template>
