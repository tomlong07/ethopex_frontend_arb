<template>
  <div v-if="isDisplay" class="mr-10">
    {{ total_account }}
    <n-button size="small" class="ml-1" type="success" @click="selectAll">
      {{ name }}
    </n-button>
  </div>
</template>
<script setup lang="ts">
import { useDefaultAccount } from '@/store/details/defaultAccount'

const name = ref('')
const total_account = ref('')
const defaultAccountStore = useDefaultAccount()

const isDisplay = computed(() => {
  return (defaultAccountStore.selectedRowKeys || []).length > 0
})

watchEffect(() => {
  const total = defaultAccountStore.totalRecord || 0
  const selectedCount = (defaultAccountStore.selectedRowKeys || []).length

  if (defaultAccountStore.selectedAllTotal) {
    name.value = `UnSelected All`
    total_account.value = `All ${helper.formatNumber(total)} selected`
  } else {
    name.value = `Select All`
    total_account.value = `${helper.formatNumber(selectedCount)} selected`
  }
})

watch(
  () => defaultAccountStore.selectedRowKeys,
  (newKeys) => {
    if (
      defaultAccountStore.selectedAllTotal &&
      newKeys.length < (defaultAccountStore.tableData || []).length
    ) {
      defaultAccountStore.selectedAllTotal = false
    }
  },
  { deep: true }
)

const selectAll = async () => {
  if (!defaultAccountStore.selectedAllTotal) {
    defaultAccountStore.selectedAllTotal = true
    defaultAccountStore.selectedRowKeys = (
      defaultAccountStore.tableData || []
    ).map((r: any) => r.key)
  } else {
    defaultAccountStore.clearSelectAllSelection()
  }
}
</script>
