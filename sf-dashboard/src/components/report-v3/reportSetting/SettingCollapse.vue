<script setup lang="ts">
export type ValueToggle =
  | 'general'
  | 'view-chart'
  | 'data-sorting'
  | 'campaign'
  | 'table-action'

const props = defineProps<{
  title: string
  subtitle?: string
  value: ValueToggle
  activeKey: ValueToggle[]
}>()

const emit = defineEmits<{
  (e: 'update:activeKey', value: string[]): void
}>()

const isOpen = computed(() => props.activeKey.includes(props.value))

function toggle() {
  if (isOpen.value) {
    emit(
      'update:activeKey',
      props.activeKey.filter((k) => k !== props.value)
    )
  } else {
    emit('update:activeKey', [...props.activeKey, props.value])
  }
}
</script>

<template>
  <div class="setting-collapse shadow-md">
    <!-- Header -->
    <div
      class="bg-gray-50 header border border-gray-100 rounded-tr-md rounded-tl-md"
      @click="toggle"
    >
      <div class="header-left">
        <slot name="icon" />
        <div>
          <div class="title">{{ title }}</div>
          <div v-if="subtitle" class="subtitle">
            {{ subtitle }}
          </div>
        </div>
      </div>

      <div class="arrow" :class="{ open: isOpen }">
        <svg width="16" height="16" viewBox="0 0 24 24">
          <path
            d="M7 10l5 5 5-5"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </div>
    </div>

    <!-- Body -->
    <div
      class="body"
      :style="{
        maxHeight: isOpen ? '1000px' : '0',
        opacity: isOpen ? 1 : 0,
      }"
    >
      <div class="content divide-y">
        <slot />
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-collapse {
  border: 1px solid var(--tw-border-opacity);
  border-radius: 10px;
}

/* Header */
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 20px;
  cursor: pointer;
  user-select: none;
}

.header-left {
  display: flex;
  gap: 12px;
  align-items: center;
}

.title {
  font-weight: 600;
  font-size: 15px;
}

.subtitle {
  font-size: 13px;
  color: var(--n-text-color-3);
}

/* Arrow */
.arrow {
  transition: transform 0.25s ease;
  display: flex;
  align-items: center;
}

.arrow.open {
  transform: rotate(180deg);
}

/* Body animation */
.body {
  overflow: hidden;
  transition: max-height 0.3s ease-in-out, opacity 0.3s ease;
}

.content {
  padding: 0 20px 16px;
}
</style>
