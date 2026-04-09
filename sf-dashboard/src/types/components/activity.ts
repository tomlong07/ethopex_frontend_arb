import { atomizeChangeset, diff } from 'json-diff-ts'
import { utcToZonedTime } from 'date-fns-tz'
import { format } from 'date-fns'
import { checkEmpty, parseJson, processDataShow, typeOfObject } from '@/utils'

export interface IUser {
  id: number
  email: string
}
export interface IActivityItem {
  id: number
  data: string
  name: string
  nameMore?: string
  new: string
  old: string
  object: string
  object_id: string
  type: string
  UserInfo: IUser
  reason: string
  note?: string
  created_at: string
  logic?: string
}

export interface IPayload {
  filter: Record<string, string | null>
  page: number
  size: number
  sort: { field: string; dir: string }[]
}

export interface ISettingsNow {
  language: string
  mode: string
}

export interface ILogDataType {
  id: number
  title: string
  type: string
  object: string
  old: string
  new: string
  user: IUser
  time: string
  timeTooltip: string
  reason: string
  note?: string
  campaign_id?: string
  logic?: string
  isNoChange?: boolean
  finalShow?: any
  metrics?: any[]
  raw?: any
  rule_id?: any
  description?: string
}

export interface ITableDataLog {
  object: string
  field: string
  type: string
  old: string
  new: string
  oldTooltip?: string
  newTooltip?: string
}

export interface TypeFilterActivity {
  outerId: string
  id?: string
  campaign?: string
  metrics?: Array<Record<string, any>>
  raw?: any
  logic?: any
  rule_id?: any
  description?: string
}

export const timeFields = [
  'updated_at',
  'created_at',
  'adjust_time',
  'term_scan_time',
  'last_scan_token',
]

const botEmails = ['bot', 'worker']

// Class xử lý và chuẩn hóa dữ liệu Activity Log
// Tập trung toàn bộ logic transform từ raw data → UI display data
export class HandleDataLogActivity {
  ToJson<T>(value: unknown): T | null {
    if (!value) return null
    return typeof value === 'string' ? JSON.parse(value.trim()) : (value as T)
  }

  FirstString(
    source: Record<string, unknown>,
    keys: string[]
  ): string | undefined {
    for (const key of keys) {
      const value = source[key]
      const trimmed = value != null ? String(value).trim() : ''
      if (trimmed) return trimmed
    }
    return undefined
  }

  // Helper dữ liệu metrics thành mảng object
  NormalizeMetrics(candidate: unknown): any[] | null {
    const parsed = this.ToJson(candidate)
    if (!parsed) return null
    if (Array.isArray(parsed)) return parsed.length ? parsed : null
    return typeof parsed === 'object' ? [parsed] : null
  }

  // DataNewVersion, Data
  ResolveMetrics(
    parsed: Record<string, unknown>
  ): Array<Record<string, any>> | null {
    return (
      this.NormalizeMetrics(parsed['DataNewVersion']) ??
      this.NormalizeMetrics(parsed['Data'])
    )
  }

  Build(item: {
    id?: unknown
    data?: unknown
    logic?: unknown
    rule_id?: unknown
    description?: unknown
  }): TypeFilterActivity | null {
    const parsed = this.ToJson<Record<string, any>>(
      item.data ?? item.logic ?? '{}'
    )

    if (!parsed) return null

    const metrics = this.ResolveMetrics(parsed)
    const logic = item.logic ? this.ToJson(item.logic) : null
    // lấy từ data hoặc logic

    return {
      outerId: String(item.id),
      rule_id: parsed?.rule_id,
      description: parsed?.description,
      id: this.FirstString(parsed, ['ID', 'Id', 'id']),
      campaign: this.FirstString(parsed, [
        'CampaignID',
        'CampaignId',
        'campaign_id',
        'campaignId',
      ]),
      raw: parsed,
      ...(metrics ? { metrics } : {}),
      ...(logic ? { logic } : {}),
    }
  }

  // Gom dữ liệu đã chuẩn hóa vào Map để tra cứu nhanh theo outerId
  CreateExtrasMap(type: TypeFilterActivity[]): Map<string, TypeFilterActivity> {
    const extras = new Map<string, TypeFilterActivity>()
    type.forEach((item) => extras.set(item.outerId, item))
    return extras
  }

