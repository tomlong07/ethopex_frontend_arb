<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import CheckAll from '@/assets/icons/CheckAll.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import FileSaver from 'file-saver'
import api_v2 from '@/core/api_v2'
import Save from '@/assets/icons/Save.vue'
import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'

const props = defineProps({
  isSave: {
    type: Boolean,
    default: false,
  },
})

const emits = defineEmits(['handleSave'])

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
    if (element.field) {
      dataToSave.push(element.field)
    }
  })

  templateV2Store.columnSettings = dataToSave || []
}

const messageNow = ref()

watch(
  () => templateV2Store.columnSettings,
  async (newValue, oldValue) => {
    if (!newValue || !newValue.length) {
      if (messageNow.value) {
        messageNow.value.destroy()
      }
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

  if (groupBy.value && groupBy.value.length) {
    pl.group_by = groupBy.value
  }

  // if (defaultInfoPayload.value) {
  //   for (const key in defaultInfoPayload.value) {
  //     if (Object.prototype.hasOwnProperty.call(defaultInfoPayload.value, key)) {
  //       pl[key] = defaultInfoPayload.value[key]
  //     }
  //   }
  // }

  return pl
})

const downloadTable = async () => {
  if (!templateV2Store.baseConfigs.IsHasDownload()) return
  if (templateV2Store.baseConfigs.IsDownloadFollowTable()) {
    templateV2Store.isDownloading = true
    templateV2Store.downloadTableNow()
  } else {
    const loadingDownload = window.message.loading('Downloading...', {
      duration: 0, //0 is infinite
    })
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

    loadingDownload.destroy()
  }
}

const handleSave = () => {
  if (!props.isSave) return
  emits('handleSave')
}
</script>

<template>
  <div class="flex p-2 justify-between bg-gray-100 main-group-child">
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
    <div class="ml-auto pr-2 flex">
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
        <div class="flex justify-end" :class="[{ 'gap-2': isSave }]">
          <n-button text title="Check all columns" @click="checkAllHandle">
            <n-icon :component="CheckAll" size="24" />
          </n-button>
          <n-button
            v-if="isSave"
            type="primary"
            text
            title="Check all columns"
            @click="handleSave"
          >
            <n-icon :component="Save" size="18" />
          </n-button>
        </div>
      </div>
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
