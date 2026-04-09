<script setup lang="ts">
import SkeletonTable from '@/components/template-v2/skeleton/SkeletonTable.vue'
import { ByDimensionSettings, PayloadDimension } from '@/types/components/types'
import MiniChart from '@/components/common/MiniChart.vue'
import useByDimensionStore from '@/store/useByDimensionStore'
import { useLogicGoAndLeave } from '@/plugins/reuseable'
import { ctr_by_dimension } from '@/services/ctr_by_dimension'
import { NTooltip } from 'naive-ui'
import { render } from 'vue'

const settings = computed<ByDimensionSettings>(() => byDimensionStore.settings)
const metricsValue = computed<string[]>(() => byDimensionStore.metricsValue)
const dimensionForShow = computed<string>(
  () => byDimensionStore.dimensionForShow
)
const dateValue = computed(() => byDimensionStore.dateValue)

const unixTime = ref<number>(Date.now())

const byDimensionStore = useByDimensionStore()

const isLoading = ref<boolean>(true)
const isRenderingChart = ref<boolean>(true)
const isLoadWhenReturn = ref<boolean>(false)

const data = ref<any>({})
const payload = computed(() => byDimensionStore.payload)
const topDimension = ref<string[]>([])

const activeRequestId = ref<number>(0)

//Sử dụng để quản lí ajax -> hủy bỏ nếu call nhiều lần
let abortManager: AbortController = new AbortController()

//Khi renderLazyChart chưa xong nhưng ajax đã xong chuyển router -> đánh dấu để khi quay lại load lại data
onDeactivated(() => {
  if (isRenderingChart.value && !isLoading.value) {
    isLoadWhenReturn.value = true
  }
})

//quay lại load lại data nếu chưa render xong chart ở lần trước lúc rời đi
onActivated(() => {
  if (isLoadWhenReturn.value) {
    fetchReport()
    isLoadWhenReturn.value = false
  }
})

const fetchReport = async () => {
  if (!metricsValue.value.length) {
    window.message.error('Please select metrics')
    return
  }

  const requestId = ++activeRequestId.value

  //Hủy bỏ ajax trước nếu chưa finish
  if (abortManager) abortManager.abort()

  isLoading.value = true
  isRenderingChart.value = true
  data.value = {}

  generateURL()

  const controller = new AbortController()
  abortManager = controller

  try {
    const result = await ctr_by_dimension.GetReport(
      payload.value as PayloadDimension,
      {
        signal: controller.signal,
      }
    )

    if (requestId !== activeRequestId.value) return

    data.value = result?.data || {}

    isLoading.value = false

    await renderLazyChart()

    if (requestId !== activeRequestId.value) return

    isRenderingChart.value = false
  } catch (error: any) {
    console.error(error)
    if (requestId === activeRequestId.value) {
      isLoading.value = false
      isRenderingChart.value = false
    }
  }
}

//render chart từ từ tránh gây render cùng 1 lúc gây lag
const renderLazyChart = async () => {
  //Khởi tạo 1 unixTime mới mỗi lần bấm update
  unixTime.value = Date.now()
  const unixNow = unixTime.value

  topDimension.value = []
  const topRaw = data.value?.top
  for (let index = 0; index < topRaw?.length; index++) {
    //So sánh nếu khác thì hủy bỏ (hủy bỏ lần render chart trước nếu chưa xong)
    if (unixNow !== unixTime.value) {
      break
    }
    const element = topRaw[index]

    const newValue = element[dimensionForShow.value] || 'N/A'

    topDimension.value.push(newValue)
    initTooltip()

    await helper.sleep(500)
  }
}

