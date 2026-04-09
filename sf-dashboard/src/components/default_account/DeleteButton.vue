<script setup lang="ts">
import ctr_default_account from '@/services/ctr_default_account'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import TrashAltRegular from '@/assets/icons/TrashAltRegular.vue'
const isDeleting = ref(false)

const defaultAccountStore = useDefaultAccount()
const deleteBulkAccounts = async () => {
  // Lấy danh sách tên account từ selected rows
  const selectedAccountNames = Array.from(defaultAccountStore.selectedRows)
    .map((key) => {
      const row = defaultAccountStore.tableData.find((item) => item.key === key)
      return row?.name
    })
    .filter(Boolean)
  const ok = confirm(
    `Are you sure you want to delete ${selectedAccountNames.length} account(s)?`
  )
  if (!ok) return

  isDeleting.value = true

  try {
    const result = await ctr_default_account.RemoveAccountDefault({
      id: defaultAccountStore.id,
      accounts: selectedAccountNames,
    })

    if (result.status) {
      // Xóa các row đã chọn khỏi UI
      defaultAccountStore.tableData = defaultAccountStore.tableData.filter(
        (item) => !defaultAccountStore.selectedRows.has(item.key)
      )
      defaultAccountStore.deleteTableItems(defaultAccountStore.selectedRowKeys)
      defaultAccountStore.selectedRows.clear()
      defaultAccountStore.selectedRowKeys = []

      window.message.success(
        `Deleted ${selectedAccountNames.length} account(s) successfully.`
      )
    }
  } catch {
    window.message.error('Failed to delete accounts')
  } finally {
    isDeleting.value = false
  }
}
</script>

<template>
  <n-button
    type="error"
    size="small"
    :loading="isDeleting"
    :disabled="isDeleting || defaultAccountStore.selectedRows.size <= 0"
    @click="deleteBulkAccounts"
  >
    <template #icon>
      <n-icon :size="14">
        <TrashAltRegular />
      </n-icon>
    </template>
    Delete
  </n-button>
</template>
