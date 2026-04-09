<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { useLocale } from '@/lang/messages'
const RuleLimit = useLocale(
  () => import('@/lang/vi/rule_limit'),
  () => import('@/lang/en/rule_limit')
)
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>
<template>
  <n-card title="Limit" class="card-flex-gap-4"
    ><div class="flex items-center">
      <div class="w-1/6 font-bold flex items-center gap-2">
        Delay
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <span>{{ RuleLimit.delay }}</span>
        </n-popover>
      </div>
      <div class="w-5/6">
        <n-input-number v-model:value="props.data.delay">
          <template #suffix>
            {{ RuleLimit.second }}
          </template></n-input-number
        >
      </div>
    </div>

    <div class="flex items-center">
      <div class="w-1/6 font-bold flex items-center gap-2">
        Limit Campaign
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <span>{{ RuleLimit.total_rule }}</span>
        </n-popover>
      </div>
      <div class="w-5/6">
        <n-input-number v-model:value="props.data.limit_campaign">
          <template #suffix> campaigns </template></n-input-number
        >
      </div>
    </div></n-card
  >
</template>
