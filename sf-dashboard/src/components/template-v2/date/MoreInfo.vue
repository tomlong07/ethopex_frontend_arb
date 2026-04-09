<script setup lang="ts">
import { CellFormaterCore } from '@/aggrid/cellv2'
import { useTemplateV2 } from '@/store/templateV2Store'
import { MoreInfoItem } from '@/types/state/template'
import ctr_more_info_ajax from '@/services/ctr_more_info_ajax'

const templateV2Store = useTemplateV2(helper.truePath())()
const ajaxDataMap = ref<Record<string, any>>({})
const moreInfo = templateV2Store.baseConfigs.moreInfo

const rawData = computed(() => {
  const dataShow = templateV2Store.rawDataV2 || {}
  const moreInfoProp = templateV2Store.baseConfigs.moreInfoProp

  //Nếu chỉ định prop thì lấy ở đó
  if (moreInfoProp) {
    return dataShow[moreInfoProp] || {}
  }
  return dataShow
})
onMounted(async () => {
  // Trường hợp có ajax trong moreInfo
  if (moreInfo) {
    for (const item of moreInfo) {
      if (item.ajax) {
        try {
          const res = await ctr_more_info_ajax.GetDataAjax(item.ajax)
          ajaxDataMap.value[item.key] = res?.data ?? null
        } catch (error) {
          console.error(`Error fetching ajax data for ${item.key}:`, error)
          ajaxDataMap.value[item.key] = null
        }
      }
    }
  }
})
const formatValue = (value: any, type?: string) => {
  if (value === 0) return '0'

  if (typeof value === 'number') {
    return helper.formatNumber(value)
  }

  return CellFormaterCore({ type: type, value }) || 'N/A'
}

const dataShow = (item: MoreInfoItem) => {
  // Trường hợp có ajax
  if (item.ajax) {
    const ajaxResult = ajaxDataMap.value[item.key]

    if (ajaxResult === undefined) return 'Loading...'
    if (ajaxResult === null) return 'Error'

    return formatValue(ajaxResult, item.type)
  }

  const dataNow = rawData.value[item.key]

  if (!rawData.value || Object.keys(rawData.value).length === 0) {
    return 'Loading...'
  }

  if (dataNow === undefined || dataNow === null || dataNow === '') {
    return 'N/A'
  }

  return formatValue(dataNow, item.type)
}
</script>

<template>
  <div class="flex mt-4 ml-2 z-10 relative bg-gray-100 role-group-by">
    <div class="flex justify-start items-center mb-4">
      <n-tag
        v-for="(item, index) in moreInfo"
        :key="item.key + index"
        :bordered="false"
        :type="item.color || 'info'"
        size="small"
        class="mr-4 n-tag-exclude"
      >
        {{ item.name || item.key }}:
        {{ dataShow(item) }}
      </n-tag>
    </div>
  </div>
</template>
