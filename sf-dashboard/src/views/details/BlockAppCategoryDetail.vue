<script setup lang="ts">
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import BackPage from '@/components/common/BackPage.vue'

import { useFeSettings } from '@/composables/feSettings'

const blockAppCategoryStore = useBlockAppCategory()

const feSettings = toRef(blockAppCategoryStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

onMounted(() => {
  blockAppCategoryStore.initData()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="blockAppCategoryStore.feSettings?.page_list"
          name="Block App Category"
          v-if="blockAppCategoryStore.feSettings?.page_list"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div v-if="blockAppCategoryStore.isLoading">
              <Skeleton />
            </div>
            <div v-else class="flex mt-6">
              <n-card title="Block App Category" class="card-flex-gap-4">
                <BlockAppName />
                <BlockAppAdAccounts />
                <BlockAppCategories />
                <BlockAppExcludeList />
                <BlockAppModalBulkEntry />
              </n-card>
            </div>
            <BlockAppSubmit />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
