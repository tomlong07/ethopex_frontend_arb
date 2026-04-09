<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import { TransferOption } from 'naive-ui'
import { ctr_account } from '@/services/ctr_account'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_label } from '@/services/ctr_label'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainConfigStore()

const trafficSourceOptions = ref<TransferOption[]>([])
const adAccountOptions = ref<TransferOption[]>([])
const labelOptions = ref<TransferOption[]>([])

onMounted(async () => {
  await Promise.all([
    getTrafficSourceOptions(),
    getListAdAccounts(),
    getLabelOptions(),
  ])
})

// Sử dụng computed để tự động tính toán thông báo
const notifyModeTrafficSource = computed(() => {
  const type = domainConfig.dataConfig.traffic_sources_type
  if (!type) return ''

  return `Condition sẽ ${helper.capitalizeFirstLetter(
    type
  )} các Traffic Source trong list chọn phía dưới`
})

const notifyModeAccountAd = computed(() => {
  const type = domainConfig.dataConfig.ad_accounts_type
  if (!type) return ''

  return `Condition sẽ ${helper.capitalizeFirstLetter(
    type
  )} các Ad Accounts trong list chọn phía dưới`
})

const notifyModeLabel = computed(() => {
  const type = domainConfig.dataConfig.labels_type
  if (!type) return ''

  return `Condition sẽ ${helper.capitalizeFirstLetter(
    type
  )} các Label trong list chọn phía dưới`
})

const getTrafficSourceOptions = async () => {
  const result = await ctr_traffic_source.GetAllTrafficSource()
  trafficSourceOptions.value = result?.data?.traffic_sources
    ? result.data.traffic_sources.map((item: any) => {
        return {
          label: item.name,
          value: item.value,
        }
      })
    : []
}

const getListAdAccounts = async (opts: { [key: string]: any } = {}) => {
  adAccountOptions.value = []
  let resRaw = await ctr_account.GroupByName(opts.q || '', '')

  adAccountOptions.value = resRaw?.data
    ? resRaw.data.map((element: any) => {
        let label
        element.account_status = element.account_status || 'unknown'
        if (element.object == TS.GOOGLE) {
          label =
            helper.capitalizeFirstLetter(element.object) +
            ': ' +
            element.show_name +
            ' (' +
            element.account_status +
            ')'
        } else {
          label =
            helper.capitalizeFirstLetter(element.object) +
            ': ' +
            element.show_name
        }
        return {
          label: label,
          value: element.name,
        }
      })
    : []
}

const getLabelOptions = async () => {
  const result = await ctr_label.GetAll()

  labelOptions.value = result?.data
    ? result.data.map((item: any) => {
        return {
          label: item.name,
          value: item.id,
        }
      })
    : []
}

const copyAdAccounts = () => {
  if (domainConfig.dataConfig.ad_accounts?.length) {
    helper.copyText(domainConfig.dataConfig.ad_accounts?.join('\n') || '')
    window.message.success('Copied!')
  }
}

const showBulk = () => {
  domainConfig.dataBulk = domainConfig.dataConfig.ad_accounts?.join('\n') || ''
  domainConfig.showModalBulk = true
}

const customAdAccountFilter = (
  pattern: string,
  option: TransferOption,
  from: 'source' | 'target'
) => {
  const lowerCasedPattern = pattern.toLowerCase()
  let arrayPattern = []

  if (lowerCasedPattern.includes(',') || lowerCasedPattern.includes('\n')) {
    arrayPattern = helper.stringToArray(lowerCasedPattern)
  } else {
    arrayPattern = [lowerCasedPattern]
  }

  try {
    for (let index = 0; index < arrayPattern.length; index++) {
      if (
        String(option.label).toLowerCase().includes(arrayPattern[index]) ||
        String(option.value).toLowerCase().includes(arrayPattern[index])
      ) {
        return true
      }
    }
    return false
  } catch {}
  return false
}
</script>

