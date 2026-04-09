<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'

import labelManagerDetail from '@/store/details/LabelManagerDetail'
import { ctr_label } from '@/services/ctr_label'
import { useFeSettings } from '@/composables/feSettings'

import AdsType from '@/components/label_mannager_detail/LabelAdsType.vue'
import Description from '@/components/label_mannager_detail/LabelDescription.vue'
import SelectAdsFor from '@/components/label_mannager_detail/LabelSelectAdsFor.vue'
import Status from '@/components/label_mannager_detail/LabelStatus.vue'
const uselabelManagerDetail = labelManagerDetail()

const textShow = computed<string>(() => {
  return uselabelManagerDetail.isAddPage ? 'Add' : 'Edit'
})

if (uselabelManagerDetail.isAddPage) {
  uselabelManagerDetail.clearData()
}

const feSettings = toRef(uselabelManagerDetail, 'feSettings')

useFeSettings(feSettings, window.route?.meta?.url as string)

onMounted(async () => {
  uselabelManagerDetail.isLoading = true
  uselabelManagerDetail.isDisable = true

  if (uselabelManagerDetail.isEditPage) {
    const result = await ctr_label.GetByID(uselabelManagerDetail.id)

    uselabelManagerDetail.dataConfig = result?.data || {}
  }
  uselabelManagerDetail.isDisable = false

  uselabelManagerDetail.isLoading = false
})
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="uselabelManagerDetail.feSettings?.page_list"
          :name="uselabelManagerDetail.name"
          v-if="uselabelManagerDetail.feSettings?.page_list"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div v-show="uselabelManagerDetail.isLoading">
              <Skeleton />
            </div>
            <div v-show="!uselabelManagerDetail.isLoading" class="flex mt-6">
              <n-card :title="`${textShow} ${uselabelManagerDetail.name}`">
                <LabelDetailName />
                <SelectAdsFor />
                <AdsType />
                <Description />
                <Status />
              </n-card>
            </div>
            <div class="flex flex-row-reverse sticky bottom-0 py-2">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :disabled="uselabelManagerDetail.isDisable"
                :loading="uselabelManagerDetail.isSubmitBtnLoading"
                @click="uselabelManagerDetail.submitForm"
              >
                Submit
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}
.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }
  .dynamic-button {
    padding: 0 0.5rem;
  }
}
</style>
