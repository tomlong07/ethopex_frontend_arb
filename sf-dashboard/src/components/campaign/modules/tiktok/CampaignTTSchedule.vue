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
const hours = ref([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23,
])

const week = ref([
  { label: 'Mon', value: 1 },
  { label: 'Tue', value: 2 },
  { label: 'Wed', value: 3 },
  { label: 'Thu', value: 4 },
  { label: 'Fri', value: 5 },
  { label: 'Sat', value: 6 },
  { label: 'Sun', value: 7 },
])

const halfHours = ref([
  0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21,
  22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 40,
  41, 42, 43, 44, 45, 46, 47,
])

const selectedArr = computed<string[][]>(() => {
  const dayparting = props.adgroup.schedule?.dayparting

  // Convert to string if it's array, or use empty string if undefined
  let daypartingStr = ''
  if (Array.isArray(dayparting)) {
    daypartingStr = dayparting.join('')
  } else if (typeof dayparting === 'string') {
    daypartingStr = dayparting
  } else {
    daypartingStr = ''
  }

  const mon = daypartingStr.substring(0, 48) || ''
  const tue = daypartingStr.substring(48, 96) || ''
  const wed = daypartingStr.substring(96, 144) || ''
  const thu = daypartingStr.substring(144, 192) || ''
  const fri = daypartingStr.substring(192, 240) || ''
  const sat = daypartingStr.substring(240, 288) || ''
  const sun = daypartingStr.substring(288, 336) || ''

  return [
    mon.split(''),
    tue.split(''),
    wed.split(''),
    thu.split(''),
    fri.split(''),
    sat.split(''),
    sun.split(''),
  ]
})

const day1 = ref(-1)
const day2 = ref(-1)
const hh1 = ref(-1)
const hh2 = ref(-1)
const isDragging = ref(false)
const changeHhTo = ref('1')

const getCharAt = (dayparting: string | string[], index: number): string => {
  if (typeof dayparting === 'string') {
    return dayparting.charAt(index)
  } else if (Array.isArray(dayparting)) {
    return dayparting.join('').charAt(index)
    // Hoặc: return dayparting[index] || ''
  }
  return ''
}

const setTopLeft = (day: number, hh: number) => {
  day1.value = day
  hh1.value = hh
  day2.value = day
  hh2.value = hh
  isDragging.value = true

  //change to
  if (props.adgroup.schedule?.dayparting) {
    const charAt =
      week.value[day].value === 1 ? hh : (week.value[day].value - 1) * 48 + hh
    changeHhTo.value =
      getCharAt(props.adgroup.schedule.dayparting as string, charAt) === '1'
        ? '0'
        : '1'
  }
}
const setBottomRight = (day: number, hh: number) => {
  if (!isDragging.value) {
    return
  }
  day2.value = day
  hh2.value = hh
}
const offDrag = () => {
  const xx1 = Math.min(day1.value, day2.value)
  const yy1 = Math.min(hh1.value, hh2.value)
  const xx2 = Math.max(day1.value, day2.value)
  const yy2 = Math.max(hh1.value, hh2.value)

  //set select draged for campaign
  week.value.forEach((day) => {
    halfHours.value.forEach((h) => {
      if (
        xx1 <= day.value - 1 &&
        day.value - 1 <= xx2 &&
        yy1 <= h &&
        h <= yy2 &&
        props.adgroup.schedule?.dayparting
      ) {
        const charAt = day.value === 1 ? h : (day.value - 1) * 48 + h

        // Check type trước khi gọi replaceCharacter
        const dayparting = props.adgroup.schedule.dayparting
        if (typeof dayparting === 'string') {
          props.adgroup.schedule.dayparting = replaceCharacter(
            dayparting,
            charAt,
            changeHhTo.value
          )
        } else if (Array.isArray(dayparting)) {
          // Handle array case - convert to string, modify, then convert back if needed
          const daypartingStr = dayparting.join('')
          props.adgroup.schedule.dayparting = replaceCharacter(
            daypartingStr,
            charAt,
            changeHhTo.value
          )
          // Hoặc nếu muốn giữ format array:
          // const modifiedStr = replaceCharacter(daypartingStr, charAt, changeHhTo.value)
          // props.adgroup.schedule.dayparting = modifiedStr.split('')
        }
      }
    })
  })
  isDragging.value = false
}

const replaceCharacter = (s: string, i: number, replacement: string) => {
  return s.substring(0, i) + replacement + s.substring(i + replacement.length)
}
const scheduleType = computed({
  get: () => props.adgroup.schedule?.type ?? 'all',
  set: (val: string) => {
    if (!props.adgroup.schedule) {
      props.adgroup.schedule = { type: val }
    } else {
      props.adgroup.schedule.type = val
    }
  },
})
const name = 'Dayparting'
</script>

<template>
  <div v-if="adgroup.schedule?.type" class="flex flex-col gap-1">
    <div class="text-xs font-bold">{{ name }}</div>
    <n-radio-group v-model:value="scheduleType">
      <n-radio-button value="all" label="All day" />
      <n-radio-button value="specific" label="Select specific time" />
    </n-radio-group>
  </div>

  <!-- schedule detail -->
  <div v-show="adgroup.schedule?.type === 'specific'" class="not-td-color">
    <table class="w-full">
      <thead>
        <tr>
          <th class="custom-schedule-tiktok" rowspan="2">Week/Time</th>
          <th colspan="24" scope="colgroup" class="custom-schedule-tiktok">
            00:00 - 12:00
          </th>
          <th colspan="24" scope="colgroup" class="custom-schedule-tiktok">
            12:00 - 24:00
          </th>
        </tr>
        <tr>
          <th
            class="custom-schedule-tiktok"
            v-for="(hour, i) in hours"
            :key="i"
            colspan="2"
            scope="col"
          >
            {{ hour }}
          </th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(day, index) in week" :key="index">
          <th class="custom-schedule-tiktok">{{ day.label }}</th>
          <td
            v-for="(hh, i) in halfHours"
            :key="i"
            :class="[
              {
                selected: selectedArr[day.value - 1][hh] === '1',
              },
              // { draged: isDraged(index, i) },
            ]"
            @mousedown="setTopLeft(index, i)"
            @mouseover="setBottomRight(index, i)"
            @mouseup="offDrag"
          ></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped lang="scss">
.selected {
  background-color: hotpink;
}
.draged {
  background-color: lightpink;
}
td:hover {
  background-color: lightpink;
}
table {
  margin: auto;
}
table,
th,
td {
  border: 1px solid black;
}
td {
  width: 14px !important;
}
td,
tr {
  user-select: none;
  cursor: pointer;
  text-align: center;
}
</style>
