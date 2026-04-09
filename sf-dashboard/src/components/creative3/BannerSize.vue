<script setup lang="ts">
import {
  CreativeStateManager,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const sizeBannerOptions: SelectOption[] = [
  { label: '300x250', value: '300x250' },
  { label: '728x90', value: '728x90' },
  { label: '160x600', value: '160x600' },
]

const sizeOptions = computed(() => {
  if (props.cre.IsPocpocBannerHtml()) {
    return [{ label: '1x1', value: '1x1' }].concat(sizeBannerOptions as any)
  }
  return sizeBannerOptions
})
watch(
  () => props.cre.ad_type,
  async (newValue, oldValue) => {
    if (props.stateManager.isEditPage() || !props.cre.IsPocpocBanner()) return
    if (newValue) {
      props.cre.size = sizeOptions.value[0].value as string
    } else {
      props.cre.size = undefined
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Size" small rounded v-if="props.cre.IsPocpocBanner()">
    <n-select
      v-model:value="props.cre.size"
      clearable
      :disabled="props.stateManager.isEditPage()"
      placeholder="Size"
      :options="sizeOptions"
  /></FloatingWrapper>
</template>
