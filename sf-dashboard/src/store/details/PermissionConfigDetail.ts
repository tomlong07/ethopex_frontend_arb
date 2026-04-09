import { defineStore } from 'pinia'
import { SelectOption } from 'naive-ui'
import { permissionType } from '@/types/components/permission'
export interface KeyValue {
  key: string
  value: string
}
export default defineStore('usePermissionConfigDetail', () => {
  // Dữ liệu mặc định cho permission
  const dataPermission = (): permissionType =>
    ({
      id: 0,
      name: '',
      description: '',
      traffic_source: [],
      demand_source: [],
      account_traffic: [],
      account_demand: [],
      role_inheritance: [],
      permission: {},
    } as any)

  // Trạng thái chính của store
  const permission = ref<permissionType>(dataPermission())
  const permissionInfo = ref<Record<string, KeyValue[]>>({})
  const permissionStatus = ref<Record<string, Record<string, boolean>>>({})
  const permissionName = ref<Record<string, string>>({})

  // Options cho Select
  const demandAccountOptions = shallowRef<SelectOption[]>([])
  const trafficOptions = shallowRef<SelectOption[]>([])
  const demandOptions = shallowRef<SelectOption[]>([])
  const roleInheritanceOptions = shallowRef<SelectOption[]>([])
  const trafficAccountOptions = shallowRef<SelectOption[]>([])

  const itemSelected = ref<KeyValue[]>([])
  const filterType = ref('all')

  const filterPermissionInfo = computed(() => {
    const info = permissionInfo.value
    const status = permissionStatus.value

    return Object.fromEntries(
      Object.entries(info)
        .map(([groupKey, items]) => {
          const filteredItems = items.filter((item: any) => {
            const checked = status[groupKey]?.[item.key]

            if (filterType.value === 'selected') return checked === true
            if (filterType.value === 'unselected') return checked === false

            return true
          })

          return [groupKey, filteredItems]
        })
        .filter(([_, items]) => {
          return (items as any[]).length > 0
        })
    )
  })

  // Hàm reset dữ liệu permission
  const clearData = () => {
    permission.value = dataPermission()
  }

  return {
    // State
    permission,
    permissionInfo,
    permissionStatus,
    permissionName,
    demandAccountOptions,
    trafficOptions,
    demandOptions,
    roleInheritanceOptions,
    trafficAccountOptions,
    itemSelected,
    filterPermissionInfo,
    filterType,
    // Actions
    clearData,
  }
})
