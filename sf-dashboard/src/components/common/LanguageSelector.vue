<script setup lang="ts">
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { SelectOption } from 'naive-ui'
import { TS } from '@/enum/campaign'
import FloatingWrapper from './FloatingWrapper.vue'

const languageOptionsList = ref<SelectOption[]>([])
const loadingLanguages = ref(false)

const props = defineProps({
  modelValue: {
    type: [String, Array, null] as PropType<string | number | null>,
    default: null,
  },
  label: {
    type: String,
    default: 'Language',
  },

  redDot: {
    type: Boolean,
    default: false,
  },

  width: {
    type: String,
    default: 'w-72',
  },
})
const emit = defineEmits(['update:modelValue'])
const updateValue = (value: any) => {
  emit('update:modelValue', value)
}

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code2?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

onMounted(async () => {
  if (languageOptionsList.value.length === 0) {
    loadingLanguages.value = true
    let result

    try {
      result = await ctr_traffic_source.GetLanguage(TS.GOOGLE)

      // For Google traffic source, use code2 as the value
      languageOptionsList.value = (result?.data?.languages || [])
        .filter((item: any) => item.code2 !== 'ALL')
        .map((item: any) => ({
          value: item.code2 || item.value,
          code2: item.code2,
          name: item.name,
        }))
    } catch (error) {
      console.error('Error fetching language options:', error)
    } finally {
      loadingLanguages.value = false
    }
  }
})
</script>

<template>
  <FloatingWrapper :name="props.label" :required="true">
    <n-select
      :value="props.modelValue"
      @update:value="updateValue"
      filterable
      value-field="value"
      label-field="name"
      :loading="loadingLanguages"
      placeholder=""
      :options="languageOptionsList"
      :clearable="true"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
