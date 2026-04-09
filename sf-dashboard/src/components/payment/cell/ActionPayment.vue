<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import usePaymentStore from '@/store/usePaymentStore'
import EyeOutline from '@/assets/icons/EyeOutline.vue'

const paymentsStore = usePaymentStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const fetchInvalidInfo = async (id: string) => {
  paymentsStore.changePaymentData(props.params.data)

  paymentsStore.changeShowModal(true)
  paymentsStore.changePaymentAmount(props.params.data?.amount)
}
</script>

<template>
  <div class="flex w-full h-full items-center">
    <!-- edit -->

    <n-icon
      size="32"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Show info"
      :component="EyeOutline"
      @click="fetchInvalidInfo(props.params.data.id)"
    >
    </n-icon>
  </div>
</template>
