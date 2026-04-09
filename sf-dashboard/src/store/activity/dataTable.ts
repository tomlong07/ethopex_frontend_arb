import { defineStore } from 'pinia'
import { ref } from 'vue'
import {
  IActivityItem,
  ILogDataType,
  IPayload,
  ITableDataLog,
} from '@/types/components/activity'
import { DataTableColumns, NTooltip } from 'naive-ui'
import { GridApi } from 'ag-grid-community'
import { checkEmpty } from '@/utils'
import AddNote from '@/assets/icons/AddNote.vue'
import AddIcon from '@/assets/icons/activity/AddIcon.vue'
import CircleIcon from '@/assets/icons/activity/CircleIcon.vue'
import UpdateRuleIconAC from '@/assets/icons/activity/UpdateRuleIconAC.vue'
import UpdateIcon from '@/assets/icons/activity/UpdateIcon.vue'
import SubIcon from '@/assets/icons/activity/SubIcon.vue'
import LoginIcon from '@/assets/icons/activity/LoginIcon.vue'
import { ctr_logging } from '@/services/ctr_logging'
import Robot from '@/assets/icons/Robot.vue'

export const timeFields = [
  'updated_at',
  'created_at',
  'adjust_time',
  'term_scan_time',
  'last_scan_token',
]

