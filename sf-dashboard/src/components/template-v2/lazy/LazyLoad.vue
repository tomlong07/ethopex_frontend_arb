<script setup lang="ts">
import { watch } from 'vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import { general } from '@/services/general'
import { getLazyLoadConfig, hasLazyLoadConfig } from './LazyLoadConfig'

const templateV2Store = useTemplateV2(helper.truePath())()

watch(
  () => templateV2Store.rawDataV2?.[templateV2Store.baseConfigs.PropTable()],
  async (table) => {
    if (!table?.length) return

    const colV2 = templateV2Store.baseConfigs.colV2 || ''
    if (!hasLazyLoadConfig(colV2)) return

    const lazyConfig = getLazyLoadConfig(colV2)

    // add loading
    setLazyFieldsValue(lazyConfig.fields, 'Loading...')

    await fetchAndMapLazyLoad(lazyConfig)
  }
)

const fetchAndMapLazyLoad = async (lazyConfig: any) => {
  if (!lazyConfig.fields.length || !lazyConfig.inputs.length) {
    setLazyFieldsValue(lazyConfig.fields, 0)
    return
  }

  const tableData = getTableData()
  const payload = buildPayload(tableData, lazyConfig)

  if (!payload) {
    setLazyFieldsValue(lazyConfig.fields, 0)
    return
  }

  templateV2Store.lazyControllerV2?.abort()
  templateV2Store.lazyControllerV2 = new AbortController()

  try {
    const response = await general.fetchTable(
      templateV2Store.baseConfigs.lazyLoadV2 as string,
      payload,
      { signal: templateV2Store.lazyControllerV2.signal }
    )

    if (response?.status && response?.data) {
      mapLazyData(response.data, lazyConfig)
    } else {
      setLazyFieldsValue(lazyConfig.fields, 0)
    }
  } catch (error: any) {
    if (error.name !== 'AbortError') {
      setLazyFieldsValue(lazyConfig.fields, 0)
    }
  }
}

const getTableData = () => {
  return templateV2Store.rawDataV2?.[templateV2Store.baseConfigs.PropTable()]
}

const buildPayload = (tableData: any[], lazyConfig: any) => {
  const payload: any = { fields: lazyConfig.fields }

  for (const input of lazyConfig.inputs) {
    if (input.type === 'data_array') {
      const arrayValues = tableData
        ?.map((row: any) => row[input.base])
        .filter((val: any) => val != null)

      if (!arrayValues?.length) return null

      payload[input.key] = arrayValues
    } else if (input.type === 'payload') {
      const filterValue = templateV2Store.filterList[input.key]
      if (filterValue) {
        payload[input.key] = filterValue
      }
    }
  }

  return payload
}

const setLazyFieldsValue = (fields: string[], value: any) => {
  const tableData = getTableData()
  if (!tableData) return

  tableData.forEach((row: any) => {
    fields.forEach((field) => {
      row[field] = value
    })
  })

  try {
    const api = templateV2Store.gridApiV2
    const gridEl = document.getElementById(templateV2Store.idTable)

    if (!gridEl || !api || !templateV2Store.gridAlive) {
    } else {
      // Trì hoãn refresh một chút và kiểm tra lại để tránh gọi API khi AG Grid đang ở trạng thái pre-destroy
      const capturedApi = api
      setTimeout(() => {
        try {
          // Kiểm tra lại để đảm bảo grid vẫn còn hoạt động và instance của API chưa bị thay thế
          if (!templateV2Store.gridAlive) {
            return
          }
          if (!templateV2Store.isGridPresent?.()) {
            return
          }
          if (templateV2Store.gridApiV2 !== capturedApi) {
            return
          }

          capturedApi?.refreshCells?.()
        } catch (err) {
          console.error('[LazyLoad] delayed refreshCells error', err)
        }
      }, 50)
    }
  } catch (e) {
    console.error('[LazyLoad] setLazyFieldsValue - refreshCells error', e)
  }
}

const mapLazyData = (lazyData: any[], lazyConfig: any) => {
  const dataArrayInput = lazyConfig.inputs.find(
    (inp: any) => inp.type === 'data_array'
  )
  if (!dataArrayInput) {
    setLazyFieldsValue(lazyConfig.fields, 0)
    return
  }

  const lazyMap = new Map(
    lazyData
      .filter((item) => item[dataArrayInput.response] != null)
      .map((item) => [item[dataArrayInput.response], item])
  )

  const tableData = getTableData()

  tableData.forEach((row: any) => {
    const lazyItem = lazyMap.get(row[dataArrayInput.base])
    lazyConfig.fields.forEach((field: string) => {
      row[field] = lazyItem?.[field] ?? 0
    })
  })

  try {
    const api = templateV2Store.gridApiV2
    const gridEl = document.getElementById(templateV2Store.idTable)

    if (!gridEl || !api) {
    } else {
      const capturedApi = api
      setTimeout(() => {
        try {
          if (!templateV2Store.isGridPresent?.()) {
            return
          }
          if (templateV2Store.gridApiV2 !== capturedApi) {
            return
          }

          capturedApi?.refreshCells?.()
        } catch (err) {
          console.error('[LazyLoad] delayed refreshCells error', err)
        }
      }, 50)
    }
  } catch (e) {
    console.error('[LazyLoad] mapLazyData - refreshCells error', e)
  }
}
</script>

<template></template>
