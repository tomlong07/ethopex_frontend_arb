import PaymentsNote from '@/components/payment/cell/PaymentsNote.vue'

export const columnsDefPaymentModal = () => {
  return [
    {
      headerName: 'PERIOD',
      field: 'period',
      sortable: true,
      width: 250,
      flex: 0.1,
    },
    {
      headerName: 'INFO',
      field: 'note',
      sortable: true,
      cellRenderer: PaymentsNote,
      autoHeight: true,
      flex: 0.5,
    },
    {
      headerName: 'AMOUNT',
      field: 'amount',
      sortable: true,
      type: 'rightAligned',
      valueGetter: (params: any) => {
        const amount = params.data.amount
        if (amount === null || amount === undefined) {
          return '-'
        } else {
          return helper.currencyFormatterAuto(amount)
        }
      },
      cellStyle: (params: any) => {
        const amount = params.data.amount
        if (amount < 0) {
          return { color: 'red' } // Số âm - màu đỏ
        } else if (amount > 0) {
          return { color: 'green' } // Số dương - màu xanh lá cây
        } else {
          return null // Số 0
        }
      },
      width: 150,
      flex: 0.1,
    },
    {
      headerName: 'TYPE',
      field: 'type',
      sortable: true,
      width: 120,
      flex: 0.1,
    },
  ]
}
