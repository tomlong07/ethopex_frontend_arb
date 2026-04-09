import Highcharts from 'highcharts'
import dataModule from 'highcharts/modules/data'
import exportingModule from 'highcharts/modules/exporting'
import exportDataModule from 'highcharts/modules/export-data'
import annotationsModule from 'highcharts/modules/annotations'
import icons from '@/utils/icons'
import helper from '@/utils/helper'

dataModule(Highcharts)
exportingModule(Highcharts)
exportDataModule(Highcharts)
annotationsModule(Highcharts)
window.Highcharts = Highcharts

import { useReportV2 } from '../store/report/report-v2'
import { waitForElementById } from './utils'
import { CHART_TYPE } from '@/enum/report-v2'
import { OFF_SERIES_CHART } from '@/constants/storage'

//Bê cái này vào profile -> lưu lại theo từng profile
function keyOffSeries() {
  return OFF_SERIES_CHART + '_' + helper.truePath()
}
const chartInstances = {}
export default {
  HighchartsObj: null,
  chartColumns: [],
  DataChartFormat: [],
  setChartColumns(columns) {
    this.chartColumns = columns
  },
  setDataChartFormat(chartFormat) {
    this.DataChartFormat = chartFormat
  },

  formatData(data, format) {
    const formatterParams = format || {}
    const symbol = formatterParams.symbol
    if (symbol) {
      return formatterParams.leftSymbol
        ? symbol + helper.formatNumberV2(data, formatterParams.precision)
        : helper.formatNumberV2(data, formatterParams.precision) + symbol
    }
    return helper.formatNumberV2(data, formatterParams.precision)
  },
  strTooltip(title, color, curData, preData, dataFormat) {
    var strShow =
      `<span style="height: 8px;width: 8px;background-color: ${color};border-radius: 50%;display: inline-block;"></span> ` +
      title +
      `<b>${this.formatData(curData, dataFormat)}</b>`
    if (preData != null) {
      const mark = curData > preData ? '+' : '-'
      const totalDiff = Math.abs(curData - preData)
      const totalDiffShow = this.formatData(totalDiff, dataFormat)
      var percentDiffShow = 0
      if ((preData == 0 && curData != 0) || (preData > 0 && curData == 0)) {
        // Infinity
        percentDiffShow = 999
      } else {
        const percentDiff = Math.round(
          Math.abs(((preData - curData) * 100) / preData)
        )
        percentDiffShow = helper.formatNumber(percentDiff)
      }

      strShow +=
        `<span class="comparison-text">` + curData > preData
          ? icons.sortasc()
          : icons.sortdesc() +
            `${mark}${totalDiffShow} ` +
            `(${percentDiffShow == 999 ? '>' : mark}${percentDiffShow}%)` +
            `</span>`
    }
    return strShow
  },
  setupTooltip() {
    //@ts-ignore
    var that = this
    return {
      shared: true,
      useHTML: true,
      formatter: function (_a) {
        const reportStoreV2 = useReportV2(helper.truePath())()

        var strShow = reportStoreV2.reportSettingsNew.showFullDate
          ? helper.formatFullDate(
              this.points[0].key,
              reportStoreV2.time_interval,
              reportStoreV2.timezone
            ) + `<br/>`
          : this.points[0].key + `<br/>`

        const pointObj = this.points.reduce((preVal, point) => {
          preVal[point.series.userOptions.id] = {
            val: point.y,
            color: point.color,
            id: point.series.userOptions.id,
          }
          return preVal
        }, {})

        Object.keys(pointObj).map((key, index) => {
          const item = pointObj[key]
          const itemComp = pointObj[`${key}Comparison`]
            ? pointObj[`${key}Comparison`].val
            : null

          if (key.indexOf('Comparison') == -1) {
            // Get display_format
            const curKey = that.chartColumns.find((obj) => obj.key == item.id)

            let title = key
            const thisMetric = reportStoreV2.metricInfo(key)
            if (thisMetric?.title) {
              if (thisMetric.IsRealTime()) {
                title = `<span class="blink-chart">${thisMetric.title}</span><span style="margin-left: 20px">: </span>`
              } else {
                title = thisMetric.title + ': '
              }
            }

            strShow +=
              `${index != 0 ? '<br/>' : ''}` +
              that.strTooltip(title, item.color, item.val, itemComp, curKey)
          }
        })
        strShow = strShow.replace('<br/><br/>', '<br/>')

        return strShow
      },
    }
  },

  setupSeriesV2(seriesFilter) {
    const reportStoreV2 = useReportV2(helper.truePath())()

    const seriesNew = Object.keys(seriesFilter)
      .map((key) => {
        const seriesData = seriesFilter[key]
        if (!seriesData) return null

        const item = this.DataChartFormat.find(
          (formatItem) => formatItem.id === key
        )
        if (!item) return null

        const seriesItem = { ...item }

        // Lấy tất cả numeric keys và convert thành array
        const numericKeys = Object.keys(seriesData)
          .filter((k) => !isNaN(k))
          .map((k) => parseInt(k))
          .sort((a, b) => a - b)

        seriesItem.data = numericKeys.map((k) => seriesData[k])

        // Ghi đè type nếu có
        if (seriesData.type !== undefined) {
          seriesItem.type = seriesData.type
        }

        // Lấy setting từ reportStore
        const chartItemSetting = reportStoreV2.getChartSetting(key)
        if (chartItemSetting?.cColor) {
          seriesItem.color = chartItemSetting.cColor
        }
        if (chartItemSetting) {
          seriesItem.opts = chartItemSetting
        }

        return seriesItem
      })
      .filter((item) => item !== null)

    return seriesNew
  },

  async renderChartV2({
    id,
    title,
    xAxis,
    series,
    height = null,
    colSelected = {
      column: /** @type {string[]} */ ([]),
      spline: /** @type {string[]} */ ([]),
    },
  }) {
    if (helper.isEmpty(series)) {
      console.warn('No data to render chart:', id)
      return
    }
    const reportStoreV2 = useReportV2(helper.truePath())()

    const idPlace = await waitForElementById(id, () => {
      return reportStoreV2.isShowChart
    })

    if (!idPlace) {
      console.warn(`Chart container with id "${id}" not found.`)

      return
    }

    const seriesFilter = {}
    Object.keys(series).forEach((metric) => {
      if (series[metric]) {
        seriesFilter[metric] = { ...series[metric] }

        // Override type dựa trên colSelected
        if (colSelected.column?.includes(metric)) {
          seriesFilter[metric].type = CHART_TYPE.COLUMN
        } else if (colSelected.spline?.includes(metric)) {
          seriesFilter[metric].type = CHART_TYPE.SPLINE
        }
      }
    })

    const seriesNew = this.setupSeriesV2(seriesFilter)

    let offSeries = []
    let yAxis = []

    const mapAxis = {} //Lưu vị trí yAxis của group để push yAxis vào các phần tử cùng nhóm

    // Get list of turned off series
    try {
      offSeries = JSON.parse(localStorage.getItem(keyOffSeries())) || []
    } catch (error) {
      console.error(error)

      offSeries = []
    }

    let leftItems = 0
    let rightItems = 0
    seriesNew.forEach((element) => {
      if (element && element.id) {
        const colSetting = reportStoreV2.getFullInfoByKey(element.id)
        if (colSetting?.type) {
          const yAxisNow = colSetting.groupYAxis

          if (yAxisNow) {
            const settingAxis =
              reportStoreV2.ReportChartSettings2.yAxisGroup[yAxisNow]
            if (mapAxis[yAxisNow] || mapAxis[yAxisNow] === 0) {
              element.yAxis = mapAxis[yAxisNow]
            } else {
              if (settingAxis) {
                const isOpposite = settingAxis.position === 'right' || false
                const color = settingAxis.color || element.color
                yAxis.push({
                  title: {
                    text: settingAxis.label || element.name,
                    style: { color: color },
                  },
                  labels: {
                    style: { color: color },
                  },
                  opposite: isOpposite,
                })

                element.yAxis = yAxis.length - 1

                mapAxis[yAxisNow] = yAxis.length - 1

                if (isOpposite) {
                  rightItems++
                } else {
                  leftItems++
                }
              } else {
                const isRight = yAxis.length % 2 !== 0
                yAxis.push({
                  title: {
                    text: element.name,
                    style: { color: element.color },
                  },
                  labels: {
                    style: { color: element.color },
                  },
                  opposite: isRight,
                })
                element.yAxis = yAxis.length - 1

                if (isRight) {
                  rightItems++
                } else {
                  leftItems++
                }
              }
            }
          } else {
            const isRight = yAxis.length % 2 !== 0

            yAxis.push({
              title: {
                text: element.name,
                style: { color: element.color },
              },
              labels: {
                style: { color: element.color },
              },
              opposite: isRight,
            })
            element.yAxis = yAxis.length - 1
            if (isRight) {
              rightItems++
            } else {
              leftItems++
            }
          }
        }
        if (offSeries.includes(element.id)) {
          element.visible = false
        }
      }
    })

    //Cho chart spline lên trên column
    seriesNew.forEach((element) => {
      if (element.type !== CHART_TYPE.COLUMN) {
        element.zIndex = 1
      }
    })

    const chartOpts = {
      credits: false,
      accessibility: { enabled: false },
      chart: {
        zoomType: 'xy',
        height: height || 300,
        marginLeft: leftItems * 70,
        marginRight: rightItems * 80,
      },
      title: { text: title || '', style: { fontWeight: 'bold' } },
      xAxis: { categories: xAxis, crosshair: false },
      yAxis: yAxis?.length ? yAxis : null,
      series: seriesNew,
      tooltip: this.setupTooltip(),
      plotOptions: {
        series: {
          events: {
            legendItemClick: function () {
              const seriesName = this.name
              const series = this.chart.series
              let seriesStatus = []

              if (this.visible) {
                series.forEach((seri) => {
                  if (seri.name === seriesName) {
                    seri.hide()
                  }
                })
              } else {
                series.forEach((seri) => {
                  if (seri.name === seriesName) {
                    seri.show()
                  }
                })
              }

              try {
                series.forEach((seri) => {
                  if (!seri.visible) {
                    seriesStatus.push(seri.userOptions.id)
                  }
                })
                localStorage.setItem(
                  keyOffSeries(),
                  JSON.stringify(seriesStatus)
                )
              } catch (error) {
                console.error('Error save series', error)
              }

              return false
            },
          },
        },
      },
      responsive: {
        rules: [
          {
            condition: { maxWidth: 500, maxHeight: 400 },
            chartOptions: {
              legend: {
                layout: 'horizontal',
                align: 'center',
                verticalAlign: 'bottom',
              },
            },
          },
        ],
      },

      legend: {
        labelFormatter: function () {
          try {
            const key = this.userOptions.id
            const thisMetric = reportStoreV2.metricInfo(key)
            if (thisMetric?.IsRealTime()) {
              return `<span class="blink-chart" style="margin-right: 15px">${this.name}</span>`
            }
            return this.name
          } catch (error) {
            console.error('Error format legend:', error)
            return this.name
          }
        },
        useHTML: true,
      },
    }

    chartInstances[id] = Highcharts.chart(id, chartOpts)
    return chartInstances[id]
  },
  destroyChart(id) {
    if (chartInstances[id]) {
      chartInstances[id].destroy()
      delete chartInstances[id]
    }
    if (this.HighchartsObj) {
      this.HighchartsObj.destroy()
      this.HighchartsObj = null
    }
  },
  processColFormatChart(colFormatChart) {
    const reportStoreV2 = useReportV2(helper.truePath())()

    const DataChartFormat = []
    for (let i = 0; i < colFormatChart.length; i++) {
      const itemCol = colFormatChart[i]

      const chartItemSetting = reportStoreV2.getChartSetting(itemCol.key)

      const typeCol = chartItemSetting?.cType || CHART_TYPE.SPLINE

      let obj = {
        index: i,
        type: typeCol,
        name: itemCol.title,
        id: itemCol.key,
        color: '#434348',
        opts: chartItemSetting,
      }

      DataChartFormat.push(obj)
    }

    this.setChartColumns(colFormatChart)
    this.setDataChartFormat(DataChartFormat)
  },
  processDataChart(dataSrc) {
    if (!dataSrc) return { xAxis: [], series: {}, comparison: [] }

    try {
      const xAxis = []
      const series = {}
      const comparison = []

      dataSrc?.items?.forEach((data) => {
        xAxis.push(helper.formatDateChart(data['date']))

        Object.keys(data).forEach((key) => {
          if (key == 'date') return

          if (!series[key]) series[key] = []
          series[key].push(helper.checkNumNull(data[key]))
        })

        const itemCompEmpty = Object.keys(data).reduce((obj, key) => {
          obj[key] = 0
          return obj
        }, {})
        const itemComp = data.comparison || itemCompEmpty
        if (itemComp) {
          Object.keys(itemComp).forEach((key) => {
            if (key == 'date') return

            if (!comparison[key]) comparison[`${key}Comparison`] = []
            comparison[`${key}Comparison`].push(
              helper.checkNumNull(itemComp[key])
            )
          })
        }
      })

      return { xAxis: xAxis, series: series, comparison: comparison }
    } catch (error) {
      console.error('[Charts] processDataChart error: ' + error)
      return { xAxis: [], series: {}, comparison: [] }
    }
  },
}
