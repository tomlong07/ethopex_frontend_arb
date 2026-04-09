<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { CONVERSION_LOGIC } from '@/enum/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const isShow = computed(() => {
  return props.campaign.IsDemandPubPower()
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      props.campaign.conversion_logic = CONVERSION_LOGIC.BY_CLICK
    }
  }
)

const conversionLogicOptions: SelectOption[] = [
  {
    value: CONVERSION_LOGIC.BY_CLICK,
    label: 'By Click',
  },
  {
    value: CONVERSION_LOGIC.BY_EPC,
    label: 'By EPC',
  },
  {
    value: CONVERSION_LOGIC.BY_USER_VALUE,
    label: 'By User Value',
  },
]

const name = 'Conversion Logic'
</script>
<template>
  <div class="flex gap-4 items-center" v-if="isShow">
    <div class="w-52 font-bold flex items-center gap-2 text-gray-500 text-xs">
      {{ name }}
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        If "By EPC" is selected, use "EPC Min"; if "By Click" is selected, use
        "Clicks".
      </n-popover>
    </div>
    <div class="flex-1 min-w-0 flex flex-col">
      <n-radio-group v-model:value="props.campaign.conversion_logic">
        <n-space>
          <n-radio
            v-for="conv in conversionLogicOptions"
            :key="conv.value"
            :value="conv.value"
            :label="(conv.label as string)"
          />
        </n-space>
      </n-radio-group>
    </div>
  </div>
</template>
