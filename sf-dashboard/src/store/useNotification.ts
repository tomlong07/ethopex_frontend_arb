import { ctr_notification } from '@/services/ctr_notification'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface NotificationType {
  id?: string
  user_id?: number
  title?: string
  message?: string
  type?: string
  category?: string
  priority?: string
  status?: string
  is_read?: boolean
  created_at?: string
  source?: string
  action_url?: string
  is_important?: boolean
}

const STORAGE_KEY = 'notification_fetch_data'
const DEFAULT_INTERVAL = 30000

export const useNotificationStore = defineStore('useNotifications', () => {
  const notifications = ref<NotificationType[]>([])
  const lastUpdated = ref<number | null>(null)

  const lastFetchTime = ref(0)
  const fetchInterval = ref(DEFAULT_INTERVAL)
  const isNewNoti = ref(false)
  let timeoutId: ReturnType<typeof setTimeout> | null = null

  const updateNotifications = (newNotifications: NotificationType[]) => {
    notifications.value = newNotifications
    lastUpdated.value = Date.now()
  }

  const saveFetchDataToLocal = () => {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        lastFetchTime: lastFetchTime.value,
        fetchInterval: fetchInterval.value,
      })
    )
  }

  const loadFetchDataFromLocal = () => {
    const data = localStorage.getItem(STORAGE_KEY)
    if (data) {
      try {
        const parsed = JSON.parse(data)
        if (parsed.lastFetchTime) lastFetchTime.value = parsed.lastFetchTime
        if (parsed.fetchInterval) fetchInterval.value = parsed.fetchInterval
      } catch {
        console.error('faild parse data')
      }
    }
  }

  const fetchNotifications = async () => {
    const result = await ctr_notification.GetNotification()
    const newNotifications = result.data?.notifications || []

    const oldIds = notifications.value.map((n) => n.id)
    const newIds = newNotifications.map((n: any) => n.id)

    // Kiểm tra trùng ID hoàn toàn
    const isSame =
      oldIds.length === newIds.length &&
      oldIds.every((id, idx) => id === newIds[idx])

    // Cập nhật state
    notifications.value = newNotifications
    lastFetchTime.value = Date.now()
    fetchInterval.value = result.data?.time || DEFAULT_INTERVAL

    // Nếu trùng thì false, khác thì true
    isNewNoti.value = !isSame

    saveFetchDataToLocal()
    timeoutId = setTimeout(fetchNotifications, fetchInterval.value)
  }

  const startAutoFetch = () => {
    if (timeoutId) return
    loadFetchDataFromLocal()

    const remainingTime =
      fetchInterval.value - (Date.now() - lastFetchTime.value)

    if (remainingTime <= 0) {
      fetchNotifications()
    } else {
      timeoutId = setTimeout(fetchNotifications, remainingTime)
    }
  }

  const stopAutoFetch = () => {
    if (timeoutId) clearTimeout(timeoutId)
  }

  return {
    notifications,
    fetchNotifications,
    startAutoFetch,
    stopAutoFetch,
    fetchInterval,
    updateNotifications,
    isNewNoti,
  }
})