  // Gắn thêm thông tin phụ (metrics, raw, rule_id, description) vào log
  // Chỉ gắn metrics/raw cho object type = 'rule_satisfy'
  AttachExtras(
    log: ILogDataType,
    extras: Map<string, TypeFilterActivity>
  ): ILogDataType {
    const matched = extras.get(String(log.id))
    if (!matched) return log

    // Luôn gắn rule_id nếu có
    const result: ILogDataType = {
      ...log,
      ...(matched.rule_id !== undefined ? { rule_id: matched.rule_id } : {}),
      ...(matched.description !== undefined
        ? { description: matched.description }
        : {}),
    }

    // Chỉ gắn metrics/raw cho rule_satisfy
    if (log.object === 'rule_satisfy') {
      return {
        ...result,
        metrics: matched.metrics,
        raw: matched.raw,
      }
    }

    return result
  }

  // Xử lý toàn bộ danh sách log từ raw data
  // Parse → Filter → Transform → Attach Extras → Build FinalShow
  async ProcessAllLogs(
    rows: IActivityItem[],
    options: {
      modalSettingStore: any
      dataTableStore: any
      objectType: string
    }
  ): Promise<ILogDataType[]> {
    const { modalSettingStore, dataTableStore, objectType } = options

    // Bước 1: Build extras map để tra cứu nhanh
    const extrasMap = this.CreateExtrasMap(
      (rows || [])
        .map((item) => this.Build(item))
        .filter((item): item is TypeFilterActivity => Boolean(item))
    )

    // Bước 2: Xử lý từng row
    const processedLogs: ILogDataType[] = []

    for (const row of rows || []) {
      // Lọc các log từ bot/worker nếu đang ở mode Important
      if (this.ShouldFilterRow(row, modalSettingStore)) continue

      const logEntry = await this.ProcessSingleRow(
        row,
        modalSettingStore,
        dataTableStore,
        objectType,
        extrasMap
      )

      if (logEntry) processedLogs.push(logEntry)
    }

    // Lọc cuối: chỉ giữ log có nội dung hiển thị
    return processedLogs.filter(
      (el) => el?.type === 'note' || (el?.finalShow?.length ?? 0) > 0 || el.logic
    )
  }

  // Check xem có nên lọc row này không
  ShouldFilterRow(row: IActivityItem, modalSettingStore: any): boolean {
    const emailNow = row.UserInfo?.email?.toLowerCase() || ''
    return (
      modalSettingStore.isModeImportant &&
      !emailNow.includes('rule') &&
      botEmails.some((bot) => emailNow.includes(bot))
    )
  }

  // Xử lý một row thành log entry hoàn chỉnh
  async ProcessSingleRow(
    row: IActivityItem,
    modalSettingStore: any,
    dataTableStore: any,
    objectType: string,
    extrasMap: Map<string, TypeFilterActivity>
  ): Promise<ILogDataType | null> {
    const rowType = !checkEmpty(row.type) ? row.type : ''
    const oldVal = !checkEmpty(row.old) ? parseJson(row.old) : {}
    const newVal = !checkEmpty(row.new) ? parseJson(row.new) : {}
    const dataChange = diff(oldVal, newVal)
    const { utcTime, vnTime } = this.GetRowTimes(row.created_at)

    // Tạo log entry cơ bản
    let logEntry = this.CreateLogEntry(
      row,
      rowType,
      dataChange,
      oldVal,
      newVal,
      utcTime,
      vnTime,
      modalSettingStore
    )
    if (!logEntry) return null

    // Gắn thông tin phụ
    logEntry = this.AttachExtras(logEntry, extrasMap)

    // Build finalShow cho non-note logs
    if (logEntry.type !== 'note') {
      await this.BuildAndAttachFinalShow(
        logEntry,
        oldVal,
        newVal,
        modalSettingStore,
        dataTableStore,
        objectType
      )
    }

    return logEntry
  }

  // Tạo log entry cơ bản từ row data
  CreateLogEntry(
    row: IActivityItem,
    rowType: string,
    dataChange: any[],
    oldVal: any,
    newVal: any,
    utcTime: string,
    vnTime: string,
    modalSettingStore: any
  ): ILogDataType | null {
    // Xử lý theo loại log
    if (dataChange.length > 0 || rowType === 'note') {
      const name =
        rowType === 'note'
          ? row.name || ''
          : this.BuildNameForChangedRow(row, rowType, oldVal, newVal)
      return this.MapRowData(row, name, utcTime, vnTime, modalSettingStore)
    }

    // Log không có thay đổi
    const name = this.BuildRowTitle(row, rowType)
    const logEntry = this.MapRowData(row, name, utcTime, vnTime, modalSettingStore)
    if (!row.logic) logEntry.isNoChange = true
    return logEntry
  }

