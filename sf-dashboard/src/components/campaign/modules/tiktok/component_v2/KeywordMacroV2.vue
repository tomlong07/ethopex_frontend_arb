<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ONOFF } from '@/enum/campaign'
import { CampaignContext } from '@/types/components/campaign-v2'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const isShow = computed(() => {
  return (
    props.data.campaign.IsDemandAdsense() &&
    props.data.campaign.prelanding === ONOFF.ON
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      props.data.campaign.keyword_macro = ''
    }
  },
  { immediate: true }
)

const name = `Keyword Macro`
</script>
<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-input
      v-model:value="props.data.campaign.keyword_macro"
      :placeholder="name"
      class="mt-1"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
