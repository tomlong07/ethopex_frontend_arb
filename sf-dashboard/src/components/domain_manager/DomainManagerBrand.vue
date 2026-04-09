<script setup lang="ts">
import ctr_brand from '@/services/ctr_brand'
import useDomainManagerStore from '@/store/details/useDomainManager'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const domainConfig = useDomainManagerStore()

const brands = ref<any[]>([])

const fetchBrand = async () => {
  const result = await ctr_brand.GetAll()
  if (result.data) {
    brands.value = result.data || []
  }
}

onMounted(async () => {
  await fetchBrand()
})
</script>

<template>
  <FloatingWrapper name="Brand" rounded>
    <n-select
      label-field="brand_name"
      value-field="id"
      placeholder=""
      v-model:value="domainConfig.dataConfig.brand_id"
      clearable
      :options="brands"
    />
  </FloatingWrapper>
</template>
