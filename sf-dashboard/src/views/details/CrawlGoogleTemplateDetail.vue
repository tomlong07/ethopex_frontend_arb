<script setup lang="ts">
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import BackPage from '@/components/common/BackPage.vue'

import { useFeSettings } from '@/composables/feSettings'

const crawlGoogleTemplateStore = useCrawlGoogleTemplate()

const feSettings = toRef(crawlGoogleTemplateStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)
onMounted(() => {
  crawlGoogleTemplateStore.initData()
})

const isShowPurchase = window.arb.isAdmin() || window.arb.isDev()
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-2/3 5xl:w-1/2">
        <BackPage
          name="Campaign Presets"
          :url="crawlGoogleTemplateStore.feSettings?.page_list"
          v-if="crawlGoogleTemplateStore.feSettings?.page_list"
        />
        <div v-if="crawlGoogleTemplateStore.isLoading">
          <Skeleton />
        </div>
        <div v-else class="flex mt-6">
          <n-card title="Google Preset" class="card-flex-gap-4">
            <CrawlGGBody />
          </n-card>
        </div>
        <CrawlGGSubmit />
      </div>
    </div>
  </div>
</template>
