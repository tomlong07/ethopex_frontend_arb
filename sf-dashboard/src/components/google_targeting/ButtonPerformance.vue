<script setup lang="ts">
import { STATUS_GG } from '@/enum/google_performance'
import { TType } from '@/enum/naiveui'
import { ctr_google_targeting } from '@/services/ctr_google_targeting'
import { general } from '@/services/general'

import { useTemplateV2 } from '@/store/templateV2Store'
import { SelectOption } from 'naive-ui'

const templateV2Store = useTemplateV2(helper.truePath())()

const placements = computed(() => {
  return templateV2Store.getItemSelectByKey('placement')
})

const statusRef = ref<STATUS_GG | null>(null)
const isSubmitting = ref(false)

//Làm tạm, chưa tối ưu
const filterTable = computed(() => {
  let filter = helper.clone(templateV2Store.filterList || {})

  filter.search = templateV2Store.search.trim()

  return filter
})
const payload = computed(() => {
  if (templateV2Store.isSelectAll) {
    return {
      filter: filterTable.value,
      status: statusRef.value,
    }
  }

  return {
    placements: placements.value,
    status: statusRef.value,
  }
})

const placementTotal = computed(() => {
  if (templateV2Store.isSelectAll) return templateV2Store.totalItems
  return templateV2Store.itemSelectedV2?.length || 0
})

const totalText = computed(() => {
  return helper.formatNumberV2(placementTotal.value)
})

const submitStatus = async () => {
  if (!templateV2Store.asyncConfigs.performanceButton) return
  isSubmitting.value = true

  try {
    if (!placementTotal.value) {
      window.message.warning('Placements not found')
      return
    }

    if (templateV2Store.isSelectAll) {
      const ok = confirm(
        `${totalText.value} placements are selected. Do you want to set status for all placements?`
      )

      if (!ok) {
        return
      }
    }

    const result = await ctr_google_targeting.UpdateStatusPlacements(
      templateV2Store.asyncConfigs.performanceButton,
      payload.value
    )

    if (result.status) {
      await refetchMoreInfo()

      templateV2Store.gridApiV2?.forEachNode((node) => {
        const isSelected = templateV2Store.itemSelectedV2.some(
          (item) => item.placement === node.data.placement
        )

        if (isSelected) {
          node.setData({
            ...node.data,
            status: statusRef.value,
          })
        }
      })

      window.message.success(
        `Set status ${statusRef.value} for ${totalText.value} placements successfully`
      )

      isSubmitting.value = false
      templateV2Store.itemSelectedV2 = []
      templateV2Store.isSelectAll = false

      // templateV2Store.reInitTable()
    }
  } finally {
    isSubmitting.value = false
  }
}

const refetchMoreInfo = async () => {
  const result = await general.fetchTable(
    templateV2Store.baseConfigs.AjaxAPI(),
    payloadV2.value
  )

  const dataNew = result.data || {}
  templateV2Store.baseConfigs.moreInfo?.forEach(
    ({ key }) => (templateV2Store.rawDataV2[key] = dataNew[key])
  )
}

//Làm tạm, chưa tối ưu
const payloadV2 = computed(() => {
  let rawFilterList = helper.clone(templateV2Store.filterList) || {}

  if (templateV2Store.datePicker.isMultiMonth) {
    rawFilterList['start_month'] = rawFilterList['start_month'].substring(0, 7)
    rawFilterList['end_month'] = rawFilterList['end_month'].substring(0, 7)
  }

  if (
    templateV2Store.datePicker.isSingleMonth &&
    templateV2Store.filterConfigs.datePickerMonth
  ) {
    try {
      rawFilterList['month'] = rawFilterList['month'].substring(0, 7)
    } catch (error) {
      console.error(error)
    }
  }

  if (templateV2Store.viewModelNow) {
    rawFilterList['filter_by'] = templateV2Store.viewModelNow
  }

  let pl: {
    filter: any
    search?: string
    page?: number
    size?: number
    sort?: object
    group_by?: string[]
    columns?: string[]
    [key: string]: any
  } = {
    filter: rawFilterList,
  }

  if (templateV2Store.baseConfigs.ServerSide()) {
    pl.page = templateV2Store.pageNow
    pl.size = templateV2Store.pageSizeNow
  }

  if (templateV2Store.baseConfigs.searchInFilter) {
    pl.filter.search = templateV2Store.search.trim()
  } else {
    pl.search = templateV2Store.search.trim()
  }

  if (templateV2Store.sortInfoV2.sortNow) {
    pl.sort = templateV2Store.sortInfoV2.sortNow
  }

  return pl
})

const preSubmit = (status: STATUS_GG) => {
  statusRef.value = status
  submitStatus()
}

const statusOptions = ref<SelectOption[]>([
  {
    label: 'Unknow',
    value: STATUS_GG.UNKNOW,
  },
  {
    label: 'Whitelist',
    value: STATUS_GG.WHITE_LIST,
    type: 'success',
  },
  {
    label: 'Blacklist',
    value: STATUS_GG.BLACK_LIST,
    type: 'error',
  },
])

const tagType = (item: any) => {
  return (item.type as TType) || null
}
</script>

<template>
  <n-button
    v-for="item in statusOptions"
    :key="item.value"
    size="small"
    class="shadow-lg"
    :loading="isSubmitting"
    @click="preSubmit(item.value as STATUS_GG)"
    :type="tagType(item)"
  >
    {{ item.label }}
  </n-button>
</template>
