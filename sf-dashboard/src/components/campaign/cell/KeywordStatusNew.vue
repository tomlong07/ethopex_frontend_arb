<script setup lang="ts">
import { TType } from '@/enum/naiveui'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
  },
})

const adStatus = computed(() => ({
  pending: props.params?.data?.ad_status?.status_link?.pending ?? 0,
  error: props.params?.data?.ad_status?.status_link?.error ?? 0,
  success: props.params?.data?.ad_status?.status_link?.success ?? 0,
}))

// Tổng số
const total = computed(
  () => adStatus.value.pending + adStatus.value.error + adStatus.value.success
)

// Ưu tiên trạng thái
const status = computed(() => {
  if (adStatus.value.success > 0) return 'success'
  if (adStatus.value.error > 0) return 'error'
  return 'pending'
})

// Màu theo trạng thái
const statusColor = computed(() => {
  return (helper.classRender(status.value) as TType) || null
})

// Phần hiển thị số (x/total), ưu tiên theo trạng thái
const countLabel = computed(() => {
  switch (status.value) {
    case 'success':
      return `${adStatus.value.success}/${total.value}`
    case 'error':
      return `${adStatus.value.error}/${total.value}`
    default:
      return `${adStatus.value.pending}/${total.value}`
  }
})

let errorMessage = props.params.data.error

if (!errorMessage.includes('Status Link -')) errorMessage = ''
</script>

<template>
  <div class="flex gap-2 items-center">
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
          <span class="w-16">Success</span>
          <span>{{ adStatus.success }}</span>
        </div>
        <div class="flex items-center gap-2 text-[#d03050]">
          <span class="w-16">Error</span>
          <span>{{ adStatus.error }}</span>
        </div>
        <div class="flex items-center gap-2 text-[#f0a020]">
          <span class="w-16">Pending</span>
          <span>{{ adStatus.pending }}</span>
        </div>

        <template v-if="errorMessage">
          <n-divider class="!m-0" />

          <div class="flex items-center gap-2 text-[#d03050]">
            <span class="w-16">Info</span>
            <span class="max-w-[200px] break-words">
              {{ errorMessage }}
            </span>
          </div></template
        >
      </div>
    </n-popover>
  </div>
</template>
