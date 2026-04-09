<script setup lang="ts">
import { ctr_prompt } from '@/services/ctr_prompt'

import PromtDetail from '@/store/details/PromptDetail'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const usePromtDetail = PromtDetail()
const isLoading = ref(false)
const promptRuleOptions = ref<SelectOption[]>([])

const fetchPromptRules = async () => {
  try {
    isLoading.value = true
    const result = await ctr_prompt.GetPromptRule()
    if (result.status) {
      promptRuleOptions.value = result.data
    }
  } catch (error) {
    console.error('Error fetching prompt rules:', error)
    promptRuleOptions.value = []
  } finally {
    isLoading.value = false
  }
}

const isDev = computed(() => {
  return window.arb.isDev()
})

onMounted(() => {
  fetchPromptRules()
})
</script>
<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Rule">
        <n-input
          v-model:value="usePromtDetail.dataConfig.rule"
          :loading="usePromtDetail.statusData.isLoading"
          type="textarea"
          placeholder="Enter rule"
          :autosize="{
            minRows: 10,
            maxRows: 35,
          }"
        />
      </FloatingWrapper>
    </div>
  </div>
  <div class="flex items-center" v-if="isDev">
    <div class="w-full">
      <FloatingWrapper name="Prompt rule id">
        <n-select
          v-model:value="usePromtDetail.dataConfig.prompt_rule_id"
          :options="promptRuleOptions"
          :loading="isLoading"
          placeholder=""
          label-field="name"
          value-field="id"
          clearable
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
