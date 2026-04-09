import { KEY_STORAGE, STORE_KEY } from '@/constants/app'
import { ctr_table_settings } from '@/services/ctr_table_settings'
import { debounceV2 } from '@/utils'

const keyStorage = KEY_STORAGE

function makeStorageKey() {
  return `${keyStorage}_${window.location.pathname}`
}

export default {
  getData: () => {
    try {
      const jsonData = localStorage.getItem(makeStorageKey()) || ''
      return JSON.parse(jsonData)
    } catch {
      return undefined
    }
  },

  getDataSave: () => {
    try {
      const jsonData = localStorage.getItem(makeStorageKey()) || ''
      return [...new Set(JSON.parse(jsonData))] //Thêm logic lọc trùng trong array
    } catch {
      return undefined
    }
  },

  // setData: (data: any) => {
  //   try {
  //     localStorage.setItem(makeStorageKey(), JSON.stringify(data));
  //   } catch (error) {}
  // },

  remove: () => {
    localStorage.removeItem(makeStorageKey())
  },

  removeBlocks: () => {
    localStorage.removeItem('content_data')
  },

  clearOldStorage: function () {
    try {
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i)
        if (key?.includes(STORE_KEY) && !key?.includes(keyStorage)) {
          localStorage.removeItem(key)
          // Sau khi xoá một mục, độ dài của localStorage thay đổi,
          // nên cần điều chỉnh chỉ số i để không bỏ qua bất kỳ mục nào
          i--
        }
      }
    } catch {}
  },

  //Cái này lúc nào cần bật lên để debug sao nó watch sai
  // initWatchV2: function (data: Ref, statusData: Ref) {
  //   this.clearOldStorage()
  //   let previousValue = JSON.stringify(data.value)

  //   watch(
  //     () => data.value,
  //     (newValue) => {
  //       if (statusData.value.showModalSaveForm && !statusData.value.readyWatch)
  //         return

  //       const currentValue = JSON.stringify(newValue)

  //       if (previousValue === currentValue) {
  //         console.log('⚠️ No actual changes detected')
  //         return
  //       }

  //       console.log('📝 Changes found:')
  //       console.log(previousValue)
  //       console.log(currentValue)
  //       const oldObj = JSON.parse(previousValue)
  //       const newObj = JSON.parse(currentValue)

  //       Object.keys(newObj).forEach((key) => {
  //         if (JSON.stringify(oldObj[key]) !== JSON.stringify(newObj[key])) {
  //           console.log(`Field "${key}":`)
  //           console.log('  Old:', oldObj[key])
  //           console.log('  New:', newObj[key])
  //         }
  //       })

  //       previousValue = currentValue
  //       localStorage.setItem(makeStorageKey(), currentValue)
  //     },
  //     { deep: true }
  //   )
  // },

  /* eslint-disable no-unused-vars */
  // @ts-nocheck
  initWatchV2: function (data: Ref, statusData: Ref) {
    this.clearOldStorage()
    watch(
      () => data.value,
      (oldValue, newValue) => {
        if (statusData.value.showModalSaveForm && !statusData.value.readyWatch)
          return

        const _payload = {
          campaign: data.value,
          _isDefault: statusData.value._isDefault,
        }
        localStorage.setItem(makeStorageKey(), JSON.stringify(_payload))
      },
      { deep: true }
    )
  },

  initWatch: function (data: Ref) {
    this.clearOldStorage()
    watch(
      () => data.value,
      (oldValue, newValue) => {
        localStorage.setItem(makeStorageKey(), JSON.stringify(data.value))
      },
      { deep: true }
    )
  },

  initWatchCols: (data: Ref, columns: Ref, pathName?: string) => {
    return watch(
      () => data.value,
      debounceV2(() => {
        let dataCols: { [key: string]: boolean } = {}
        columns.value.forEach((element: any) => {
          if (!element.field) {
            return
          }

          if (element.cellRendererParams?.isGroup) {
            return
          }

          let status = false

          if (data.value.includes(element.field)) {
            status = true
          }

          dataCols[element.field] = status
        })
        ctr_table_settings.Update({
          router: pathName ? pathName : window.location.pathname,
          columns: JSON.stringify(dataCols),
          type: 'cols',
        })
      }, 800),
      { deep: true }
    )
  },
}
