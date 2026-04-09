<script setup lang="ts">
import { creativeType } from '@/types/components/creative'

const props = defineProps({
  cre: {
    type: Object as () => creativeType,
    required: true,
  },
})
</script>

<template>
  <div class="flex my-4">
    <div class="w-1/6 font-bold">Display Path</div>
    <div class="w-5/6 flex gap-2 place-items-center">
      /<n-input
        v-model:value="props.cre.display_path[0]"
        type="text"
        placeholder="First Path"
        maxlength="15"
      />
      /<n-input
        v-model:value="props.cre.display_path[1]"
        type="text"
        placeholder="Second Path"
        maxlength="15"
      />
    </div>
  </div>
</template>
