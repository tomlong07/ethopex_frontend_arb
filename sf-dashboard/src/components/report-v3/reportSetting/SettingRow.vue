<script setup lang="ts">
defineProps<{
  title: string
  description?: string
  note?: string
}>()
const slots = useSlots()
</script>

<template>
  <div class="row">
    <div class="left">
      <div class="row-title">{{ title }}</div>
      <div v-if="slots.description || description" class="row-desc">
        <slot name="description">
          {{ description }}
        </slot>
      </div>
      <div v-if="note" class="row-note">
        {{ note }}
      </div>
    </div>

    <div class="right">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.row {
  display: flex;
  justify-content: space-between;
  gap: 24px;
  padding: 14px 0;
}

.left {
  flex: 1;
}

.row-title {
  font-weight: 500;
}

.row-desc {
  font-size: 13px;
  color: var(--n-text-color-3);
  margin-top: 4px;
}

.row-note {
  font-size: 12px;
  color: #f97316;
  margin-top: 4px;
}

.right {
  display: flex;
  align-items: center;
}
</style>
