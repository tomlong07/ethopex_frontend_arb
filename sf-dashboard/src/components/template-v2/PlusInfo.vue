<script setup lang="ts">
import { CellFormaterCore } from '@/aggrid/cellv2'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const rawData = computed(() => {
  const dataShow = templateV2Store.rawDataV2 || {}

  //Nếu chỉ định prop thì lấy ở đó
  if (templateV2Store.baseConfigs.plusInfo) {
    return dataShow[templateV2Store.baseConfigs.plusInfo] || {}
  }
  return dataShow
})

const isHasData = computed(() => {
  return Object.keys(rawData.value).length > 0
})

const formatValue = (value: any) => {
  if (helper.isNumber(value)) {
    return CellFormaterCore({ type: 'number', value })
  }
  if (value === 0) return '0'
  return CellFormaterCore({ type: 'string', value }) || 'N/A'
}

const buildName = (name: string = '') => {
  return helper.toTitleCase(name)
}
</script>

<template>
  <div
    class="flex mt-4 ml-2 z-10 relative bg-gray-100 role-group-by gap-2"
    v-if="isHasData"
  >
    <div>{{ buildName(templateV2Store.baseConfigs.plusInfo) }}</div>
    <div class="flex justify-start items-center mb-4">
      <n-tag
        v-for="(item, key) in rawData"
        :key="key"
        :bordered="false"
        type="info"
        size="small"
        class="mr-4"
      >
        {{ key }}:
        {{ formatValue(item) }}
      </n-tag>
    </div>
  </div>
</template>
