<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

// Định nghĩa props
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

// For Google Ads
const isEnabled = computed(() => props.params.value === 'ENABLED') // Trạng thái ENABLED cho Google Ads
const isSuspended = computed(() => props.params.value === 'SUSPENDED') // Trạng thái SUSPENDED cho Google Ads

// For TikTok - Các trạng thái Enabled
const tiktokEnabledStatuses = ['STATUS_ENABLE'] // Tài khoản được phê duyệt

// For TikTok - Các trạng thái Suspended
const tiktokSuspendedStatuses = [
  'STATUS_DISABLE', // Tài khoản quảng cáo đã bị đóng
  'STATUS_CONFIRM_FAIL', // Xác minh thất bại
  'STATUS_CONFIRM_FAIL_END', // Hệ thống CRM xác minh thất bại
  'STATUS_CONFIRM_MODIFY_FAIL', // Xác minh chỉnh sửa thất bại
  'STATUS_LIMIT', // Tài khoản quảng cáo bị xử phạt
]

// For TikTok - Các trạng thái Pending
const tiktokPendingStatuses = [
  'STATUS_PENDING_CONFIRM', // Đang chờ xem xét
  'STATUS_PENDING_VERIFIED', // Đang chờ xác minh
  'STATUS_PENDING_CONFIRM_MODIFY', // Đang chờ xem xét chỉnh sửa
  'STATUS_WAIT_FOR_BPM_AUDIT', // Đang chờ hệ thống CRM xem xét
  'STATUS_WAIT_FOR_PUBLIC_AUTH', // Đang chờ xác minh tài khoản ngân hàng công ty
  'STATUS_SELF_SERVICE_UNAUDITED', // Đang chờ xác minh tài khoản tự phục vụ
  'STATUS_CONTRACT_PENDING', // Hợp đồng chưa có hiệu lực
]

// Xác định loại trạng thái
const tagType = computed(() => {
  const valueNow = props.params.value.toLowerCase()
  switch (valueNow) {
    case 'active':
      return 'success'
    case 'disabled':
      return 'error'
    case 'unsettled':
      return 'info'
  }

  if (isEnabled.value || tiktokEnabledStatuses.includes(props.params.value)) {
    return 'success' // Màu xanh (Enabled)
  }
  if (
    isSuspended.value ||
    tiktokSuspendedStatuses.includes(props.params.value)
  ) {
    return 'error' // Màu đỏ (Suspended)
  }
  if (tiktokPendingStatuses.includes(props.params.value)) {
    return 'warning' // Màu vàng (Pending)
  }
  return 'default' // Trạng thái không xác định
})
</script>

<template>
  <div class="flex h-full items-center cell-status">
    <!-- Hiển thị props.params.value trực tiếp -->
    <n-tag
      :type="tagType"
      class="n-tag-exclude"
      ghost
      v-if="props.params.value"
    >
      {{ props.params.value }}
    </n-tag>
  </div>
</template>
