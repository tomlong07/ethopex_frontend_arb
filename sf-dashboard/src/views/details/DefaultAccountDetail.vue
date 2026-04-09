<script setup lang="ts">
import { useDefaultAccount } from '@/store/details/defaultAccount'
import BackPage from '@/components/common/BackPage.vue'
import SkeletonTable from '@/components/template-v2/skeleton/SkeletonTable.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { useFeSettings } from '@/composables/feSettings'
import Global from '@/components/default_account/Global.vue'
import MaxSpendStatus from '@/components/default_account/MaxSpendStatus.vue'
import MaxSpend from '@/components/default_account/MaxSpend.vue'
import CategoryAllocation from '@/components/default_account/CategoryAllocation.vue'
import MaxCampaignStatus from '@/components/default_account/MaxCampaignStatus.vue'
import MaxCampaign from '@/components/default_account/MaxCampaign.vue'
import Accounts from '@/components/default_account/Accounts.vue'
import Submit from '@/components/default_account/Submit.vue'
import FilterAction from '@/components/default_account/FilterAction.vue'
import SelectAllButton from '@/components/default_account/SelectAllButton.vue'
import CopyButton from '@/components/default_account/CopyButton.vue'
import DeleteButton from '@/components/default_account/DeleteButton.vue'
import TableDefaultAccount from '@/components/default_account/TableDefaultAccount.vue'

const defaultAccountStore = useDefaultAccount()

const feSettings = toRef(defaultAccountStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

const getPermissionAsyncConfig = async () => {
  if (!window.route?.meta?.url) return
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  defaultAccountStore.setPermissionAsyncConfigs(result.data || {})
}

onMounted(async () => {
  defaultAccountStore.clearData()

  getPermissionAsyncConfig()

  if (defaultAccountStore.isEditPage) {
    defaultAccountStore.getById()
    await defaultAccountStore.fetchTableData()
  } else {
    defaultAccountStore.isLoading = false
  }
})

onUnmounted(() => {
  defaultAccountStore.selectedAllTotal = false
  defaultAccountStore.selectedRows = new Set()
  defaultAccountStore.selectedRowKeys = []
})

watch(
  () => defaultAccountStore.selectedRowKeys,
  (newKeys) => {
    defaultAccountStore.selectedRows = new Set(newKeys)
  },
  { deep: true, immediate: true }
)
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-2/3">
        <BackPage
          :url="defaultAccountStore.feSettings?.page_list"
          :name="defaultAccountStore.name"
          v-if="defaultAccountStore.feSettings?.page_list"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div v-if="defaultAccountStore.isLoading">
              <Skeleton />
            </div>
            <div v-else class="flex mt-6">
              <n-card :title="defaultAccountStore.name" class="card-flex-gap-4">
                <DefaultAccountName />
                <DefaultAccountTrafficSource />
                <DefaultAccountDemandSource />
                <Global />
                <MaxSpendStatus />
                <MaxSpend />
                <CategoryAllocation />
                <MaxCampaignStatus />
                <MaxCampaign />
                <Accounts />
                <Submit />
              </n-card>
            </div>
            <n-card class="mt-6 min-h-80" v-if="defaultAccountStore.isEditPage">
              <div class="mb-6 flex justify-between items-center">
                <span class="font-semibold text-xl">Account List</span>

                <div class="flex gap-2">
                  <n-button
                    secondary
                    type="primary"
                    class="cursor-default"
                    size="small"
                  >
                    Total Accounts:
                    <span class="font-semibold ml-1">
                      {{ defaultAccountStore.totalRecord }}</span
                    >
                  </n-button>
                  <n-button
                    secondary
                    type="success"
                    class="cursor-default"
                    size="small"
                  >
                    Enabled:
                    <span class="font-semibold ml-1">
                      {{ defaultAccountStore.totalEnabled }}</span
                    >
                  </n-button>
                  <n-button
                    secondary
                    type="error"
                    class="cursor-default"
                    size="small"
                  >
                    Suspended:
                    <span class="font-semibold ml-1">
                      {{ defaultAccountStore.totalSuspended }}</span
                    >
                  </n-button>
                </div>
              </div>
              <div class="mb-4 flex gap-2 items-center justify-between">
                <FilterAction />
              </div>

              <div class="mb-4 flex gap-2 items-center">
                <SelectAllButton />
                <CopyButton />
                <DeleteButton />
              </div>

              <div v-if="defaultAccountStore.loadingTable">
                <SkeletonTable />
              </div>

              <TableDefaultAccount v-else />
            </n-card>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
