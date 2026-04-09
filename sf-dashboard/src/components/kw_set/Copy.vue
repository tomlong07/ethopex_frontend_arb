<template>
  <n-card
    title="Campaigns are being used"
    v-if="kwsetStore.dataConfig.campaigns && kwsetStore.isShowFull"
    class="mb-4"
  >
    <template #header-extra
      ><n-button
        color="#49a0f9"
        size="medium"
        type="success"
        @click="copyCampaignId"
      >
        Copy
      </n-button></template
    >
    <SkeletonTable v-if="kwsetStore.isDisable" />
    <div class="w-full" v-else>
      <n-space align="center" class="mb-3">
        <n-tag type="info" class="n-tag-exclude">
          {{ kwsetStore.campaignsUsedStatsFormatted.total }} items
        </n-tag>

        <n-tag type="success" class="n-tag-exclude">
          ON {{ kwsetStore.campaignsUsedStatsFormatted.total_on }}
        </n-tag>

        <n-tag type="error" class="n-tag-exclude">
          OFF {{ kwsetStore.campaignsUsedStatsFormatted.total_off }}
        </n-tag>
      </n-space>

      <ag-grid-vue
        :theme="customTheme"
        :animate-rows="true"
        dom-layout="autoHeight"
        :column-defs="columnsDef"
        :enable-cell-text-selection="true"
        :row-data="kwsetStore.dataConfig.campaigns"
      />

      <div class="flex justify-end mt-3">
        <n-pagination
          v-model:page="kwsetStore.payloadCampaignsUsed.page"
          v-model:page-size="kwsetStore.payloadCampaignsUsed.size"
          :item-count="kwsetStore.campaignsUsedStats.total"
          show-size-picker
          :page-slot="5"
          :page-sizes="[50, 100, 200]"
          @update:page="kwsetStore.onChangePage"
          @update:page-size="kwsetStore.onChangePageSize"
        />
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import { newColumnsDefKeywordSet } from '@/constants/keywordSet'
import { themeAlpine } from 'ag-grid-community'
import SkeletonTable from '@/components/template-v2/skeleton/SkeletonTable.vue'
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
const kwsetStore = useKeywordSetStore()
const columnsDef = newColumnsDefKeywordSet()
const stringCampaignID = computed(() => {
  var stringCampID = ''
  kwsetStore.dataConfig.campaigns?.forEach((item, index) => {
    const id = item.id
    stringCampID = stringCampID + id
    if (kwsetStore.dataConfig.campaigns) {
      if (index < kwsetStore.dataConfig.campaigns?.length - 1) {
        stringCampID = stringCampID + ','
      }
    }
  })

  return stringCampID
})
const copyToClipBoard = (s: string | undefined) => {
  if (s !== undefined) {
    helper.copyText(s)
    window.message.success('Copied to clipboard!')
  }
}

const copyCampaignId = () => {
  copyToClipBoard(stringCampaignID.value)
}
</script>

<style scoped>
:deep(.n-card-header) {
  padding-bottom: 5px !important;
}
</style>
