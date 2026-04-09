<script setup lang="ts">
import {
  campaignTypeClass,
  adGroups,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { transformOptions } from '@/components/campaign/help/select'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BENEFICIARY } from '@/constants/formats'
import ModalLocation from '../../modal/ModalLocation.vue'
const store = usePresetLocations()

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
    type: null,
    required: false,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isLoading = ref<boolean>(false)
const countriesOptions = ref<SelectOption[]>([])

const countriesOptionsShow = computed<SelectOption[]>(() => {
  let options: SelectOption[] = []

  const isNotSelect = !props.adgroup.location?.value?.length

  if (isNotSelect) {
    options = helper.clone(countriesOptions.value)
  } else {
    const isHasAll = props.adgroup?.location?.value?.includes('ALL') || false
    options = transformOptions(countriesOptions, isHasAll)
  }

  //Nếu chọn categories
  if (props.campaign.categories?.length) {
    options = options.map((option) =>
      option.value === 'ALL' ? { ...option, disabled: true } : option
    )
  }

  return options
})

const fetchCountriesByTraffic = async () => {
  const countriesOptionsResult = await ctr_traffic_source.GetCountries({
    traffic_source: props.campaign.traffic_source,
    ad_type: props.campaign.IsSmart() ? 'smart' : undefined,
  })

  const countries = countriesOptionsResult?.data?.coutries || []

  const filteredCountries = countries.filter(
    (country: any) => country.value !== 'all' && country.value !== 'ALL'
  )

  countriesOptions.value = [
    {
      name: 'All Locations',
      value: 'ALL',
    },
    ...filteredCountries,
  ]
  props.statusData.optionsLocationTT = countriesOptions.value
}

// onMounted(async () => {
//   if (props.campaign.IsAPI()) {
//     if (!props.adgroup.location) {
//       props.adgroup.location = {
//         value: [],
//         type: 'include',
//       }
//     }

//     await fetchCountriesByTraffic()
//   }
// })

watch(
  () => [props.statusData.IsTabAdGroup(), props.statusData.adGroupIndex],
  async ([tab, index]) => {
    if (tab && index !== undefined) {
      if (props.campaign.IsAPI()) {
        if (!props.adgroup.location) {
          props.adgroup.location = {
            value: [],
            type: 'include',
          }
        }

        await fetchCountriesByTraffic()
      }
    }
  }
)

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

const updateLocations = (value: string[]) => {
  if (props.adgroup.location) {
    props.adgroup.location.value = value

    // Tạo sự kiện click giả trên class name-affect-comp để kích hoạt userClick
    // sẽ giúp watcher bắt được thay đổi và cập nhật name
    const parentElement = document.querySelector('.name-affect-comp')
    if (parentElement) {
      parentElement.dispatchEvent(
        new MouseEvent('click', {
          bubbles: true,
          cancelable: true,
        })
      )
    }
  }
}

const isHasEU = () => {
  return props.adgroup?.location?.value?.some((countryCode) =>
    helper.isEUCountry(countryCode)
  )
}

watch(
  () => props.adgroup.location?.value,
  (value) => {
    if (isHasEU()) {
      props.adgroup.beneficiary = BENEFICIARY
    } else {
      props.adgroup.beneficiary = ''
    }
  }
)

const name = 'Locations'
</script>

<template>
  <div
    class="flex items-center name-affect-comp gap-2"
    v-if="props.adgroup?.location"
  >
    <FloatingWrapper :name="name" rounded required>
      <div class="flex-1 min-w-0 flex gap-2">
        <n-select
          :value="props.adgroup.location?.value"
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
          :max-tag-count="5"
        />
        <n-button @click="store.openModal">Preset </n-button>
      </div>
    </FloatingWrapper>

    <ModalLocation
      :campaign="campaign"
      :data-select="countriesOptions"
      :adgroup="adgroup"
    />
  </div>
</template>