  // Build tên cho row có thay đổi
  BuildNameForChangedRow(
    row: IActivityItem,
    rowType: string,
    oldVal: any,
    newVal: any
  ): string {
    if (row.name?.includes('Update Campaign (update field)')) {
      this.ProcessUpdateCampaignName(row, oldVal, newVal)
    }
    return this.BuildRowTitle(row, rowType)
  }

  // Build finalShow và gắn vào log
  async BuildAndAttachFinalShow(
    logEntry: ILogDataType,
    oldVal: any,
    newVal: any,
    modalSettingStore: any,
    dataTableStore: any,
    objectType: string
  ): Promise<void> {
    const rawTableData = await this.BuildRawTableData(
      logEntry,
      oldVal,
      newVal,
      modalSettingStore.settingsNow,
      dataTableStore,
      objectType
    )

    // Bỏ qua log chỉ chứa các trường thời gian
    const isOnlyTimeFields =
      rawTableData.length > 0 &&
      rawTableData.every((item) => timeFields.includes(item.field))

    if (!isOnlyTimeFields) {
      logEntry.finalShow = rawTableData
        .map((item) => ({
          ...item,
          field: item.field === 'cpc' ? 'Bidding Value' : item.field,
        }))
        .map((item) => this.FormatEmptyValues(item))
    }
  }

  // Xử lý tên hiển thị cho Update Campaign - gắn thêm các trường đã thay đổi
  ProcessUpdateCampaignName(row: IActivityItem, oldVal: any, newVal: any): void {
    try {
      const atomicChanges = atomizeChangeset(diff(oldVal, newVal))
      if (atomicChanges?.length) {
        const arr = atomicChanges
          .filter((element) => !timeFields.includes(element.key))
          .map((element) => (element.key === 'cpc' ? 'Bidding' : element.key))
        row.nameMore = arr.join(', ')
      }
    } catch (e) {
      console.error(e)
    }
  }

  // Xây dựng title hiển thị cho log
  BuildRowTitle(row: IActivityItem, rowType: string): string {
    let name = row.name
      ? row.name
      : `${rowType.charAt(0).toUpperCase()}${rowType.slice(1)} ${
          row.object
        } id: ${row.object_id}`

    if (row.nameMore) {
      name = name.replace('(update field)', '')
      name += ` (${row.nameMore})`
    }
    return name
  }

  // Map dữ liệu raw thành format chuẩn cho UI
  MapRowData(
    row: IActivityItem,
    name: string,
    utcTime: string,
    vnTime: string,
    modalSettingStore: any
  ): ILogDataType {
    const isVnTime = modalSettingStore.settingsNow.language === '+7'

    return {
      id: row.id,
      logic: row.logic
        ? typeof row.logic === 'string'
          ? JSON.parse(row.logic)
          : row.logic
        : '',
      title: name,
      type: row.type,
      object: row.object,
      old: row.old || '{}',
      new: row.new || '{}',
      user: row.UserInfo || { id: 0, email: '' },
      time: isVnTime ? vnTime : utcTime,
      timeTooltip: isVnTime ? utcTime : vnTime,
      reason: row.reason || '',
      note: row.note || '',
      campaign_id: row.object_id || '',
    }
  }

  // dựng dữ liệu bảng chi tiết (finalShow) từ old/new values
  // Xử lý 3 trường hợp: có diff, có logic, không thay đổi
  async BuildRawTableData(
    log: ILogDataType,
    oldVal: any,
    newVal: any,
    settings: ISettingsNow,
    store: any,
    objectType: string
  ): Promise<ITableDataLog[]> {
    const atomicChanges = atomizeChangeset(diff(oldVal, newVal))
    let rawTableData: ITableDataLog[] = []

    if (atomicChanges.length) {
      rawTableData = this.BuildFromAtomicChanges(atomicChanges, settings)
    } 
    else if (log.logic) {
      rawTableData = this.BuildFromLogicData(log)
    } 
    else if (log.isNoChange) {
      rawTableData = this.BuildFromNoChange(oldVal, newVal)
    }

    // Xử lý các trường đặc biệt cần gọi API để lấy label
    if (rawTableData.length > 0) {
      await store.processSpecialFields(rawTableData, objectType)
    }

    return rawTableData
  }

