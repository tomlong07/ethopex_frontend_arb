<script setup lang="ts">
import useReportV2ModalTaboola from '@/store/report/report-v2-modal-taboola'
import { ctr_report } from '@/services/ctr_report'
import { TS } from '@/enum/campaign'
import { NPopover } from 'naive-ui'
import useReportV2ModalFacebook from '@/store/report/report-v2-modal-facebook'

const storeReportV2ModalTaboola = useReportV2ModalTaboola()
const previewFacebookInfo = useReportV2ModalFacebook()

const props = defineProps({
  adId: {
    type: String,
    required: true,
  },
  adName: {
    type: String,
    default: '',
  },
  trafficSource: {
    type: String,
    required: true,
  },
  campaignId: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    default: false,
  },
})

const num1 = parseInt(props.adId, 10)

const isShowChangeStatus =
  props.trafficSource === TS.FACEBOOK || props.trafficSource === TS.TABOOLA

const isBlue =
  (props.trafficSource === TS.FACEBOOK || props.trafficSource === TS.TABOOLA) &&
  !isNaN(num1) &&
  num1 !== 0

const changePreviewData = async () => {
  if (props.trafficSource === TS.FACEBOOK) {
    showPreviewAdFB()
    return
  }
  if (props.trafficSource !== TS.TABOOLA) return
  if (!props.adId || !props.campaignId) return

  const listdataPreview = await ctr_report.GetLinkPreviewTaboola({
    id: props.adId,
    campaign_id: String(props.campaignId),
  })
  if (listdataPreview?.status) {
    storeReportV2ModalTaboola.data = listdataPreview?.data || {}
    storeReportV2ModalTaboola.showModal = true
  }
}

const showPreviewAdFB = async () => {
  if (props.campaignId) {
    previewFacebookInfo.id = String(props.campaignId)
    const listdataPreview = await ctr_report.GetListFaceBookAds({
      id: String(props.campaignId),
    })
    if (listdataPreview?.status) {
      try {
        previewFacebookInfo.listAds = listdataPreview.data.data.data
        previewFacebookInfo.url = listdataPreview.data.url

        previewFacebookInfo.adId = props.adId
        previewFacebookInfo.showModal = true

        await nextTick()

        previewFacebookInfo.handleClick()
      } catch {}
    }
  }
}
</script>

<template>
  <div class="flex items-center gap-2 p-2 w-full">
    <div class="gap-2 flex flex-col w-64 overflow-hidden">
      <n-popover trigger="hover" :show-arrow="false">
        <template #trigger>
          <div
            class="overflow-hidden text-ellipsis"
            @click="changePreviewData"
            :class="{ 'text-blue-link': isBlue }"
          >
            {{ adId || 'N/A' }}
          </div>
        </template>
        <span>{{ props.adName || adId || 'N/A' }}</span>
      </n-popover>
    </div>

    <FacebookEditAd
      v-if="isShowChangeStatus && !props.status"
      classNow="ml-auto"
      :item="{ id: props.adId }"
      :campaignId="props.campaignId"
      :fromReport="true"
    />

    <FacebookAdStatus
      v-if="isShowChangeStatus && props.status"
      :campaignId="props.campaignId"
      :item="{ id: props.adId, status: props.status }"
    />
  </div>
</template>
