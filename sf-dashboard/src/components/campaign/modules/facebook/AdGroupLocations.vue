<script setup lang="ts">
import {
  campaignTypeClass,
  adGroups,
  StatusCampManager,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { transformOptions } from '@/components/campaign/help/select'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import ModalLocation from '../../modal/ModalLocation.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { BENEFICIARY } from '@/constants/formats'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { INEX } from '@/enum/campaign'
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
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
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
  })
  countriesOptions.value = countriesOptionsResult?.data?.coutries || []
}

const initLocations = async () => {
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

watch(
  () => [props.statusData.IsTabAdGroup(), props.statusData.adGroupIndex],
  ([tab, index]) => {
    if (tab && index !== undefined) {
      initLocations()
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

const updateBeneficiary = () => {
  const hasEU = isHasEU()
  const isExclude = props.adgroup.location?.type === INEX.EXCLUDE

  if (hasEU || isExclude) {
    // đã có beneficiary thì không change

    if (props.adgroup.beneficiary) return

    props.adgroup.beneficiary = BENEFICIARY
  } else {
    props.adgroup.beneficiary = ''
  }
}

watch(
  () => [props.adgroup.location?.value, props.adgroup.location?.type],
  updateBeneficiary
)

const name = 'Locations'

const showBulkEntry = ref<boolean>(false)
const bulkEntry = ref<string>('')

const openBulkEntry = () => {
  if (props.adgroup.location?.value?.length) {
    const selectedLocations = props.adgroup.location.value
      .map((code) => {
        const option = countriesOptions.value.find(
          (o) => o.value?.toString().toUpperCase() === code.toUpperCase()
        )
        return option ? `${option.name}` : code
      })
      .join('\n')
    bulkEntry.value = selectedLocations
  } else {
    bulkEntry.value = ''
  }

  showBulkEntry.value = true
}

const handleAddBulkEntry = () => {
  if (!bulkEntry.value) return

  const rawInputs = bulkEntry.value
    .split(/[\n,]+/)
    .map((c) => c.trim())
    .filter((c) => c)

  const hasAll = rawInputs.some((c) => c.toUpperCase() === 'ALL')

  if (hasAll && rawInputs.length > 1) {
    window.message.error('ALL must be alone, cannot combine with other codes.')
    return
  }

  if (hasAll) {
    props.adgroup.location!.value = ['ALL']

    const parentElement = document.querySelector('.name-affect-comp')
    if (parentElement) {
      parentElement.dispatchEvent(
        new MouseEvent('click', { bubbles: true, cancelable: true })
      )
    }

    showBulkEntry.value = false
    bulkEntry.value = ''
    return
  }

  const codes: string[] = rawInputs
    .map((c) => {
      const parts = c.split('-')
      const input = parts.length > 1 ? parts[1].trim() : parts[0].trim()

      const option = countriesOptions.value.find(
        (o) =>
          o.value?.toString().toUpperCase() === input.toUpperCase() ||
          o.name?.toString().toUpperCase() === input.toUpperCase()
      )

      return option?.value?.toString().toUpperCase()
    })
    .filter((c): c is string => !!c)

  if (!props.adgroup.location) return

  props.adgroup.location.value = [
    ...new Set([...(props.adgroup.location.value || []), ...codes]),
  ]

  const invalidCodes = rawInputs.filter((input) => {
    const parts = input.split('-')
    const checkInput = parts.length > 1 ? parts[1].trim() : parts[0].trim()

    const match = countriesOptions.value.find(
      (o) =>
        o.value?.toString().toUpperCase() === checkInput.toUpperCase() ||
        o.name?.toString().toUpperCase() === checkInput.toUpperCase()
    )
    return !match
  })

  if (invalidCodes.length) {
    window.message.error(`Invalid codes: ${invalidCodes.join(', ')}`)
  }

  const parentElement = document.querySelector('.name-affect-comp')
  if (parentElement) {
    parentElement.dispatchEvent(
      new MouseEvent('click', { bubbles: true, cancelable: true })
    )
  }

  showBulkEntry.value = false
  bulkEntry.value = ''
}
</script>

<template>
  <FloatingWrapper
    :name="name"
    rounded
    required
    v-if="props.adgroup?.location"
    class="name-affect-comp"
  >
    <div class="flex gap-2 items-center">
      <n-select
        :value="props.adgroup.location?.value"
        filterable
        multiple
        clearable
        value-field="value"
        label-field="name"
        :max-tag-count="5"
        :loading="isLoading"
        :placeholder="name"
        :options="countriesOptionsShow"
        :filter="filterHandle"
        :on-update:value="updateLocations"
      />
      <CustomSwitch
        v-if="props.adgroup.location"
        v-model="props.adgroup.location.type"
        type="inex"
        true-label="Include"
        false-label="Exclude"
        size="small"
      />
      <n-button
        @click="openBulkEntry"
        :disabled="props.adgroup.location?.value?.includes('ALL')"
      >
        Bulk Entry
      </n-button>
      <n-button @click="store.openModal">Preset </n-button>
    </div>
  </FloatingWrapper>

  <n-modal
    v-model:show="showBulkEntry"
    preset="card"
    style="width: 700px"
    title="Bulk Entry Ad Accounts"
  >
    <n-form ref="formRef">
      <n-input
        v-model:value="bulkEntry"
        type="textarea"
        rows="6"
        placeholder="Enter country codes, separated by comma or new line"
      />
    </n-form>
    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="showBulkEntry = false">Cancel</n-button>
        <n-button
          type="primary"
          @click="handleAddBulkEntry"
          :disabled="!bulkEntry.trim()"
        >
          Add
        </n-button>
      </div>
    </template>
  </n-modal>

  <ModalLocation
    :campaign="campaign"
    :data-select="countriesOptions"
    :adgroup="adgroup"
  />
</template>
