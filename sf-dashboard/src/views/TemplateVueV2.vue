<script setup lang="ts">
import { ReportManagerCenter } from '@/types/components/report-v2'
import storage from '@/plugins/storage'
import { useTemplateV2 } from '@/store/templateV2Store'
import { SortTable } from '@/types/state/template-v2'
import { syncColDimensions } from '@/components/template-v2/helper'

import TableComp from '@/components/template-v2/TableComp.vue'
import GroupFilter from '@/components/template-v2/filter/GroupFilter.vue'

//Sử dụng import thông thường để các date picker có thể watch của plk
import CampaignsGroupBy from '@/components/template-v2/CampaignsGroupBy.vue'
import GroupTabDate from '@/components/template-v2/date/GroupTabDate.vue'
import SkeletonTop from '@/components/template-v2/skeleton/SkeletonTop.vue'

//Sử dụng import thông thường để có thể watch plk xong mới init custom filters
import CustomFilter from '@/components/template-v2/filter/CustomFilter.vue'

import ColumnSettings from '@/components/template-v2/ColumnSettings.vue'
import date2 from '@/utils/date2'
import { FilterItem } from '@/types/state/template'
import { ctr_payload_key } from '@/services/ctr_payload_key'
import { ctr_table_settings } from '@/services/ctr_table_settings'
import ColumnAsync from '@/components/template-v2/ColumnAsync.vue'
import ProfileView from '@/components/template-v2/ProfileView.vue'
import ModalCopyCampaignV2 from '@/components/campaign/modal/ModalCopyCampaignV2.vue'

// Async components
const AccountsGroupBy = defineAsyncComponent(
  () => import('@/components/template-v2/AccountsGroupBy.vue')
)

const GroupByDimension = defineAsyncComponent(
  () => import('@/components/template-v2/GroupByDimension.vue')
)

const DuplicateChangeCampaignType = defineAsyncComponent(
  () => import('@/components/campaign/modal/DuplicateChangeCampaignType.vue')
)

const ModalWrapper = defineAsyncComponent(
  () => import('@/components/template-v2/modal/ModalWrapper.vue')
)

const Preload = defineAsyncComponent(
  () => import('@/components/template-v2/preload/Preload.vue')
)

