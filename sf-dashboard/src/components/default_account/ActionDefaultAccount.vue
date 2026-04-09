<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div class="flex w-full h-full items-center">
    <router-link :to="`/account-preset/${props.params.data.id}`">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
      />
    </router-link>
  </div>
</template>
