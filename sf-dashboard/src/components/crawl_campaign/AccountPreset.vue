<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import { SelectOption } from 'naive-ui'

const storeModalCrawl = modalCrawlCamp()

const loading = ref(false)
const defaultAccountOptions = ref<SelectOption[]>([])

const fetchDefaultAccounts = async (
  traffic_source: string,
  demand_source: string
) => {
  try {
    loading.value = true
    const result = await ctr_crawl_campaign.GetDefaultAccount({
      traffic_source,
      demand_source,
    })
    return result?.data || []
  } catch (error) {
    window.message.error(`Error: ${error}`)
    return []
  } finally {
    loading.value = false
  }
}

const handleSourceChange = async (
  traffic_source: string,
  demand_source: string
) => {
  if (storeModalCrawl.isCallapi) {
  } else {
    const data = await fetchDefaultAccounts(traffic_source, demand_source)

    defaultAccountOptions.value = data.map((item: any) => ({
      value: item.id,
      label: item.name,
    }))

    const validAccountIds = data.map((item: any) => item.id)

    if (
      !validAccountIds.includes(storeModalCrawl.dataCrawlCamp.default_account)
    ) {
      storeModalCrawl.dataCrawlCamp.default_account = null
    }
  }
}

const handleMountedLogic = async (
  traffic_source: string,
  demand_source: string
) => {
  const data = await fetchDefaultAccounts(traffic_source, demand_source)

  defaultAccountOptions.value = data.map((item: any) => ({
    value: item.id,
    label: item.name,
  }))
}

watch(
  () => [
    storeModalCrawl.dataCrawlCamp.traffic_source,
    storeModalCrawl.dataCrawlCamp.demand_source,
  ],
  ([traffic_source, demand_source]) => {
    if (traffic_source && demand_source) {
      handleSourceChange(traffic_source, demand_source)
    }
  }
)

onMounted(() => {
  if (storeModalCrawl.showModal) {
    storeModalCrawl.isCallapi = false
    const { traffic_source, demand_source } = storeModalCrawl.dataCrawlCamp
    if (traffic_source && demand_source) {
      handleMountedLogic(traffic_source, demand_source)
    }
  }
})

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex w-full items-center gap-2' }, [
    h('div', { class: 'flex-1 min-w-0 truncate' }, option.label as string),

    option.value
      ? h(
          'a',
          {
            href: `/default-account/${option.value as string}`,
            target: '_blank', // mở tab mới
            rel: 'noopener noreferrer', // bảo mật
            class:
              'text-blue-500 hover:text-blue-600 hover:underline text-xs flex-shrink-0 transition-colors',

            onClick: (e: MouseEvent) => {
              e.stopPropagation()
            },
          },
          'Open'
        )
      : null,
  ])
}
</script>

<template>
  <FloatingWrapper name="Account Preset" :required="true">
    <n-select
      v-model:value="storeModalCrawl.dataCrawlCamp.default_account"
      :options="defaultAccountOptions"
      placeholder=""
      :loading="loading"
      :render-label="renderLabel"
    />
  </FloatingWrapper>
</template>
