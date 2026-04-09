<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'

import { useGoogleExcludeList } from '@/store/details/googleExcludeList'
import { useFeSettings } from '@/composables/feSettings'

// !! State
const googleExcludeListStore = useGoogleExcludeList()
googleExcludeListStore.idGoogleListExclude = Number(
  window.route?.params?.id || 0
)

googleExcludeListStore.resetGoogleExcludeListData()

const feSettings = toRef(googleExcludeListStore, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="googleExcludeListStore.feSettings?.page_list"
          name="Google Exclude List"
          v-if="googleExcludeListStore.feSettings?.page_list"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <!-- <div v-if="googleExcludeListStore.isLoading">
              <Skeleton />
            </div> -->

            <div class="mt-6">
              <n-card
                :title="googleExcludeListStore.cardTitle"
                class="card-flex-gap-4"
              >
                <GGExcludeForm />
                <GGExcludePlacements />
              </n-card>
            </div>
            <GGExcludeSubmit />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
