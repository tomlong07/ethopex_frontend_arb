<script setup lang="ts">
import DataTable from '@/components/activity/DataTable.vue'
import { useModalSettingStore } from '@/store/activity/modalSetting'
import { useDataTableStore } from '@/store/activity/dataTable'
const dataTableStore = useDataTableStore()

const ModalSetting = defineAsyncComponent(
  () => import('@/components/activity/ModalSetting.vue')
)

const modalSettinglStore = useModalSettingStore()

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
})

onBeforeMount(() => {
  dataTableStore.isStyle = true
})

onBeforeUnmount(() => {
  dataTableStore.isStyle = false
})
</script>

<template>
  <div
    class="h-full flex flex-col px-3 flex-1 custom-bg-full"
    :class="props.isModal ? '' : 'mt-6'"
  >
    <ActivityGroupFilter :isModal="props.isModal" />
    <DataTable :isModal="props.isModal" />
    <ModalSetting v-if="modalSettinglStore.showModal" />
  </div>
</template>
