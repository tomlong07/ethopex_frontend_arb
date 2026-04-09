import { ctr_payment } from '@/services/ctr_payment'
import { defineStore } from 'pinia'
import { ctr_order_column } from '@/services/ctr_order_column'
import { ColumnItem } from '@/types/state/general'

export default defineStore('usePaymentStore', () => {
  const showModal = ref<boolean>(false)
  const paymentAmount = ref<number>(0)

  const data = ref<any>({})
  const isLoading = ref<boolean>(false)

  const paymentsLoadInvoiceDataTable = ref<any[]>([])
  const isPub = ref<boolean>(false)

  const columnDefsNewVersion = ref<ColumnItem[]>([])
  const loadCols = ref<boolean>(true)
  const showFull = ref<boolean>(false)

  const columnDefsNewComputed = computed<ColumnItem[]>(() => {
    let arr = []

    for (let index = 0; index < columnDefsNewVersion.value.length; index++) {
      const element = columnDefsNewVersion.value[index]
      if (element.condition && isPub.value) continue

      arr.push(element)
    }
    return arr
  })

  const fetchListPaymentLoadingInvoice = async () => {
    isLoading.value = true
    const result = await ctr_payment.LoadInvoice(data.value?.id)
    paymentsLoadInvoiceDataTable.value = result?.data?.data || []
    isPub.value = result?.data?.p || false
    isLoading.value = false
  }

  const changeShowModal = (isShow: boolean) => {
    showModal.value = isShow
  }

  const changePaymentAmount = (amount: number) => {
    paymentAmount.value = amount
  }

  const changePaymentData = (newData: any) => {
    data.value = helper.clone(newData)
  }

  const getColumnDefsNewVersion = async () => {
    loadCols.value = true
    const result = await ctr_order_column.GetColumnsByPage('/payment_modal_adm')
    columnDefsNewVersion.value = result?.data?.options?.columns || []
  }

  return {
    showModal,
    paymentAmount,
    data,
    paymentsLoadInvoiceDataTable,
    loadCols,
    isLoading,
    columnDefsNewVersion,
    showFull,
    isPub,

    columnDefsNewComputed,

    changeShowModal,
    changePaymentAmount,
    changePaymentData,
    fetchListPaymentLoadingInvoice,
    getColumnDefsNewVersion,
  }
})