export const useDataTableStore = defineStore('useDataTableStore', () => {
  // !! State
  const ADD = 'ADD'
  const UPDATE = 'UPDATE'
  const CHANGE_STATUS = 'CHANGE_STATUS'
  const REMOVE = 'REMOVE'
  const CHANGE_BUDGET = 'CHANGE_BUDGET'
  const CHANGE_BUDGET_TOOLTIP = 'UPDATE RULE'
  const LOGIN = 'LOGIN'
  const NOTE = 'NOTE'
  const CHANGE_BID = 'CHANGE_BID'
  const CHANGE_BID_TOOLTIP = 'CHANGE BID'
  const isValiDefine = [
    ADD,
    UPDATE,
    CHANGE_STATUS,
    REMOVE,
    CHANGE_BUDGET,
    CHANGE_BUDGET_TOOLTIP,
    LOGIN,
    NOTE,
    CHANGE_BID,
  ]
  const botEmails = ['bot', 'worker']
  const bot = ['bot'] // chỉ dùng cho hàm isBlurItem
  const worker = ['worker'] // chỉ dùng cho hàm isWorkerBlurItem

  const textSearchBefore = ref<string>('')
  const isFirstTime = ref<boolean>(true)
  const isDisShowMore = ref<boolean>(false)
  const page = ref<number>(1)
  const pageSize = ref<number>(50)
  const recordsTotal = ref<number>(0)
  const gridApi = ref<GridApi | null>(null)
  const isStyle = ref<boolean>(false)

  const columnLogics = ref<any[]>([])
  const dataLogics = ref<any[]>([])

  const curDataLog = ref<ILogDataType | null>()
  const tableDataLog = ref<ITableDataLog[]>()
  const dataLogList = ref<ILogDataType[]>([])

  const activityRawData = ref<IActivityItem[]>([])

  // !! Func
  const getLogHistory = async (data: any): Promise<boolean> => {
    const res = await ctr_logging.Filter(data)

    if (res?.status) {
      activityRawData.value = res.data.items as unknown as IActivityItem[]
      recordsTotal.value = res.data.recordsTotal || 0
      return true
    }
    return false
  }

  const checkDisShowMore = (newFetchedCount: number) => {
    if (newFetchedCount === 0 || newFetchedCount < pageSize.value) {
      isDisShowMore.value = true
    }
  }

  const getLogDataByID = async (
    object: string,
    field: string,
    oldData: string,
    newData: string
  ): Promise<any | null> => {
    try {
      const res = await ctr_logging.getLogDataByIDV2({
        object: object,
        field,
        old_data: oldData,
        new_data: newData,
      })

      if (res?.status && res.data?.status) {
        return res.data.data
      }
      return null
    } catch {
      return null
    }
  }

  const isBlurItem = (item: any) => {
    for (let index = 0; index < bot.length; index++) {
      if (item.user?.email?.includes(bot[index])) {
        return true
      }
    }
    return false
  }
  const isWorkerBlurItem = (item: any) => {
    for (let index = 0; index < worker.length; index++) {
      if (item.user?.email?.includes(worker[index])) {
        return true
      }
    }
    return false
  }

  const convertDataTableLogic = (item: ILogDataType) => {
    if (item.logic && Array.isArray(item.logic)) {
      let flatConditions: any[] = []

      item.logic.forEach((logic: any) => {
        logic.conditions.forEach((condition: any) => {
          flatConditions.unshift(condition)
        })
      })

      const fieldName = Array.from(
        new Set(flatConditions.flatMap((obj) => Object.keys(obj)))
      )

      if (fieldName && fieldName.length > 0) {
        columnLogics.value = fieldName.map((item) => ({
          title: item,
          key: item,
        }))
      }

      if (flatConditions && flatConditions.length > 0) {
        dataLogics.value = flatConditions
      } else {
        dataLogics.value = []
      }
    }
  }

  const totalTableWidth = computed(() => {
    const paddingAndBorder = 16 + 1

    return columnsV2.value.reduce((sum, column) => {
      const columnWidth = Number(column.width) || 0
      return sum + columnWidth + paddingAndBorder
    }, 0)
  })

  const saveNote = async () => {
    const result = await ctr_logging.UpdateLog(curDataLog.value?.id as any, {
      note: curDataLog.value?.note,
    })

    if (result?.status) {
      window.message.success('Note saved successfully')
    }
  }

  // !! Render
  const columnsV2 = computed<DataTableColumns<ITableDataLog>>(() => {
    if (curDataLog.value?.type === 'note') {
      return [
        {
          title: 'Field',
          key: 'field',
        },

        {
          title: 'Campaign ID',
          key: 'campaign_id',
        },
        {
          title: 'Note',
          key: 'note',
        },
      ]
    }
    return [
      {
        title: 'Field',
        key: 'field',
        width: 120,
      },
      {
        title: '',
        key: 'type',
        width: 80,
        render(row) {
          return h(
            NTooltip,
            { trigger: 'hover' },
            {
              trigger: () => {
                if (row.type == ADD) return h(AddIcon)
                if (row.type == UPDATE || row.type == CHANGE_STATUS)
                  return h(UpdateIcon)
                if (row.type == REMOVE) return h(SubIcon)
                if (row.type == CHANGE_BUDGET) return h(UpdateRuleIconAC)
                if (row.type == LOGIN) return h(LoginIcon)
                if (row.type == NOTE) return h(AddNote)

                return h(CircleIcon)
              },
              default: () => {
                if (row.type == ADD) return ADD
                if (row.type == UPDATE || row.type == CHANGE_STATUS)
                  return UPDATE
                if (row.type == REMOVE) return REMOVE

                return 'Not Change'
              },
            }
          )
        },
      },
      {
        title: 'Previous state',
        key: 'old',
        width: 200,
        render(row) {
          if (timeFields.includes(row.field)) {
            return h(
              NTooltip,
              { placement: 'top' },
              {
                trigger: () => h('span', row.old),
                default: () => row.oldTooltip,
              }
            )
          }

          return row.old
        },
      },
      {
        title: 'Current state',
        key: 'new',
        width: 200,
        render(row) {
          if (timeFields.includes(row.field)) {
            return h(
              NTooltip,
              { placement: 'top' },
              {
                trigger: () => h('span', row.new),
                default: () => row.newTooltip,
              }
            )
          }

          return row.new
        },
      },
    ]
  })

  const typeMapIcon: Record<string, { icon: any; tooltip: string }> = {
    [ADD]: { icon: markRaw(AddIcon), tooltip: ADD },
    [UPDATE]: { icon: markRaw(UpdateIcon), tooltip: UPDATE },
    [CHANGE_STATUS]: { icon: markRaw(UpdateIcon), tooltip: UPDATE },
    [REMOVE]: { icon: markRaw(SubIcon), tooltip: REMOVE },
    [CHANGE_BUDGET]: {
      icon: markRaw(UpdateRuleIconAC),
      tooltip: CHANGE_BUDGET_TOOLTIP,
    },
    [LOGIN]: { icon: markRaw(LoginIcon), tooltip: LOGIN },
    [NOTE]: { icon: markRaw(AddNote), tooltip: NOTE },
    [CHANGE_BID]: { icon: markRaw(Robot), tooltip: CHANGE_BID_TOOLTIP },
  }

  // <!-- ================ Func Handle fetchLogHistory ================ -->
  const prepareLogHistoryPayload = (payload: IPayload): IPayload => {
    const isSearchChanged = payload?.filter?.search !== textSearchBefore.value
    if (isSearchChanged) {
      payload.page = 1
      dataLogList.value = []
      tableDataLog.value = []
    }

    try {
      const { filter } = payload

      if (filter?.search) {
        filter.search =
          filter.search.charAt(0).toUpperCase() + filter.search.slice(1)
        filter.search = filter.search.trim()
      }
    } catch (e) {
      console.error(e)
    }

    return payload
  }

  const handleNoteLogIfMatched = (): boolean => {
    if (!curDataLog.value || curDataLog.value.type !== 'note') return false

    tableDataLog.value = [
      {
        field: 'Note',
        campaign_id: curDataLog.value.campaign_id,
        note: curDataLog.value.note,
      } as any,
    ]
    return true
  }

  const processSpecialFields = async (
    rawTableData: ITableDataLog[],
    objectType: string
  ) => {
    const specialFields = ['adsense_accounts', 'ad_accounts', 'labels']

    for (const field of specialFields) {
      const target = rawTableData.find((x) => x.field === field)
      if (!target) continue

      const oldValue = checkEmpty(target.old)
        ? '[]'
        : JSON.stringify(target.old)
      const newValue = checkEmpty(target.new)
        ? '[]'
        : JSON.stringify(target.new)

      const logData = await getLogDataByID(
        objectType,
        target.field,
        oldValue,
        newValue
      )

      if (logData) {
        const index = rawTableData.indexOf(target)
        rawTableData[index].old = checkEmpty(logData.old_data)
          ? 'N/A'
          : logData.old_data
        rawTableData[index].new = checkEmpty(logData.new_data)
          ? 'N/A'
          : logData.new_data
      }
    }
  }

  return {
    ADD,
    UPDATE,
    CHANGE_STATUS,
    REMOVE,
    CHANGE_BUDGET,
    CHANGE_BUDGET_TOOLTIP,
    LOGIN,
    NOTE,
    isValiDefine,
    botEmails,
    timeFields,
    activityRawData,
    columnLogics,
    dataLogics,
    curDataLog,
    tableDataLog,
    dataLogList,
    columnsV2,
    totalTableWidth,
    typeMapIcon,
    textSearchBefore,
    isFirstTime,
    isDisShowMore,
    page,
    pageSize,
    recordsTotal,
    gridApi,

    getLogHistory,
    checkDisShowMore,
    getLogDataByID,
    isBlurItem,
    isWorkerBlurItem,
    convertDataTableLogic,
    saveNote,
    prepareLogHistoryPayload,

    handleNoteLogIfMatched,
    processSpecialFields,
    isStyle,
  }
})
