import { ctr_table_settings } from '@/services/ctr_table_settings'

export const syncColDimensions = async (
  dataGroup: string[],
  groupByOptions: any[]
) => {
  let tempData: { [key: string]: boolean } = {}

  groupByOptions.forEach((element) => {
    tempData[element.field] = false
  })

  for (const key in tempData) {
    if (Object.prototype.hasOwnProperty.call(tempData, key)) {
      if (dataGroup.includes(key)) {
        tempData[key] = true
      }
    }
  }

  await ctr_table_settings.Update({
    router: window.location.pathname,
    columns: JSON.stringify(tempData),
    type: 'group',
  })
}
