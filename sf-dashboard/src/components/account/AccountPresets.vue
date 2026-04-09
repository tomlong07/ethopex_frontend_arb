<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { computed } from 'vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const presets = computed(() => {
  const value = props.params.value
  
  if (!value || !Array.isArray(value) || value.length === 0) {
    return []
  }
  
  return value.filter((item: any) => item.name)
})
</script>

<template>
  <div class="flex flex-col">
    <span v-if="presets.length === 0" class="text-gray-400">-</span>
    <router-link
      v-for="(preset, index) in presets"
      :key="index"
      :to="`/account-preset/${preset.id}`"
      class="text-blue-600 hover:underline"
      :title="preset.name"
      @click.stop
    >
      {{ preset.name }}
    </router-link>
  </div>
</template>

<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>