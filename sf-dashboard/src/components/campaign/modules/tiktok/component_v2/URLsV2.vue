<script setup lang="ts">
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CampaignContext } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const copyToClipBoard = (text: string = '') => {
  if (!text) {
    return
  }
  helper.copyText(text)
  window.message.success('Copied!')
}
</script>

<template>
  <n-card
    title="URLs"
    class="rounded-[5px] !border-gray2"
    v-if="props.data.campaign.url"
  >
    <div>
      <FloatingWrapper rounded>
        <n-input
          v-model:value="props.data.campaign.url"
          class="mb-2 custom-disabled-input"
          :readonly="true"
          @click="copyToClipBoard(props.data.campaign.url)"
        >
          <template #suffix>
            <n-icon class="cursor-pointer ml-2" :component="CopyOutline" />
          </template>
        </n-input>
      </FloatingWrapper>
    </div>

    <n-button
      v-if="props.data.campaign.url_backup"
      @click="copyToClipBoard(props.data.campaign.url_backup)"
    >
      Backup URL
    </n-button>
    <div v-if="props.data.campaign.link_ads">
      <FloatingWrapper rounded>
        <n-input
          v-model:value="props.data.campaign.link_ads"
          class="mb-2 custom-disabled-input"
          :readonly="true"
          @click="copyToClipBoard(props.data.campaign.link_ads)"
        >
          <template #suffix>
            <n-icon class="cursor-pointer ml-2" :component="CopyOutline" />
          </template>
        </n-input>
      </FloatingWrapper>
    </div>
  </n-card>
</template>
