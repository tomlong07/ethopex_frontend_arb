<script lang="ts" setup>
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
import { NTooltip } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const StyleExperimentStore = useStyleExperimentStore()

const updateGeneration = (value: string) => {
  StyleExperimentStore.dataConfig.generation = value
  StyleExperimentStore.dataConfig.updateStyles = []
  StyleExperimentStore.getStyleOptions()
}

const renderLabel = (option: any) => {
  if (option.disabled) {
    return h('div', { class: 'flex w-full' }, [
      h(NTooltip, null, {
        trigger: () =>
          h('span', { style: { 'max-width': '80%' } }, option.label),
        default: () => 'This generation has been used',
      }),
    ])
  }
  return h('span', option.label)
}
</script>

<template>
  <div class="flex">
    <div class="w-full flex flex-col">
      <FloatingWrapper
        name="Generation"
      >
        <n-select
          v-model:value="StyleExperimentStore.dataConfig.generation"
          tag
          placeholder=""
          :options="StyleExperimentStore.generationSelectOptions"
          :on-update:value="updateGeneration"
          :render-label="renderLabel"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
