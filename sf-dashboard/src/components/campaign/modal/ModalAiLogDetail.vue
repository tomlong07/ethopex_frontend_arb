<script setup lang="ts">
import { aiLog } from '@/types/components/campaign'

const vModel = defineModel<boolean>()
const props = defineProps<{
  AiLog: aiLog
}>()
const closeModal = () => {
  vModel.value = false
}

const typeValue = (option: any) => {
  const action = props.AiLog?.action_type
  const value = option
  if (action === 'TOGGLE_CAMPAIGN') {
    return value === '1' || value === 1 ? 'On' : 'Off'
  }
  if (action === 'CHANGE_BUDGET' || action === 'CHANGE_BID') {
    return `$${parseFloat(value).toFixed(2)}`
  }
  return value
}
</script>
<template>
  <n-modal v-model:show="vModel" closable>
    <n-card
      closable
      style="width: 600px"
      title="AI Log Detail"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
      @close="closeModal"
    >
      <div class="space-y-4 text-sm text-gray-800">
        <div class="grid grid-cols-2 gap-4">
          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Campaign ID</p>
            <p class="font-semibold text-black">{{ AiLog.campaign_id }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Action Type</p>
            <p class="text-indigo-600 font-semibold">
              {{ AiLog.action_type }}
            </p>
          </div>

          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Old Value</p>
            <p class="text-yellow-600 font-semibold">
              {{ typeValue(AiLog.old_value) }}
            </p>
          </div>
          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">New Value</p>
            <p class="text-green-600 font-semibold">
              {{ typeValue(AiLog.new_value) }}
            </p>
          </div>

          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Confidence Score</p>
            <span
              :class="[
                'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                AiLog.confidence_score && AiLog.confidence_score >= 0.75
                  ? 'bg-green-100 text-green-700'
                  : 'bg-yellow-100 text-yellow-700',
              ]"
            >
              {{ AiLog.confidence_score }}
            </span>
          </div>

          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Executed</p>
            <span
              :class="[
                'inline-block px-2 py-0.5 rounded text-xs font-semibold',
                AiLog.executed
                  ? 'bg-green-100 text-green-700'
                  : 'bg-red-100 text-red-700',
              ]"
            >
              {{ AiLog.executed ? 'Yes' : 'No' }}
            </span>
          </div>

          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Decision Time</p>
            <p class="text-black">{{ AiLog.decision_timestamp }}</p>
          </div>
          <div class="p-3 bg-gray-50 rounded shadow-sm">
            <p class="text-gray-500 font-medium">Executed Time</p>
            <p class="text-black">{{ AiLog.execution_timestamp }}</p>
          </div>
        </div>

        <div class="p-4 bg-blue-50 rounded shadow-sm">
          <p class="text-blue-600 font-semibold mb-1">Reasoning</p>
          <p
            class="text-gray-800 text-base whitespace-pre-line leading-relaxed"
          >
            {{ AiLog.reasoning }}
          </p>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button type="info" @click="closeModal"> Close </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
