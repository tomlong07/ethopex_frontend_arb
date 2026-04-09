<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const adStatus = computed(() => ({
  pending: props.params?.data?.ad_status?.landing_page_ai?.pending ?? 0,
  success: props.params?.data?.ad_status?.landing_page_ai?.success ?? 0,
}))

// Tổng số
const total = computed(() => adStatus.value.pending + adStatus.value.success)

// Ưu tiên trạng thái
const status = computed(() => {
  if (adStatus.value.success > 0) return 'success'
  return 'pending'
})

// Màu theo trạng thái
const statusColor = computed(() => {
  return (helper.classRender(status.value) as TType) || undefined
})

// Phần hiển thị số (x/total), ưu tiên theo trạng thái
const countLabel = computed(() => {
  switch (status.value) {
    case 'success':
      return `${adStatus.value.success}/${total.value}`

    default:
      return `${adStatus.value.pending}/${total.value}`
  }
})
</script>
<template>
  <div class="flex gap-2 items-center" v-if="total">
    <n-popover trigger="hover" placement="bottom">
      <template #trigger>
        <n-tag :type="statusColor" round size="small">
          <div class="flex items-center gap-2">
            <span class="w-14 capitalize">{{ status }}</span>
            <span>{{ countLabel }}</span>
          </div>
        </n-tag>
      </template>

      <div class="flex flex-col gap-2 text-xs">
        <div class="flex items-center gap-2 text-[#18a058]">
          <span class="w-16">Success</span>
          <span>{{ adStatus.success }}</span>
        </div>

        <div class="flex items-center gap-2 text-[#f0a020]">
          <span class="w-16">Pending</span>
          <span>{{ adStatus.pending }}</span>
        </div>
      </div>
    </n-popover>
  </div>
</template>
