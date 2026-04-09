<script setup lang="ts">
import Highcharts from 'highcharts'
import Exporting from 'highcharts/modules/exporting'
import ExportData from 'highcharts/modules/export-data'
import OfflineExporting from 'highcharts/modules/offline-exporting'
import FullScreen from 'highcharts/modules/full-screen'
import useByDimensionStore from '@/store/useByDimensionStore'
import { InfoData } from '@/types/components/types'
import { CURRENCY_TYPE, NUMBER_TYPE, PERCENT_TYPE } from '@/constants/formats'
import date2 from '@/utils/date2'
import { initHighchartsSymbols } from '@/utils/highchartSymbol'
const byDimensionStore = useByDimensionStore()
Exporting(Highcharts)
ExportData(Highcharts)
OfflineExporting(Highcharts)
FullScreen(Highcharts)
const props = defineProps({
  data: {
    type: Object,
    required: true,
  },
  index: {
    type: Number,
    required: true,
  },

  dateValue: {
    type: Array,
    required: true,
  },

  settings: {
    type: Object,
    required: true,
  },
})

const metricsNow = computed(() => byDimensionStore.metricsValue)
const isDayInterval = computed(() => byDimensionStore.isDayInterval)
const dimensionForShow = computed(() => byDimensionStore.dimensionForShow)

const isAdmin = window.arb.isAdmin()

onMounted(() => {
  initHighchartsSymbols() // custom icon
})

//Ở keyword là chart dimension là domain
const propToGetData = computed(
  () => byDimensionStore.thisDimensionSettings?.prop || 'date'
)
const metricList = computed(() => byDimensionStore.metricList)

const idRender = computed(() => `${props.data.dimension}-chart-${props.index}`)

const isLoading = ref<boolean>(true)

// tìm ngày đầu tiên có data
const getFirstDateWithData = (): string | null => {
  if (!props.data?.items?.length) return null

  const prop = propToGetData.value
  const selectedMetrics = metricsNow.value

  const firstItem = props.data.items.find((item: any) => {
    return selectedMetrics.some((metric: string) => {
      const value = item[metric]
      return value !== null && value !== undefined && value !== 0
    })
  })

  return firstItem?.[prop] || null
}

const isAllTime = computed(() => {
  if (!props.dateValue?.length || props.dateValue.length < 2) return false

  return (
    props.dateValue[0] == date2.allTime() && props.dateValue[1] == date2.today()
  )
})

const xAxis = computed<string[]>(() => {
  if (isDayInterval.value && propToGetData.value == 'date') {
    if (isAllTime.value) {
      const firstDate = getFirstDateWithData()
      if (firstDate) {
        return helper.generateDateRange(firstDate, props.dateValue[1])
      }
    }

    return helper.generateDateRange(props.dateValue[0], props.dateValue[1])
  }

  let axisData: string[] = []

  //sort data theo mong muốn
  if (byDimensionStore.thisDimensionSettings?.sortData) {
    const key = byDimensionStore.thisDimensionSettings?.sortData as string
    try {
      props.data?.items.sort((a: any, b: any) => (b[key] || 0) - (a[key] || 0))
    } catch {}
  }

  props.data?.items?.forEach((element: any) => {
    axisData.push(element[propToGetData.value])
  })

  return axisData
})

const buildHtmlIconGreen = (name: string) => {
  return `<div class="flex flex-row tool-tip-wrapper-legend">${name}<div class="green-circle ml-1"></div></div>`
}

const series = computed<any[]>(() => {
  let objectTemp: { [key: string]: any } = {}

  loop1: for (let index = 0; index < xAxis.value.length; index++) {
    const axisNow = xAxis.value[index]

    for (let i = 0; i < props.data.items?.length; i++) {
      const element = props.data.items[i]
      if (element[propToGetData.value] == axisNow) {
        objectTemp[axisNow] = element
        continue loop1
      }
    }
    objectTemp[axisNow] = {}
  }

  let series: any[] = []

  metricsNow.value.forEach((element) => {
    let typeChart = 'spline'

    try {
      const chartType = getPropById(element, 'chart')
      if (chartType) typeChart = chartType
    } catch {}

    try {
      const chartByDimension = getPropById(element, 'chartByDimension')
      if (chartByDimension) {
        for (const key in chartByDimension) {
          if (Object.prototype.hasOwnProperty.call(chartByDimension, key)) {
            if (key === byDimensionStore.dimensionForShow) {
              typeChart = chartByDimension[key]
              break
            }
          }
        }
      }
    } catch {}

    let name = getPropById(element)
    series.push({
      name: name.includes('RT')
        ? buildHtmlIconGreen(name.replace('RT', ''))
        : name,
      className: name.includes('RT') ? 'blink-opacity' : undefined,
      zIndex: typeChart == 'column' ? undefined : 1, //Dìm column xuống dưới spline
      color: getPropById(element, 'color') || '#ccc',
      yAxis: getPropById(element, 'yAxis') || 0,
      rawKey: element,
      tooltipPlus: getPropById(element, 'tooltipPlus') || undefined,
      type: typeChart,
      data: xAxis.value.map((date) => {
        return objectTemp[date][element] || 0
      }),
    })
  })

  //Sort lại theo thứ tự metric đc define
  series.sort((a, b) => {
    return (
      metricList.value.indexOf(a.rawKey) - metricList.value.indexOf(b.rawKey)
    )
  })

  return series
})

