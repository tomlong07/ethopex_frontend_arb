<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import { useDefaultAccount } from '@/store/details/defaultAccount'
import { ctr_category } from '@/services/ctr_category'

const loadingAccount = ref<boolean>(false)
const loadingCategories = ref<boolean>(false)

const accountOptions = ref<SelectOption[]>([])
const categoryOptions = ref<SelectOption[]>([])

const defaultAccountStore = useDefaultAccount()

const clearSelection = () => {
  fetchAccount()
}

const fetchAccount = async (q = '') => {
  try {
    loadingAccount.value = true
    const response = await ctr_filter_v2.FilterAccount({
      q,
      f: '',
    })
    const accounts: SelectOption[] = response?.data || []
    accountOptions.value = accounts
  } catch (error) {
    console.error('Error fetching accounts:', error)
  } finally {
    loadingAccount.value = false
  }
}
const fetchCategories = async () => {
  try {
    loadingCategories.value = true
    const result = await ctr_category.getCategoryIAB()

    categoryOptions.value = [
      { label: 'All', value: 'all' },
      ...(result?.data?.map((item: any) => ({
        label: item.name,
        value: item.name,
      })) || []),
    ]
  } catch (error) {
    console.error('Error fetching accounts:', error)
  } finally {
    loadingCategories.value = false
  }
}
const applyFilter = () => {
  defaultAccountStore.fetchTableData(true)
}
const handleSearchAccounts = debounceV2(async (q: string = '') => {
  fetchAccount(q)
}, 500)
onMounted(() => {
  fetchAccount()
  fetchCategories()
})
</script>
<template>
  <div class="flex gap-2 items-center">
    <n-select
      v-model:value="defaultAccountStore.selectedNames"
      clearable
      filterable
      multiple
      size="small"
      :options="accountOptions"
      max-tag-count="responsive"
      :ellipsis-tag-popover-props="{ trigger: 'hover' }"
      placeholder="Filter Accounts"
      style="width: 200px; flex-shrink: 0"
      :loading="loadingAccount"
      @search="handleSearchAccounts"
      :consistent-menu-width="false"
      @clear="clearSelection()"
    />
    <n-select
      v-model:value="defaultAccountStore.selectedCategories"
      clearable
      filterable
      multiple
      size="small"
      :options="categoryOptions"
      :max-tag-count="1"
      :ellipsis-tag-popover-props="{ trigger: 'hover' }"
      placeholder="Filter Categories"
      style="width: 180px; flex-shrink: 0"
      :loading="loadingCategories"
    />
  </div>

  <n-button type="info" size="small" @click="applyFilter"> Update </n-button>
</template>
