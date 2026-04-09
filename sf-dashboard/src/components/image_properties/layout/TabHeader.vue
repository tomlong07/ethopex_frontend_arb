<script setup lang="ts">
import { useImagePropertiesStore } from '@/store/useImageProperties'

// Use store directly
const store = useImagePropertiesStore()

// Computed để lấy data từ store
const tabs = computed(() => store.tabs)
const activeTab = computed(() => store.activeTab)
</script>

<template>
  <div class="flex border-b border-gray-200">
    <button
      v-for="tab in tabs"
      :key="tab.id"
      @click="store.setActiveTab(tab.id)"
      :class="[
        'tab-button px-4 py-2 text-sm font-medium border-b-2 transition-colors',
        activeTab === tab.id
          ? 'active border-blue-500 text-blue-600 bg-blue-50'
          : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300',
      ]"
    >
      {{ tab.label }}
    </button>
  </div>
</template>

<style scoped>
/* Tab button styles */
.tab-button {
  transition: all 0.2s ease;
  cursor: pointer;
}

.tab-button:hover {
  background-color: #f3f4f6;
}

.tab-button.active {
  color: #3b82f6;
  border-color: #3b82f6;
  background-color: #eff6ff;
}
</style>
