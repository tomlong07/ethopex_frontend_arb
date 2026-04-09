<script setup lang="ts">
import { ctr_keyword_set } from '@/services/ctr_keyword_set'
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const kwsetStore = useKeywordSetStore()
const demandSourceOptions = ref<SelectOption[]>([])

const fetchDemandSource = async () => {
  const result = await ctr_keyword_set.GetDemandSource()
  if (result?.status) {
    demandSourceOptions.value = result.data.map((item: any) => ({
      label: item.name,
      value: item.value,
    }))
  }
  return []
}

onMounted(() => {
  fetchDemandSource()
})
</script>

<template>
  <div class="flex">
    <FloatingWrapper name="Demand Source">
      <n-select
        :disabled="kwsetStore.isEditPage"
        v-model:value="kwsetStore.dataConfig.demand_source"
        :options="demandSourceOptions"
      />
    </FloatingWrapper>
  </div>
</template>
