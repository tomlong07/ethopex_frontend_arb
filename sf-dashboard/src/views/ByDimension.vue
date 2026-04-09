<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { AxiosRequestConfig } from 'axios'

import { ByDimensionSettings, FilterType } from '@/types/components/types'

import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import OrderBy from '@/components/by_dimension/OrderBy.vue'
import TopDimension from '@/components/by_dimension/TopDimension.vue'

import DropCustom from '@/components/common/DropCustom.vue'
import GroupMetrics from '@/components/common/GroupMetrics.vue'
import MultiChart from '@/components/common/MultiChart.vue'
import TimeZoneComp from '@/components/common/TimeZoneComp.vue'
import DateRanger from '@/components/common/DateRanger.vue'

import useByDimensionStore from '@/store/useByDimensionStore'
import { debounceV2 } from '@/utils'
import { ctr_by_dimension } from '@/services/ctr_by_dimension'
import { general } from '@/services/general'
import { TIME_OUT_SEARCH } from '@/constants/app'

const multiChart = ref<InstanceType<typeof MultiChart>>()

const dropCustomRefs = ref<InstanceType<typeof DropCustom>[]>([])
const dropCustomTimeOut = ref<Array<ReturnType<typeof setTimeout> | null>>([])

const byDimensionStore = useByDimensionStore()

const settings = computed<ByDimensionSettings>(() => byDimensionStore.settings)
const isLoading = ref<boolean>(true)

const dateValue = computed(() => byDimensionStore.dateValue)

const timeZoneValue = computed(() => byDimensionStore.timeZoneValue)
const intervalValue = computed(() => byDimensionStore.intervalValue)
const selectOptions = computed(() => byDimensionStore.selectOptions)
const selectDropList = computed(() => byDimensionStore.selectDropList)
const selectDropTitle = computed(() => byDimensionStore.selectDropTitle)
const dimensionForShow = computed(() => byDimensionStore.dimensionForShow)
const loadData = async () => {
  //Wait  for all components to be mounted
  await helper.sleep(0)

  ajaxSelectHandle()

  byDimensionStore.changeDimensionTemp([byDimensionStore.dimensionValue[0]])

  getReports()
}

const isHasAjax = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].ajax)
}

const isRemote = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].remote)
}

const isMultiple = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].multiple)
}

const ajaxSelectHandle = async () => {
  let ajaxList = [] as Promise<void>[]

  for (let index = 0; index < selectList.value.length; index++) {
    const item = selectList.value[index]

    if (!isHasAjax(item)) {
      continue
    }

    ajaxList.push(
      newAjaxFilter({ item: item, index: index, loading: true, first: true })
    )
  }

  await Promise.all(ajaxList)

  for (let index = 0; index < selectList.value.length; index++) {
    dropCustomTimeOut.value.push(null)
  }
}

const newAjaxFilter = async (options: FilterType) => {
  const element = ajaxObject.value[options.item]
  const opts: AxiosRequestConfig = {
    url: element.ajax,
    method: element.method || 'GET',
  }

  opts.params = {}
  if (options.q) {
    opts.params.q = options.q
  }

  if (
    element.remote &&
    selectDropList.value[options.item] &&
    selectDropList.value[options.item].length > 0
  ) {
    opts.params.f = selectDropList.value[options.item].join(',')
  }

  if (element.remote && options.first) {
    opts.params.fi = '1'
  }

  if (options.loadingSearch) {
    dropCustomRefs.value[options.index].changeLoadingSearch(true)
  }

  const result = await general.fetchDataByOpts(opts)

  let data = []
  if (result?.status && result?.data) {
    data = result?.data
  }

  byDimensionStore.changeOptionsByKey(options.item, data)

  if (options.loading) {
    if (dropCustomRefs.value[options.index]) {
      dropCustomRefs.value[options.index].changeLoading(false)
    }
  }

  if (options.loadingSearch) {
    dropCustomRefs.value[options.index].changeLoadingSearch(false)
  }
}

const updateReports = () => {
  getReports()
}

const getReports = () => {
  byDimensionStore.changeDimension([byDimensionStore.dimensionValueTemp[0]])

  multiChart?.value?.fetchReport()
}

onMounted(async () => {
  isLoading.value = true

  await Promise.all([loadSettings(), byDimensionStore.loadOrderOptions()])

  byDimensionStore.repairAfterSettings()
  afterLoadProcess()

  isLoading.value = false

  await loadData()

  document.addEventListener('click', handleClickTitle)
})

