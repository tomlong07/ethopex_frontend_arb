import { ctr_logging } from '@/services/ctr_logging'
import { ctr_payload_key } from '@/services/ctr_payload_key'
import { defineStore } from 'pinia'

interface User {
  id: number
  email: string
}
export interface ActivityItem {
  id: number
  data: string
  name: string
  nameMore?: string
  new: string
  old: string
  object: string
  object_id: string
  type: string
  UserInfo: User
  reason: string
  note?: string
  created_at: string
  logic?: string
}

export default defineStore({
  id: 'useActivityStore',
  state: () => ({
    showModal: false,
    isRequest: false,
    isRequestLog: false,
    plk: '',
    isDefaultAllTime: false,
    payload: {
      filter: {
        search: '',
        startDate: '',
        endDate: '',
        user: 'all',
        campaign: 'all',
        objectType: 'all',
      },
      page: 1,
      size: 10,
      sort: [
        {
          field: 'created_at',
          dir: 'desc',
        },
      ],
    },
    activityRawData: [] as ActivityItem[],
  }),
  actions: {
    async fetchFilterByPlk(plk: string) {
      const result = await ctr_payload_key.Key({ params: { q: plk } })
      if (result && result.status) {
        if (result.data?.Filter) {
          result.data.filter = result.data.Filter
        }
        this.payload = result.data
      }
    },
    async getLogHistory(data: any) {
      this.isRequest = true
      const res = await ctr_logging.Filter(data)

      this.isRequest = false
      if (res && res.status) {
        this.plk = res.data.plk
        this.activityRawData = res.data.items as ActivityItem[]
        return true
      }
      return false
    },

    async getLogDataByID(field: any, oldData: any, newData: any) {
      try {
        this.isRequestLog = true
        const payload = {
          object: this.payload.filter.objectType,
          field: field,
          old_data: oldData,
          new_data: newData,
        }
        const res = await ctr_logging.getLogDataByID(payload)
        this.isRequestLog = false

        if (res?.status) {
          const data = res.data
          if (data && data.status) {
            return data.data
          }
          return null
        }
        return null
      } catch (error) {
        console.error(error)
        return null
      }
    },
  },
})
