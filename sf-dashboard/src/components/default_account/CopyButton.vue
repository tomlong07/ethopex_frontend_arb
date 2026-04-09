<template>
  <n-button
    secondary
    :loading="isLoadingNames"
    type="info"
    size="small"
    @click="copySelectedNames"
  >
    <template #icon>
      <n-icon :size="14">
        <Copy />
      </n-icon>
    </template>
    Names
  </n-button>
  <n-button
    secondary
    :loading="isLoadingShowNames"
    type="info"
    size="small"
    @click="copySelectedShowNames"
  >
    <template #icon>
      <n-icon :size="14">
        <Copy />
      </n-icon>
    </template>
    Show Names
  </n-button>
  <n-button
    secondary
    :loading="isLoadingCategories"
    v-if="isDisplay"
    type="info"
    size="small"
    @click="copySelectedCategories"
  >
    <template #icon>
      <n-icon :size="14">
        <Copy />
      </n-icon>
    </template>
    Categories
  </n-button>
</template>
<script lang="ts" setup>
import { useDefaultAccount } from '@/store/details/defaultAccount'
import Copy from '@/assets/icons/Copy.vue'
import { ONOFF } from '@/enum/campaign'
import ctr_default_account from '@/services/ctr_default_account'
const defaultAccountStore = useDefaultAccount()

const isDisplay = computed(() => {
  return defaultAccountStore.initCategoryAllocation === ONOFF.ON
})

const isLoadingNames = ref<boolean>(false)
const isLoadingShowNames = ref<boolean>(false)
const isLoadingCategories = ref<boolean>(false)

const GetDataCopy = async (isLoading: Ref<boolean>, type?: string) => {
  if (!defaultAccountStore.selectedAllTotal) return
  if (defaultAccountStore.tableData.length > 0) {
    const payload = {
      ...defaultAccountStore.payloadAccounts,
      size: defaultAccountStore.totalRecord,
      copy_field: type,
    }
    try {
      isLoading.value = true
      helper.sleep(500)
      const result = await ctr_default_account.GetDataTable(payload)
      return result
    } finally {
      isLoading.value = false
    }
  }
}

const copySelectedNames = async () => {
  try {
    let namesToCopy: string[] = []

    if (defaultAccountStore.selectedAllTotal) {
      const result = await GetDataCopy(isLoadingNames, 'name')
      namesToCopy = Array.isArray(result.data) ? result.data : []
    } else {
      if (defaultAccountStore.selectedRows.size > 0) {
        namesToCopy = Array.from(defaultAccountStore.selectedRows)
          .map((key) => {
            const row = defaultAccountStore.tableData.find(
              (item) => item.key === key
            )
            return row?.name
          })
          .filter(Boolean) as string[]
      } else {
        namesToCopy = defaultAccountStore.tableData
          .map((item) => item.name)
          .filter(Boolean) as string[]
      }
    }

    if (namesToCopy.length > 0) {
      const textToCopy = namesToCopy.join(', ')
      await navigator.clipboard.writeText(textToCopy)
      window.message.success(`${namesToCopy.length} name copied to clipboard`)
    } else {
      window.message.warning('Name empty')
    }
  } catch (err) {
    console.error(err)
    window.message.error('Failed to copy names to clipboard')
  }
}
const copySelectedShowNames = async () => {
  try {
    let showNamesToCopy = []

    if (defaultAccountStore.selectedAllTotal) {
      const result = await GetDataCopy(isLoadingShowNames, 'show_name')
      showNamesToCopy = Array.isArray(result.data) ? result.data : []
    } else {
      if (defaultAccountStore.selectedRows.size > 0) {
        showNamesToCopy = Array.from(defaultAccountStore.selectedRows)
          .map((key) => {
            const row = defaultAccountStore.tableData.find(
              (item) => item.key === key
            )
            return row?.show_name
          })
          .filter(Boolean) as string[]
      } else {
        showNamesToCopy = defaultAccountStore.tableData
          .map((item) => item.show_name)
          .filter(Boolean) as string[]
      }
    }

    if (showNamesToCopy.length > 0) {
      const textToCopy = showNamesToCopy.join(', ')
      await navigator.clipboard.writeText(textToCopy)
      window.message.success(
        `${showNamesToCopy.length} show name copied to clipboard`
      )
    } else {
      window.message.warning(`Show name empty`)
    }
  } catch {
    window.message.error('Failed to copy show names to clipboard')
  }
}
const copySelectedCategories = async () => {
  if (defaultAccountStore.initCategoryAllocation === ONOFF.OFF) {
    window.message.warning('Category allocation is off')
    return
  }
  try {
    let categoriesToCopy = []

    if (defaultAccountStore.selectedAllTotal) {
      const result = await GetDataCopy(isLoadingCategories, 'category')
      categoriesToCopy = Array.isArray(result.data) ? result.data : []
    } else {
      if (defaultAccountStore.selectedRows.size > 0) {
        categoriesToCopy = Array.from(defaultAccountStore.selectedRows)
          .map((key) => {
            const row = defaultAccountStore.tableData.find(
              (item) => item.key === key
            )
            return row?.category
          })
          .filter(Boolean) as string[]
      } else {
        categoriesToCopy = defaultAccountStore.tableData
          .map((item) => item.category)
          .filter(Boolean) as string[]
      }
    }

    if (categoriesToCopy.length > 0) {
      const textToCopy = categoriesToCopy.join(', ')
      await navigator.clipboard.writeText(textToCopy)
      window.message.success(
        `${categoriesToCopy.length} category copied to clipboard`
      )
    } else {
      window.message.warning(`Category empty`)
    }
  } catch {
    window.message.error('Failed to copy categories to clipboard')
  }
}
</script>
