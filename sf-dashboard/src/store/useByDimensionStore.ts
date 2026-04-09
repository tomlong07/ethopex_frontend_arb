import { defineStore } from 'pinia'
import date2 from '@/utils/date2'
import {
  ByDimensionSettings,
  DimensionMetricSettings,
  InfoData,
  PayloadDimension,
} from '@/types/components/types'
import { SelectOption } from 'naive-ui'
import { ctr_by_dimension } from '@/services/ctr_by_dimension'

const defaultDate = computed(() => {
  return [date2.last7Days(), date2.yesterday()]
})

export default defineStore('useByDimensionStore', () => {
  const oldParams: { [key: string]: any } = helper.getQueryParams(
    window.location?.href || location?.href || {}
  )

  let oldDate: string[] = []

  if (
    oldParams.startDate &&
    oldParams.endDate &&
    helper.isValidDateString(oldParams.startDate) &&
    helper.isValidDateString(oldParams.endDate)
  ) {
    oldDate = [oldParams.startDate, oldParams.endDate]
  }

  let oldDimensions = []
  try {
    oldDimensions = oldParams.dimensions ? oldParams.dimensions.split(',') : []
    if (oldDimensions.length > 1) {
      //Dimension chỉ lấy 1
      oldDimensions = oldDimensions.slice(0, 1)
    }
  } catch (error) {
    console.error(error)
  }

  let oldMetrics = []
  try {
    oldMetrics = oldParams.metrics ? oldParams.metrics.split(',') : []
  } catch {}

  const dateValue = ref<string[]>(oldDate.length ? oldDate : defaultDate.value)
  const settings = ref<ByDimensionSettings>({})
  const timeZoneValue = ref<string>(oldParams.timeZone || '')
  const intervalValue = ref<string>(oldParams.interval || '')
  const topValue = ref<number>(Number(oldParams.top) || 20)
  const orderBy = ref<string>(oldParams.orderBy || 'revenue')
  const metricsValue = ref<string[]>(oldMetrics)
  const dimensionValue = ref<string[]>(oldDimensions)
  const dimensionValueTemp = ref<string[]>(oldDimensions)
  const selectOptions = ref<{ [key: string]: SelectOption[] }>({})
  const selectDropList = ref<{ [key: string]: any }>({})
  const selectDropTitle = ref<{ [key: string]: string }>({})
  const orderOptions = ref<SelectOption[]>([])
  const resetOrderBySignal = ref<string>('')

  const isDayInterval = computed<boolean>(() => {
    return intervalValue.value === 'DAY'
  })

  const selectList = computed<string[]>(() => {
    return settings.value.settingSelect?.selects || []
  })

  const metricsByDimension = computed<{
    [key: string]: DimensionMetricSettings
  }>(() => {
    return settings.value.settingSelect?.metricsByDimension || {}
  })

  const thisDimensionSettings = computed(() => {
    return metricsByDimension.value[dimensionForShowTemp.value]
  })

  const metricList = computed<string[]>(() => {
    return settings.value.settingMetric?.metrics || []
  })

  const dimensionForShow = computed<string>(() => {
    if (!dimensionValue.value || !dimensionValue.value.length) {
      return ''
    }

    return dimensionValue.value[0]
  })

  const dimensionForShowTemp = computed<string>(() => {
    if (!dimensionValueTemp.value || !dimensionValueTemp.value.length) {
      return ''
    }

    return dimensionValueTemp.value[0]
  })

  const isCampaignDimension = computed(
    () => dimensionForShowTemp.value === 'campaign'
  )

  const fixedInterval = computed(
    () => thisDimensionSettings.value?.fixedInterval
  )

  const defaultOrderBy = computed(
    () => thisDimensionSettings.value?.defaultOrderBy
  )
  const isOffOrder = computed(() => thisDimensionSettings.value?.offOrder)
  const fixedTop = computed(() => thisDimensionSettings.value?.fixedTop)
  const fixedOrder = computed(() => thisDimensionSettings.value?.fixedOrder)

  const isErrorDimension = computed(
    () => dimensionForShowTemp.value === 'error_type'
  )

  const infoData = computed(() => {
    return settings.value.info || []
  })

  const ajaxObject = computed(() => {
    let objectTemp: { [key: string]: InfoData } = {}

    selectList.value.forEach((element) => {
      for (let index = 0; index < infoData.value.length; index++) {
        const e = infoData.value[index]
        if (e.id == element) {
          objectTemp[element] = e
        }
      }
    })

    return objectTemp
  })

  const objectSettings = computed(() => {
    const objectTemp: { [key: string]: InfoData } = {}

    for (let index = 0; index < infoData.value.length; index++) {
      objectTemp[infoData.value[index].id] = infoData.value[index]
    }

    return objectTemp
  })

  const payload = computed<PayloadDimension>(() => {
    return {
      startDate: dateValue.value[0],
      endDate: dateValue.value[1],
      interval:
        thisDimensionSettings.value?.fixedInterval ?? intervalValue.value,
      timeZone: timeZoneValue.value,
      metrics: metricsValue.value,
      dimensions: dimensionValue.value,
      selects: selectDropList.value,
      top: thisDimensionSettings.value?.fixedTop ?? topValue.value,
      orderBy: thisDimensionSettings.value?.offOrder
        ? undefined
        : orderBy.value,
    }
  })

  const changeDateValue = (dateVal: string[]) => {
    dateValue.value = dateVal
  }

  const changeSettings = (value: ByDimensionSettings) => {
    settings.value = value
  }

  const repairAfterSettings = () => {
    if (!settings.value) return

    if (!timeZoneValue.value) changeTimeZoneDefault()

    //Validate metrics
    if (metricsValue.value.length) {
      metricsValue.value = metricsValue.value.filter(function (item) {
        return settings.value.settingMetric?.metrics?.includes(item)
      })
    }

    if (!metricsValue.value.length) {
      if (settings.value.settingMetric?.defaultMetrics) {
        changeMetrics(settings.value.settingMetric.defaultMetrics)
      }
    }

    //Validate dimensions
    if (dimensionValue.value.length) {
      dimensionValue.value = dimensionValue.value.filter(function (item) {
        return settings.value.settingSelect?.dimensions?.includes(item)
      })
    }

    if (!dimensionValue.value.length) {
      if (settings.value.settingSelect?.defaultDimension) {
        changeDimension([settings.value.settingSelect.defaultDimension])
      }
    }

    selectList.value.forEach((element) => {
      if (element == dimensionForShow.value && ajaxObject.value[element].top) {
        selectDropTitle.value[element] = `Top ${ajaxObject.value[element].top}`
      } else {
        selectDropTitle.value[element] = 'All'
      }

      if (ajaxObject.value[element].multiple) {
        selectDropList.value[element] = []

        if (oldParams[element]) {
          try {
            if (ajaxObject.value[element].isNumber) {
              selectDropList.value[element] = oldParams[element]
                .split(',')
                .map(function (str: string) {
                  // Kiểm tra xem chuỗi có phải là số không trước khi chuyển đổi
                  var num = parseInt(str, 10)
                  if (!isNaN(num)) {
                    // Kiểm tra xem có phải là số không
                    return num // Trả về số nếu là số
                  } else {
                    return str // Trả về chính chuỗi nếu không phải số
                  }
                })
                .filter(function (item: any) {
                  return typeof item === 'number' // Lọc ra chỉ những giá trị là số
                })
            } else {
              selectDropList.value[element] = oldParams[element].split(',')
            }
          } catch (error) {
            console.error(error)
          }
        }
      } else {
        selectDropList.value[element] = ''
        if (oldParams[element]) {
          selectDropList.value[element] = oldParams[element]
        }
      }
    })

    if (thisDimensionSettings.value?.show?.length) {
      //Nếu có các giá trị chỉ đc phép show thì lọc bỏ các giá trị ko có trong show
      metricsValue.value = metricsValue.value.filter((m) =>
        thisDimensionSettings.value.show?.includes(m)
      )
    }

    //Xử lí clear bỏ các giá trị ko có trong filter cho phép của dimension đó
    if (thisDimensionSettings.value?.filter?.length) {
      for (const key in selectDropList.value) {
        if (Object.prototype.hasOwnProperty.call(selectDropList.value, key)) {
          if (thisDimensionSettings.value?.filter.includes(key)) continue
          switch (true) {
            case Array.isArray(selectDropList.value[key]):
              selectDropList.value[key] = []
              break
            default:
              selectDropList.value[key] = ''
              break
          }
        }
      }
    }

    //Sửa interval nếu có fixedInterval
    if (fixedInterval.value && intervalValue.value != fixedInterval.value) {
      intervalValue.value = fixedInterval.value
    }

    repairOrderBy()
    repairTopBy()
  }

  const repairOrderBy = () => {
    if (thisDimensionSettings.value?.defaultOrderBy) {
      changeOrderBy(thisDimensionSettings.value?.defaultOrderBy)
      resetOrderBySignal.value = thisDimensionSettings.value?.defaultOrderBy
      return
    }
    const optionsForCheck = fixedOrder.value?.length
      ? fixedOrder.value
      : orderOptions.value

    if (!optionsForCheck.length) return

    const exists = optionsForCheck.some((opt) => opt.value === orderBy.value)

    if (!exists) {
      changeOrderBy(optionsForCheck[0].value as string)
      resetOrderBySignal.value = optionsForCheck[0].value as string
    }
  }

  const repairTopBy = () => {
    if (!fixedTop.value) return

    changeTop(fixedTop.value)
  }

  const changeTimeZone = (value: string) => {
    timeZoneValue.value = value
  }

  const changeOrderBy = (value: string) => {
    orderBy.value = value
  }

  const changeTop = (value: number) => {
    topValue.value = value
  }

  const changeTimeZoneDefault = () => {
    changeTimeZone(settings.value.settingTop?.timeZone || '')
  }

  const changeInterval = (value: string) => {
    intervalValue.value = value
  }

  const changeMetrics = (value: string[]) => {
    metricsValue.value = value
  }

  const changeDimension = (value: string[]) => {
    dimensionValue.value = value
  }

  const changeDimensionTemp = (value: string[]) => {
    dimensionValueTemp.value = value
  }

  const changeOptionsByKey = (key: string, data: any) => {
    selectOptions.value[key] = data || []
  }

  const changeSelectDropListByKey = (key: string, data: any) => {
    selectDropList.value[key] = data
  }

  const clearSelectDropList = () => {
    for (const key in selectDropList.value) {
      if (Object.prototype.hasOwnProperty.call(selectDropList.value, key)) {
        switch (true) {
          case Array.isArray(selectDropList.value[key]):
            selectDropList.value[key] = []
            break
          default:
            selectDropList.value[key] = ''
            break
        }
      }
    }
  }

  //Đổi hết title của dropdown list về all, nếu dimension đang chọn là limit top thì hiển thị top
  const changeTitleDropList = (item: string) => {
    for (const key in selectDropTitle.value) {
      if (Object.prototype.hasOwnProperty.call(selectDropTitle.value, key)) {
        if (key == item && ajaxObject.value[key].top) {
          selectDropTitle.value[key] = `Top ${ajaxObject.value[key].top}`
        } else {
          selectDropTitle.value[key] = 'All'
        }
      }
    }
  }

  const valueById = (id: string, prop: string) => {
    for (let index = 0; index < infoData.value.length; index++) {
      if (infoData.value[index].id == id) {
        return infoData.value[index][prop as keyof InfoData]
      }
    }

    return null
  }

  const metricIsDisabled = (key: string) => {
    if (!key || !dimensionForShowTemp.value) return false

    if (!thisDimensionSettings.value?.show?.length) return false
    return thisDimensionSettings.value.show.includes(key) ? false : true
  }

  const filterIsDisabled = (key: string) => {
    if (!key || !dimensionForShowTemp.value) return false

    if (!thisDimensionSettings.value?.filter?.length) return false
    return thisDimensionSettings.value.filter.includes(key) ? false : true
  }

  const loadOrderOptions = async () => {
    const result = await ctr_by_dimension.OrderOptions()

    orderOptions.value = result?.data || []
  }

  return {
    dateValue,
    settings,
    timeZoneValue,
    intervalValue,
    topValue,
    orderBy,
    orderOptions,
    metricsValue,
    dimensionValue,
    dimensionValueTemp,
    resetOrderBySignal,

    dimensionForShow,
    isCampaignDimension,
    isErrorDimension,
    selectList,
    metricsByDimension,
    metricList,
    ajaxObject,
    objectSettings,
    selectOptions,
    selectDropList,
    selectDropTitle,
    fixedInterval,
    isOffOrder,
    fixedTop,
    fixedOrder,
    thisDimensionSettings,
    isDayInterval,
    payload,
    defaultOrderBy,

    changeDateValue,
    changeSettings,
    changeTimeZone,
    changeOrderBy,
    changeTop,
    changeTimeZoneDefault,
    changeInterval,
    changeMetrics,
    changeDimension,
    changeDimensionTemp,
    valueById,
    changeOptionsByKey,
    changeSelectDropListByKey,
    clearSelectDropList,
    changeTitleDropList,
    metricIsDisabled,
    filterIsDisabled,
    repairOrderBy,
    repairTopBy,
    loadOrderOptions,
    repairAfterSettings,
  }
})
