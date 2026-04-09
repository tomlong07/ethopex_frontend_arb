<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import ModalLocation from '../modal/ModalLocation.vue'
const store = usePresetLocations()
import { TS } from '@/enum/campaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

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

const countriesOptionsShow = computed<SelectOption[]>(() => {
  const isNotSelect =
    !props.campaign?.location?.value || !props.campaign?.location?.value.length

  if (isNotSelect) {
    return countriesOptions.value
  }

  const isHasAll = props.campaign?.location?.value?.includes('ALL')

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
  if (props.campaign.location?.value?.length) {
    let tempLocations = []
    for (
      let index = 0;
      index < props.campaign.location?.value.length;
      index++
    ) {
      const element = props.campaign.location?.value[index]
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
      props.campaign.location = {
        value: [],
        type: 'include',
      }

      await fetchCountriesByTraffic()
    } else {
      props.campaign.location = undefined
    }
  }
)
watch(
  () => props.campaign.location,
  async (newValue, oldValue) => {
    if (newValue?.value?.length === 1 && newValue.value[0] === 'ALL') {
      isLoadAll.value = true
    } else {
      isLoadAll.value = false
    }
  }
)

onMounted(async () => {
  if (isShow.value) {
    if (!props.campaign.location) {
      props.campaign.location = {
        value: [],
        type: 'include',
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

defineExpose({
  renderName,
})

const isDisabled = computed(() => {
  if (
    props.campaign.IsPMax() ||
    props.campaign.IsGGDisplay() ||
    props.campaign.IsTrafficPocPoc()
  )
    return false

  return props.FreezeData.isEditPage()
})

const name = 'Location'
</script>

<template>
  <div
    v-if="props.campaign.location && isShow"
    class="flex-1 min-w-0 flex items-center gap-2 name-affect-comp"
  >
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="props.campaign.location.value"
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
        :disabled="isDisabled"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-model="props.campaign.location.type"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
      :disabled="isDisabled || props.campaign.IsTrafficSnapchat()"
    />

    <n-button @click="store.openModal">Preset </n-button>
  </div>

  <ModalLocation :campaign="campaign" :data-select="countriesOptionsShow" />
</template>
