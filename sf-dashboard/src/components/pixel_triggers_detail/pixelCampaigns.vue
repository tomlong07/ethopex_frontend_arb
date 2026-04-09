<script setup lang="ts">
import TableBind from '@/components/common/TableBind.vue'
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
const usePixelTriggersDetail = PixelTriggersDetail()
const changeSearch = (value: string) => {
  usePixelTriggersDetail.campsByTrigger.search = value.trim()

  if (usePixelTriggersDetail.campsByTrigger.searchTimeout) {
    clearTimeout(usePixelTriggersDetail.campsByTrigger.searchTimeout)
  }
  // Đặt một timeout mới để chạy đoạn mã sau 500 ms
  usePixelTriggersDetail.campsByTrigger.searchTimeout = setTimeout(() => {
    usePixelTriggersDetail.updatePage(1)
  }, 500)
}
const updatePageSize = (pageSize: number) => {
  usePixelTriggersDetail.campsByTrigger.pageSize = pageSize
  usePixelTriggersDetail.updatePage(1)
}
</script>
<template>
  <n-grid
    v-if="usePixelTriggersDetail.isEditPage"
    x-gap="14"
    y-gap="14"
    :cols="1"
  >
    <n-gi>
      <n-card title="Campaigns" class="mb-4 card-rule-condition">
        <template #header-extra>
          <n-input
            size="small"
            placeholder="Search..."
            :loading="usePixelTriggersDetail.campsByTrigger.loading"
            @input="changeSearch"
          ></n-input>
        </template>
        <TableBind
          :tableFullInfo="usePixelTriggersDetail.campsByTrigger"
          @updatePage="usePixelTriggersDetail.updatePage"
          @updatePageSize="updatePageSize"
        />
      </n-card>
    </n-gi>
  </n-grid>
</template>
