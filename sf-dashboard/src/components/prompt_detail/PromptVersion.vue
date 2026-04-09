<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { SelectOption } from 'naive-ui'
const usePromtDetail = PromtDetail()

const changePromptFollowVersion = (value: string, option: SelectOption) => {
  usePromtDetail.dataConfig.version = value
  usePromtDetail.dataConfig.prompt = (option as any).prompt || ''
}

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'truncate' }, option.label as string),
    option.time
      ? h(
          'span',
          { class: 'text-gray-400 text-xs ml-2' },
          helper.convertToVNTime(option.time as string)
        )
      : null,
  ])
}
</script>
<template>
  <div class="flex items-center">
    <div class="w-full flex gap-2 items-center">
      <FloatingWrapper name="Version">
        <n-select
          v-model:value="usePromtDetail.dataConfig.version"
          :loading="usePromtDetail.statusData.isLoading"
          placeholder="Enter version"
          filterable
          :options="usePromtDetail.selectData.versionOptions"
          :on-update:value="changePromptFollowVersion"
          :render-label="renderLabel"
        />
      </FloatingWrapper>

      <n-button @click="usePromtDetail.showModal = true">Manage</n-button>
    </div>
  </div>
</template>
