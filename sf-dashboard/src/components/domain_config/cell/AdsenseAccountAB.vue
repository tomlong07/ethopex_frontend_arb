<script setup lang="ts">
import type { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
  },
})

const parseData = (val: unknown) => {
  if (!val) return []
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val)
      return Array.isArray(parsed) ? parsed : [parsed]
    } catch {
      return []
    }
  }
  return Array.isArray(val) ? val : [val]
}

const formatLabel = (key: string) => {
  return key
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}

const formatValue = (val: unknown) => {
  if (val == null) return String(val)
  if (typeof val === 'boolean') return String(val)
  if (typeof val === 'object') return JSON.stringify(val, null, 2)
  return String(val)
}

const getStatusType = (status: string) => {
  switch (status.toLowerCase()) {
    case 'on':
      return 'success'
    case 'off':
      return 'default'
    default:
      return 'info'
  }
}

const items = computed(() => parseData(props.params?.data?.adsense_ab))
const count = computed(() => items.value.length)
</script>

<template>
  <n-popover trigger="hover" placement="top-end" v-if="count >= 1">
    <template #trigger>
      <n-tag
        v-if="count"
        size="small"
        type="success"
        round
        class="n-tag-exclude"
      >
        {{ count }} item{{ count > 1 ? 's' : '' }}
      </n-tag>
    </template>

    <div class="max-w-[450px] p-2 overflow-auto [scrollbar-width:thin]">
      <n-empty v-if="!count" description="Không có dữ liệu" size="small" />

      <div class="max-h-96 space-y-3">
        <div v-for="(item, idx) in items" :key="idx" class="border rounded p-3">
          <div class="space-y-2">
            <div v-for="(value, key) in item" :key="key" class="flex">
              <div class="text-gray-500 text-xs font-medium min-w-[100px]">
                {{ formatLabel(String(key)) }}
              </div>
              <div class="text-sm flex-1 pl-2">
                <template v-if="String(key).toLowerCase() === 'status'">
                  <n-tag
                    size="small"
                    :type="getStatusType(String(value))"
                    round
                  >
                    {{ formatValue(value).toUpperCase() }}
                  </n-tag>
                </template>
                <n-code
                  v-else-if="typeof value === 'object'"
                  :code="formatValue(value)"
                  language="json"
                  word-wrap
                />
                <span v-else>{{ formatValue(value) }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </n-popover>
</template>
