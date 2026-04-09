<template>
  <div class="app-card">
    <div
      v-if="hasAdBlock && adBlockLength > 0"
      class="button-container"
      v-for="(ad, index) in adBlockData"
      :key="index"
    >
      <p>
        {{ capitalize(ad.adMode || '') }}{{ ad.adType ? ',' : '' }}
        {{ capitalize(ad.adType || '') }}
      </p>
    </div>
    <div v-else class="bg-red-600 text-white p-2">
      NO AD BLOCKS FOUND!<br />
      Debug: hasAdBlock={{ hasAdBlock }}, length={{ adBlockLength }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Ad_Block } from '@/types/components/landing'

const props = defineProps<{
  adBlocks?: Ad_Block[]
}>()

const adBlockData = computed(() => {
  return props.adBlocks ? [...props.adBlocks] : []
})

const adBlockLength = computed(() => {
  return adBlockData.value.length
})

const hasAdBlock = computed(() => {
  return props.adBlocks && Array.isArray(props.adBlocks)
})

const capitalize = (str: string): string => {
  if (!str) return ''
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}
</script>

<style scoped>
.app-card {
  background: #fff;
  padding: 5px;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.button-container button {
  width: 60%;
  max-width: 400px;
}

.simple-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 5px;
  padding: 9px 28px;
  border: none;
  font-size: 15px;
  font-weight: 600;
  transition: all 0.2s ease;
  min-width: 280px;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* Responsive */
@media (max-width: 480px) {
  .simple-btn {
    min-width: 100%;
    padding: 16px 20px;
    font-size: 14px;
  }
}
</style>
