<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import BackPage from '@/components/common/BackPage.vue'

import { useFeSettings } from '@/composables/feSettings'
import AssetGroupStatus from '@/components/asset_group/AssetGroupStatus.vue'
import AssetGroupTable from '@/components/asset_group/AssetGroupTable.vue'
import AssetGroupSubmit from '@/components/asset_group/AssetGroupSubmit.vue'
import AssetGroupUsers from '@/components/asset_group/AssetGroupUsers.vue'

const assetGroupStore = useAssetGroupDetail()

const feSettings = toRef(assetGroupStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

onMounted(() => {
  assetGroupStore.initData()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          v-if="assetGroupStore.feSettings?.page_list"
          :url="assetGroupStore.feSettings?.page_list"
          name="Asset Group"
        />
        <div v-if="assetGroupStore.isLoading">
          <Skeleton />
        </div>
        <div v-else class="flex mt-6">
          <n-card title="Asset Group" class="card-flex-gap-4">
            <AssetGroupUsers />
            <!-- <ASG.AssetGroupName /> -->
            <AssetGroupStatus />

            <AssetGroupTrafficSource
              v-if="assetGroupStore.macroValueOptions.length > 0"
            />
            <div
              v-if="
                assetGroupStore.hasNoTrafficSource &&
                assetGroupStore.selectedUserEmail
              "
              class="no-traffic-source-message"
            >
              <n-alert type="warning" :show-icon="true">
                <template #header> Publisher has no traffic source </template>
              </n-alert>
            </div>
            <AssetGroupTable />
          </n-card>
        </div>
        <AssetGroupSubmit />
      </div>
    </div>
  </div>
</template>
<style scoped>
.asset-group-card .n-card {
  margin-top: -46px;
}
.asset-group-card .n-tabs.n-tabs--top .n-tab-pane {
  padding: 0;
}
.asset-group-card .n-card .n-card__content {
  margin-top: 0.5rem !important;
}
</style>
