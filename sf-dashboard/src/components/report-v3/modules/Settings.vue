<script setup lang="ts">
import SettingIcon from '@/assets/icons/SettingIcon.vue'
import { useReportV2 } from '@/store/report/report-v2'

const reportStoreV2 = useReportV2(helper.truePath())()

const changeShowModalSettings = async () => {
  reportStoreV2.changeShowModalSettings(true)
}
</script>

<template>
  <n-tooltip trigger="hover">
    <template #trigger>
      <div
        class="flex items-center flex-col cursor-pointer p-2 bg-gray-200 hover:bg-gray-300 rounded-md"
        @click="changeShowModalSettings"
      >
        <n-icon size="18" class="text-gray-500">
          <SettingIcon />
        </n-icon>
      </div>
    </template>
    <div class="flex flex-col">Settings</div>
  </n-tooltip>
</template>
