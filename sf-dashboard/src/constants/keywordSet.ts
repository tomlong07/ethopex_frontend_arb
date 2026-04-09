import NameCampaign from '@/components/keyword_set/cell/NameCampaign.vue'
import Round from '@/components/template-v2/cell/Round.vue'
import { ColDef } from 'ag-grid-community'

export const newColumnsDefKeywordSet = (flex?: { [key: string]: number }) => {
  let result: ColDef[] = [
    {
      headerName: 'ID',
      field: 'id',
      flex: 0.1,
      sort: 'desc',
    },
    {
      headerName: 'Name',
      field: 'name',
      flex: 0.6,
      cellRenderer: NameCampaign,
    },
    {
      headerName: 'Status',
      field: 'status',
      flex: 0.3,
      cellRenderer: Round,
    },
  ]

  if (flex) {
    for (const key in flex) {
      if (Object.prototype.hasOwnProperty.call(flex, key)) {
        const element = flex[key]

        for (let i = 0; i < result.length; i++) {
          const e = result[i]
          if (e.field === key) {
            e.flex = element
            break
          }
        }
      }
    }
  }

  return result
}
