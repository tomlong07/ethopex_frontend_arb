<script setup lang="ts">
import useRoleStore from '@/store/useRoleStore'

const roleStore = useRoleStore()

onMounted(async () => {
  await roleStore.fetchDemandOptions()
})
</script>

<template></template>
