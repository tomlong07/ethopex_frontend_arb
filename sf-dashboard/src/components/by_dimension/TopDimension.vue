<script setup lang="ts">
import DropCustom from '@/components/common/DropCustom.vue'
import useByDimensionStore from '@/store/useByDimensionStore'
import { SelectOption } from 'naive-ui'
import { ByDimensionSettings } from '@/types/components/types'

const byDimensionStore = useByDimensionStore()

const settings = computed<ByDimensionSettings>(() => byDimensionStore.settings)

const topOptions: SelectOption[] = [
  { value: 10, label: '10' },
  { value: 20, label: '20' },
  { value: 50, label: '50' },
  { value: 100, label: '100' },
  { value: 500, label: '500' },
]

const infoData = computed(() => {
  return settings.value.info || []
})

const hasTopInfo = computed(() => {
  for (let index = 0; index < infoData.value.length; index++) {
    const element = infoData.value[index]
    if (element.id === byDimensionStore.dimensionValueTemp[0]) {
      if (element.top === 1) return false
      return element.top ? true : false
    }
  }

  return false
})

const updateTop = (value: number) => {
  byDimensionStore.changeTop(value)
}
</script>

<template>
  <div v-if="hasTopInfo">
    <DropCustom
      class="w-32"
      name="Top"
      size="small"
      title="Select Top"
      disabled
      :defaultValue="byDimensionStore.fixedTop"
      :valueOptions="[
        { value: byDimensionStore.fixedTop, label: byDimensionStore.fixedTop },
      ]"
      @updateValue="updateTop"
      v-if="byDimensionStore.fixedTop"
    />

    <DropCustom
      class="w-32"
      name="Top"
      size="small"
      title="Select Top"
      :defaultValue="byDimensionStore.topValue"
      :valueOptions="topOptions"
      @updateValue="updateTop"
      v-else
    />
  </div>
</template>
