<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { transformOptions } from '@/components/campaign/help/select'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
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
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI() && props.campaign.IsDemandGen()
})

const isLoading = ref<boolean>(false)
const countriesOptions = ref<SelectOption[]>([])

const countriesOptionsShow = computed<SelectOption[]>(() => {
  let options: SelectOption[] = []

  if (!props.campaign.ad_groups) return options

  const isNotSelect = !props.adgroup.location?.value?.length

  if (isNotSelect) {
    return countriesOptions.value
  }
  const isHasAll = props.adgroup?.location?.value?.includes('ALL') || false

  options = transformOptions(countriesOptions, isHasAll)

  return options
})

const fetchCountriesByTraffic = async () => {
  const countriesOptionsResult = await ctr_traffic_source.GetCountries({
    traffic_source: props.campaign.traffic_source,
  })
  countriesOptions.value = countriesOptionsResult?.data?.coutries || []
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue && props.campaign.ad_groups) {
      props.adgroup.location = undefined
    }
  }
)
watch(
  () => [props.statusData.adGroupIndex, props.statusData.IsTabAdGroup()],
  (index, IsTabAdGroup) => {
    if (index !== null && IsTabAdGroup) {
      fetchCountriesByTraffic()
    }
  }
)
onMounted(async () => {
  if (isShow.value) {
    if (props.campaign.ad_groups) {
      if (!props.adgroup.location) {
        props.adgroup.location = {
          value: [],
          type: 'include',
        }
      }
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
const name = 'Location'

const updateLocations = (value: string[]) => {
  if (props.adgroup.location) {
    props.adgroup.location.value = value
  }
}
</script>

<template>
  <div
    class="flex-1 min-w-0 flex items-center gap-2"
    v-if="isShow && props.campaign.ad_groups"
  >
    <FloatingWrapper v-if="props.adgroup.location" :name="name" rounded>
      <n-select
        :value="props.adgroup.location.value"
        filterable
        multiple
        clearable
        value-field="value"
        label-field="name"
        :loading="isLoading"
        :placeholder="name"
        :options="countriesOptionsShow"
        :filter="filterHandle"
        :on-update:value="updateLocations"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-if="props.adgroup.location"
      v-model="props.adgroup.location.type"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
    />
  </div>
</template>
