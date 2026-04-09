<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'
import { NTooltip, SelectOption } from 'naive-ui'

import { CampaignStatus } from '@/definitions/accounts/campaignStatus'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { optionPage } from '@/options/filter'

const accountAdStore = useAccountAd()

const typeOptions = ref<SelectOption[]>([])

const cpStatusOptions = ref<SelectOption[]>(CampaignStatus)

const ListLabels = computed(() => {
  const empty = [{ label: 'Empty', value: 'none' }]
  const labels = accountAdStore.listLabel?.data?.labels ?? []
  return [...empty, ...labels]
})

const onPageSizeChanged = (value: any) => {
  if (accountAdStore.gridApi) {
    const pageSize = Number(value)

    if (pageSize && pageSize >= 1) {
      accountAdStore.currentPagingDetail.size = pageSize
      accountAdStore.gridApi.setGridOption('paginationPageSize', pageSize)
    }
  }
}

const onUpdate = async () => {
  accountAdStore.gridApi?.showLoadingOverlay()
  await accountAdStore.GetAccountAdsDetail()
  accountAdStore.gridApi?.hideOverlay()
}

const getFilterMcc = async () => {
  const result = await ctr_filter_v2.GetFilterMcc()
  typeOptions.value = result?.data || undefined
}

onMounted(async () => {
  await Promise.all([onUpdate(), getFilterMcc()])
})

const initDataFilter = async () => {
  await Promise.all([
    accountAdStore.getListExcludeGoogle(),
    accountAdStore.getListLabel(),
  ])
}

watch(
  () => accountAdStore.isGoogleAccount,
  async (v) => {
    if (v) {
      await initDataFilter()
    }
  },
  { immediate: true }
)

const handleCreateAccountId = (value: string) => {
  if (!value?.trim()) return value

  const isBulkInput =
    value.includes(',') || value.includes('\n') || value.includes('\t')

  if (isBulkInput) {
    const newIds = value
      .split(/[\n,\t\s]+/)
      .map((id) => id.trim())
      .filter((id) => id.length > 0 && /^[a-zA-Z0-9-_]+$/.test(id))

    if (newIds.length > 0) {
      const currentIds =
        accountAdStore.accountAdsDetailCondition.account_ids || []
      const uniqueNewIds = newIds.filter((id) => !currentIds.includes(id))

      if (uniqueNewIds.length > 0) {
        accountAdStore.accountAdsDetailCondition.account_ids = [
          ...currentIds,
          ...uniqueNewIds,
        ]
      }

      return ''
    }
  } else {
    const trimmedValue = value.trim()
    if (!/^[a-zA-Z0-9-_]+$/.test(trimmedValue)) {
      return trimmedValue
    }
    const currentIds =
      accountAdStore.accountAdsDetailCondition.account_ids || []
    if (currentIds.includes(trimmedValue)) {
      return ''
    }
    accountAdStore.accountAdsDetailCondition.account_ids = [
      ...currentIds,
      trimmedValue,
    ]

    return ''
  }

  return value
}

const handlePasteAccountId = (event: ClipboardEvent) => {
  event.preventDefault()
  const pastedData = event.clipboardData?.getData('text') || ''

  if (pastedData) {
    handleCreateAccountId(pastedData)
  }
}

const renderLabel = (option: any) => {
  return h(
    NTooltip,
    {},
    {
      trigger: () => h('span', option.label),
      default: () => option.label,
    }
  )
}
</script>
<template>
  <!-- filter -->
  <div
    class="flex justify-between bg-card text-start font-semibold border-l border-r border-t p-2 gap-2"
  >
    <!-- total of rows -->
    <div class="flex items-center gap-2 w-2/3">
      <!-- Pagination -->
      <n-space vertical>
        <n-select
          v-model:value="accountAdStore.currentPagingDetail.size"
          :options="optionPage.options"
          class="w-20"
          :max-tag-count="1"
          :on-update:value="onPageSizeChanged"
        />
      </n-space>
      <!-- Filter -->
      <n-select
        v-if="accountAdStore.isGoogleAccount"
        v-model:value="accountAdStore.accountAdsDetailCondition.type"
        placeholder="Mcc ID"
        clearable
        filterable
        multiple
        class="w-full"
        :max-tag-count="0"
        :options="typeOptions"
        :consistent-menu-width="false"
        :render-label="renderLabel"
      />

      <n-select
        v-if="accountAdStore.isGoogleAccount"
        v-model:value="accountAdStore.accountAdsDetailCondition.cp_status"
        placeholder="Promotion status"
        clearable
        filterable
        multiple
        class="w-full"
        :max-tag-count="0"
        :consistent-menu-width="false"
        :options="cpStatusOptions"
      />

      <n-select
        v-if="accountAdStore.isGoogleAccount"
        v-model:value="
          accountAdStore.accountAdsDetailCondition.list_exclude_scan
        "
        placeholder="List exclude"
        clearable
        filterable
        multiple
        :max-tag-count="0"
        class="w-full"
        :options="accountAdStore.excludeGoogle?.data?.list_exclude_scan || []"
      />

      <n-select
        v-if="accountAdStore.isGoogleAccount"
        v-model:value="accountAdStore.accountAdsDetailCondition.labels"
        placeholder="Label"
        clearable
        filterable
        multiple
        :max-tag-count="0"
        class="w-full"
        :options="ListLabels"
      />

      <n-tooltip trigger="hover" placement="top" :style="{ maxWidth: '400px' }">
        <template #trigger>
          <n-select
            v-show="accountAdStore.isGoogleAccount"
            v-model:value="accountAdStore.accountAdsDetailCondition.account_ids"
            placeholder="Account IDs"
            clearable
            filterable
            multiple
            tag
            :max-tag-count="0"
            class="w-full"
            :options="[]"
            :allow-input="true"
            :show-create-when-filtering="true"
            :create="handleCreateAccountId"
            @keydown.enter.prevent
            @paste="handlePasteAccountId"
          >
            <template #empty>
              <n-empty description="Type, paste account IDs" />
            </template>
          </n-select>
        </template>
        Enter account IDs manually or paste multiple IDs (separated by commas,
        newlines)
      </n-tooltip>
    </div>

    <!-- button -->
    <div class="flex items-center">
      <n-input
        v-model:value="accountAdStore.searchText"
        placeholder="Search..."
        clearable
        class="w-64 mr-2"
        @keyup.enter="onUpdate"
      />
      <n-button
        color="#f43f5e"
        :disabled="accountAdStore.isLoadingTable"
        size="small"
        type="primary"
        @click="onUpdate"
      >
        Update
      </n-button>
    </div>
  </div>
</template>