<template>
  <n-card title="Conditions" class="rounded-md space-y-3">
    <div class="flex">
      <FloatingWrapper name="Traffic Sources" rounded>
        <n-card>
          <div class="flex-row">
            <n-radio-group
              v-model:value="domainConfig.dataConfig.traffic_sources_type"
              style="margin-bottom: 12px"
            >
              <n-radio-button
                value="include"
                class="custom-radio-button include"
              >
                Include
              </n-radio-button>
              <n-radio-button
                value="exclude"
                class="custom-radio-button exclude"
              >
                Exclude
              </n-radio-button>
            </n-radio-group>
            <span class="ml-2">{{ notifyModeTrafficSource }}</span>
          </div>
          <n-transfer
            v-model:value="domainConfig.dataConfig.traffic_sources"
            multiple
            source-filterable
            :loading="domainConfig.isLoading"
            :options="trafficSourceOptions"
          />
        </n-card>
      </FloatingWrapper>
    </div>

    <div class="flex my-4">
      <FloatingWrapper name="Ad Accounts" rounded>
        <n-card>
          <div class="flex items-center mb-3">
            <n-radio-group
              v-model:value="domainConfig.dataConfig.ad_accounts_type"
            >
              <n-radio-button
                value="include"
                class="custom-radio-button include"
              >
                Include
              </n-radio-button>
              <n-radio-button
                value="exclude"
                class="custom-radio-button exclude"
              >
                Exclude
              </n-radio-button>
            </n-radio-group>
            <span class="ml-2">{{ notifyModeAccountAd }}</span>
            <div class="ml-auto flex gap-2">
              <n-button @click="copyAdAccounts" type="info">Copy</n-button>
              <n-button color="#f43f5e" @click="showBulk">Bulk Entry</n-button>
            </div>
          </div>
          <n-transfer
            v-model:value="domainConfig.dataConfig.ad_accounts"
            multiple
            source-filterable
            target-filterable
            :loading="domainConfig.isLoading"
            :options="adAccountOptions"
            virtual-scroll
            :filter="customAdAccountFilter"
          >
          </n-transfer>
        </n-card>
      </FloatingWrapper>
    </div>

    <div class="flex my-4">
      <FloatingWrapper name="Labels" rounded>
        <n-card>
          <div class="flex-row">
            <n-radio-group
              v-model:value="domainConfig.dataConfig.labels_type"
              style="margin-bottom: 12px"
            >
              <n-radio-button
                value="include"
                class="custom-radio-button include"
              >
                Include
              </n-radio-button>
              <n-radio-button
                value="exclude"
                class="custom-radio-button exclude"
              >
                Exclude
              </n-radio-button>
            </n-radio-group>
            <span class="ml-2">{{ notifyModeLabel }}</span>
          </div>
          <n-transfer
            v-model:value="domainConfig.dataConfig.labels"
            multiple
            source-filterable
            :loading="domainConfig.isLoading"
            :options="labelOptions"
          />
        </n-card>
      </FloatingWrapper>
    </div>
  </n-card>
</template>

<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }

  .dynamic-button {
    padding: 0 0.5rem;
  }
}

/* Màu sắc cho nút khi hover */
.custom-radio-button.include:hover {
  background-color: #82b4fd; /* Màu xanh lá khi chọn "Include" */
}

.custom-radio-button.exclude:hover {
  background-color: #f88c9d; /* Màu đỏ khi chọn "Exclude" */
}

/* Đổi màu khi được chọn cho Include */
.n-radio-button--checked.include {
  background-color: #82b4fd; /* Màu xanh lá khi chọn "Include" */
  color: #ffffff;
}

/* Đổi màu khi được chọn cho Exclude */
.n-radio-button--checked.exclude {
  background-color: #f88c9d; /* Màu đỏ khi chọn "Exclude" */
  color: #ffffff;
}

/* Kiểu dáng chung khi được chọn */
.n-radio-button--checked {
  border-color: transparent;
  font-weight: bold;
}
</style>
