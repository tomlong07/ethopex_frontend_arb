<script setup lang="ts">
import ColumnDisplay from '@/components/report-v3/modules/ColumnDisplay.vue'

const ReportColRight = defineAsyncComponent(
  () => import('@/components/report-v3/ReportColRight.vue')
)
</script>
<template>
  <div class="flex p-2 mx-2 report-child-wrapper items-center">
    <div class="flex flex-row flex-1 justify-between">
      <ColumnDisplay />
    </div>

    <ReportColRight />
  </div>
</template>
<style scoped lang="scss">
.blink {
  position: relative;
  width: fit-content;
}
.blink:after {
  content: '';
  position: absolute;
  top: 50%;
  right: 0;
  transform: translate(50%, -50%);
  width: 8.39px;
  height: 8.39px;
  border-radius: 50%;
  background-color: #49a849;
  animation: flash 1s infinite;
}
</style>

<style lang="scss">
.column-wrapper-checkbox {
  .n-checkbox__label {
    max-width: calc(144px - 14px); /* Giới hạn chiều rộng */
    white-space: nowrap; /* Không xuống dòng */
    overflow: hidden; /* Ẩn phần nội dung bị tràn */
    text-overflow: ellipsis; /* Hiển thị dấu '...' khi bị tràn */
  }
}
</style>