  // Case 1: Có thay đổi → build từ atomic changes
  BuildFromAtomicChanges(
    atomicChanges: any[],
    settings: ISettingsNow
  ): ITableDataLog[] {
    return atomicChanges
      .map((item) => this.BuildLogEntry(item, settings))
      .filter((item) => item?.field !== 'id' && !item?.field.includes('> id'))
      .filter(Boolean) as ITableDataLog[]
  }

  // Case 2: Logic data (ví dụ: rule conditions)
  BuildFromLogicData(log: ILogDataType): ITableDataLog[] {
    const rawTableData: ITableDataLog[] = []
    try {
      const newData = log.new as any
      const oldData = log.old as any
      for (const key in newData) {
        if (!Object.hasOwn(newData, key)) continue
        const vNew = newData[key]
        const vOld = oldData?.[key]

        rawTableData.push({
          field: key,
          type: vOld === undefined ? 'ADD' : 'UPDATE',
          old: vOld,
          new: vNew,
        } as ITableDataLog)
      }
    } catch {}
    return rawTableData
  }

  // Case 3: Không có thay đổi → hiển thị snapshot
  BuildFromNoChange(oldVal: any, newVal: any): ITableDataLog[] {
    const hasData =
      (oldVal && Object.keys(oldVal).length > 0) ||
      (newVal && Object.keys(newVal).length > 0)
    return [
      {
        field: hasData ? 'Snapshot' : 'No change',
        type: 'NO_CHANGE',
        old: hasData ? oldVal : 'No change',
        new: hasData ? newVal : 'No change',
      } as ITableDataLog,
    ]
  }

  // Build một entry trong bảng log từ atomic change
  BuildLogEntry(item: any, settings: ISettingsNow): ITableDataLog | null {
    const newVal = item.value ? parseJson(item.value) : ''
    let oldVal = parseJson(item.oldValue || '""')

    if (checkEmpty(item.oldValue)) {
      const type = typeOfObject(newVal)
      oldVal = type === 'array' ? [] : type === 'object' ? {} : ''
    }

    const field =
      item.path.toString().replace('$.', '').replace(/\./g, ' > ') +
      (item.type.toLocaleUpperCase() === 'ADD' && item.valueType === 'Object'
        ? ` > ${item.key}`
        : '')

    // Ẩn các trường không cần thiết trong mode Important
    if (
      settings.mode === 'important' &&
      ['status_cache', 'naked_link'].includes(field)
    ) {
      return null
    }

    const isTime = this.IsTimeField(field)
    return this.BuildLogEntryWithTime(field, item.type, oldVal, newVal, isTime, settings)
  }

  // Build log entry với xử lý timezone
  BuildLogEntryWithTime(
    field: string,
    type: string,
    oldVal: any,
    newVal: any,
    isTime: boolean,
    settings: ISettingsNow
  ): ITableDataLog {
    const obj: any = {
      field,
      type: type.toLocaleUpperCase(),
      old: isTime && settings.language !== 'utc' ? helper.convertToGMT7(oldVal) : oldVal,
      new: isTime && settings.language !== 'utc' ? helper.convertToGMT7(newVal) : newVal,
    }

    if (isTime && (settings.language === 'utc' || settings.language === '+7')) {
      obj.oldTooltip = settings.language === 'utc' ? helper.convertToGMT7(oldVal) : oldVal
      obj.newTooltip = settings.language === 'utc' ? helper.convertToGMT7(newVal) : newVal
    }

    return obj as ITableDataLog
  }

  // Format giá trị rỗng thành "N/A" và stringify object/array
  FormatEmptyValues(item: ITableDataLog): ITableDataLog {
    return {
      ...item,
      old: checkEmpty(item.old) ? 'N/A' : processDataShow(item.old),
      new: checkEmpty(item.new) ? 'N/A' : processDataShow(item.new),
    }
  }

  // Check xem field có phải là time field không
  IsTimeField(field: string): boolean {
    return (
      timeFields.includes(field) ||
      field.toLowerCase().includes('time') ||
      field.toLowerCase().includes('date')
    )
  }

  // Chuyển đổi thời gian UTC sang múi giờ VN (+7)
  GetRowTimes(created_at: string): { utcTime: string; vnTime: string } {
    const utcDate = utcToZonedTime(new Date(created_at), 'UTC')
    const utcTime = format(utcDate, 'yyyy-MM-dd HH:mm:ss') + ' UTC+0'
    const vnTime = helper.convertUTCToGMT7(utcTime)
    return { utcTime, vnTime }
  }
}
