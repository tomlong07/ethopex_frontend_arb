<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Detail from '@/assets/icons/Detail.vue'
import useModalSatisfyStore from '@/store/modalSatisfy'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const modalSatisfyStore = useModalSatisfyStore()
const data = props.params.data

const campaignHref = computed(() => {
  let endDate = data.interval_end_date

  const queryParams = new URLSearchParams({
    start_date: data.interval_start_date,
    end_date: endDate,
    campaigns: data.campaign_id,
  })

  return `/?${queryParams.toString()}`
})

const openModalSatisfy = () => {
  modalSatisfyStore.showModal = true
  modalSatisfyStore.dataRowSatisfy = data
  modalSatisfyStore.campaignHref = campaignHref.value
}
</script>

<template>
  <div class="flex w-full h-full items-center">
    <div class="flex">
      <n-icon
        size="32"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Satisfy"
        :component="Detail"
        @click="openModalSatisfy"
      />
    </div>
  </div>
</template>
