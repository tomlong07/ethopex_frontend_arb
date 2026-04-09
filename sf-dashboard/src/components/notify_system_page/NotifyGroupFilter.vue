<script setup lang="ts">
import { onMounted } from 'vue'

import RotateRightSolid from '@/assets/icons/RotateRightSolid.vue'
import NotifyDetailPage from '@/components/notify_system_detail/Page.vue'
import NotifyDetailUser from '@/components/notify_system_detail/User.vue'
import NotifyDetailRole from '@/components/notify_system_detail/Role.vue'
import useNotifySystem from '@/store/details/useNotifySystem'
const notifySystemStore = useNotifySystem()

onMounted(async () => {
  notifySystemStore.resetPayload()
})
</script>

<template>
  <div
    class="flex flex-wrap px-4 py-2 gap-2 report-child-wrapper border-t border-gray-200"
  >
    <div class="flex items-center flex-row flex-wrap gap-2">
      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs font-bold h-6 text-gray-500">Page</div>
        <NotifyDetailPage />
      </div>
      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs font-bold h-6 text-gray-500">User</div>
        <NotifyDetailUser />
      </div>
      <div class="flex flex-col gap-1 w-40">
        <div class="text-xs font-bold h-6 text-gray-500">Role</div>
        <NotifyDetailRole />
      </div>
    </div>

    <div class="flex items-center gap-2 ml-auto">
      <n-button
        size="small"
        color="#f43f5e"
        :loading="notifySystemStore.isFilterLoading"
        @click="notifySystemStore.handleFilter"
      >
        <template #icon>
          <n-icon size="16">
            <RotateRightSolid />
          </n-icon>
        </template>
        Update
      </n-button>
    </div>
  </div>
</template>
