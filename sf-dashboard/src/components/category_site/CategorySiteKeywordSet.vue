<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { ModalState } from '@/types/components/modal'
import KeywordSetDetail from '@/views/details/KeywordSetDetail.vue'
const categorySiteStore = useCategorySite()

const dataModal = ref<ModalState>({})
const kwSetComp = ref<InstanceType<typeof KeywordSetDetail>>()

const props = defineProps({
  isInCateSiteBuilder: {
    type: Boolean,
    default: false,
  },
})

watch(
  () => categorySiteStore.isLoadingPage,
  (newVal, oldValue) => {
    if (!newVal && oldValue) {
      dataModal.value.id = categorySiteStore.categorySite.keyword_set_id || 0
    }
  }
)

const getDataKwSet = () => {
  return kwSetComp.value?.getDataKwSet()
}

defineExpose({
  getDataKwSet,
})
</script>

<template>
  <KeywordSetDetail
    ref="kwSetComp"
    :fromCategoySiteBuilder="true"
    :dataModal="dataModal"
    :isInCateSiteBuilder="props.isInCateSiteBuilder"
    v-if="!categorySiteStore.isLoadingPage"
  />
</template>
