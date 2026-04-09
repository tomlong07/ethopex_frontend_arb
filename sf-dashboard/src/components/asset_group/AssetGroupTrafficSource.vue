<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import AssetGroupAdAccounts from './AssetGroupAdAccounts.vue'
import AssetGroupFanpages from './AssetGroupFanpages.vue'
const assetGroupStore = useAssetGroupDetail()
</script>
<template>
  <div class="mb-4">
    <div
      class="w-full font-bold"
      :class="assetGroupStore.macroValueOptions.length > 0 ? 'mb-4' : 'mb-8'"
    ></div>
    <template v-if="assetGroupStore.isLoadingTrafficSource">
      <n-spin size="small" />
    </template>
    <div v-else class="w-full macro">
      <n-tabs
        v-show="!assetGroupStore.isLoadingTrafficSource"
        type="card"
        tab-style="min-width: 80px;"
        v-model:value="assetGroupStore.currentTrafficSource"
        @update:value="assetGroupStore.handleTabChange"
      >
        <n-tab-pane
          v-for="(item, index) in assetGroupStore.macroValueOptions"
          :key="index"
          class="tab-pane-macros"
          :name="item.value"
          :tab="item.label"
        >
          <div
            class="asset-group-card"
            v-if="assetGroupStore.macroValueOptions.length > 0"
          >
            <n-card>
              <AssetGroupAdAccounts :index="index" />
              <AssetGroupFanpages
                v-if="item.value === 'facebook'"
                :index="index"
              />
            </n-card>
          </div>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>
