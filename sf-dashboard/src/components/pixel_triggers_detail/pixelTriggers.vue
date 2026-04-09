<script setup lang="ts">
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { SelectOption } from 'naive-ui'
import { pixelTrigger } from '@/types/components/pixel_manager'
import { ctr_account } from '@/services/ctr_account'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

const usePixelTriggersDetail = PixelTriggersDetail()
const isCampaignLoading = ref(false)
const isAccountLoading = ref(false)

const triggerConditionOption = ref<SelectOption[]>([
  { label: 'Traffic Source', value: 'traffic_source' },
  { label: 'Demand Source', value: 'demand_source' },
  { label: 'Ad Account', value: 'ad_account' },
  { label: 'MCC', value: 'mcc' },
  { label: 'Campaign', value: 'campaign' },
  { label: 'Category', value: 'category' },
  { label: 'Goals', value: 'goals' },
  { label: 'Country', value: 'country' },
])

const triggerConditionOptionNow = computed<SelectOption[]>(() => {
  const obj = helper.clone(triggerConditionOption.value)
  const obj2 = [] as SelectOption[]

  loop1: for (let index = 0; index < obj.length; index++) {
    const element = obj[index]
    for (
      let i = 0;
      i < usePixelTriggersDetail.pixelConfig.triggers.length;
      i++
    ) {
      const e = usePixelTriggersDetail.pixelConfig.triggers[i]
      if (e.field == element.value) {
        obj2.push({
          label: element.label,
          value: element.value,
          disabled: true,
        })
        continue loop1
      }
    }
    obj2.push(element)
  }
  return obj2
})

const fieldLoadedFlags = ref({
  traffic_source: false,
  demand_source: false,
  mcc: false,
  campaign: false,
  category: false,
  country: false,
})
const onchangeTrigger = async (value: any, index: any) => {
  switch (value) {
    case 'traffic_source':
      if (!fieldLoadedFlags.value.traffic_source) {
        fieldLoadedFlags.value.traffic_source = true
      }
      break
    case 'demand_source':
      if (!fieldLoadedFlags.value.demand_source) {
        fieldLoadedFlags.value.demand_source = true
      }
      break
    case 'mcc':
      if (!fieldLoadedFlags.value.mcc) {
        fieldLoadedFlags.value.mcc = true
      }
      break
    case 'campaign':
      if (!fieldLoadedFlags.value.campaign) {
        fieldLoadedFlags.value.campaign = true
      }
      break
    case 'category':
      if (!fieldLoadedFlags.value.category) {
        fieldLoadedFlags.value.category = true
      }
      break
    case 'country':
      if (!fieldLoadedFlags.value.country) {
        fieldLoadedFlags.value.country = true
      }
      break
    case 'ad_account':
    case 'goals':
      break
    default:
      console.warn(`Unknown field type: ${value}`)
  }

  // Sync type cho ad_account và mcc
  syncTypeAdAccountAndMcc(value, index)

  // Set field và reset value
  usePixelTriggersDetail.pixelConfig.triggers[index].field = value
  usePixelTriggersDetail.pixelConfig.triggers[index].value = []
}

const triggerValueOption = (input: string | null) => {
  switch (input) {
    case 'traffic_source':
      return usePixelTriggersDetail.optionPixel.trafficSource
    case 'demand_source':
      return usePixelTriggersDetail.optionPixel.demandSource
    case 'campaign':
      return usePixelTriggersDetail.optionPixel.campaigns
    case 'category':
      return usePixelTriggersDetail.optionPixel.pixelCategoryOptions
    case 'ad_account':
      return currentAdAccountOptions.value
    case 'goals':
      return goalsOptions.value
    case 'mcc':
      return usePixelTriggersDetail.optionPixel.Mccs
    case 'country':
      return usePixelTriggersDetail.optionPixel.countryOptions
    default:
      return [{ label: 'Source', value: 'source' }]
  }
}

