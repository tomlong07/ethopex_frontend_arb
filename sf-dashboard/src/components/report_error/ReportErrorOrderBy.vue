<script setup lang="ts">
import DropCustom from '@/components/common/DropCustom.vue'
import { SelectOption } from 'naive-ui'
import { useReportError } from '@/store/report-error'
import { ctr_by_dimension } from '@/services/ctr_by_dimension'

const reportErrorStore = useReportError()
const orderOptions = ref<SelectOption[]>([])

const loadOrderOptions = async () => {
  const result = await ctr_by_dimension.OrderOptions()

  orderOptions.value = result?.data || []
}

onMounted(() => {
  loadOrderOptions()
})

const updateOrder = (value: string) => {
  reportErrorStore.changeOrderBy(value)
}
</script>

<template>
  <DropCustom
    class="w-32"
    name="Order By"
    size="small"
    title="Select Order By"
    :defaultValue="reportErrorStore.reportParams.orderBy"
    :valueOptions="orderOptions"
    @updateValue="updateOrder"
  />
</template>
