<script setup lang="ts">
import { Plus } from '@/assets'
import ClearAll from '@/assets/icons/ClearAll.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ScheduleEntry } from '@/interface/campaign'
import { campaignTypeClass } from '@/types/components/campaign-v2'

// Schedule này đang được sử dụng ở 2 chỗ: Campaign Google và Google Preset (02/10/2025)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: false,
  },
  data: {
    type: Object as () => any,
    required: false,
  },

  crawl: {
    type: Boolean,
    required: false,
    default: false,
  },
})

const target = computed(() => props.data ?? props.campaign)
const duplicates_error = ref<string>()

const isEditPage = computed<boolean>(
  () => Number(window.route.params.id || 0) !== 0
)

const WEEK_DAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
  'SATURDAY',
  'SUNDAY',
] as const

// Các nhóm ngày đặc biệt
const GROUP_WEEKDAYS = [
  'MONDAY',
  'TUESDAY',
  'WEDNESDAY',
  'THURSDAY',
  'FRIDAY',
] as const
const GROUP_WEEKEND = ['SATURDAY', 'SUNDAY'] as const

// Tuỳ chọn hiển thị ngày trong UI
const dayOptions = [
  { label: 'All days', value: 'ALL' },
  { label: 'Monday', value: 'MONDAY' },
  { label: 'Tuesday', value: 'TUESDAY' },
  { label: 'Wednesday', value: 'WEDNESDAY' },
  { label: 'Thursday', value: 'THURSDAY' },
  { label: 'Friday', value: 'FRIDAY' },
  { label: 'Saturday', value: 'SATURDAY' },
  { label: 'Sunday', value: 'SUNDAY' },
  { label: 'Monday - Friday', value: 'MONDAY_FRIDAY' },
  { label: 'Saturday - Sunday', value: 'SATURDAY_SUNDAY' },
]

// Tạo danh sách thời gian mỗi 15 phút (00:00 → 23:45) theo định dạng 12h
const timeOptions = Array.from({ length: 96 }, (_, i) => {
  const hour = Math.floor(i / 4)
  const minute = (i % 4) * 15

  // label hiển thị 24h
  const label = `${hour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')}`

  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 || 12
  const value = `${displayHour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')} ${period}`
  return { label, value }
})

// Chuyển enum phút sang số phút
function minuteEnumToNumber(minuteEnum: string): number {
  if (minuteEnum === 'FIFTEEN') return 15
  if (minuteEnum === 'THIRTY') return 30
  if (minuteEnum === 'FORTY_FIVE') return 45
  return 0
}

// Chuyển đổi giờ + minuteEnum (enum) sang chuỗi 12h
function formatTimeFromSchedule(hour: number, minuteEnum: string) {
  if (hour === 24) {
    return '12:00 AM'
  }

  const displayHour = hour % 12 || 12
  const minutes = minuteEnumToNumber(minuteEnum)
  const period = hour < 12 ? 'AM' : 'PM'
  return `${displayHour.toString().padStart(2, '0')}:${minutes
    .toString()
    .padStart(2, '0')} ${period}`
}

// Phân tích chuỗi "hh:mm AM/PM" → { hour: 0-23, minute: Enum 15p }
function parseTime(timeStr: string): { hour: number; minute: string } {
  const [time, period] = timeStr.split(' ')
  let [h, m] = time.split(':').map(Number)
  if (period === 'PM' && h < 12) h += 12
  if (period === 'AM' && h === 12) h = 0
  const minuteEnum = ['ZERO', 'FIFTEEN', 'THIRTY', 'FORTY_FIVE'][m / 15]
  return { hour: h, minute: minuteEnum }
}

// Chuẩn hoá "hh:mm AM/PM" → tổng phút trong ngày (0..1439)
function timeToMinutes(timeStr: string): number {
  const [time, period] = timeStr.split(' ')
  let [hour, minute] = time.split(':').map(Number)
  if (period === 'PM' && hour < 12) hour += 12
  if (period === 'AM' && hour === 12) hour = 0
  return hour * 60 + minute
}

