<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => ({}),
    required: false,
  },
})

const showType = computed<string>(() => {
  const { colDef, data } = props.params
  if (!colDef || !data) {
    return ''
  }
  // Kiểm tra cột và xây dựng giá trị hiển thị tùy theo cột
  let type = ''
  switch (colDef.field) {
    case 'traffic_sources_name':
      type = data.traffic_sources_type
      break
    case 'labels_name':
      type = data.labels_type
      break
    case 'ad_accounts_name':
      type = data.ad_accounts_type
      break
    default:
      return ''
  }

  // Chỉ viết hoa chữ cái đầu tiên
  return type.charAt(0).toUpperCase() + type.slice(1)
})

const { colDef, data } = props.params

const isShowTooltip = colDef?.field === 'ad_accounts_name'

const adAccountValue = data.ad_accounts_name

const showValue = computed<string>(() => {
  const { colDef, data } = props.params
  if (!colDef || !data) {
    return ''
  }
  // Kiểm tra cột và xây dựng giá trị hiển thị tùy theo cột
  switch (colDef.field) {
    case 'traffic_sources_name':
      return `${data.traffic_sources_name}`
    case 'labels_name':
      return `${data.labels_name}`
    case 'ad_accounts_name':
      const res = `${data.ad_accounts_name}`
      if (res.toLowerCase() === 'all') {
        return res
      }
      const arr = helper.stringToArray(res)
      return arr.length.toString()
    default:
      return ''
  }
})
</script>
<template>
  <div class="flex flex-row items-center">
    <!-- Icon cho Include -->
    <div
      v-if="showType === 'Include'"
      class="bg-green-600 rounded-full flex items-center justify-center icon-container"
      title="Include"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="icon w-4 h-4 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
    </div>

    <!-- Icon cho Exclude -->
    <div
      v-if="showType === 'Exclude'"
      class="bg-red-600 rounded-full flex items-center justify-center icon-container"
      title="Exclude"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        stroke="currentColor"
        class="icon w-4 h-4 text-white"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M4 12h16"
        />
      </svg>
    </div>
    <n-popover style="max-width: 500px" trigger="hover" v-if="isShowTooltip">
      <template #trigger>
        <span class="ml-2 text-truncate">{{ showValue }}</span>
      </template>
      <span>{{ adAccountValue }}</span>
    </n-popover>
    <span class="ml-2 text-truncate" v-else>{{ showValue }}</span>
  </div>
</template>

<style scoped>
.icon-container {
  width: 20px; /* Đảm bảo kích thước ổn định cho icon */
  height: 20px;
  min-width: 20px; /* Đặt min-width để tránh bị co lại */
}

.icon {
  width: 16px;
  height: 16px;
}

.text-truncate {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
