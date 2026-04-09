<script setup lang="ts">
import { campaignTypeClass } from '@/types/components/campaign-v2'
import Note from '@/components/helpers/Note.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsHasSecondaryKeyword(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.campaign.secondary_keyword = undefined
    }
  }
)

const name = 'Secondary Keyword'
</script>

<template>
  <FloatingWrapper rounded v-if="props.campaign.IsHasSecondaryKeyword()">
    <div class="text-xs font-bold flex items-center gap-2">
      {{ name }}

      <Note :text="`${name} available with Auto Keyword 1`" />
    </div>
    <div class="flex-1 min-w-0">
      <n-input v-model:value="campaign.secondary_keyword" :placeholder="name">
      </n-input>
    </div>
  </FloatingWrapper>
</template>
