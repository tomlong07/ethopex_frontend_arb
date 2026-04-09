<script setup lang="ts">
import MonthPicker from '@/components/template-v2/date/MonthPicker.vue'
import MoreInfo from '@/components/template-v2/date/MoreInfo.vue'
import GroupDate from '@/components/template-v2/date/GroupDate.vue'

import { useTemplateV2 } from '@/store/templateV2Store'
import BrandManagerDetail from '@/views/details/BrandManagerDetail.vue'

const CopyWhitelist = defineAsyncComponent(
  () => import('@/components/google_targeting/CopyWhitelist.vue')
)

const DownloadReportTargeting = defineAsyncComponent(
  () => import('@/components/google_targeting/DownloadReportTargeting.vue')
)

const ExportSectionTaboola = defineAsyncComponent(
  () => import('@/components/google_targeting/ExportSectionTaboola.vue')
)

const SetAccountDemand = defineAsyncComponent(
  () => import('@/components/user/SetAccountDemand.vue')
)

const ButtonWrapper = defineAsyncComponent(
  () => import('@/components/common/ButtonWrapper.vue')
)

const ExportAccountAd = defineAsyncComponent(
  () => import('@/components/template-v2/ExportAccountAd.vue')
)

const SyncPages = defineAsyncComponent(
  () => import('@/components/facebook_fanpage/SyncPages.vue')
)

const SetBulk = defineAsyncComponent(
  () => import('@/components/template-v2/SetBulk.vue')
)

const TemplateV2TabInfo = defineAsyncComponent(
  () => import('@/components/template-v2/TemplateV2TabInfo.vue')
)
const PlusInfo = defineAsyncComponent(
  () => import('@/components/template-v2/PlusInfo.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()

const hasLeftWrapper = computed<boolean>(() => {
  return templateV2Store.addUrlNow ||
    templateV2Store.datePicker.hasDatePicker ||
    templateV2Store.baseConfigs.moreInfo?.length
    ? true
    : false
})

const hasRightWrapper = computed<boolean>(() => {
  if (templateV2Store.hasFeatureButton) return true

  if (templateV2Store.baseConfigs.tabInfo?.length) return false
  if (
    templateV2Store.baseConfigs.IsModalCrawl() ||
    templateV2Store.baseConfigs.IsModalCrawlKeyword()
  )
    return false
  return templateV2Store.baseConfigs.IsModalRole() ||
    templateV2Store.baseConfigs.IsModalAccountAdBulk() ||
    templateV2Store.baseConfigs.HasFeatureButton() ||
    templateV2Store.hasFeatureButton ||
    templateV2Store.addUrlNow
    ? true
    : false
})

const currentPage = helper.truePath()

const isBrandPage = computed(() => currentPage === '/brand')
</script>

<template>
  <TemplateV2TabInfo v-if="templateV2Store.baseConfigs.tabInfo?.length" />
  <div
    class="flex justify-between relative bg-gray-100 main-group-child campaign-group-by custom-bg-icon"
    v-if="hasRightWrapper || hasLeftWrapper"
  >
    <div class="flex" v-if="hasLeftWrapper">
      <div
        class="group-btn p-2 flex justify-start mx-2 gap-2"
        v-if="
          templateV2Store.datePicker.hasDatePicker ||
          templateV2Store.baseConfigs.HasDownloadButton()
        "
      >
        <GroupDate
          v-if="
            templateV2Store.datePicker.isDefault ||
            templateV2Store.datePicker.isThisMonth ||
            templateV2Store.datePicker.isMultiMonth
          "
          classContainer="flex-row"
        />

        <MonthPicker v-if="templateV2Store.datePicker.isSingleMonth" />

        <DownloadReportTargeting
          v-if="templateV2Store.baseConfigs.DownloadReportTargeting()"
        />

        <CopyWhitelist v-if="templateV2Store.baseConfigs.CopyWhiteList()" />
      </div>
      <MoreInfo v-if="templateV2Store.baseConfigs.moreInfo?.length" />
      <PlusInfo v-if="templateV2Store.baseConfigs.plusInfo" />
    </div>

    <div v-if="hasRightWrapper" class="flex items-center py-2 px-2 gap-2">
      <ExportSectionTaboola
        v-if="templateV2Store.baseConfigs.FeatureTargeting()"
      />

      <SetAccountDemand v-if="templateV2Store.baseConfigs.IsModalRole()" />

      <ButtonWrapper />

      <SetBulk v-if="templateV2Store.baseConfigs.IsModalAccountAdBulk()" />

      <SyncPages v-if="templateV2Store?.asyncConfigs.syncButton" />
      <ExportAccountAd v-if="templateV2Store.baseConfigs.FeatureAccountAd()" />
      <router-link
        :to="templateV2Store.addUrlNow"
        v-if="templateV2Store.addUrlNow && !isBrandPage"
      >
        <n-button class="mr-2" color="#f43f5e" size="small">
          {{ templateV2Store.nameAddNow }}
        </n-button>
      </router-link>
      <BrandManagerDetail v-if="isBrandPage"/>
    </div>
  </div>
</template>
