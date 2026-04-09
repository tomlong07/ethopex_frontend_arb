<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import useBrandStore from '@/store/useBrandStore'
const brandStore = useBrandStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const getId = computed(() => props.params.data?.id)

const update = () => {
  brandStore.createType = 'edit'
  brandStore.openModal()
  brandStore.getById(getId.value)
}
</script>
<template>
  <div class="flex w-full h-full items-center">
    <button>
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="Settings20Regular"
        @click="update"
      />
    </button>
  </div>
</template>
