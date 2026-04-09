<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import NotifyMessage from '@/components/notify_system_detail/Message.vue'
import NotifyUser from '@/components/notify_system_detail/User.vue'
import NotifyRole from '@/components/notify_system_detail/Role.vue'
import NotifyPage from '@/components/notify_system_detail/Page.vue'
import useNotifySystem from '@/store/details/useNotifySystem'
import SkeletonDetailCenter from '@/components/skeleton/SkeletonDetailCenter.vue'
import NotifySystemLevel from '@/components/notify_system_detail/NotifySystemLevel.vue'

const notifySystemStore = useNotifySystem()

onMounted(() => {
  notifySystemStore.resetPayload()
  notifySystemStore.idNotifySystem = Number(window.route?.params?.id || 0)
  notifySystemStore.fetchNotifyById()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center items-start">
      <div class="grid gap-4 grid-cols-1 p-5 w-full max-w-4xl">
        <BackPage
          :url="notifySystemStore.pathNotify"
          :name="notifySystemStore.notifySystem"
          class="mt-3"
        />
        <div v-if="notifySystemStore.isFetchNotifyDetailLoading">
          <SkeletonDetailCenter />
        </div>
        <n-card
          v-else
          class="rounded-[5px] !border-gray2"
          :title="notifySystemStore.titleCard"
        >
          <div class="flex flex-col gap-4">
            <NotifyMessage />

            <NotifyUser :is-floating="true" />

            <NotifyRole :is-floating="true" />

            <NotifyPage :is-floating="true" />

            <NotifySystemLevel :is-floating="true" />

            <NotifySystemStatus />

            <NotifySystemSubmit />
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
