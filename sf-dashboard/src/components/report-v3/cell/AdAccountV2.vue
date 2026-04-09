<script setup lang="ts">
const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  href: {
    type: String,
    required: true,
  },
  link: {
    type: String,
  },
})

// const name = props.cell?.getValue() || '-'

// const href = computed(() => {
//   return `/?ad_account=${name}&group=campaign&start_date=${reportStoreV2.filter.start_date}&end_date=${reportStoreV2.filter.end_date}`
// })
</script>
<template>
  <div class="flex w-full gap-2">
    <a
      :href="props.href"
      target="_blank"
      class="text-blue-500"
      v-if="props.name != '-'"
      >{{ props.name }}</a
    >{{ props.name == '-' ? '-' : '' }}
    <div v-if="props.link" class="ml-auto">
      <a :href="props.link" target="_blank" class="text-blue-500">Open</a>
    </div>
  </div>
</template>