// Lấy thời điểm sau 15 phút so với startTime (không qua ngày thực sự)
function getNextTime(startTime: string): string {
  const startMinutes = timeToMinutes(startTime)
  const nextMinutes = startMinutes + 15
  const hour = Math.floor(nextMinutes / 60) % 24
  const minute = nextMinutes % 60
  const period = hour < 12 ? 'AM' : 'PM'
  const displayHour = hour % 12 || 12
  return `${displayHour.toString().padStart(2, '0')}:${minute
    .toString()
    .padStart(2, '0')} ${period}`
}

// Lọc options cho endTime theo startTime
function endTimeOptions(startTime: string) {
  const startMinutes = timeToMinutes(startTime)
  return timeOptions.filter((option) => {
    const endMinutes = timeToMinutes(option.value)
    return option.value === '12:00 AM' || endMinutes > startMinutes
  })
}

// Gom nhóm các entries có cùng khung giờ rồi rút gọn theo nhóm ngày đặc biệt
const processSchedulesFromProps = () => {
  return (
    target.value.schedule?.google?.map((entry: ScheduleEntry) => ({
      dayOfWeek: entry.dayOfWeek,
      startTime: formatTimeFromSchedule(
        entry.startHour ?? 0,
        entry.startMinute ?? 'ZERO'
      ),
      endTime: formatTimeFromSchedule(
        entry.endHour ?? 0,
        entry.endMinute ?? 'ZERO'
      ),
    })) ?? []
  )
}

// Danh sách schedules hiển thị trong UI
const schedules = ref(processSchedulesFromProps())

// Không disable bất kỳ ngày nào - cho phép chọn tự do
const availableDayOptions = computed(() => {
  return dayOptions.map((opt) => ({ ...opt, disabled: false }))
})

// Thêm lịch mới - mặc định là Monday
const addSchedule = () => {
  if (!target.value) return
  if (!target.value.schedule) target.value.schedule = {}
  if (!Array.isArray(target.value.schedule.google))
    target.value.schedule.google = []

  schedules.value.push({
    dayOfWeek: 'MONDAY',
    startTime: '12:00 AM',
    endTime: '12:00 AM',
  })
}

// Xoá dòng theo index
const removeSchedule = (index: number) => {
  if (schedules.value.length) {
    schedules.value.splice(index, 1)
  }
}
/**
 * LƯU Ý QUAN TRỌNG
 * - "Kiểm tra TRÙNG KHUNG GIỜ TRONG CÙNG NGÀY"
 * - Nếu có khung giờ overlap trong cùng ngày, xoá hết schedule_dayparting và báo lỗi.
 * - Khi chọn startTime, endTime tự nhảy +15 phút nếu hợp lệ.
 * - endTimeOptions cho phép chọn "12:00 AM" như ngoại lệ.
 */
