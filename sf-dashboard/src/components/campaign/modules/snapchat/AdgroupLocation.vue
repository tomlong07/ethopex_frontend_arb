<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  adGroups,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import { TS } from '@/enum/campaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import ModalLocation from '../../modal/ModalLocation.vue'
import { linkField } from './helpers'

const store = usePresetLocations()
const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: false,
  },

  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  if (props.campaign.IsDemandGen()) {
    return false
  }

  return props.campaign.IsAPI()
})
const isLoadAll = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const countriesOptions = ref<SelectOption[]>([])
const locationValueModel = linkField<string[] | null>(
  'location.value',
  [() => props.adGroup],
  { fallback: [] }
)

const locationTypeModel = linkField<string | null>(
  'location.type',
  [() => props.adGroup],
  { fallback: 'include' }
)

const countriesOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect =
    !locationValueModel.value || !locationValueModel.value.length

  if (isNotSelect) {
    return countriesOptions.value
  }

  const isHasAll = locationValueModel.value?.includes('ALL')

  let options: SelectOption[] = []

  for (let index = 0; index < countriesOptions.value.length; index++) {
    const element = helper.clone(countriesOptions.value[index])
    if (isHasAll) {
      if (element.value === 'ALL') {
        options.push(element)
      } else {
        element.disabled = true
        options.push(element)
      }
    } else {
      if (element.value === 'ALL') {
        element.disabled = true

        options.push(element)
      } else {
        options.push(element)
      }
    }
  }

  return options
})

const renderName = computed<string>(() => {
  if (locationValueModel.value?.length) {
    let tempLocations = []
    for (let index = 0; index < locationValueModel.value.length; index++) {
      const element = locationValueModel.value[index]
      const r = countriesOptions.value.find(
        (item: SelectOption) => item.value === element
      )

      if (r) {
        tempLocations.push(r.code)
      }
    }

    return tempLocations.join(', ')
  }

  return ''
})

const fetchCountriesByTraffic = async () => {
  const countriesOptionsResult = await ctr_traffic_source.GetCountries({
    traffic_source: props.campaign.traffic_source,
  })
  countriesOptions.value = countriesOptionsResult?.data?.coutries || []

  // lưu mã code cho TikTok để hiển thị => Name
  if (props.campaign.traffic_source === TS.TIKTOK && props.statusData) {
    props.statusData.valueToCodeMap = {}
    countriesOptionsResult?.data?.coutries.forEach((country: any) => {
      ;(props.statusData as any).valueToCodeMap[country.value] = country.code
    })
  }
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      locationValueModel.value = []
      locationTypeModel.value = 'include'

      await fetchCountriesByTraffic()
    } else {
      locationValueModel.value = undefined as unknown as string[] | null
      locationTypeModel.value = undefined as unknown as string | null
      props.adGroup.location = undefined
      props.campaign.location = undefined
    }
  }
)
watch(
  () => locationValueModel.value,
  (values) => {
    isLoadAll.value = Boolean(values?.length === 1 && values[0] === 'ALL')
  }
)

onMounted(async () => {
  if (isShow.value) {
    if (!locationValueModel.value?.length) {
      locationValueModel.value = []
      locationTypeModel.value = 'include'
    }

    await fetchCountriesByTraffic()
  }
})

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

defineExpose({
  renderName,
})

const name = 'Location'
</script>

<template>
  <div
    v-if="props.adGroup.location && isShow"
    class="flex-1 min-w-0 flex items-center gap-2 name-affect-comp"
  >
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="locationValueModel"
        filterable
        multiple
        clearable
        value-field="value"
        label-field="name"
        :loading="isLoading"
        :placeholder="name"
        :options="countriesOptionsShow"
        :max-tag-count="3"
        :filter="filterHandle"
        :disabled="props.FreezeData.isEditPage() && !!adGroup.id"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-model="locationTypeModel"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
      :disabled="
        props.FreezeData.isEditPage() ||
        props.campaign.IsTrafficSnapchat() ||
        props.campaign.IsDemandGen()
      "
    />

    <n-button @click="store.openModal">Preset </n-button>
  </div>

  <ModalLocation
    :campaign="campaign"
    :data-select="countriesOptionsShow"
    :adgroup="adGroup"
  />
</template>
