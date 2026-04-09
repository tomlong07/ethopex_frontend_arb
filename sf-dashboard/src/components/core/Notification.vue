<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import Ring from '@/assets/icons/Ring.vue'
import { NotificationType, useNotificationStore } from '@/store/useNotification'
import helper from '@/utils/helper'
import { ref, onMounted, onBeforeUnmount } from 'vue'
const notificationStore = useNotificationStore()

const isOpen = ref(false)

const toggleDropdown = async () => {
  isOpen.value = !isOpen.value
  if (isOpen.value) {
    await notificationStore.fetchNotifications()
    notificationStore.isNewNoti = false
  }
}

const isNewNoti = computed(() => notificationStore.isNewNoti || false)

const handleItemClick = (item: NotificationType) => {
  if (item.action_url) {
    window.open(item.action_url, '_blank')
  }
  notificationStore.isNewNoti = false
  closeDropdown()
}

const closeDropdown = () => {
  isOpen.value = false
}

const handleClickOutside = (event: MouseEvent) => {
  const dropdownEl = event.target as HTMLElement
  if (!dropdownEl.closest('.relative.inline-block')) {
    closeDropdown()
  }
}

onMounted(async () => {
  notificationStore.startAutoFetch()

  document.addEventListener('click', handleClickOutside)
})

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  notificationStore.stopAutoFetch()
})
</script>
<template>
  <div class="relative inline-block">
    <!-- Trigger button -->
    <div class="cursor-pointer" @click="toggleDropdown">
      <n-badge dot :show="isNewNoti">
        <n-icon
          :component="Ring"
          size="22"
          :class="{ 'bell-shake': isNewNoti }"
        />
      </n-badge>
    </div>

    <div
      v-if="isOpen"
      class="absolute right-0 top-8 w-96 bg-white rounded-md shadow-lg border border-gray-200 z-50 custom-notification"
    >
      <div class="flex justify-between items-center px-4 py-2 border-b-2">
        <div class="font-semibold text-sm text-slate-800">Notification</div>
        <div>
          <n-icon
            :component="Close"
            size="20"
            class="cursor-pointer"
            @click="toggleDropdown"
          />
        </div>
      </div>

      <div
        v-if="
          notificationStore.notifications &&
          notificationStore.notifications?.length > 0
        "
        class="content max-h-[400px] overflow-y-auto custom-dark-mode-noty"
        style="scrollbar-width: thin"
      >
        <div
          v-for="(item, index) in notificationStore.notifications"
          :key="index"
          class="block pr-4 pl-2 py-4 text-sm text-gray-700 hover:bg-gray-100 cursor-pointer border-b"
          @click.stop="handleItemClick(item)"
        >
          <div class="flex gap-1">
            <div class="flex-none w-[25px]">
              <n-icon
                v-if="item.is_important"
                :component="ReportGmailerrorredFilled"
                size="22"
                color="#2d5cc8"
              />
            </div>
            <div>
              <div
                class="line-clamp-2 overflow-hidden font-medium text-md text-ellipsis text-slate-800"
                v-if="item.title"
              >
                {{ item.title }}
              </div>
              <div
                class="line-clamp-2 overflow-hidden text-xs text-ellipsis text-gray-500 mt-2"
                v-if="item.message"
              >
                {{ item.message }}
              </div>
              <div class="text-end font-semibold text-xs text-gray-500 mt-3">
                {{ helper.convertTimeV3(item.created_at) }}
              </div>
            </div>
          </div>
        </div>
      </div>
      <div class="py-4" v-else>
        <n-empty description="There are no notifications!"> </n-empty>
      </div>
    </div>
  </div>
</template>

<style>
@keyframes bell-shake {
  0% {
    transform: rotate(0deg);
  }
  15% {
    transform: rotate(15deg);
  }
  30% {
    transform: rotate(-15deg);
  }
  45% {
    transform: rotate(10deg);
  }
  60% {
    transform: rotate(-10deg);
  }
  75% {
    transform: rotate(5deg);
  }
  100% {
    transform: rotate(0deg);
  }
}

.bell-shake {
  animation: bell-shake 1.5s ease-in-out infinite;
  transform-origin: top center;
}
</style>
