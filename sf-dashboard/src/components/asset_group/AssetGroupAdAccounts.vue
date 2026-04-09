<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import BulkEntryModal from './BulkEntry/BulkEntryAdAccounts.vue'

const assetGroupStore = useAssetGroupDetail()

const baseName = 'Ad Accounts'
const selectedAccounts = ref<string | null>(null)

const handleAccountsChange = async (value: string) => {
  assetGroupStore.updateAssetGroupByTrafficSource(
    assetGroupStore.currentTrafficSource,
    {
      accounts: [value],
    }
  )
  selectedAccounts.value = null
}
</script>

<template>
  <div class="flex items-center">
    <div class="w-48 font-bold">
      {{ baseName }}
    </div>
    <div class="flex-1">
      <div class="flex items-center">
        <div class="flex-1">
          <n-select
            v-model:value="selectedAccounts"
            :placeholder="`Select ${baseName}`"
            clearable
            filterable
            label-field="name"
            value-field="value"
            :max-tag-count="10"
            :loading="assetGroupStore.loadingAdAccounts"
            :options="assetGroupStore.adAccountOptions"
            @update:value="handleAccountsChange"
          />
        </div>
        <BulkEntryModal type="accounts" />
      </div>
    </div>
  </div>
</template>