//Đồng bộ type condition ad_account và mcc
const syncTypeAdAccountAndMcc = (value: any, index: any) => {
  if (!value || !['ad_account', 'mcc'].includes(value)) {
    return
  }
  if (value === 'ad_account') {
    for (
      let i = 0;
      i < usePixelTriggersDetail.pixelConfig.triggers.length;
      i++
    ) {
      const element = usePixelTriggersDetail.pixelConfig.triggers[i]
      if (element.field === 'mcc') {
        usePixelTriggersDetail.pixelConfig.triggers[index].condition =
          element.condition
        break
      }
    }
  }
  if (value === 'mcc') {
    for (
      let i = 0;
      i < usePixelTriggersDetail.pixelConfig.triggers.length;
      i++
    ) {
      const element = usePixelTriggersDetail.pixelConfig.triggers[i]

      if (element.field === 'ad_account') {
        usePixelTriggersDetail.pixelConfig.triggers[index].condition =
          element.condition
        break
      }
    }
  }
}

const triggerIncludeOption = ref<SelectOption[]>([
  { label: 'Is In', value: 'include' },
  { label: 'Is Not In', value: 'exclude' },
])

//Đồng bộ ad_account type theo mcc
const onchangeType = (value: string, field: string | null) => {
  if (field === 'mcc') {
    for (
      let i = 0;
      i < usePixelTriggersDetail.pixelConfig.triggers.length;
      i++
    ) {
      const element = usePixelTriggersDetail.pixelConfig.triggers[i]
      if (element.field === 'ad_account') {
        usePixelTriggersDetail.pixelConfig.triggers[i].condition = value
        break
      }
    }
  }
}

const valueField = (input: string | null) => {
  if (
    input == 'traffic_source' ||
    input == 'goals' ||
    input == 'demand_source'
  ) {
    return 'value'
  }
  return 'id'
}

const labelField = (input: string | null) => {
  if (input == 'goals') {
    return 'label'
  }
  return 'name'
}

const goalsOptions = ref<SelectOption[]>([
  { label: 'Lead', value: 'lead' },
  { label: 'Purchase', value: 'purchase' },
  { label: 'Search', value: 'search' },
])

const loadingNow = (selectField: string | null) => {
  if (selectField == 'campaign') {
    return isCampaignLoading.value || usePixelTriggersDetail.isLoading
  }
  if (selectField == 'ad_account') {
    return isAccountLoading.value || usePixelTriggersDetail.isLoading
  }
  return usePixelTriggersDetail.isLoading
}

let searchTimeout: ReturnType<typeof setTimeout>

const getListCampaign = async (opts = { q: '' } as { q: string }) => {
  try {
    let resRaw = await ctr_filter_v2.FilterCampaign({
      q: opts.q,
    })

    if (resRaw?.data && Array.isArray(resRaw.data)) {
      // lấy campaign ids đã được chọn
      const campaignTrigger = usePixelTriggersDetail.pixelConfig.triggers.find(
        (t: any) => t.field === 'campaign'
      )

      const selectedIds = (campaignTrigger?.value ?? []) as number[]

      const selectedOptions =
        usePixelTriggersDetail.optionPixel.campaigns.filter((camp: any) =>
          selectedIds.includes(camp.id)
        )

      // map data
      const newCampaigns = resRaw.data.map((camp: any) => ({
        name: camp.label,
        id: camp.value,
      }))

      // merge, loaij bỏ trùng
      const existingIds = new Set(selectedOptions.map((c: any) => c.id))
      const mergedCampaigns = [
        ...selectedOptions,
        ...newCampaigns.filter((c: any) => !existingIds.has(c.id)),
      ]

      usePixelTriggersDetail.optionPixel.campaigns = mergedCampaigns
    } else {
      usePixelTriggersDetail.optionPixel.campaigns = []
    }
  } catch (error) {
    console.error('Error fetching campaigns:', error)
  }
}

const allAdAccounts = ref<any[]>([]) // Lưu toàn bộ data gốc ban đầu để filter local
const displayedAdAccounts = ref<any[]>([]) // Data hiển thị trên UI
const isInitialLoad = ref(true)
const BATCH_SIZE = 100

const currentAdAccountOptions = computed(() => {
  return displayedAdAccounts.value
})

