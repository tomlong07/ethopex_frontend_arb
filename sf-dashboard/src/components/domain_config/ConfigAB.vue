<template>
  <n-card title="Config A/B Test" class="rounded-md">
    <div class="flex my-4">
      <FloatingWrapper name="Traffics" rounded>
        <n-input-number
          v-model:value="domainConfig.dataConfig.traffics_ab_test"
          :parse="parseCurrency"
          :format="formatCurrency"
        />
      </FloatingWrapper>
    </div>
    <n-card>
      <div
        class="grid grid-cols-[45px,2fr,0.5fr,2fr,100px] gap-4 text-sm font-medium"
      >
        <div></div>
        <div></div>
        <div></div>
        <div></div>

        <div></div>
      </div>

      <div class="space-y-3">
        <div
          class="grid grid-cols-[45px,2fr,0.5fr,2fr,100px] gap-4 items-center"
          v-for="(item, idx) in configItems"
          :key="idx"
        >
          <n-switch
            v-model:value="item.status"
            checked-value="on"
            unchecked-value="off"
          />

          <FloatingWrapper name="Account Adsense" rounded>
            <n-select
              v-model:value="item.account_adsense"
              filterable
              clearable
              placeholder=""
              :options="adsenseOptions"
              @update:value="(value: number) => handleAccountChange(value, idx)"
            />
          </FloatingWrapper>

          <FloatingWrapper name="Priority" rounded>
            <n-select
              v-model:value="item.priority"
              filterable
              clearable
              placeholder=""
              :options="PriorityOpts"
            />
          </FloatingWrapper>

          <FloatingWrapper name="Domain" rounded>
            <n-select
              v-model:value="item.domain"
              filterable
              clearable
              placeholder=""
              :render-label="renderDomainLabel"
              :disabled="!item.account_adsense"
              :loading="loadingMap[idx]"
              :options="getListDomainByAdsense(item.account_adsense)"
            />
          </FloatingWrapper>

          <div class="flex gap-2">
            <n-button
              @click="removeConfig(idx)"
              :disabled="configItems.length <= 1"
            >
              <template #icon>
                <n-icon><Minus /></n-icon>
              </template>
            </n-button>

            <n-button @click="addConfig">
              <template #icon>
                <n-icon size="12"><Plus /></n-icon>
              </template>
            </n-button>
          </div>
        </div>
      </div>
    </n-card>
  </n-card>
</template>

<script setup lang="ts">
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import ctr_demand_source from '@/services/ctr_demand_source'
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainConfigStore()
const loadingMap = ref<Record<number, boolean>>({})
const adsenseOptions = ref<SelectOption[]>([])
const normalize = (value: number | null) => (value === 0 ? null : value)

const formatCurrency: (value: number | null) => string = (value) => {
  if (value === null) return ''
  return `${value.toLocaleString('en-US')}`
}
const parseCurrency = (input: string) => {
  const nums = input.replace(/(,|\$|\s)/g, '').trim()
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}

const PriorityOpts = ref<SelectOption[]>(
  Array.from({ length: 16 }, (_, i) => ({
    label: (i + 1).toString(),
    value: i + 1,
  }))
)

const configItems = computed(() => {
  if (!domainConfig.dataConfig.config_ab_test?.length) {
    domainConfig.dataConfig.config_ab_test = [
      domainConfig.createDefaultConfig(),
    ]
  }

  domainConfig.dataConfig.config_ab_test.forEach((item) => {
    item.domain = normalize(item.domain)
    item.priority = normalize(item.priority)
    item.account_adsense = normalize(item.account_adsense)
  })

  return domainConfig.dataConfig.config_ab_test
})

const getListDomainByAdsense = (account: number | null) => {
  return account ? domainConfig.domainOptionsMap?.[account] || [] : []
}
const handleAccountChange = async (value: number, idx: number) => {
  const config = configItems.value[idx]
  if (!config) return

  config.domain = null

  if (value) {
    try {
      loadingMap.value[idx] = true
      await domainConfig.getDomainOptions(value)
    } finally {
      loadingMap.value[idx] = false
    }
  }
}

const addConfig = () => {
  configItems.value.push(domainConfig.createDefaultConfig())
  loadingMap.value[configItems.value.length - 1] = false
}

const removeConfig = (index: number) => {
  if (configItems.value.length <= 1) return

  configItems.value.splice(index, 1)
  const newLoadingMap: Record<number, boolean> = {}
  configItems.value.forEach((_, i) => {
    newLoadingMap[i] = loadingMap.value[i >= index ? i + 1 : i] || false
  })
  loadingMap.value = newLoadingMap
}

watch(
  () => domainConfig.dataConfig,
  (data) => {
    if (data && !data.config_ab_test) {
      data.config_ab_test = [domainConfig.createDefaultConfig()]
    }
  },
  { immediate: true }
)

const renderDomainLabel = (option: any) => {
  const rpmText = formatRpm(option?.text ?? option?.rpm)

  return h('div', { class: 'flex items-center w-full' }, [
    // left label
    h('span', { class: 'truncate' }, option?.label ?? ''),

    // right formatted rpm
    h(
      'span',
      { class: 'ml-auto text-sm text-gray-500 truncate', title: rpmText },
      rpmText
    ),
  ])
}

const formatRpm = (val: any) => {
  if (val == null || val === 'N/A') return 'N/A'
  return helper.currencyFormatter(val)
}

onMounted(async () => {
  await fetchAccountAdsense()
})
const fetchAccountAdsense = async () => {
  const rs = await ctr_demand_source.GetAccount({
    object: 'adsense',
  })
  if (rs.status) {
    adsenseOptions.value = rs.data.accounts.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  }
}
</script>