const getPropById = (id: string, prop: string = 'name') => {
  for (let index = 0; index < props.settings?.info?.length; index++) {
    const element = props.settings.info[index]
    if (element.id == id) {
      return element[prop as keyof InfoData]
    }
  }
  return id
}

const getAutoDecimal = (value: number): number => {
  if (!Number.isFinite(value)) return 0

  const str = value.toString()
  if (!str.includes('.')) return 0

  const decimals = str.split('.')[1].replace(/0+$/, '')
  return Math.min(decimals.length, 4)
}

const thisChart = ref<Highcharts.Chart | null>(null)

onMounted(async () => {
  renderChart()
})

const opts = computed<any>(() => {
  let xAxisOpts = {
    categories: xAxis.value,
    crosshair: true,
  } as Record<string, any>

  let subtitle = null

  if (
    byDimensionStore.isCampaignDimension &&
    props.data?.keyword_optimize_start_at
  ) {
    const index = xAxis.value.indexOf(props.data?.keyword_optimize_start_at)

    if (index !== -1) {
      xAxisOpts.plotBands = [
        {
          from: index - 0.5,
          to: index + 0.5,
          label: {
            text: '🚀 Keyword Optimize',
            align: 'center',
            verticalAlign: 'top',
            y: 20,
            style: {
              color: '#ff4d4f',
              fontWeight: 'bold',
              fontSize: 11,
            },
          },
          zIndex: 3,
        },
      ]
    } else {
      subtitle = {
        useHTML: true,
        text: `
    <span class="hc-naive-tooltip">
      🚀 <b>${props.data?.keyword_optimize_start_at}</b>
    </span>
  `,
        align: 'left',
        verticalAlign: 'bottom',
        floating: true,
        y: 0,
        style: {
          color: '#ff4d4f',
          fontWeight: 'bold',
          fontSize: '10px',
        },
      }
    }
  }

  return {
    chart: {
      type: 'column',
    },
    credits: {
      enabled: false,
    },
    exporting: {
      enabled: true,
      buttons: {
        contextButton: isAdmin
          ? {
              menuItems: [
                'viewFullscreen',
                'printChart',
                'separator',
                'downloadPNG',
                'downloadJPEG',
                'downloadPDF',
                'downloadSVG',
                'separator',
                'downloadCSV',
                'downloadXLS',
                'viewData',
              ],
            }
          : {
              symbol: 'customExpand',
              titleKey: 'viewFullscreen',
              menuItems: [],
              onclick() {
                // @ts-ignore
                this.fullscreen.toggle()
              },
            },
      },
    },
    accessibility: {
      enabled: false,
    },
    title: {
      text: props.data.name || props.data[dimensionForShow.value] || 'N/A',
      useHTML: true, // Enable HTML to prevent the browser from automatically processing the text
      align: 'center',
      style: {
        fontWeight: 'bold',
      },
    },

    xAxis: xAxisOpts,

    legend: {
      enabled: true,
      useHTML: true,
    },

    yAxis: [
      {
        title: {
          text: '$',
          style: { color: '#d5dbdb' },
        },
        labels: {
          style: { color: '#d5dbdb' },
        },
      },
      {
        min: 0,
        opposite: true,
        title: {
          text: '',
          style: { color: '#7cb5ec' },
        },
        labels: {
          style: { color: '#7cb5ec' },
        },
      },

      {
        opposite: true,
        title: {
          text: '%',
          style: { color: '#bd7a9b' },
        },
        labels: {
          style: { color: '#bd7a9b' },
        },
      },

      {
        opposite: true,
        title: {
          text: '',
          style: { color: '#f45b5b' },
        },
        labels: {
          style: { color: '#f45b5b' },
        },
      },
    ],

    plotOptions: {
      column: {
        pointPadding: 0.2,
        borderWidth: 0,
      },
    },
    series: series.value,

    tooltip: {
      shared: true,
      useHTML: true,
      formatter: function () {
        const allData = (this as any).points
        if (allData?.length == 0) {
          return ''
        }

        let listString = ''
        let dataRaw: { [key: string]: any } = {}
        let tooltipPlus: any[] = []

        allData.forEach((element: any) => {
          let nameNow,
            pointNow,
            rawKey = ''

          try {
            nameNow = element.series?.name
            pointNow = element.point?.y
            rawKey = element.series?.userOptions?.rawKey

            if (element.series?.userOptions?.tooltipPlus)
              tooltipPlus.push(element.series?.userOptions?.tooltipPlus)

            dataRaw[rawKey] = pointNow

            switch (getPropById(rawKey, 'type')) {
              case CURRENCY_TYPE:
                const decimal = getAutoDecimal(pointNow)
                pointNow = helper.getMoneyCurrency(pointNow, decimal)

                break
              case NUMBER_TYPE:
                pointNow = helper.floatWithCommas(pointNow)
                break
              case PERCENT_TYPE:
                pointNow = helper.getPercent(pointNow, 2)
                break

              default:
                break
            }
          } catch {}

          listString += helper.buildCustomHtml(
            nameNow + ': ' + helper.boldHtml(pointNow) + '<br>',
            'li',
            nameNow.includes('</div>') ? 'flex flex-row' : ''
          )
        })

        try {
          if (tooltipPlus.length) {
            for (let ind = 0; ind < tooltipPlus.length; ind++) {
              const oneTooltipPlus = tooltipPlus[ind]

              loopOne: for (const key in oneTooltipPlus) {
                if (Object.prototype.hasOwnProperty.call(oneTooltipPlus, key)) {
                  const tt = oneTooltipPlus[key]?.metrics

                  for (let index = 0; index < tt.length; index++) {
                    const element = tt[index]
                    if (!metricsNow.value.includes(element)) {
                      continue loopOne
                    }
                  }

                  const typeTT = oneTooltipPlus[key]?.type

                  switch (typeTT) {
                    case 'percent':
                      const rate = helper.calculateRate(
                        dataRaw[tt[0]],
                        dataRaw[tt[1]]
                      )
                      listString += helper.buildCustomHtml(
                        oneTooltipPlus[key]?.name +
                          ': ' +
                          helper.boldHtml(rate + '%') +
                          '<br>',
                        'li'
                      )
                      break
                  }
                }
              }
            }
          }
        } catch {}

        const htmlNow = helper.buildCustomHtml(listString, 'ul')
        const result = helper.boldHtml(allData[0].key) + '<br>' + htmlNow
        return result
      },
    },
    subtitle: subtitle,
  }
})

