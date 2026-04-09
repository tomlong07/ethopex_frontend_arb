<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import Close from '@/assets/icons/Close.vue'

const assetGroupStore = useAssetGroupDetail()
</script>

<template>
  <n-modal v-model:show="assetGroupStore.showModalAsset">
    <n-card
      style="width: 600px"
      title="Ad Account"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button @click="assetGroupStore.showModalAsset = false">
          <n-icon :component="Close" size="24" class="not-filter-icon" />
        </button>
      </template>
      {{ assetGroupStore.infoAssetDetail }}
    </n-card>
  </n-modal>
</template>
