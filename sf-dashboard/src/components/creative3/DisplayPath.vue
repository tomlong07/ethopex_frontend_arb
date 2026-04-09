<script setup lang="ts">
import {
  CreativeStateManager,
  creativeTypeClass,
} from '@/types/components/creative-v2'
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
})

onMounted(() => {
  if (props.cre.IsGoogleSearch()) {
    if (!props.cre.display_path) {
      props.cre.SetDefaultDisplayPath()
    }
  }
})

watch(
  () => props.cre.IsGoogleSearch(),
  async (newValue, oldValue) => {
    if (props.stateManager.isDisableType()) {
      return
    }
    if (newValue) {
      props.cre.SetDefaultDisplayPath()
    } else {
      props.cre.display_path = undefined
    }
  }
)
</script>

<template>
  <div
    class="flex gap-2"
    v-if="props.cre.IsGoogleSearch() && props.cre.display_path"
  >
    <FloatingWrapper name="Display Path" small rounded>
      <n-input
        v-model:value="props.cre.display_path[0]"
        type="text"
        placeholder="First Path"
        maxlength="15"
      >
        <template #prefix> / </template>
      </n-input></FloatingWrapper
    >

    <FloatingWrapper small rounded>
      <n-input
        v-model:value="props.cre.display_path[1]"
        type="text"
        placeholder="Second Path"
        maxlength="15"
      >
        <template #prefix> / </template>
      </n-input></FloatingWrapper
    >
  </div>
</template>
