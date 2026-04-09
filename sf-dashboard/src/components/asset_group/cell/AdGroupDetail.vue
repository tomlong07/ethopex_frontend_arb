<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import { useAssetGroupDetail } from '@/store/assetGroupDetail'
const assetGroupStore = useAssetGroupDetail()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const openModal = () => {
  assetGroupStore.showModalAsset = true
  assetGroupStore.infoAssetDetail = props.params.data?.accounts || ''
}
</script>
<template>
  <div class="cursor-pointer" @click="openModal">
    {{ props.params.data?.accounts }}
  </div>
</template>