const initTooltip = async () => {
  await nextTick()

  const elements = document.querySelectorAll<HTMLElement>('.hc-naive-tooltip')

  elements.forEach((el) => {
    // tránh mount lại nhiều lần
    if (el.classList.contains('hc-mounted')) return

    const text = el.innerHTML
    const tooltip = 'Keyword Optimize start date'

    // clear nội dung gốc
    el.innerHTML = ''

    render(
      h(
        NTooltip,
        { trigger: 'hover' },
        {
          trigger: () =>
            h('span', {
              innerHTML: text,
              style: 'cursor: help; font-size: 11',
            }),
          default: () => tooltip,
        }
      ),
      el
    )

    el.classList.add('hc-mounted')
  })
}

// generate url: đổi url theo payload
const generateURL = async () => {
  let newSearch: { [key: string]: any } = helper.getQueryParams(
    window.location?.href || location?.href || {}
  )
  //để lấy các param đang có trên url

  for (const key in payload.value) {
    if (Object.prototype.hasOwnProperty.call(payload.value, key)) {
      switch (true) {
        case key === 'selects':
          for (const key in payload.value.selects) {
            if (
              Object.prototype.hasOwnProperty.call(payload.value.selects, key)
            ) {
              const element = payload.value.selects[key]
              if (Array.isArray(element)) {
                if (element) {
                  if (element.length) {
                    newSearch[key] = element.join(',')
                  } else {
                    try {
                      newSearch[key] = undefined
                    } catch {}
                  }
                }
              } else {
                if (element) {
                  newSearch[key] = element
                }
              }
            }
          }
          break

        case Array.isArray(payload.value[key as keyof PayloadDimension]):
          newSearch[key as keyof PayloadDimension] = (
            payload.value[key as keyof PayloadDimension] as string[]
          ).join(',')

          break

        default:
          const value = payload.value[key as keyof PayloadDimension]
          if (value === false) {
            continue
          }

          newSearch[key] = payload.value[key as keyof PayloadDimension]
          break
      }
    }
  }

  fmt.Println(newSearch)

  window.router.push({
    query: newSearch,
  })
}

const dataByDimension = (dimension: string) => {
  if (!data.value?.report?.length) return {}
  for (let index = 0; index < data.value.report?.length; index++) {
    const element = data.value.report[index]
    if (element[dimensionForShow.value] === dimension) {
      return { ...element, dimension: dimensionForShow.value }
    }
  }

  return {}
}

useLogicGoAndLeave(isLoading, fetchReport)

defineExpose({
  fetchReport,
})

const noData = computed<boolean>(
  () => topDimension.value.length == 0 && !isRenderingChart.value
)
</script>

<template>
  <SkeletonTable v-if="isLoading" />

  <n-grid
    v-else
    class="flex flex-col gap-1 chart-wrapper-multi custom-chart-dimension"
    :class="{ 'place-items-center': noData }"
    :x-gap="12"
    :y-gap="8"
    :cols="
      noData || (data.report && data.report.length == 1) ? '1' : 's:1 m:1 l:2'
    "
    responsive="screen"
  >
    <n-gi
      v-for="(item, index) in topDimension"
      :key="item + index"
      class="rounded-lg border"
    >
      <MiniChart
        :data="dataByDimension(item)"
        :index="index"
        :dateValue="dateValue"
        :settings="settings"
      />
    </n-gi>
    <n-gi v-if="noData" class="font-bold text-lg">No Data</n-gi>
  </n-grid>
</template>

<style lang="scss">
.chart-wrapper-multi {
  min-height: 50vh;
  .highcharts-title {
    cursor: copy;
  }

  .highcharts-legend-item,
  .tool-tip-wrapper-legend {
    .green-circle {
      border-radius: 50%;
      background-color: #49a849;
      width: 6.39px;
      height: 6.39px;
      background-color: #49a849;
      animation: flash 1s infinite;
    }

    // Nháy mờ hơn khi legend được ẩn
    &.highcharts-legend-item-hidden {
      .green-circle {
        animation: flash-circle-2 1s infinite;
      }
    }

    @keyframes flash-circle-2 {
      0% {
        opacity: 0.4;
      }
      50% {
        opacity: 0;
      }
      100% {
        opacity: 0.4;
      }
    }
  }
}
</style>
