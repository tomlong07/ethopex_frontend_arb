<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

onMounted(async () => {
  const result = await ctr_filter_v2.FilterTrafficSource({ general: '1' })

  templateV2Store.trafficOptions = result?.data || []
})
</script>

<template></template>
