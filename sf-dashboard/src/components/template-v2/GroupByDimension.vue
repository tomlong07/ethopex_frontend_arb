<script setup lang="ts">
import { syncColDimensions } from '@/components/template-v2/helper'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const groupByUserClick = ref(false) //Nếu là userclick mới watch và update

const dataGroup = ref<string[]>(templateV2Store.groupByV2 || [])

watch(
  () => templateV2Store.groupByV2,
  () => {
    dataGroup.value = templateV2Store.groupByV2
  }
)

watch(dataGroup, () => {
  if (!groupByUserClick.value) return

  templateV2Store.groupByV2 = dataGroup.value

  syncColDimensions(dataGroup.value, templateV2Store.groupBy)

  if (
    !templateV2Store.columnConfigs.instantUpdateGroup ||
    !templateV2Store.allowInstant
  )
    return

  templateV2Store.reInitTable()

  groupByUserClick.value = false
})

const labelNow = (label?: string) => {
  return helper.capitalizeFirstLetter(label?.toLowerCase() || '')
}

const clickHandle = (values: string[] | any[]) => {
  dataGroup.value = values
  groupByUserClick.value = true
}
</script>

<template>
  <div class="flex p-2 justify-between bg-gray-100 main-group-child">
    <div class="flex flex-col">
      <div class="font-bold text-xs text-gray-500 pb-1 mx-2">Group By:</div>
      <div class="flex mx-2 text-xs">
        <n-checkbox-group
          v-model:value="dataGroup"
          :on-update:value="clickHandle"
        >
          <div class="grid grid-rows-1 grid-flow-col gap-1">
            <template v-for="(o, i) in templateV2Store.groupBy" :key="i">
              <n-checkbox
                size="small"
                :value="o.field"
                :label="labelNow(o.headerName)"
                :disabled="o.disable"
              />
            </template>
          </div>
        </n-checkbox-group>
      </div>
    </div>
  </div>
</template>
