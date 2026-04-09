<script setup lang="ts">
import SkeletonElement from '@/components/skeleton/SkeletonElement.vue'
const isMobile = helper.mobileDetect()
</script>
<template>
  <n-grid x-gap="14" y-gap="14" :cols="isMobile ? 1 : 2">
    <n-gi class="flex flex-col gap-4">
      <n-card class="card-flex-gap-4">
        <div>
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <SkeletonElement />

        <SkeletonElement classList="w-1/3" />
        <SkeletonElement /><SkeletonElement /><SkeletonElement />
      </n-card>

      <n-card class="card-flex-gap-4">
        <div>
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <SkeletonElement />
        <SkeletonElement classList="w-1/3" />

        <SkeletonElement /><SkeletonElement /><SkeletonElement />
      </n-card>

      <n-card class="card-flex-gap-4">
        <div>
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <SkeletonElement />
        <SkeletonElement classList="w-1/3" />

        <SkeletonElement /><SkeletonElement /><SkeletonElement />
      </n-card>
    </n-gi>
    <n-gi>
      <n-card class="card-flex-gap-4">
        <div>
          <n-skeleton :width="120" :sharp="false" size="medium" />
        </div>
        <SkeletonElement />
        <SkeletonElement classList="w-1/3" />

        <SkeletonElement />
      </n-card>
    </n-gi>
  </n-grid>
</template>
