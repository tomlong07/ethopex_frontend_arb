import Highcharts from 'highcharts'
import dataModule from 'highcharts/modules/data'
import exportingModule from 'highcharts/modules/exporting'
import exportDataModule from 'highcharts/modules/export-data'
import Accessibility from 'highcharts/modules/accessibility'

Accessibility(Highcharts)

dataModule(Highcharts)
exportingModule(Highcharts)
exportDataModule(Highcharts)
window.Highcharts = Highcharts

const chartInstances = {}

export default {
  chartColumns: [],
  DataChartFormat: [],

  setChartColumns(columns) {
    this.chartColumns = columns
  },

  setDataChartFormat(chartFormat) {
    this.DataChartFormat = chartFormat
  },

  setupSeriesV2(seriesData) {
    const seriesNew = []

    // Define series configurations
    const seriesConfig = [
      {
        id: 'total_error_count',
        name: 'Total Errors',
        color: '#FF6B6B',
        type: 'spline',
      },
      {
        id: 'error_page_1',
        name: 'Error Page 1',
        color: '#4ECDC4',
        type: 'spline',
      },
      {
        id: 'error_page_2',
        name: 'Error Page 2',
        color: '#45B7D1',
        type: 'spline',
      },
      {
        id: 'rate_error_page_1',
        name: 'Rate Error Page 1',
        color: '#96CEB4',
        type: 'spline',
      },
      {
        id: 'rate_error_page_2',
        name: 'Rate Error Page 2',
        color: '#FFEAA7',
        type: 'spline',
      },
    ]

    seriesConfig.forEach((config) => {
      if (seriesData[config.id]) {
        seriesNew.push({
          ...config,
          data: seriesData[config.id],
        })
      }
    })

    return seriesNew
  },

  async renderErrorChart({
    id,
    title = 'Error Tracking Over Time',
    xAxis,
    series,
    height = 400,
  }) {
    if (!series || Object.keys(series).length === 0) {
      console.warn('No data to render error chart:', id)
      return
    }

    const idPlace = document.getElementById(id)
    if (!idPlace) {
      console.warn(`Chart container with id "${id}" not found.`)
      return
    }

    const seriesNew = this.setupSeriesV2(series)

    const chartOpts = {
      credits: false,
      chart: {
        type: 'spline',
        height: height,
      },
      title: {
        text: title,
        style: { fontWeight: 'bold' },
      },
      xAxis: {
        categories: xAxis,
        crosshair: true,
      },
      yAxis: {
        title: { text: 'Number of Errors' },
        min: 0,
      },
      series: seriesNew,
      tooltip: {
        shared: true,
        crosshairs: true,
        formatter: function () {
          let tooltip = `<b>${this.x}</b><br/>`
          this.points.forEach((point) => {
            tooltip += `<span style="color:${point.color}">●</span> ${point.series.name}: <b>${point.y}</b><br/>`
          })
          return tooltip
        },
      },
      plotOptions: {
        spline: {
          marker: {
            enabled: true,
            radius: 4,
          },
        },
      },
      legend: {
        layout: 'horizontal',
        align: 'center',
        verticalAlign: 'bottom',
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
  },

  processColFormatChart(colFormatChart) {
    const DataChartFormat = []
    for (let i = 0; i < colFormatChart.length; i++) {
      const itemCol = colFormatChart[i]

      let obj = {
        index: i,
        type: 'spline',
        name: itemCol.title,
        id: itemCol.key,
        color: i === 0 ? '#FF6B6B' : i === 1 ? '#4ECDC4' : '#45B7D1',
      }

      DataChartFormat.push(obj)
    }

    this.setChartColumns(colFormatChart)
    this.setDataChartFormat(DataChartFormat)
  },

  processDataChart(dataSrc) {
    if (!dataSrc) return { xAxis: [], series: {} }

    try {
      const xAxis = []
      const series = {}

      dataSrc?.items?.forEach((data) => {
        xAxis.push(data['time'])

        Object.keys(data).forEach((key) => {
          if (key === 'time') return

          if (!series[key]) series[key] = []
          series[key].push(data[key] || 0)
        })
      })

      return { xAxis: xAxis, series: series }
    } catch (error) {
      console.error('[Charts] processDataChart error: ' + error)
      return { xAxis: [], series: {} }
    }
  },
}
