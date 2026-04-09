<script setup lang="ts">
import useLayoutStore from '@/store/useLayoutStore'

const layoutStore = useLayoutStore()

onMounted(async () => {
  await layoutStore.getLayout()
})
</script>

<template></template>
