<script setup lang="ts">
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { useLocale } from '@/lang/messages'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const countKeywordPlan = computed<number>(() => {
  let input = props.campaign.keywords_gg_search || ''
  let parts = input.split(/[,\n]+/)
  let result = parts.map((part) => part.trim()).filter((part) => part !== '')
  return result.length || 0
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsGGSearch(),
  async (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.campaign.keywords_gg_search = undefined
    }
  }
)
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="props.campaign.IsGGSearch() && props.campaign.keywords_gg_search"
  >
    <div class="w-40 font-bold flex items-center gap-2">
      Keyword Google Search
    </div>

    <div class="flex-1 min-w-0 flex flex-col gap-2">
      <n-input
        v-model:value="props.campaign.keywords_gg_search"
        type="textarea"
        placeholder="Keywords"
        :disabled="props.FreezeData.isEditPage()"
      />

      <div class="flex items-center gap-2">
        <span class="font-xs italic text-gray-400"
          >{{ countKeywordPlan }} Keywords
        </span>
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <span>{{ Message.campkeyword }}</span>
        </n-popover>
      </div>
    </div>
  </div>
</template>
