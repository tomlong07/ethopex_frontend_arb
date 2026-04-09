<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { prelanderConfigs } from '@/types/components/landing'

const props = defineProps({
  configs: {
    type: Object as () => prelanderConfigs,
    required: true,
  },
})

watch(
  () => props.configs.IsTheme1(),
  (newValue) => {
    if (!newValue) {
      props.configs.title_dropdown = null
    }
  }
)

const name = `Title Dropdown`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="props.configs.IsTheme1()">
    <n-input
      v-model:value="props.configs.title_dropdown"
      :placeholder="name"
      maxlength="500"
    />
  </FloatingWrapper>
</template>