const renderChart = async () => {
  isLoading.value = true

  if (thisChart.value) {
    thisChart.value.destroy()
  }

  fmt.Println(opts.value)

  try {
    Highcharts.chart(idRender.value, opts.value)
  } catch {}

  isLoading.value = false
}
</script>

<template>
  <div :id="idRender" class="mini-chart-by-dimension rounded-lg"></div>
</template>
<style lang="css">
.highcharts-data-table {
  margin-top: 12px;
  max-height: 420px;
  overflow: auto;
  border-radius: 8px;
  border: 1px solid #e5e7eb;
  background: #fff;
}

.highcharts-data-table table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  font-size: 13px;
  line-height: 1.4;
}

.highcharts-data-table caption {
  caption-side: top;
  padding: 12px 16px;
  text-align: left;
  font-weight: 600;
  font-size: 14px;
  color: #111827;
  background: #f9fafb;
  border-bottom: 1px solid #e5e7eb;

  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.highcharts-data-table thead th {
  background: #f3f4f6;
  color: #374151;
  font-weight: 600;
  padding: 10px 12px;
  border-bottom: 1px solid #e5e7eb;
  text-align: right;
}

.highcharts-data-table thead th:first-child {
  text-align: left;
}

.highcharts-data-table tbody th,
.highcharts-data-table tbody td {
  padding: 8px 12px;
  border-bottom: 1px solid #f1f5f9;
}

.highcharts-data-table tbody th {
  font-weight: 500;
  color: #111827;
  text-align: left;
  white-space: nowrap;
}

.highcharts-data-table td.highcharts-number {
  text-align: right;
  font-variant-numeric: tabular-nums;
}

.highcharts-data-table tbody tr:nth-child(even) {
  background: #fafafa;
}

.highcharts-data-table tbody tr:hover {
  background: #eef2ff;
}
</style>
