<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import CheckAll from '@/assets/icons/CheckAll.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import FileSaver from 'file-saver'
import api_v2 from '@/core/api_v2'
import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'
import OrderColumn from './order_column/OrderColumn.vue'

const props = defineProps({
  class: {
    type: String,
    default: '',
  },
})

const templateV2Store = useTemplateV2(helper.truePath())()

const rtColumns = computed(() => {
  return templateV2Store.columnConfigs.columns || []
})

const columnsNow = computed(() => {
  let cols: SelectOption[] = []

  try {
    templateV2Store.columns.forEach((element) => {
      if (!element.field) {
        return
      }
      const isBlink =
        element.headerComponentParams &&
        (element.headerComponentParams as any)?.template?.includes(
          'ag-header-icon'
        )
          ? true
          : false

      let isHidden = false
      for (let index = 0; index < rtColumns.value.length; index++) {
        const e = rtColumns.value[index]
        if (element.field === e.field && e.isGroup) {
          isHidden = true
          break
        }
      }

      cols.push({
        field: element.field,
        label: element.headerName,
        isBlink: isBlink,
        hidden: isHidden,
      })
    })
  } catch (error) {
    console.error(error)
  }
  return cols
})

const labelNow = (label?: string) => {
  return helper.capitalizeFirstLetter(label || '')
}

const checkAllHandle = () => {
  if (
    !templateV2Store.columnSettings ||
    templateV2Store.columns?.length == templateV2Store.columnSettings.length
  ) {
    templateV2Store.columnSettings = []

    return
  }

  let dataToSave: string[] = []

  templateV2Store.columns?.forEach((element) => {
    if (element.field) dataToSave.push(element.field)
  })

  templateV2Store.columnSettings = dataToSave || []
}

const messageNow = ref()

watch(
  () => templateV2Store.columnSettings,
  async (newValue, oldValue) => {
    if (!newValue?.length) {
      if (messageNow.value) messageNow.value.destroy()
      messageNow.value = window.message.warning('Select at least one column.', {
        duration: 2000,
      })
    }
  }
)

const groupBy = computed(() => {
  return templateV2Store.groupByV2 || []
})

//Làm tạm, chưa tối ưu
const payload = computed(() => {
  let rawFilterList = templateV2Store.filterList || {}

  let pl: {
    filter: any

    search?: string
    sort?: object
    group_by?: string[]
    columns?: string[]
    [key: string]: any
  } = {
    filter: rawFilterList,
  }

  if (templateV2Store.baseConfigs.searchInFilter) {
    pl.filter.search = templateV2Store.search.trim()
  } else {
    pl.search = templateV2Store.search.trim()
  }

  if (templateV2Store.sortInfoV2.sortNow) {
    pl.sort = templateV2Store.sortInfoV2.sortNow
  }

  if (groupBy.value?.length) pl.group_by = groupBy.value

  return pl
})

const downloadTable = async () => {
  if (!templateV2Store.baseConfigs.IsHasDownload()) return

  // Handle asset group download
  if (templateV2Store.baseConfigs.IsDownloadAssetGroup()) {
    templateV2Store.downloadAssetGroupNow()
    return
  }

  // Handle table download
  if (templateV2Store.baseConfigs.IsDownloadFollowTable()) {
    templateV2Store.isDownloading = true
    return templateV2Store.downloadTableNow()
  }

  // Handle API download
  const loadDownload = window.message.loading('Downloading...', { duration: 0 })

  try {
    const method = templateV2Store.baseConfigs.method || 'GET'
    const url = templateV2Store.baseConfigs.download

    const opts: Record<string, any> = {
      url: url,
      method: method,
      responseType: 'blob',
    }

    if (method.toLowerCase() === 'post') opts['data'] = payload.value

    //download theo link ajax api trả về
    const result = await api_v2.request(opts)

    if (result) {
      const data = new Blob([result], {
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8',
      })
      FileSaver.saveAs(data, 'data_download.xlsx')
      window.message.success('Download successfully')
    }
  } finally {
    loadDownload.destroy()
  }
}
</script>

<template>
  <div
    class="flex p-2 justify-between bg-gray-100 main-group-child"
    :class="[props.class]"
  >
    <div class="flex flex-col">
      <div class="font-bold text-xs text-gray-500 pb-1 mx-2">Columns:</div>
      <div class="flex mx-2 text-xs">
        <n-checkbox-group
          v-model:value="templateV2Store.columnSettings"
          class="flex flex-wrap gap-2"
        >
          <n-checkbox
            size="small"
            v-for="(item, index) in columnsNow"
            :key="item.field as PropertyKey"
            :value="item.field as any"
            :class="{
              hidden: item.hidden,
            }"
          >
            <template #default>
              <span
                class="inline-flex items-center gap-1"
                :class="{
                  [templateV2Store.columnConfigs.fixedWidth || '']: true,
                }"
              >
                <span>{{ labelNow(item.label as string) }}</span>
                <span v-if="item.isBlink" class="dot-blink" />
              </span>
            </template>
          </n-checkbox>
        </n-checkbox-group>
      </div>
    </div>
    <div class="ml-auto pr-2 flex items-center gap-1">
      <div v-if="templateV2Store.baseConfigs.IsHasDownload()">
        <div class="font-bold text-xs text-gray-500 pb-1 mx-2">&nbsp;</div>

        <n-popover trigger="hover" :show-arrow="false">
          <template #trigger>
            <n-button
              text
              @click="downloadTable"
              :disabled="templateV2Store.isDownloading"
            >
              <n-icon :component="ArrowDownload16Regular" size="22" />
            </n-button>
          </template>
          <span>Download</span>
        </n-popover>
      </div>
      <div>
        <div class="font-bold text-xs text-gray-500 pb-1 mx-2">&nbsp;</div>
        <n-popover trigger="hover">
          <template #trigger>
            <n-button text @click="checkAllHandle">
              <n-icon :component="CheckAll" size="24" />
            </n-button>
          </template>
          <span>Check all columns</span>
        </n-popover>
      </div>
      <OrderColumn :columns="templateV2Store.columnConfigs" />
    </div>
  </div>
</template>

<style scoped lang="scss">
.dot-blink {
  width: 8px;
  height: 8px;
  border-radius: 9999px;
  background-color: #49a849;
  animation: flash 1s infinite;
  flex-shrink: 0;
}
</style>
