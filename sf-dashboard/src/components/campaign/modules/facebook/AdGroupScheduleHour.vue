<script lang="ts" setup>
import { FreezeClass, adGroups } from '@/types/components/campaign-v2'
import { ref, onMounted } from 'vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const days = [
  'Monday',
  'Tuesday',
  'Wednesday',
  'Thursday',
  'Friday',
  'Saturday',
  'Sunday',
  'Every day',
]
const hours = Array.from({ length: 24 }, (_, i) => `${i}`)

const schedule = ref(
  (props.adgroup.schedule?.dayparting as string[] | undefined) ||
    Array(8 * 24).fill('0')
)

const isSelecting = ref(false)
const selectionState = ref('1')
const isDragging = ref(false)

const startDay = ref<number | null>(null)
const startHour = ref<number | null>(null)
const endDay = ref<number | null>(null)
const endHour = ref<number | null>(null)

const getIndex = (dayIndex: number, hourIndex: number) => {
  return dayIndex * 24 + hourIndex
}

const startSelection = (
  dayIndex: number,
  hourIndex: number,
  event: MouseEvent
) => {
  isSelecting.value = true
  startDay.value = dayIndex
  startHour.value = hourIndex
  endDay.value = dayIndex
  endHour.value = hourIndex
  selectionState.value =
    schedule.value[getIndex(dayIndex, hourIndex)] === '1' ? '0' : '1'

  if (dayIndex !== 7) {
    updateSelection()
  }
}

const handleMouseOver = (dayIndex: number, hourIndex: number) => {
  if (isSelecting.value) {
    isDragging.value = true
    endDay.value = dayIndex
    endHour.value = hourIndex
    updateSelection()
  }
}

const updateSelection = () => {
  if (
    startDay.value === null ||
    startHour.value === null ||
    endDay.value === null ||
    endHour.value === null
  ) {
    return
  }

  const minDay = Math.min(startDay.value, endDay.value)
  const maxDay = Math.max(startDay.value, endDay.value)
  const minHour = Math.min(startHour.value, endHour.value)
  const maxHour = Math.max(startHour.value, endHour.value)

  if (minDay <= 7 && maxDay >= 7) {
    for (let hour = minHour; hour <= maxHour; hour++) {
      for (let day = 0; day < 7; day++) {
        schedule.value[getIndex(day, hour)] = selectionState.value
      }
      schedule.value[getIndex(7, hour)] = selectionState.value
    }
  } else if (maxDay < 7) {
    for (let day = minDay; day <= maxDay; day++) {
      for (let hour = minHour; hour <= maxHour; hour++) {
        schedule.value[getIndex(day, hour)] = selectionState.value
      }
    }
    for (let hour = minHour; hour <= maxHour; hour++) {
      syncEveryDay(hour)
    }
  }
}

const toggleEveryDay = (hourIndex: number, event: MouseEvent) => {
  event.stopPropagation()
  if (!isDragging.value) {
    const newState = schedule.value[getIndex(7, hourIndex)] === '1' ? '0' : '1'
    for (let i = 0; i < 7; i++) {
      schedule.value[getIndex(i, hourIndex)] = newState
    }
    schedule.value[getIndex(7, hourIndex)] = newState
  }
  endSelection()
}

const syncEveryDay = (hourIndex: number) => {
  let allSelected = true
  for (let i = 0; i < 7; i++) {
    if (schedule.value[getIndex(i, hourIndex)] !== '1') {
      allSelected = false
      break
    }
  }
  schedule.value[getIndex(7, hourIndex)] = allSelected ? '1' : '0'
}

const endSelection = () => {
  isSelecting.value = false
  isDragging.value = false
  startDay.value = null
  startHour.value = null
  endDay.value = null
  endHour.value = null
}

const scheduleHour = ref()

onMounted(() => {
  if (scheduleHour.value) {
    scheduleHour.value.addEventListener('mouseup', endSelection)
  }
})
</script>

<template>
  <div class="overflow-x-auto" ref="scheduleHour">
    <div class="grid grid-cols-25 border border-gray-300">
      <div
        class="border text-center font-bold flex items-center justify-center bg-gray-100 px-2 py-1"
        v-for="hour in [' ', ...hours]"
        :key="'header-' + hour"
      >
        {{ hour }}
      </div>

      <template v-for="(day, dayIndex) in days" :key="'day-' + dayIndex">
        <div
          class="border text-center font-bold bg-gray-100 flex items-center justify-center px-2 py-3 h-12 select-none"
          :class="{ 'mt-4': day === 'Every day' }"
        >
          {{ day }}
        </div>

        <div
          v-for="(hour, hourIndex) in hours"
          :key="'cell-' + dayIndex + '-' + hourIndex"
          class="border cursor-pointer flex items-center justify-center w-full h-12"
          :class="{
            'bg-cyan-500': schedule[getIndex(dayIndex, hourIndex)] === '1',
            'hover:bg-cyan-200': isSelecting,
            'mt-4': day === 'Every day',
          }"
          @mousedown="startSelection(dayIndex, hourIndex, $event)"
          @mouseover="handleMouseOver(dayIndex, hourIndex)"
          @click="dayIndex === 7 ? toggleEveryDay(hourIndex, $event) : null"
        ></div>
      </template>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.grid-cols-25 {
  display: grid;
  grid-template-columns: 100px repeat(24, 1fr);
  align-items: center;
  border-collapse: collapse;
}

.grid-cols-25 div:not(.mt-4) {
  padding: 0;
  margin: 0;
  box-sizing: border-box;
}
</style>
