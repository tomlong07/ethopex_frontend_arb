<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useManagerFacebookBusiness from '@/store/useManagerFacebookBusiness'

const managerFbBusinessStore = useManagerFacebookBusiness()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const GetByAdvertiserID = async () => {
  if (!props.params.data.id) return
  managerFbBusinessStore.id = props.params?.data?.id as string
  managerFbBusinessStore.type = 'advertiser'
  managerFbBusinessStore.showModal = true
}
</script>
<template>
  <div class="flex items-center gap-2" title="Double click to edit">
    <div
      class="cursor-pointer text-blue-500 hover:text-red-500"
      @click="GetByAdvertiserID"
    >
      {{ props.params.value }}
    </div>
  </div>
</template>
