<script lang="ts" setup>
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import InputComponent from './InputComponent.vue'

const props = defineProps({
  item: {
    type: Object as () => any,
    required: true,
  },
})

const copyAdId = () => {
  if (!props.item.ad_id) {
    window.message.warning(`Ad ID not found!`)
    return
  }

  helper.copyText(props.item.ad_id)
  window.message.success('Copied Ad ID!')
}
const name = 'Ad ID'
const isDev = window.arb.isDev()
</script>
<template>
  <div v-if="isDev" class="flex gap-2 items-center">
    <InputComponent v-model:value="props.item.ad_id" :name="name" />
    <n-button class="text-xs bg-white hover:!bg-white" @click="copyAdId">
      <template #icon> <n-icon :component="CopyOutline" /></template
    ></n-button>
  </div>
</template>
