<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { ByDimensionSettings, InfoData } from '@/types/components/types'
import useByDimensionStore from '@/store/useByDimensionStore'

const props = defineProps({
  title: {
    type: String,
    default: 'Metrics',
  },
})

const byDimensionStore = useByDimensionStore()

const settings = computed<ByDimensionSettings>(() => byDimensionStore.settings)
const objectSettings = computed<{ [key: string]: InfoData }>(
  () => byDimensionStore.objectSettings
)
const checkBoxList = computed<string[]>(() => {
  return settings.value.settingMetric?.metrics || []
})

const checkBoxOptions = computed<SelectOption[]>(() => {
  if (!checkBoxList.value?.length) return []

  let list: SelectOption[] = []
  checkBoxList.value.forEach((element) => {
    list.push({
      label: (byDimensionStore.valueById(element, 'name') as string) || '',
      key: element,
    })
  })

  return list
})

const availableOptions = computed<string[]>(() => {
  return checkBoxOptions.value
    .filter((o) => !byDimensionStore.metricIsDisabled(o.key as string))
    .map((o) => o.key as string)
})

const isAllChecked = computed<boolean>(() => {
  if (!availableOptions.value.length) return false
  return availableOptions.value.every((key) =>
    byDimensionStore.metricsValue.includes(key)
  )
})

const handleSelectAll = (checked: boolean) => {
  if (checked) {
    byDimensionStore.metricsValue = [...availableOptions.value]
  } else {
    byDimensionStore.metricsValue = []
  }
}

const labelNow = (label: string) => {
  if (!label) return ''

  if (label.includes('RT')) return label.replace('RT', '')
  return label
}
</script>

<template>
  <div class="flex p-2 justify-between bg-gray-100 rounded-b-lg">
    <div class="flex flex-col">
      <div class="font-bold text-xs text-gray-500 pb-1 mx-2">
        {{ props.title }}
      </div>
      <div class="flex mx-2 items-start gap-3">
        <n-checkbox-group v-model:value="byDimensionStore.metricsValue">
          <div class="flex flex-wrap gap-3">
            <template v-for="(o, i) in checkBoxOptions" :key="i">
              <div class="w-28">
                <n-checkbox
                  size="small"
                  :disabled="byDimensionStore.metricIsDisabled(o.key as string)"
                  :value="o.key as any"
                  :label="labelNow(o.label as string)"
                  :class="objectSettings[o.key as string]?.class || ''"
                  class="small-check-metric-dimension"
                />
              </div>
            </template>
          </div>
        </n-checkbox-group>
        <div class="flex-shrink-0 whitespace-nowrap">
          <n-checkbox
            size="small"
            :checked="isAllChecked"
            @update:checked="handleSelectAll"
            label="All"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.small-check-metric-dimension {
  .n-checkbox__label {
    font-size: 12px;
  }
  display: flex;
  align-items: center;
}
</style>

<style lang="scss" scoped>
.blink {
  position: relative;
  width: fit-content;
}
.blink:after {
  content: '';
  position: absolute;
  top: 30%;
  right: 0;
  transform: translate(30%, -50%);
  width: 8.39px;
  height: 8.39px;
  border-radius: 50%;
  background-color: #49a849;
  animation: flash 1s infinite;
}
</style>
