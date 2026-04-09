<script setup lang="ts">
import DateRanger from '@/components/common/DateRanger.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import { storeToRefs } from 'pinia'
import { DATE_RANGE } from '@/enum/report-v2'

const props = defineProps({
  classLabel: {
    type: String,
    default: '',
  },

  minDate: {
    type: String,
    default: '',
  },
  teleport: {
    type: Boolean,
    default: false,
  },

  classContainer: {
    type: String,
    default: 'flex-col',
  },

  smallPicker: {
    type: Boolean,
    default: false,
  },
})

const templateV2Store = useTemplateV2(helper.truePath())()
const { filterList } = storeToRefs(templateV2Store)

const startProp = computed(() => 
  templateV2Store.datePicker.isMultiMonth ? 'start_month' : 'start_date'
)
const endProp = computed(() => 
  templateV2Store.datePicker.isMultiMonth ? 'end_month' : 'end_date'
)

// Computed date value để truyền vào DateRanger
const dateValue = computed<string[]>(() => [
  filterList.value[startProp.value], 
  filterList.value[endProp.value]
])

// Handler khi date thay đổi
const handleUpdateDate = (val: string[]) => {
  filterList.value[startProp.value] = val[0]
  filterList.value[endProp.value] = val[1]

  if (
    templateV2Store.filterConfigs.instantUpdate &&
    templateV2Store.allowInstant
  ) {
    templateV2Store.reInitTable()
  }
}

const status = computed(() => ({
  isFetching: templateV2Store.isFetching,
}))

const multiCalendars = computed(() => !templateV2Store.datePicker.isMultiMonth)

const monthPicker = computed(() => templateV2Store.datePicker.isMultiMonth)

const enabledPresets = computed<DATE_RANGE[]>(() => {
  const presets: DATE_RANGE[] = []
  
  if (!templateV2Store.datePicker.isMultiMonth) {
    presets.push(
      DATE_RANGE.TODAY,
      DATE_RANGE.YESTERDAY,
      DATE_RANGE.LAST_7_DAYS,
      DATE_RANGE.LAST_30_DAYS
    )
  }
  
  presets.push(
    DATE_RANGE.THIS_MONTH,
    DATE_RANGE.LAST_MONTH,
    DATE_RANGE.FIRST_QUARTER,
    DATE_RANGE.SECOND_QUARTER,
    DATE_RANGE.THIRD_QUARTER,
    DATE_RANGE.FOURTH_QUARTER,
    DATE_RANGE.ALL_TIME
  )
  
  return presets
})
</script>

<template>
  <DateRanger
    :defaultDate="dateValue"
    :status="status"
    :classLabel="props.classLabel"
    :minDate="props.minDate"
    :teleport="props.teleport"
    :classContainer="props.classContainer"
    :smallPicker="props.smallPicker"
    :multiCalendars="multiCalendars"
    :monthPicker="monthPicker"
    :enabledPresets="enabledPresets"
    @updateDate="handleUpdateDate"
  />
</template>
