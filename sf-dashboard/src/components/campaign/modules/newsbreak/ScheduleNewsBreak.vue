<script setup lang="ts">
import { adGroups, campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
})
console.log(props.campaign)

const hours = ref([
  '00:00',
  '03:00',
  '06:00',
  '09:00',
  '12:00',
  '15:00',
  '18:00',
  '21:00',
])

const week = ref([
  { label: 'Sun', value: 0 },
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
])

// 24 hours per day (0-23)
const hoursInDay = ref(Array.from({ length: 24 }, (_, i) => i))

const getDayparting = (day: string, hh: number) => {
  const dp = props.adgroup.schedule?.dayparting
  if (!dp || typeof dp === 'string' || Array.isArray(dp)) return 0

  return dp[day]?.includes(hh) ? 1 : 0
}
const setDayparting = (day: string, hh: number, value: number) => {
  const dp = props.adgroup.schedule?.dayparting
  if (!dp || typeof dp === 'string' || Array.isArray(dp)) return

  if (!dp[day]) {
    dp[day] = []
  }

  const hours = dp[day]
  const index = hours.indexOf(hh)

  if (value === 1 && index === -1) {
    // Add hour and keep sorted
    hours.push(hh)
    hours.sort((a, b) => a - b)
  } else if (value === 0 && index !== -1) {
    // Remove hour
    hours.splice(index, 1)
  }

  // Remove day key if array is empty
  if (hours.length === 0) {
    delete dp[day]
  }
}

const day1 = ref(-1)
const day2 = ref(-1)
const hh1 = ref(-1)
const hh2 = ref(-1)
const isDragging = ref(false)
const changeHhTo = ref(1)

const setTopLeft = (dayValue: string, hh: number) => {
  const dayIndex = parseInt(dayValue)
  day1.value = dayIndex
  hh1.value = hh
  day2.value = dayIndex
  hh2.value = hh
  isDragging.value = true

  // Toggle value
  if (props.adgroup.schedule?.dayparting) {
    changeHhTo.value = getDayparting(dayValue, hh) === 1 ? 0 : 1
  }
}

const setBottomRight = (dayValue: string, hh: number) => {
  if (!isDragging.value) return
  day2.value = parseInt(dayValue)
  hh2.value = hh
}

const offDrag = () => {
  const xx1 = Math.min(day1.value, day2.value)
  const yy1 = Math.min(hh1.value, hh2.value)
  const xx2 = Math.max(day1.value, day2.value)
  const yy2 = Math.max(hh1.value, hh2.value)

  // Set selected dragged area
  if (props.adgroup.schedule?.dayparting) {
    for (let day = xx1; day <= xx2; day++) {
      const dayKey = String(day)
      for (let hh = yy1; hh <= yy2; hh++) {
        setDayparting(dayKey, hh, changeHhTo.value)
      }
    }
  }

  isDragging.value = false
}

const isDragged = (dayValue: string, hh: number) => {
  if (!isDragging.value) return false
  const dayIndex = parseInt(dayValue)
  const xx1 = Math.min(day1.value, day2.value)
  const yy1 = Math.min(hh1.value, hh2.value)
  const xx2 = Math.max(day1.value, day2.value)
  const yy2 = Math.max(hh1.value, hh2.value)
  return dayIndex >= xx1 && dayIndex <= xx2 && hh >= yy1 && hh <= yy2
}

const scheduleType = computed({
  get: () => props.adgroup.schedule?.type ?? 'all',
  set: (val: string) => {
    if (props.adgroup.schedule) {
      props.adgroup.schedule.type = val
    }
  },
})
</script>

<template>
  <div v-if="adgroup.schedule?.type" class="flex gap-2">
    <div class="flex flex-col gap-2">
      <div class="text-xs font-bold text-gray-400">Dayparting</div>
      <div class="flex-1 min-w-0">
        <div class="flex flex-col">
          <div>
            <n-radio-group v-model:value="scheduleType">
              <n-radio-button value="all" label="All day" />
              <n-radio-button value="specific" label="Select specific time" />
            </n-radio-group>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- schedule detail -->
  <div v-show="adgroup.schedule?.type === 'specific'">
    <div class="schedule-container">
      <table class="schedule-table">
        <thead>
          <tr>
            <th class="day-label"></th>
            <th
              v-for="(hour, i) in hours"
              :key="i"
              class="hour-label"
              colspan="3"
            >
              {{ hour }}
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(day, dayIndex) in week" :key="dayIndex">
            <td class="day-label">{{ day.label }}</td>
            <td
              v-for="(hh, hhIndex) in hoursInDay"
              :key="hhIndex"
              :class="[
                'time-cell',
                {
                  selected: getDayparting(String(day.value), hh) === 1,
                  dragged: isDragged(String(day.value), hh),
                },
              ]"
              @mousedown="setTopLeft(String(day.value), hh)"
              @mouseover="setBottomRight(String(day.value), hh)"
              @mouseup="offDrag"
            ></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<style scoped lang="scss">
.schedule-container {
  overflow-x: auto;
  padding: 16px;
  background: #fff;
  border-radius: 4px;
}

.schedule-table {
  border-collapse: separate;
  border-spacing: 2px;
  width: 100%;
  user-select: none;
}

.hour-label {
  font-size: 11px;
  color: #666;
  font-weight: normal;
  text-align: start;
  padding: 4px 2px;
  min-width: 50px;
}

.day-label {
  font-size: 13px;
  color: #333;
  font-weight: 500;
  text-align: left;
  padding: 8px 12px;
  background: #f5f5f5;
}

.time-cell {
  height: 32px;
  background: #f0f0f0;
  cursor: pointer;
  transition: background-color 0.15s;

  &:hover {
    background: #d1e9ff;
  }

  &.selected {
    background: #5dadec;
  }

  &.dragged {
    background: #a8d5ff;
  }
}

tbody tr:hover .day-label {
  background: #e8e8e8;
}
</style>
