<script setup lang="ts">

import { useKeywordSetStore } from '@/store/details/kwsetStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const kwsetStore = useKeywordSetStore()

</script>

<template>
  <div class="flex">
    <FloatingWrapper name="Country">
      <n-select
        v-model:value="kwsetStore.dataConfig.country"
        :options="kwsetStore.countryOptions"
        filterable
        clearable
        max-tag-count="responsive"
        @update:value="kwsetStore.updateTable()"
      />
    </FloatingWrapper>
  </div>
</template>