watch(
  schedules,
  (val) => {
    const result: ScheduleEntry[] = []

    for (const item of val) {
      const { hour: startHour, minute: startMinute } = parseTime(item.startTime)
      const { hour: endHour, minute: endMinute } = parseTime(item.endTime)

      let base: ScheduleEntry = {
        startHour,
        endHour,
        startMinute,
        endMinute,
      }

      // Nếu start và end đều là 12:00 AM (tức hour = 0, minute = 'ZERO'),
      // sẽ là full day (until_hour: 24).
      if (endHour === 0 && endMinute === 'ZERO') {
        base.endHour = 24
      }

      if (item.dayOfWeek === 'ALL') {
        WEEK_DAYS.forEach((day) => result.push({ dayOfWeek: day, ...base }))
        continue
      }

      if (item.dayOfWeek === 'MONDAY_FRIDAY') {
        GROUP_WEEKDAYS.forEach((day) =>
          result.push({ dayOfWeek: day, ...base })
        )
        continue
      }

      if (item.dayOfWeek === 'SATURDAY_SUNDAY') {
        GROUP_WEEKEND.forEach((day) => result.push({ dayOfWeek: day, ...base }))
        continue
      }

      result.push({ dayOfWeek: item.dayOfWeek, ...base })
    }

    // Nhóm theo ngày và kiểm tra overlap trong từng nhóm
    const dayGroups = new Map<string, ScheduleEntry[]>()

    for (const entry of result) {
      if (!entry.dayOfWeek) continue
      if (!dayGroups.has(entry.dayOfWeek)) {
        dayGroups.set(entry.dayOfWeek, [])
      }
      dayGroups.get(entry.dayOfWeek)!.push(entry)
    }

    const overlaps: string[] = []

    // Kiểm tra overlap trong từng nhóm ngày
    for (const [day, entries] of dayGroups) {
      // Chuyển đổi sang minutes để so sánh
      const timeRanges = entries.map((entry) => ({
        start:
          (entry.startHour ?? 0) * 60 +
          minuteEnumToNumber(entry.startMinute ?? 'ZERO'),
        end:
          entry.endHour === 24
            ? 24 * 60
            : (entry.endHour ?? 0) * 60 +
              minuteEnumToNumber(entry.endMinute ?? 'ZERO'),
      }))

      // So sánh từng cặp khung giờ
      for (let i = 0; i < timeRanges.length; i++) {
        for (let j = i + 1; j < timeRanges.length; j++) {
          const range1 = timeRanges[i]
          const range2 = timeRanges[j]

          // Overlap nếu: start1 < end2 && start2 < end1
          if (range1.start < range2.end && range2.start < range1.end) {
            if (!overlaps.includes(day)) {
              overlaps.push(day)
            }
            break
          }
        }
        if (overlaps.includes(day)) break
      }
    }

    if (overlaps.length > 0) {
      duplicates_error.value =
        "Times can't overlap. Please edit your schedule. Overlapping time ranges detected on: " +
        overlaps.join(', ')
      if (target.value) target.value.schedule = { google: [] }
      return
    } else {
      duplicates_error.value = ''
    }

    if (target.value) target.value.schedule = { google: result }
  },
  { deep: true, immediate: true }
)

const isNotOpen = computed(() => {
  return isEditPage.value && !props.crawl && !!props.campaign?.traffic_source_id
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="text-xs font-bold">Schedule</div>
    <span class="text-red-600 text-xs">{{ duplicates_error }}</span>
    <div
      v-for="(schedule, index) in schedules"
      :key="index"
      class="flex items-center gap-4 flex-wrap"
    >
      <div>
        <FloatingWrapper :name="'Select day'">
          <n-select
            v-model:value="schedule.dayOfWeek"
            placeholder=""
            :options="availableDayOptions"
            class="w-[180px]"
            filterable
            @update:value="(val: string) => { schedule.dayOfWeek = val }"
            :disabled="isNotOpen"
          />
        </FloatingWrapper>
      </div>
      <div>
        <FloatingWrapper>
          <n-select
            v-model:value="schedule.startTime"
            :disabled="isNotOpen"
            :options="timeOptions"
            class="w-[120px]"
            filterable
            @update:value="(val: string) => {
                const nextTime = getNextTime(val)
                schedule.endTime = nextTime
              }"
          />
        </FloatingWrapper>
      </div>

      <span>to</span>
      <div>
        <FloatingWrapper>
          <n-select
            v-model:value="schedule.endTime"
            :disabled="isNotOpen"
            :options="endTimeOptions(schedule.startTime)"
            class="w-[120px]"
            filterable
          />
        </FloatingWrapper>
      </div>

      <div class="flex gap-2">
        <n-button
          @click="removeSchedule(index as number)"
          text
          :disabled="isNotOpen"
        >
          <n-icon size="12" :component="ClearAll" />
        </n-button>
      </div>
    </div>
    <n-button
      class="w-20 justify-center"
      @click="addSchedule"
      :disabled="isNotOpen"
    >
      <n-icon size="12" :component="Plus" class="mr-2" />Add
    </n-button>
  </div>
</template>
