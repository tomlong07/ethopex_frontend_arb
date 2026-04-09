import { defineStore } from 'pinia'
import { AmountUser } from '@/types/state/ctr_funds'
import { AmountUserTestBudget } from '@/types/state/ctr_test_budget'
import {
  NotificationReactive,
  NotificationApiInjection,
} from 'naive-ui/es/notification/src/NotificationProvider'
import { NButton } from 'naive-ui'
import { ctr_funds } from '@/services/ctr_funds'
import { ctr_test_budget } from '@/services/ctr_test_budget'

export default defineStore('useHeader', () => {
  const DEFAULT_TIME_TEST_BUDGET = 30000 //30s

  const amountUserInfo = ref(new AmountUser({}))
  const amountUserTestBudget = ref(new AmountUserTestBudget({}))
  const notificationVersion = ref<NotificationReactive | null>(null)

  const lastDismissTime = ref(0)
  const DISMISS_COOLDOWN = 5 * 60 * 1000

  const fetchAmountUser = async () => {
    const res = await ctr_funds.AmountOfUser()

    amountUserInfo.value = new AmountUser(res?.data || {})
  }

  const fetchVersion = async (
    notification: NotificationApiInjection,
    init: boolean = false
  ) => {
    try {
      const resp = await fetch('/version.json' + '?v=' + Date.now())
      const versionObj = await resp.json()
      const versionNow = String(versionObj.version)
      const initVersion = localStorage.getItem('version')

      if (init) {
        localStorage.setItem('version', versionNow)
        return
      }

      if (!initVersion || versionNow !== initVersion) {
        if (notificationVersion.value) {
          return
        }

        const now = Date.now()
        if (
          lastDismissTime.value &&
          now - lastDismissTime.value < DISMISS_COOLDOWN
        ) {
          return
        }

        notificationVersion.value = notification.create({
          title: 'WARNING!',
          content: 'Have new version of system. Please reload to improve this!',
          closable: true,
          meta: new Date().toLocaleString(),
          onClose: () => {
            lastDismissTime.value = Date.now()
            notificationVersion.value = null
          },
          action: () =>
            h(
              NButton,
              {
                text: true,
                type: 'info',
                class: 'text-lg',
                onClick: () => {
                  notificationVersion.value?.destroy()
                  notificationVersion.value = null
                  window.location.reload()
                },
              },
              {
                default: () => 'RELOAD',
              }
            ),
        })
      }
    } catch {
      // console.error(error)
    }
  }

  const fetchBudgetRemaining = async (user_id: any) => {
    try {
      const res = await ctr_test_budget.AmountOfUser(user_id)

      //nếu có lỗi thì thực hiện gọi lại theo thời gian default cho nhanh hơn
      if (!res || !res.status || !res.data) {
        await helper.sleep(DEFAULT_TIME_TEST_BUDGET)
        fetchBudgetRemaining(user_id)
        return
      }

      amountUserTestBudget.value = new AmountUserTestBudget(res?.data || {})
      //Gọi lại sau thời gian api trả về. ví dụ 90s -> 90x1000 ms
      await helper.sleep(
        amountUserTestBudget.value.time
          ? amountUserTestBudget.value.time * 1000
          : DEFAULT_TIME_TEST_BUDGET
      )
      fetchBudgetRemaining(user_id)
    } catch (error) {
      console.error(error)

      //nếu có lỗi thì thực hiện gọi lại theo thời gian default cho nhanh hơn
      await helper.sleep(DEFAULT_TIME_TEST_BUDGET)
      fetchBudgetRemaining(user_id)
    }
  }
  return {
    amountUserInfo,
    amountUserTestBudget,
    notificationVersion,
    lastDismissTime,
    fetchAmountUser,
    fetchVersion,
    fetchBudgetRemaining,
  }
})
