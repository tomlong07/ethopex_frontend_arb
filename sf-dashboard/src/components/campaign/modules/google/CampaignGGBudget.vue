<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

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
//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
// watch(
//   () => props.campaign.IsAPI(),
//   async (newValue, oldValue) => {
//     if (newValue) {
//       props.campaign.budget = 0;
//     } else {
//        props.campaign.budget= undefined;
//     }
//   }
// );

onMounted(() => {
  if (!props.campaign.budget) props.campaign.budget = 0
})

//Tách riêng budget google vì xử lí trường hợp manual, api khác các ts khác
</script>

<template>
  <FloatingWrapper name="Budget" rounded>
    <n-input-number v-model:value="props.campaign.budget" :max="100000">
      <template #prefix> $ </template>
    </n-input-number>
  </FloatingWrapper>
</template>
