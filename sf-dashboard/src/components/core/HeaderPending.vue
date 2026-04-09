<script setup lang="ts">
import HourglassOutline from '@/assets/icons/HourglassOutline.vue'
import useHeaderStore from '@/store/useHeaderStore'

const headerStore = useHeaderStore()
</script>

<template>
  <n-tag round :bordered="false" class="font-semibold bg-indigo-100 text-xs">
    Pending: ${{ headerStore.amountUserInfo.pendingShow() }}
    <template #icon>
      <n-icon :component="HourglassOutline" size="15" />
    </template>
  </n-tag>
</template>
