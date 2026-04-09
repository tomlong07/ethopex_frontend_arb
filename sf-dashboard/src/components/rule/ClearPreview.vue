<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'
import { useTemplateV2 } from '@/store/templateV2Store'
const templateV2Store = useTemplateV2(helper.truePath())()

const isLoading = ref<boolean>(false)

const clearPreview = async () => {
  if (!templateV2Store.asyncConfigs.clearPreview) return

  if (!templateV2Store.filterList.rule_id?.length) {
    window.message.error('Select at least one rule to clear the preview')
    return
  }

  isLoading.value = true

  const arrRule = templateV2Store.filterList.rule_id.map((rule_id: any) => ({
    rule_id,
  }))

  const result = await ctr_rule.ClearPreview(
    templateV2Store.asyncConfigs.clearPreview,
    arrRule
  )

  if (result?.status) {
    window.message.success('Success!')
    templateV2Store.reInitTable()
  }
  isLoading.value = false
}
</script>

<template>
  <div class="flex items-center gap-2">
    <n-button
      color="#f43f5e"
      size="small"
      :loading="isLoading"
      @click="clearPreview"
    >
      Clear Preview
    </n-button>
  </div>
</template>
