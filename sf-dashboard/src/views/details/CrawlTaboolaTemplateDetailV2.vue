<script setup lang="ts">
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import BackPage from '@/components/common/BackPage.vue'
import { useFeSettings } from '@/composables/feSettings'

const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()

const feSettings = toRef(crawlTaboolaTemplateStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

onMounted(async () => {
  crawlTaboolaTemplateStore.initData()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-2/3 5xl:w-1/2">
        <BackPage
          :url="crawlTaboolaTemplateStore.feSettings?.page_list"
          name="Campaign Presets"
          v-if="crawlTaboolaTemplateStore.feSettings?.page_list"
          class="my-4"
        />
        <Skeleton v-if="crawlTaboolaTemplateStore.isLoading" />
        <n-card v-else title="Crawl Taboola Template" class="card-flex-gap-4">
          <CrawlTBBody />
        </n-card>
        <CrawlTBSubmit />
      </div>
    </div>
  </div>
</template>
