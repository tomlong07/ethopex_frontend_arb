import PixelManagerName from '@/components/pixel_triggers/PixelManagerName.vue'

export const columnsDefPixelTrigger = [
  { headerName: 'ID', field: 'id', flex: 0.2 },
  {
    headerName: 'Name',
    field: 'name',
    flex: 0.8,
    cellRenderer: PixelManagerName,
  },
]
