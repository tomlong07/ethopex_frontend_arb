<script lang="ts" setup>
import { DataTableColumns, NIcon } from 'naive-ui'
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'

const assetGroupStore = useAssetGroupDetail()

interface AssetAccountTable {
  account: string
  label: string
  traffic_source: string
  pixel: string
}

const data = ref<any[]>([])
const loading = ref(false)
const pixelData = ref<Record<string, string>>({})

const removeAccount = (row: AssetAccountTable) => {
  if (!row) return

  data.value = data.value.filter((item) => item.value !== row.account)

  if (assetGroupStore.assetEmpty?.accounts) {
    assetGroupStore.assetEmpty.accounts =
      assetGroupStore.assetEmpty.accounts.filter(
        (value: any) => value !== row.account
      )
  }

  assetGroupStore.assetGroup.asset_groups =
    assetGroupStore.assetGroup.asset_groups?.map((group) => {
      if (group.traffic_source === assetGroupStore.currentTrafficSource) {
        return {
          ...group,
          accounts: group.accounts?.filter(
            (value: any) => value !== row.account
          ),
        }
      }
      return group
    })
}

const findAccountsByField = (
  options: any[],
  value: any,
  field: string
): string[] => {
  return (
    options
      ?.filter((item) => item.value === value) // lấy tất cả item thỏa
      .map((item) => item[field]) ?? // trả về field
    []
  )
}

watch(
  () => assetGroupStore.currentTrafficSource,
  () => {
    data.value = []
    pixelData.value = {}
  },
  { immediate: true }
)
const accountsList = computed(() => {
  const empty = assetGroupStore.assetEmpty
  if (!empty?.accounts?.length) return []
  return empty.accounts
})
const findListByTraffic = (value: any) => {
  if (!value) return undefined

  const trafficSource = assetGroupStore.macroValueOptions
  if (!trafficSource?.length) return undefined

  return trafficSource.find((item) => item.value === value)?.label
}

const mappedAccounts = computed(() => {
  const options = assetGroupStore.adAccountOptions
  const empty = assetGroupStore.assetEmpty
  if (!options?.length || !empty?.accounts?.length) return []

  const trafficSource = assetGroupStore.currentTrafficSource
  const trafficLabel = findListByTraffic(trafficSource) || ''

  return empty.accounts?.map((acc: number | string, index: number) => ({
    index: index + 1,
    account: acc,
    label: findAccountsByField(options, acc, 'name'),
    traffic_source: trafficLabel,
    pixel: pixelData.value[String(acc)],
  }))
})

const fetchPixel = async () => {
  try {
    loading.value = true
    const payload = {
      accounts: accountsList.value,
      traffic_source: 'facebook',
    }
    const rs = await ctr_traffic_source.GetPixelByAcc(payload)

    if (rs.data) {
      const processedPixelData: Record<string, string> = {}

      rs.data.forEach((item: any) => {
        const accountId = item.account_id
        const pixelNames = item.pixels?.map((p: any) => p.pixel) || []
        processedPixelData[accountId] = pixelNames.join(', ')
      })

      pixelData.value = processedPixelData
    }
  } catch (error) {
    console.error('Error fetching pixel:', error)
  } finally {
    loading.value = false
  }
}
watch(
  () => accountsList.value,
  async (newVal, oldVal) => {
    if (
      newVal.length > 0 &&
      assetGroupStore.currentTrafficSource === 'facebook' &&
      JSON.stringify(newVal) !== JSON.stringify(oldVal)
    ) {
      await fetchPixel()
    }
  },
  { immediate: true }
)
const columns: DataTableColumns<AssetAccountTable> = [
  { title: '#', key: 'index' },
  { title: 'Account ID', key: 'account' },
  {
    title: 'Label',
    key: 'label',
    render(row) {
      if (Array.isArray(row.label)) {
        return row.label.map((item: string) =>
          h('div', { class: 'leading-5' }, item)
        )
      }
      return h('div', row.label)
    },
  },
  {
    title: 'Pixel',
    key: 'pixel',
  },
  { title: 'Traffic source', key: 'traffic_source' },
  {
    title: 'Action',
    key: 'actions',
    render(row) {
      return h(
        NIcon,
        {
          size: 14,
          class: 'cursor-pointer text-red-500',
          onClick: () => removeAccount(row),
        },
        {
          default: () => h(TrashAltRegular),
        }
      )
    },
  },
]

const paginationReactive = reactive({
  page: 1,
  pageSize: 1000,
  showSizePicker: true,
  pageSizes: [10, 20, 50, 100, 1000, 5000],
  onChange: (page: number) => {
    paginationReactive.page = page
  },
})

const onUpdatePageSize = (pageSize: number) => {
  paginationReactive.pageSize = pageSize
  paginationReactive.page = 1
}
</script>

<template>
  <n-data-table
    v-if="mappedAccounts?.length > 0"
    :columns="columns"
    :data="mappedAccounts"
    :loading="loading"
    :pagination="paginationReactive"
    @update:page-size="onUpdatePageSize"
  />
</template>
