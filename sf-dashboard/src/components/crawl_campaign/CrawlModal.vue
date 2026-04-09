<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'

import { TabInfo } from '@/types/state/template'
import helper from '@/utils/helper'
import { IconTrafficSourcesCDN } from '@/map/campaign'
const templateV2Store = useTemplateV2(helper.truePath())()

import useGeneralStore from '@/store/useGeneralStore'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
const generalStore = useGeneralStore()

const isShowModal = ref<boolean>(false)

const onClickCampaignV2 = (item: TabInfo, event: MouseEvent) => {
  const url = item.key
  if (!item.key || !url) {
    window.message.warning('This traffic source is not available now!')
    return
  }

  // Check if Ctrl, Command, or middle click
  if (event.ctrlKey || event.metaKey || event.button === 1) {
    window.open(url, '_blank')
  } else {
    window.router.push({ path: url })
  }
}

const trafficSourceAdd = ref()

onMounted(async () => {
  const result = await ctr_crawl_campaign.CampaignPresetSettings()
  trafficSourceAdd.value = result?.data || []
})

const getInfo = (ts: string) => {
  return IconTrafficSourcesCDN[ts] || null
}
</script>

<template>
  <div class="flex items-center py-2 pl-2">
    <n-button
      class="mr-4"
      color="#f43f5e"
      size="small"
      @click="isShowModal = true"
    >
      Add Preset
    </n-button>
  </div>
  <n-modal v-model:show="isShowModal">
    <n-card
      style="width: 1000px"
      title="Choose a traffic source to create a preset!"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      tabindex="-1"
    >
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(item, index) in trafficSourceAdd"
          :key="index"
          class="flex flex-col justify-center items-center mb-4 p-4 border-dotted border-2 border-gray-400 cursor-pointer rainbow"
          @click="(e) => onClickCampaignV2(item, e)"
          @mousedown.middle="(e) => onClickCampaignV2(item, e)"
        >
          <img
            class="rounded p-0.5"
            :style="
              generalStore.isDark ? { backgroundColor: 'white' } : undefined
            "
            :src="getInfo(item.logo)?.URL()"
            :width="getInfo(item.logo)?.size"
            :height="getInfo(item.logo)?.size"
            loading="lazy"
          />
          <div class="text-lg font-semibold">
            {{ helper.capitalizeFirstLetter(item.logo) }}
          </div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>
<style scoped lang="scss">
@use '@/css/CampaignGroupBy.scss';
</style>
