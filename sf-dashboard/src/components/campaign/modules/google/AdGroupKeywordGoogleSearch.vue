<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

import { useLocale } from '@/lang/messages'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
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
  if (!props.campaign.ad_groups) {
    return 0
  }
  let input = props.adgroup.keywords_gg_search || ''
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
      if (props.campaign.ad_groups) {
        props.adgroup.keywords_gg_search = undefined
      }
    }
  }
)

const textCampKeyword = () => {
  return Message.value.campkeyword.replaceAll('%v', '')
}
</script>

<template>
  <div v-if="props.campaign.IsGGSearch() && props.campaign.ad_groups">
    <FloatingWrapper name="  Keyword Google Search" rounded>
      <n-input
        v-model:value="props.adgroup.keywords_gg_search"
        type="textarea"
        placeholder="Keywords"
        :disabled="!!props.adgroup.id"
      />
    </FloatingWrapper>

    <div class="flex items-center gap-2">
      <span class="font-xs italic text-gray-400"
        >{{ countKeywordPlan }} Keywords
      </span>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="12"><QuestionCircleRegular /></n-icon>
        </template>
        <span>{{ textCampKeyword() }}</span>
      </n-popover>
    </div>
  </div>
</template>
