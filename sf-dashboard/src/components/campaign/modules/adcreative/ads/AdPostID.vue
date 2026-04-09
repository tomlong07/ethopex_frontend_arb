<script lang="ts" setup>
import InputComponent from './InputComponent.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import useAdDataStore from '@/store/adDataStore'

const adDataStore = useAdDataStore()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  item: {
    type: Object as () => any,
    required: true,
  },
})

const name = 'Post ID'
</script>
<template>
  <div class="flex gap-2 items-center">
    <InputComponent v-model:value="props.item.post_id" :name="name" />
    <n-button
      v-if="props.item.post_id"
      class="bg-white hover:!bg-white text-xs"
      @click="adDataStore.openModalAd(props.item)"
    >
      <template #icon> <n-icon :component="Edit20Regular" /> </template
    ></n-button>
  </div>
</template>
