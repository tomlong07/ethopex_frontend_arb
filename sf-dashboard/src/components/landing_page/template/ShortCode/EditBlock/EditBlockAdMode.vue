<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { optionsEditBlock } from '@/options/landing_page';

const props = defineProps<{
  index: number
}>()

const modelValue = defineModel<string>()
const form = useShortCodeBlock()

const clearAdType = () => {
  if (form.editingForm && modelValue.value === 'adsense') {
    form.updateArrayblockValue(props.index, 'adType', undefined)
  }
}

watch(modelValue, (newValue) => {
  if (newValue === 'adsense') {
    // If Adsense is selected, clear the adType
    clearAdType()
  } else {
    form.updateArrayblockValue(props.index, 'adType', 'native')
  }
})

onMounted(() => {
  clearAdType()
})
</script>
<template>
  <n-form-item
    label="Ad Mode"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-select
      v-model:value="modelValue"
      :options="optionsEditBlock"
      placeholder="Select Ad Mode"
      clearable
    >
    </n-select>
  </n-form-item>
</template>
