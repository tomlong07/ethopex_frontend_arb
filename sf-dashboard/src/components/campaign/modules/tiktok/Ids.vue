<script setup lang="ts">
// import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  ids: {
    type: Array as () => number[],
    required: true,
  },
})
const text = ref(props.ids.join(', '))
</script>

<template>
  <div class="flex items-center">
    <div class="w-1/6 font-bold">Ids</div>
    <div class="w-5/6">
      {{ text }}
    </div>
  </div>
</template>