const afterLoadProcess = () => {
  try {
    let isValidInterval = false

    //validate interval
    if (intervalValue.value) {
      if (settings.value.settingTop?.interval) {
        for (
          let index = 0;
          index < settings.value.settingTop?.interval.length;
          index++
        ) {
          const element = settings.value.settingTop?.interval[index]
          if (element.id === intervalValue.value) {
            isValidInterval = true
            break
          }
        }
      }
    }

    if (!isValidInterval) {
      if (intervalValue.value) {
        window.message.info('Interval is not valid. It will reset to default.')
      }

      try {
        if (settings.value.settingTop?.interval) {
          for (
            let index = 0;
            index < settings.value?.settingTop?.interval?.length;
            index++
          ) {
            if (settings.value?.settingTop?.interval[index].default) {
              byDimensionStore.changeInterval(
                settings.value.settingTop?.interval[index].id
              )
              break
            }
          }
        }
      } catch (error) {
        console.error(error)

        byDimensionStore.changeInterval('')
      }
    }
  } catch {}
}

const handleClickTitle = (e: MouseEvent) => {
  const targetElement = e.target as HTMLElement
  if (targetElement?.classList.contains('highcharts-title')) {
    helper.copyText(targetElement.innerHTML)
    window.message.success('Copied!')
  }
}

onUnmounted(() => {
  document.removeEventListener('click', handleClickTitle)
  dropCustomTimeOut.value.forEach((timeout) => {
    if (timeout) clearTimeout(timeout)
  })
})

const loadSettings = async () => {
  const result = await ctr_by_dimension.GetSetting()
  if (result?.status) {
    byDimensionStore.changeSettings(result.data as ByDimensionSettings)
  }
}

const isDateDefault = computed<boolean>(() => {
  return settings.value.settingTop?.date === 'default'
})

const isHasTimeZone = computed<boolean>(() => {
  return !!settings.value.settingTop?.timeZone || false
})

const isHasInterval = computed<boolean>(() => {
  return (
    !!settings.value.settingTop?.interval &&
    settings.value.settingTop?.interval.length > 0
  )
})

const hasSettingTop = computed<boolean>(() => {
  return (
    !!settings.value.settingTop && !helper.isEmpty(settings.value.settingTop)
  )
})

const hasSettingSelect = computed<boolean>(() => {
  return (
    !!settings.value.settingSelect &&
    !helper.isEmpty(settings.value.settingSelect)
  )
})

const selectList = computed(() => byDimensionStore.selectList)
const ajaxObject = computed(() => byDimensionStore.ajaxObject)

const groupList = computed<string[]>(() => {
  return settings.value.settingSelect?.dimensions || []
})

const dimensionOptions = computed<SelectOption[]>(() => {
  if (
    !byDimensionStore.dimensionValue ||
    !byDimensionStore.dimensionValue.length ||
    !groupList.value ||
    !groupList.value.length
  ) {
    return []
  }

  let list: SelectOption[] = []
  groupList.value.forEach((element) => {
    list.push({
      label: (byDimensionStore.valueById(element, 'name') as string) || '',
      value: element,
    })
  })

  helper.sortByProp(list, 'label')

  return list
})

const updateDate = (value: string[]) => {
  if (!Array.isArray(value) || value.length !== 2) {
    console.error('Invalid date value:', value)
    return
  }
  byDimensionStore.changeDateValue(value)
}

const updateTimeZone = (value: string) => {
  byDimensionStore.changeTimeZone(value)
}

const updateTimeZoneDefault = async () => {
  byDimensionStore.changeTimeZoneDefault()
  await helper.sleep(1000)
  updateReports()
}

const updateInterval = (value: string) => {
  byDimensionStore.changeInterval(value)
}

const clearDropListAndStore = (value: string, newValue: any = null) => {
  const clearValue = newValue ? newValue : isMultiple(value) ? [] : ''

  //clear in store
  byDimensionStore.changeSelectDropListByKey(value, clearValue)

  //clear in dropCustom
  for (let index = 0; index < dropCustomRefs.value.length; index++) {
    const element = dropCustomRefs.value[index]
    if (element.getRawKey() == value) {
      element.changeValueNow(clearValue)
    }
  }
}

const updateDimension = (value: string) => {
  byDimensionStore.changeDimensionTemp([value])
  byDimensionStore.changeTitleDropList(value)

  //Auto select các metric đc set là tự động chọn
  try {
    if (
      byDimensionStore.metricsByDimension &&
      byDimensionStore.metricsByDimension[value] &&
      byDimensionStore.metricsByDimension[value].auto
    ) {
      byDimensionStore.changeMetrics(
        byDimensionStore.metricsByDimension[value].auto
      )
    }
  } catch (error) {
    console.error(error)
  }

  //chọn metric rpc, chọn interval DAY và xóa hết select list nếu là keyword
  if (byDimensionStore.thisDimensionSettings?.fixedInterval) {
    byDimensionStore.intervalValue =
      byDimensionStore.thisDimensionSettings?.fixedInterval
  }

  byDimensionStore.clearSelectDropList()

  //Nếu ko có trong filter cho phép thì clear bỏ giá trị
  if (byDimensionStore.thisDimensionSettings?.filter) {
    //2 giá trị kia luôn clear ở dưới rồi
    //các giá trị có trong filter thì ko clear
    selectList.value?.forEach((element) => {
      if (
        [value, dimensionForShow.value].includes(element) ||
        byDimensionStore.thisDimensionSettings?.filter?.includes(element)
      ) {
        return
      }

      clearDropListAndStore(element)
    })
  }

  byDimensionStore.repairOrderBy()
  byDimensionStore.repairTopBy()

  clearDropListAndStore(value) //clear droplist ở dimension mới
  clearDropListAndStore(dimensionForShow.value) //clear droplist ở dimension cũ
}