// Function để process data từng batch
const processBatch = (data: any[], startIndex: number, batchSize: number) => {
  const endIndex = Math.min(startIndex + batchSize, data.length)
  return data.slice(startIndex, endIndex).map((element: any) => ({
    name: element.show_name + '_' + element.object,
    id: element.name,
  }))
}

// Hàm filter local data
const filterLocalAccounts = (query: string) => {
  if (!query.trim()) {
    // Show all items
    displayedAdAccounts.value = [...allAdAccounts.value]
    return
  }

  const filtered = allAdAccounts.value.filter((account) =>
    account.name.toLowerCase().includes(query.toLowerCase())
  )

  displayedAdAccounts.value = filtered
}

const preloadAllAdAccounts = async () => {
  try {
    isAccountLoading.value = true

    let resRaw = await ctr_account.GroupByName('')

    if (resRaw && resRaw.data && resRaw.data.length > 0) {
      const rawData = resRaw.data

      allAdAccounts.value = []
      displayedAdAccounts.value = []

      // Process từng batch 50 items với delay nhỏ để tránh freeze UI
      for (let i = 0; i < rawData.length; i += BATCH_SIZE) {
        const batch = processBatch(rawData, i, BATCH_SIZE)

        allAdAccounts.value.push(...batch)
        displayedAdAccounts.value.push(...batch)

        // Delay nhỏ để UI không bị freeze
        await new Promise((resolve) => setTimeout(resolve, 10))
      }

      isInitialLoad.value = false
    }
  } catch (error) {
    console.error('Error preloading accounts:', error)
  } finally {
    isAccountLoading.value = false
  }
}

const getListAdAccounts = async (opts = { q: '' } as { q: string }) => {
  try {
    // Nếu đã load hết data và đây là search, dùng filter local
    if (!isInitialLoad.value && opts.q) {
      filterLocalAccounts(opts.q)
      return
    }
    // Nếu chưa load hết hoặc là lần đầu load, gọi API
    isAccountLoading.value = true
    let resRaw = await ctr_account.GroupByName(opts.q)

    if (resRaw && resRaw.data && resRaw.data.length > 0) {
      const processedData = resRaw.data.map((element: any) => ({
        name: element.show_name + '_' + element.object,
        id: element.name,
      }))

      displayedAdAccounts.value = processedData
    }
  } catch (error) {
    console.error('Error in getListAdAccounts:', error)
    throw error
  } finally {
    isAccountLoading.value = false
  }
}

const handleSearch = (query: string, selectField: string | null) => {
  if (selectField == 'campaign' || selectField == 'ad_account') {
    if (query !== '') {
      if (searchTimeout) {
        clearTimeout(searchTimeout)
      }

      searchTimeout = setTimeout(async () => {
        if (selectField == 'campaign') {
          isCampaignLoading.value = true
          await getListCampaign({ q: query })
          isCampaignLoading.value = false
        }

        if (selectField == 'ad_account') {
          // Nếu đã có data cached và không phải initial load, filter local
          if (!isInitialLoad.value && allAdAccounts.value.length > 0) {
            filterLocalAccounts(query)
          } else {
            try {
              await getListAdAccounts({ q: query })
            } catch (error) {
              console.error('Search error:', error)
            }
          }
        }
      }, 300)
    } else {
      // Khi clear search,show all items
      if (selectField == 'ad_account' && !isInitialLoad.value) {
        displayedAdAccounts.value = [...allAdAccounts.value]
      }
    }
  }
}

onMounted(async () => {
  try {
    await preloadAllAdAccounts()

    // kiểm tra xem có campaign trigger không
    const campaignTrigger = usePixelTriggersDetail.pixelConfig.triggers.find(
      (t: any) => t.field === 'campaign'
    )

    if (
      campaignTrigger &&
      campaignTrigger.value &&
      campaignTrigger.value.length > 0
    ) {
      const campaignIds = campaignTrigger.value.join(',')
      await getListCampaign({ q: campaignIds })
    } else {
      await getListCampaign()
    }
  } catch (error) {
    console.error('Preload accounts error:', error)
  }
})

