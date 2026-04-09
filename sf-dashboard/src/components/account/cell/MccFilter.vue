<script setup lang="ts">
import { promotionStatusOptions } from '@/options/acount'
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()
const selectedStatus = ref<string>()

const onUpdate = () => {
  accountAdStore.filterAccoutMcc(selectedStatus.value)
}
</script>

<template>
  <!-- filter -->
  <div
    class="flex justify-between bg-card text-start font-semibold border-l border-r border-t p-2 gap-2"
  >
    <!-- total of rows -->
    <div class="flex items-center gap-2 w-2/3">
      <!-- Filter -->
      <n-select
        v-model:value="accountAdStore.accountMcc.mcc_id"
        placeholder="Mcc ID"
        clearable
        filterable
        class="w-full"
        :max-tag-count="1"
        :options="accountAdStore.mccOptions"
      />

      <n-select
        v-model:value="selectedStatus"
        placeholder="Status"
        clearable
        filterable
        class="w-full"
        :max-tag-count="1"
        :options="promotionStatusOptions"
      />
    </div>

    <!-- button -->
    <div class="flex items-center">
      <n-button @click="onUpdate" color="#f43f5e" size="small" type="primary">
        Update
      </n-button>
    </div>
  </div>
</template>
