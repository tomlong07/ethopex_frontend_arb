<script setup lang="ts">
import { ctr_category } from '@/services/ctr_category'
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()

onMounted(async () => {
  const result = await ctr_category.getCategoryIAB()

  accountAdStore.categoryOptions = result?.data || []
})
</script>

<template></template>