const LazyLoad = defineAsyncComponent(
  () => import('@/components/template-v2/lazy/LazyLoad.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()

onBeforeMount(() => {
  storage.clearOldStorage()
})

const reportManager = ref(new ReportManagerCenter())

const loadingFilters = ref<boolean>(false)

const fixedFilters = computed(() => {
  const fixedFilters: { [key: string]: any } = {}
  templateV2Store.filterConfigs.filters?.forEach((element) => {
    if (window.route.query[element.key]) {
      let valueNow = window.route.query[element.key] as any

      if (element.type === 'number') {
        valueNow = Number(valueNow)
        if (isNaN(valueNow)) {
          return
        }
      }
      if (element.multiple) {
        fixedFilters[element.key] = [valueNow]
      } else {
        fixedFilters[element.key] = valueNow
      }
    }
  })

  return fixedFilters
})

const handleRefresh = () => {
  templateV2Store.reInitTable()
}

const handlePlkTemplate_ = async () => {
  let plk = window.route.query.plk as string

  let dataSave = await ctr_payload_key.Key({ params: { q: plk } })
  if (!dataSave?.status || !dataSave.data) return

  // Clear PLK not accepted due to incorrect path
  if (templateV2Store.baseConfigs.ajax !== dataSave?.data?.path) return

  if (templateV2Store.filterConfigs.filters?.length) {
    let propNow
    if (dataSave.data?.hasOwnProperty('Filter')) {
      propNow = 'Filter'
    }

    if (dataSave.data?.hasOwnProperty('filter')) {
      propNow = 'filter'
    }

    if (propNow) {
      const plkRawData = dataSave.data[propNow]

      //Clone ra tránh memory leak
      const filterAccepts = helper.clone(
        templateV2Store.filterConfigs.filters
      ) as FilterItem[]

      const acceptPlkData: Record<string, any> = {}

      filterAccepts.forEach((element) => {
        if (plkRawData[element.key]) {
          if (element.multiple) {
            if (Array.isArray(plkRawData[element.key])) {
              acceptPlkData[element.key] = plkRawData[element.key]
              return
            }
            acceptPlkData[element.key] = []
            return
          }

          if (Array.isArray(plkRawData[element.key])) {
            acceptPlkData[element.key] = null
            return
          }

          acceptPlkData[element.key] = plkRawData[element.key]
          return
        }

        if (element.multiple) {
          acceptPlkData[element.key] = []
          return
        }
        acceptPlkData[element.key] = null
      })

      if (acceptPlkData) {
        if (fixedFilters.value) {
          for (const key in fixedFilters.value) {
            if (Object.prototype.hasOwnProperty.call(fixedFilters.value, key)) {
              dataSave.data[propNow][key] = fixedFilters.value[key]
            }
          }
        }
        const queryStartDate = window.route.query['start_date']
        const queryEndDate = window.route.query['end_date']
        if (queryStartDate && queryEndDate) {
          dataSave.data[propNow]['start_date'] = queryStartDate
          dataSave.data[propNow]['end_date'] = queryEndDate
        }

        if (dataSave.data[propNow]['month']) {
          dataSave.data[propNow]['month'] += '-01'
        }

        if (
          dataSave.data[propNow]['start_month'] &&
          dataSave.data[propNow]['end_month']
        ) {
          dataSave.data[propNow]['start_month'] += '-01'
          dataSave.data[propNow]['end_month'] += '-01'
        }

        // Must wait for filters to initialize before selecting data from the filter list
        // If later it turns out that selecting can be done without waiting for initFilters, remove await to improve performance
        await initFilters(dataSave.data[propNow])
        reportManager.value.alreadyInitFilters = true

        for (const key in acceptPlkData) {
          if (
            Object.prototype.hasOwnProperty.call(dataSave.data[propNow], key)
          ) {
            if (!acceptPlkData[key]) {
              acceptPlkData[key] = null
            }
          }
        }

        try {
          for (const key in acceptPlkData) {
            if (Object.prototype.hasOwnProperty.call(acceptPlkData, key)) {
              const element = acceptPlkData[key]

              templateV2Store.filterList[key] = element
            }
          }
        } catch (error) {
          console.error(error)
        }

        // Use a separate variable to watch changes from PLK's date picker
        // Do not watch the date in the filter list to avoid circular watch loops
        templateV2Store.plkInfo = helper.clone(dataSave.data[propNow])
      }

      if (templateV2Store.baseConfigs.searchInFilter) {
        if (dataSave.data[propNow] && dataSave.data[propNow].search) {
          templateV2Store.search = helper.clone(
            dataSave.data[propNow].search
          ) as string
        }
      } else {
        if (dataSave.data.search) {
          templateV2Store.search = helper.clone(dataSave.data.search) as string
        }
      }
    }
  }

  // //Chưa xử lí lưu date

  //Fix tạm page này, chưa xử lí hết các page khác
  if (templateV2Store.baseConfigs.colV2 === 'final-report_ht7') {
    if (
      dataSave.data['filter']['start_month'] &&
      dataSave.data['filter']['end_month']
    ) {
      templateV2Store.filterList['start_month'] =
        dataSave.data['filter']['start_month']

      templateV2Store.filterList['end_month'] =
        dataSave.data['filter']['end_month']
    }
  }

  // //chưa xử lí lưu sort
  if (dataSave.data?.hasOwnProperty('sort')) {
    if (dataSave.data.sort) {
      try {
        const sortNow = dataSave.data.sort[0]
        if (templateV2Store.columnsAccept?.includes(sortNow.field)) {
          templateV2Store.sortInfoV2 = new SortTable(
            helper.clone(dataSave.data.sort[0])
          )
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  // if (dataSave.data?.hasOwnProperty('size')) {
  //   templateV2Store.pageSizeNow = dataSave.data.size
  // }

  if (
    (templateV2Store.baseConfigs.tabInfo?.length ||
      templateV2Store.groupBy?.length) &&
    dataSave.data?.hasOwnProperty('group_by')
  ) {
    //Chưa xử lí validate rõ ràng đoạn này
    const groupByNow = dataSave.data.group_by
      ? helper.clone(dataSave.data.group_by)
      : []

    templateV2Store.groupByV2 = groupByNow

    if (groupByNow.length && templateV2Store.groupBy?.length) {
      syncColDimensions(groupByNow, templateV2Store.groupBy)
    }
  }

  if (dataSave.data?.hasOwnProperty('customFilter')) {
    reportManager.value.plkCustomFilterData = dataSave.data?.customFilter
  }
}

const initFixedFilters_ = async () => {
  const queryStartDate = window.route.query['start_date']
  const queryEndDate = window.route.query['end_date']

  const searchQuery = window.route.query['search']
  if (searchQuery) {
    templateV2Store.search = searchQuery as string
  }

  if (fixedFilters.value && Object.keys(fixedFilters.value).length) {
    await initFilters(fixedFilters.value)
    reportManager.value.alreadyInitFilters = true

    let filterListNow = helper.clone(fixedFilters.value)
    if (queryStartDate && queryEndDate) {
      filterListNow['start_date'] = queryStartDate
      filterListNow['end_date'] = queryEndDate
    } else {
      if (window.route?.query?.time === 'all') {
        filterListNow['start_date'] = date2.allTime()
        filterListNow['end_date'] = date2.today()
      }
    }

    templateV2Store.filterList = filterListNow
  }

  if (templateV2Store.groupBy?.length) {
    const result = await ctr_table_settings.Get({
      router: window.location.pathname,
      type: 'group',
    })

    let oldDataGroups = result?.data?.columns || {}
    try {
      oldDataGroups = JSON.parse(oldDataGroups)
    } catch (error) {
      console.error(error)

      oldDataGroups = {}
    }

    try {
      if (oldDataGroups && !helper.isEmpty(oldDataGroups)) {
        let dataToSave: string[] = []

        templateV2Store.groupBy.forEach((element) => {
          if (oldDataGroups.hasOwnProperty(element.field as string)) {
            if (oldDataGroups[element.field as string]) {
              dataToSave.push(element.field as string)
            }
          } else {
            if (!element.defaultOff) {
              dataToSave.push(element.field as string)
            }
          }
        })

        templateV2Store.groupByV2 = dataToSave
      }
    } catch (error) {
      console.error(error)
    }
  }
}

onUnmounted(() => {
  templateV2Store.stopWatch?.()
})

const init = async () => {
  templateV2Store.fetchPermissionAsyncConfigs()
  await Promise.all([
    templateV2Store.fetchPermissionConfigs(),
    templateV2Store.fetchPermissionFilters(),
    templateV2Store.fetchPermissionColumns(),
  ])

  if (templateV2Store.columnConfigs.columns?.length) {
    await templateV2Store.fetchChooseCols()
  }

  if (
    !Object.keys(window.route.query).length && // không có query param hiện tại
    templateV2Store.baseConfigs.queryDefault
  ) {
    for (const key in templateV2Store.baseConfigs.queryDefault) {
      if (
        Object.prototype.hasOwnProperty.call(
          templateV2Store.baseConfigs.queryDefault,
          key
        )
      ) {
        const val = templateV2Store.baseConfigs.queryDefault[key].number
          ? Number(templateV2Store.baseConfigs.queryDefault[key].value)
          : templateV2Store.baseConfigs.queryDefault[key].value
        if (templateV2Store.baseConfigs.queryDefault[key].multiple) {
          templateV2Store.filterList[key] = [val]
        } else {
          templateV2Store.filterList[key] = val
        }
      }
    }
  }

  templateV2Store.prefetchAfterRun()

  // await initFilters();

  reportManager.value.alreadyInitFilters = false

  //fetch filter if have plk
  if (templateV2Store.baseConfigs.hasPayloadKey && window.route.query?.plk) {
    await handlePlkTemplate_()
  } else {
    await initFixedFilters_()
  }

  if (!reportManager.value.alreadyInitFilters) {
    initFilters()
  }

  await helper.sleep(0) //Đợi các div render xong -> cột, group by ... mới chuẩn

  //đoạn này chưa chuẩn chưa lưu đc custom filter -> sẽ fix trong ver mới
  reportManager.value.initCustomFilters()
  templateV2Store.reInitTable()
}

onMounted(async () => {
  init()
})

const filterListFString = (filterListValue: any, key: string) => {
  if (helper.isEmpty(filterListValue)) return ''

  if (!filterListValue[key]) return ''

  if (Array.isArray(filterListValue[key])) {
    return filterListValue[key].join(',')
  }
  return String(filterListValue[key])
}

const initFilters = async (filterListValue: any = {}) => {
  loadingFilters.value = true
  let ajaxList = [] as Promise<any>[]

  templateV2Store.filterConfigs.filters?.forEach((element: FilterItem) => {
    //Nếu là clientFilter thì lấy tất ko chỉ lấy mỗi id select
    const filterInStore = templateV2Store.filterList[element.key]

    let f = element.clientFilter
      ? ''
      : filterListFString(filterListValue, element.key)

    //QueryDefault xử lí trường hợp này
    if (!f && filterInStore)
      f = Array.isArray(filterInStore) ? filterInStore.join(',') : filterInStore
    ajaxList.push(
      templateV2Store.getFilterOptions(element, {
        first: true,
        f: f,
      })
    )
  })

  if (ajaxList.length) {
    await Promise.all(ajaxList)
  }
  loadingFilters.value = false
}
</script>
<template>
  <div class="wrapper flex flex-col px-3 flex-1 mt-4 custom-bg-main-dark-mode">
    <SkeletonTop v-if="!templateV2Store.prefetchDone" />

    <div class="main-wrapper" v-else>
      <AccountsGroupBy
        v-if="templateV2Store.baseConfigs.IsButtonAddAccount()"
      />
      <CampaignsGroupBy
        v-else-if="templateV2Store.baseConfigs.IsButtonAddCamp()"
      />

      <GroupTabDate v-else />
      <GroupFilter
        @handle-refresh="handleRefresh"
        :loadingFilters="loadingFilters"
        v-if="templateV2Store.isHasBoxFilter"
      />
      <GroupByDimension v-if="templateV2Store.groupBy.length" />
      <CustomFilter :reportManager="reportManager" />
      <ProfileView v-if="templateV2Store.baseConfigs.allowViewTemplate" />
      <ColumnSettings />
    </div>

    <ModalCopyCampaignV2 v-if="templateV2Store.baseConfigs.IsButtonAddCamp()" />
    <DuplicateChangeCampaignType
      v-if="templateV2Store.baseConfigs.IsButtonAddCamp()"
    />

    <ColumnAsync v-if="!templateV2Store.loadingColumns" />

    <TableComp />

    <Preload v-if="templateV2Store.baseConfigs.HasPreload()" />
    <LazyLoad v-if="templateV2Store.baseConfigs.lazyLoadV2" />

    <ModalWrapper v-if="templateV2Store.baseConfigs.HasModal()" />
  </div>
</template>
