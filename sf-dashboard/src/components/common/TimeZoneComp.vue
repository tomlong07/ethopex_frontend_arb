<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import DropCustom from '@/components/common/DropCustom.vue'
import SkeletonSelect from '@/components/common/SkeletonSelect.vue'

import { ctr_report } from '@/services/ctr_report'

const props = defineProps({
  defaultValue: {
    type: String,
    required: true,
  },

  size: {
    type: String,
    required: false,
    default: '',
  },

  class: {
    type: String,
    required: false,
    default: '',
  },

  loadInit: {
    type: Boolean,
    default: false,
  },
})

const timeZoneOptions = ref<SelectOption[]>([])
const isLoadingTimeZone = ref<boolean>(true)

const updateValue = (timeZone: string) => {
  emit('updateValue', timeZone)
}

const emit = defineEmits<{
  (e: 'updateValue', timeZone: string): void
  (e: 'resetTzDefault'): void
}>()

const loadTimeZone = async () => {
  isLoadingTimeZone.value = true

  const result = await ctr_report.TimeZone()

  if (result?.status) {
    let found = false
    result?.data.forEach((item: any) => {
      if (item.name === props.defaultValue) {
        found = true
      }
      timeZoneOptions.value.push({
        label: '(UTC' + item.offset + ') ' + item.name,
        value: item.name,
      })
    })

    if (!found) {
      window.message.info(
        'Current time zone not available. Resetting to default.'
      )
      emit('resetTzDefault')
    }
  }

  isLoadingTimeZone.value = false
}

onMounted(() => {
  if (props.loadInit) {
    loadTimeZone()
  }
})

const timezoneComp = ref<InstanceType<typeof DropCustom>>()

const changeValueNow = (value: any) => {
  timezoneComp.value?.changeValueNow(value)
}

defineExpose({
  loadTimeZone,
  changeValueNow,
})
</script>

<template>
  <SkeletonSelect v-if="isLoadingTimeZone" />
  <DropCustom
    v-if="!isLoadingTimeZone"
    title="Time Zone"
    :defaultValue="props.defaultValue"
    :valueOptions="timeZoneOptions"
    :size="props.size"
    :class="props.class"
    :isSmall="props.size === 'small'"
    @updateValue="updateValue"
  />
</template>
