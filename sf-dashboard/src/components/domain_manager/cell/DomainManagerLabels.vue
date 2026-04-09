<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useDomainManagerStore from '@/store/useDomainManagerStore'

const domainManagerStore = useDomainManagerStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const updateLabelsDomainManager = () => {
  if (!props.params.data.id) return

  domainManagerStore.dataLabels = {
    id: props.params?.data?.id,
    labels: props.params.value ? helper.clone(props.params.value) : [],
  }
  domainManagerStore.showModal = true
}

const itemsNow = computed(() => {
  return props.params.value || []
})

const titleNow = computed(() => {
  return itemsNow.value.join(', ')
})
</script>
<template>
  <div class="cursor-pointer" @click="updateLabelsDomainManager">
    <div
      v-if="itemsNow.length"
      class="flex gap-2 flex-wrap overflow-hidden p-2"
      :title="titleNow"
    >
      <div
        v-for="(item, index) in itemsNow"
        :key="index"
        class="flex items-center gap-2"
      >
        <n-tag
          round
          class="cursor-pointer py-2 rounded n-tag-exclude"
          size="medium"
          type="primary"
        >
          {{ item }}
        </n-tag>
      </div>
    </div>
    <span v-else class="p-2">Click to set</span>
  </div>
</template>
