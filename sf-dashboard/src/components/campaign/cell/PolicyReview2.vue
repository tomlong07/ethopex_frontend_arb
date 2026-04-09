<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})

const adStatus = computed(() => ({
  pending: props.params?.data?.ad_status?.ai_status?.pending ?? 0,
  rejected: props.params?.data?.ad_status?.ai_status?.rejected ?? 0,
  approved: props.params?.data?.ad_status?.ai_status?.approved ?? 0,
}))

// Tổng số
const total = computed(
  () =>
    adStatus.value.pending + adStatus.value.rejected + adStatus.value.approved
)

// Ưu tiên trạng thái
const status = computed(() => {
  if (adStatus.value.approved > 0) return 'approved'
  if (adStatus.value.rejected > 0) return 'rejected'
  return 'pending'
})

// Màu theo trạng thái
const statusColor = computed(() => {
  return helper.classRender(status.value)
})

// Phần hiển thị số (x/total), ưu tiên theo trạng thái
const countLabel = computed(() => {
  switch (status.value) {
    case 'approved':
      return `${adStatus.value.approved}/${total.value}`
    case 'rejected':
      return `${adStatus.value.rejected}/${total.value}`
    default:
      return `${adStatus.value.pending}/${total.value}`
  }
})
</script>

<template>
  <n-popover trigger="hover" placement="bottom">
    <template #trigger>
      <n-tag :type="statusColor" round size="small" class="n-tag-exclude">
        <div class="flex items-center gap-2">
          <span class="w-14 capitalize">{{ status }}</span>
          <span>{{ countLabel }}</span>
        </div>
      </n-tag>
    </template>

    <div class="flex flex-col gap-2 text-xs">
      <div class="flex items-center gap-2 text-[#18a058]">
        <span class="w-16">Approved</span>
        <span>{{ adStatus.approved }}</span>
      </div>
      <div class="flex items-center gap-2 text-[#d03050]">
        <span class="w-16">Rejected</span>
        <span>{{ adStatus.rejected }}</span>
      </div>
      <div class="flex items-center gap-2 text-[#f0a020]">
        <span class="w-16">Pending</span>
        <span>{{ adStatus.pending }}</span>
      </div>
    </div>
  </n-popover>
</template>