const debouncedSearch = debounceV2(
  async (q: string, item: string, index: number) => {
    await newAjaxFilter({
      item,
      index,
      q,
      loadingSearch: true,
    })
  },
  TIME_OUT_SEARCH
)

const handleSearch = (q: string, item: string, index: number) => {
  if (!isRemote(item)) return
  debouncedSearch(q, item, index)
}

const updateSelectDropList = (item: string, value: any) => {
  byDimensionStore.changeSelectDropListByKey(item, value)
}
</script>

<template>
  <div class="wrapper flex flex-col px-3 flex-1 pb-12 mt-4 rounded-lg">
    <div v-show="isLoading">
      <Skeleton />
    </div>
    <div v-if="!isLoading">
      <div class="rounded-lg mb-3 border">
        <div
          class="flex justify-between relative bg-gray-100 items-center gap-1 flex-wrap rounded-t-lg"
        >
          <div class="flex">
            <div
              class="group-btn p-2 flex justify-start mx-2 gap-2 flex-wrap items-center"
              v-if="hasSettingTop"
            >
              <DateRanger
                v-if="isDateDefault"
                :status="{ isFetching: false }"
                @updateDate="updateDate"
                :defaultDate="dateValue"
                :timezone="timeZoneValue"
                :smallPicker="true"
              />

              <div v-if="isHasInterval">
                <DropCustom
                  title="Interval"
                  :defaultValue="byDimensionStore.fixedInterval"
                  :valueOptions="settings.settingTop?.interval || []"
                  valueField="id"
                  labelField="name"
                  :disabled="true"
                  class="w-24"
                  size="small"
                  :isSmall="true"
                  @updateValue="updateInterval"
                  v-if="byDimensionStore.fixedInterval"
                />
                <DropCustom
                  title="Interval"
                  :defaultValue="intervalValue"
                  :valueOptions="settings.settingTop?.interval || []"
                  valueField="id"
                  labelField="name"
                  class="w-24"
                  size="small"
                  :isSmall="true"
                  @updateValue="updateInterval"
                  v-else
                />
              </div>
              <TimeZoneComp
                v-if="isHasTimeZone"
                :loadInit="true"
                :defaultValue="timeZoneValue"
                size="small"
                class="w-52"
                @updateValue="updateTimeZone"
                @resetTzDefault="updateTimeZoneDefault"
              />
            </div>
          </div>
          <n-button
            size="small"
            color="#f43f5e"
            type="success"
            @click="updateReports"
            class="m-4 w-16"
          >
            Update
          </n-button>
        </div>
        <hr />
        <div
          class="flex justify-between relative bg-gray-100 items-center gap-1"
          v-if="hasSettingSelect"
        >
          <div class="flex">
            <div class="group-btn p-2 flex justify-start mx-2 gap-2 flex-wrap">
              <DropCustom
                ref="dropCustomRefs"
                :name="byDimensionStore.valueById(item, 'name') as string || ''"
                :title="selectDropTitle[item]"
                :defaultValue="selectDropList[item]"
                :valueOptions="selectOptions[item] || []"
                v-for="(item, index) in selectList"
                v-memo="[
                  item,
                  selectDropList[item],
                  selectOptions[item],
                  byDimensionStore.filterIsDisabled(item),
                ]"
                :key="item"
                size="small"
                class="w-40"
                :isAjax="isHasAjax(item)"
                :remote="isRemote(item)"
                :multiple="isMultiple(item)"
                :clearable="true"
                :disabled="byDimensionStore.filterIsDisabled(item)"
                :rawKey="item"
                @updateValue="(value:any) => updateSelectDropList(item, value)"
                @handleSearch="(q:string) => handleSearch(q, item, index)"
              />
            </div>
          </div>
          <div class="ml-auto flex gap-2 mr-4">
            <TopDimension />
            <OrderBy v-if="!byDimensionStore.isOffOrder" />
            <DropCustom
              v-if="
                byDimensionStore.dimensionValue &&
                byDimensionStore.dimensionValue.length > 0
              "
              class="w-32"
              name="Dimension"
              size="small"
              title="Select Dimension"
              :defaultValue="byDimensionStore.dimensionValue[0]"
              :valueOptions="dimensionOptions"
              @updateValue="updateDimension"
            />
          </div>
        </div>
        <hr />
        <GroupMetrics />
      </div>
      <MultiChart ref="multiChart" />
    </div>
  </div>
</template>
