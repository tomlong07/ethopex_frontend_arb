<script setup lang="ts">
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import BackPage from '@/components/common/BackPage.vue'
import { useFeSettings } from '@/composables/feSettings'

import modalCrawlCamp from '@/store/modalCrawlCamp'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const storeModalCrawl = modalCrawlCamp()

const feSettings = toRef(crawlFacebookTemplateStore, 'feSettings')
useFeSettings(feSettings, window.route?.meta?.url as string)

onMounted(() => {
  if (storeModalCrawl.showDrawerPreset) return
  crawlFacebookTemplateStore.initData()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-2/3 5xl:w-1/2">
        <BackPage
          :url="crawlFacebookTemplateStore.feSettings?.page_list"
          name="Campaign Presets"
          v-if="crawlFacebookTemplateStore.feSettings?.page_list"
        />
        <div v-if="crawlFacebookTemplateStore.isLoading">
          <Skeleton />
        </div>
        <div v-else class="flex mt-6">
          <n-card title="Facebook Preset" class="card-flex-gap-4">
            <CrawlFbBody />
          </n-card>
        </div>
        <CrawlFBSubmit />
      </div>
    </div>
  </div>
</template>
