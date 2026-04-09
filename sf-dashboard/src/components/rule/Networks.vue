<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
})
</script>

<template>
  <n-card title="Networks" class="card-flex-gap-4"
    ><div class="flex items-center">
      <div class="w-1/6 font-bold">Search Network</div>
      <div class="w-5/6">
        <n-checkbox v-model:checked="props.data.search_network"
          >Include Google search partners</n-checkbox
        >
      </div>
    </div>

    <div class="flex items-center">
      <div class="w-1/6 font-bold">Display Network</div>
      <div class="w-5/6">
        <n-checkbox v-model:checked="props.data.display_network"
          >Include Google Display Network</n-checkbox
        >
      </div>
    </div></n-card
  >
</template>