const initShowModal = () => {
  for (
    let index = 0;
    index < usePixelTriggersDetail.pixelConfig.triggers.length;
    index++
  ) {
    const element = usePixelTriggersDetail.pixelConfig.triggers[index]
    if (element.field == 'ad_account') {
      usePixelTriggersDetail.multipleAccountIds = element.value.join('\n')
      break
    }
  }

  usePixelTriggersDetail.showModal = true
}

const removeCondition = function (e: Event) {
  e.preventDefault()
  let thisElement = e.target as HTMLElement
  if (!thisElement) {
    return
  }
  let ruleCdtn = document.querySelectorAll('.rows-condition')
  if (ruleCdtn.length <= 1) {
    return
  }
  let parentElement: any = thisElement.closest('div.rows-condition')
  let index = Number(parentElement.getAttribute('index'))
  if (parentElement && index) {
    let dataCondition = usePixelTriggersDetail.pixelConfig
      .triggers as pixelTrigger[]
    dataCondition.splice(index, 1)
  }

  return true
}

const allowAdd = computed<boolean>(() => {
  return !(
    usePixelTriggersDetail.pixelConfig.triggers.length >=
    triggerConditionOption.value.length
  )
})

const addCondition = () => {
  if (!usePixelTriggersDetail.pixelConfig) {
    return
  }
  let dataCondition = usePixelTriggersDetail.pixelConfig
    .triggers as pixelTrigger[]
  dataCondition.push({ field: null, condition: 'include', value: [] })
}
</script>
<template>
  <div
    v-for="(tp_condition, index) in usePixelTriggersDetail.pixelConfig.triggers"
    :key="index"
    :index="index"
    class="rows-condition my-4 flex items-center"
  >
    <div class="flex items-center w-full">
      <div style="width: 25%">
        <div class="pr-2">
          <FloatingWrapper :name="index <= 0 ? 'If' : 'And'">
            <n-select
              v-model:value="tp_condition.field"
              filterable
              :options="triggerConditionOptionNow"
              :loading="usePixelTriggersDetail.isLoading"
              placeholder=""
              :on-update:value="(value: string) => onchangeTrigger(value, index)
              "
            />
          </FloatingWrapper>
        </div>
      </div>
      <div style="width: 20%" class="mx-2">
        <div class="pr-2">
          <FloatingWrapper name="Type">
            <n-select
              v-model:value="tp_condition.condition"
              filterable
              :options="triggerIncludeOption"
              :loading="usePixelTriggersDetail.isLoading"
              @update:value="(value: string) => onchangeType(value, tp_condition.field)"
            />
          </FloatingWrapper>
        </div>
      </div>
      <div style="width: 54%">
        <div class="pr-2 flex items-center">
          <FloatingWrapper name="Condition">
            <n-select
              v-model:value="tp_condition.value"
              :disabled="!tp_condition.field"
              :remote="
                tp_condition.field == 'ad_account' ||
                tp_condition.field == 'campaign'
              "
              multiple
              clearable
              filterable
              :value-field="valueField(tp_condition.field)"
              :label-field="labelField(tp_condition.field)"
              :options="triggerValueOption(tp_condition.field)"
              :loading="loadingNow(tp_condition.field)"
              placeholder=""
              @search="(term: string) => handleSearch(term, tp_condition.field)"
            />
          </FloatingWrapper>
          <n-tooltip v-if="tp_condition.field == 'ad_account'" trigger="hover">
            <template #trigger>
              <n-button class="ml-2" color="#f43f5e" @click="initShowModal">
                Bulk Entry
              </n-button>
            </template>
            <span
              >Enter multiple account ids separated by commas or lines.</span
            >
          </n-tooltip>
        </div>
      </div>
    </div>
    <div>
      <n-button
        class="remove-condition"
        icon-placement="left"
        tertiary
        :disabled="usePixelTriggersDetail.pixelConfig.triggers.length === 1"
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
  <n-button v-if="allowAdd" icon-placement="left" @click="addCondition">
    <template #icon>
      <n-icon>
        <PlusSmall />
      </n-icon>
    </template>
    Add
  </n-button>
</template>
