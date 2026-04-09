<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
// const billingLink =
//   'https://ads.google.com/aw/billing/promotions?ocid=7167794084'
const billingLink = computed(() => {
  const ocid = props.params?.data?.ocid
  if (ocid) {
    return `https://ads.google.com/aw/billing/promotions?ocid=${ocid}`
  }
  return null
})
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div class="w-full overflow-hidden">
        <a
          v-if="billingLink"
          :href="billingLink"
          target="_blank"
          rel="noopener noreferrer"
          class="hover:text-blue-800 no-underline text-blue-500 cursor-pointer block truncate"
        >
          {{ props.params.value }}
        </a>

        <span v-else class="block truncate" :title="props.params.value">
          {{ props.params.value }}
        </span>
      </div>
    </template>
    {{ props.params.value }}
  </n-tooltip>
</template>
