<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const showValue = computed<string>(() => {
  if (Array.isArray(props.params.value)) {
    if (props.params.value.length === 0) {
      return ''
    }

    if (helper.isObject(props.params.value[0])) {
      switch (true) {
        case props.params.value[0].hasOwnProperty('name'):
          return props.params.value.map((item: any) => item.name).join(', ')
      }
    }

    return props.params.value.join(', ')
  }
  if (helper.isObject(props.params.value)) {
    switch (true) {
      case props.params.value.hasOwnProperty('name'):
        return props.params.value.name
    }
  }
  return props.params.value
})
</script>
<style>
.tooltip-trigger {
  display: inline-block;
  max-width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  cursor: pointer;
}

.tooltip-content {
  max-width: 250px; /* Giới hạn chiều rộng */
  background: rgba(0, 0, 0, 0.9); /* Nền tối để dễ đọc */
  color: white;
  padding: 8px;
  border-radius: 4px;
  word-wrap: break-word;
  overflow-wrap: break-word;
  text-align: left;
  z-index: 9999;
}

@media (max-width: 768px) {
  .tooltip-content {
    max-width: 90vw; /* Tự co giãn theo màn hình mobile */
    font-size: 14px;
    white-space: normal;
  }
}

/* tắt đi vì lỗi popover arrow */
/* .n-popover-shared .n-popover-arrow-wrapper {
  left: 50% !important;
} */
</style>

<template>
  <n-tooltip trigger="hover" placement="top-start">
    <template #trigger>
      <span class="capitalize tooltip-trigger">
        {{ showValue }}
      </span>
    </template>
    <div class="tooltip-content">
      {{ showValue }}
    </div>
  </n-tooltip>
</template>
