<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import { debounceV2 } from '@/utils'
import type { SelectOption } from 'naive-ui'

const assetGroupStore = useAssetGroupDetail()

const handleSearch = debounceV2(async (q: string = '') => {
  assetGroupStore.fetchUsers(q)
}, 300)

// Handle user selection change
const handleUserSelection = (val: number | null) => {
  if (val && assetGroupStore.userOptions.length > 0) {
    updateSelectedUserEmail(val)
  } else {
    clearSelectedUserEmail()
  }
}

const updateSelectedUserEmail = (val: number) => {
  const selectedUser = assetGroupStore.userOptions.find(
    (user) => user.value === val
  ) as SelectOption | undefined
  if (selectedUser && typeof selectedUser.label === 'string') {
    assetGroupStore.setSelectedUserEmail(selectedUser.label)
  }
}

// Clear selected user email
const clearSelectedUserEmail = () => {
  assetGroupStore.setSelectedUserEmail('')
}
const name = 'Publishers'
</script>

<template>
  <div class="flex items-center">
    <div class="w-48 font-bold">{{ name }}</div>
    <div class="w-[calc(100%-12rem)]">
      <n-select
        v-model:value="assetGroupStore.assetGroup.user_id"
        :placeholder="`Select ${name}`"
        clearable
        filterable
        remote
        :disabled="assetGroupStore.isFromGetByPublisher"
        :options="assetGroupStore.userOptions"
        @search="handleSearch"
        @update:value="handleUserSelection"
      />
    </div>
  </div>
</template>
