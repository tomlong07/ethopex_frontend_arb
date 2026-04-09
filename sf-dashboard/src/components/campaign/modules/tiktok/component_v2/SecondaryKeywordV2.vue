<script setup lang="ts">
import { CampaignContext } from '@/types/components/campaign-v2'
import Note from '@/components/helpers/Note.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.data.campaign.IsHasSecondaryKeyword(),
  async (newValue, oldValue) => {
    if (newValue === false) {
      props.data.campaign.secondary_keyword = undefined
    }
  }
)

const name = 'Secondary Keyword'
</script>

<template>
  <FloatingWrapper rounded v-if="props.data.campaign.IsHasSecondaryKeyword()">
    <div class="text-xs font-bold flex items-center gap-2">
      {{ name }}

      <Note :text="`${name} available with Auto Keyword 1`" />
    </div>
    <div class="flex-1 min-w-0">
      <n-input
        v-model:value="props.data.campaign.secondary_keyword"
        :placeholder="name"
      >
      </n-input>
    </div>
  </FloatingWrapper>
</template>
