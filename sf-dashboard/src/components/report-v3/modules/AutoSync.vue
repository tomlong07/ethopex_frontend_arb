<script setup lang="ts">
import AutoFixNormalSharp from '@/assets/icons/AutoFixNormalSharp.vue'
import AutoFixOffSharp from '@/assets/icons/AutoFixOffSharp.vue'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const changeStatusAuto = () => {
  reportStoreV2.toggleAutoSync()
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex items-center flex-col cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        @click="changeStatusAuto"
      >
        <n-icon
          size="18"
          class="text-gray-500"
          :color="reportStoreV2.autoSync ? '#1E90FF' : undefined"
        >
          <AutoFixNormalSharp v-if="reportStoreV2.autoSync" />
          <AutoFixOffSharp v-else />
        </n-icon>
      </div>
    </template>
    <div class="flex flex-col">
      <div class="flex">
        {{ 'Turn ' + (reportStoreV2.autoSync ? 'off' : 'on') + ' auto sync' }}
      </div>
    </div>
  </n-tooltip>
</template>
