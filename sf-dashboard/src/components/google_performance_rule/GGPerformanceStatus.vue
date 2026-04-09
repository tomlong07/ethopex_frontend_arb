<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import { ModeClass } from '@/types/components/base'
const useGooglePerformanceRule = GooglePerformanceRule()
const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

const valueType = ref<string>()
const renderStatus = () => {
  if (!useGooglePerformanceRule.QuestionConfig) return ''
  return useGooglePerformanceRule.QuestionConfig.status
}

watchEffect(() => {
  const status = renderStatus()
  switch (status) {
    case 'done':
      valueType.value = 'success'
      break
    case 'new':
      valueType.value = 'info'
      break
    case 'pending':
      valueType.value = 'warning'
      break
    default:
      valueType.value = undefined
      break
  }
})
</script>

<template>
  <div class="flex items-center">
    <div class="w-150-px font-bold">Status</div>
    <div class="w-calc-150-px">
      <n-space>
        <n-tag :bordered="false" :type="(valueType as TType)">
          {{ modeData.isEditPage() ? renderStatus() : 'N/A' }}
        </n-tag>
      </n-space>
    </div>
  </div>
</template>
