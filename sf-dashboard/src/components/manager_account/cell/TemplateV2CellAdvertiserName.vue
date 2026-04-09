<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const GetByAdvertiserID = async () => {
  if (!props.params.value || !props.params.data?.advertiser_id) return
  accountAdStore.id = props.params?.data?.advertiser_id as string

  accountAdStore.type = 'advertiser'
  accountAdStore.showModal = true
}
</script>
<template>
  <div
    class="cursor-pointer text-blue-500 hover:text-red-500"
    @click="GetByAdvertiserID"
  >
    {{ props.params.value }}
  </div>
</template>
