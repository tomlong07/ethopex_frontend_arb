<script setup lang="ts">
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const createImage = () => {
  props.status.createImageSnapchat = Date.now()
}
</script>

<template>
  <n-button
    class="w-full"
    type="info"
    :loading="props.status.isTransforming"
    @click="createImage"
    v-if="props.cre.IsSnapchat()"
    >Create Images</n-button
  >
</template>
