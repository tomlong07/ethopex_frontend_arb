<script setup lang="ts">
// import SearchInput from '@/components/template-v2/filter/SearchInput.vue'
import useBrandStore from '@/store/useBrandStore'
const brandStore = useBrandStore()

const fetchBrand = () => {
  brandStore.fetchData()
}

onMounted(() => {
  fetchBrand()
})
const createBrand = () => {
  brandStore.createType = 'create'
  brandStore.openModal()
}
</script>

<template>
  <div class="p-3">
    <n-button color="#f43f5e" size="small" @click="createBrand">
      Add brand
    </n-button>

    <BrandModal />
  </div>
</template>
