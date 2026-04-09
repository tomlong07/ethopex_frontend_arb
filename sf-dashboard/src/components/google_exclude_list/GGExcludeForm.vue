<script setup lang="ts">
import { useGoogleExcludeList } from '@/store/details/googleExcludeList'

// !! State

const googleExcludeListStore = useGoogleExcludeList()

// !! Lifecycle hook

onMounted(async () => {
  googleExcludeListStore.fetchGoogleExcludeListById()
})
</script>

<template>
  <div v-if="googleExcludeListStore.isFormLoading">
    <n-skeleton text :repeat="2" /> <n-skeleton text />
  </div>
  <div v-else class="flex flex-col gap-4">
    <GGExcludeName />
    <GGExcludeDescription />
  </div>
</template>
