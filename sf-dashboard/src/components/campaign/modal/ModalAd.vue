<script setup lang="ts">
import SubmitForm from '@/components/common/SubmitForm.vue'
import CreativeBody from '@/components/creative3/CreativeBody.vue'

import {
  CreativeStateManager,
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import { ModalStateCreative } from '@/types/components/modal'

import useCampaign2Store from '@/store/useCampaign2Store'
import { MessageReactive } from 'naive-ui'
import AIVerify from '@/components/ai_verify/AIVerify.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import ManualVerify from './ManualVerify.vue'
import { AIVerifyClass } from '@/types/components/creative-class'
import { ctr_campaign } from '@/services/ctr_campaign'
import { ctr_creative } from '@/services/ctr_creative'
import { TS } from '@/enum/campaign'
import Close2 from '@/assets/icons/Close2.vue'

import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const campaign2Store = useCampaign2Store()

const status = ref(new StatusCreativeManager())
const messageManage = ref<MessageReactive[]>([])

const stateManager = ref(
  new CreativeStateManager({
    dataModal: {} as ModalStateCreative,
    disabledType: true,
    isModalAd: true,
  })
)

const cre = ref<creativeTypeClass>(new creativeTypeClass({}))

const clearMessages = () => {
  if (messageManage.value.length) {
    messageManage.value.forEach((element) => {
      element.destroy()
    })

    messageManage.value = []
  }
}

const submitForm = async () => {
  clearMessages()

  if (cre.value.Invalid()) {
    return
  }

  status.value.isSubmitting = true

  const result = await ctr_creative.UpdateAds(cre.value.Payload())

  if (result?.status) {
    if (helper.IsString(result.data)) {
      window.message.success(result.data)
      if (cre.value.ai_verify) {
        cre.value.ai_verify = new AIVerifyClass({})
      }
    } else {
      try {
        if (result.data?.compliance_status) {
          window.message.error('Please review and fix the issues')
          cre.value.ai_verify = new AIVerifyClass(result.data || {})
        }
      } catch (error) {
        console.error(error)
      }
    }
  }

  status.value.isSubmitting = true

  status.value.isSubmitting = false
}

const repairData = async (
  opts: { [key: string]: any } = { checkImage: false }
) => {
  let showModal: number | undefined = undefined
  try {
    if (opts?.checkImage) {
      // showModal = await repairImages();
    }

    cre.value.RepairImageRatio()

    if (stateManager.value.isModalMode()) {
      //Xóa bỏ để clone creative không bị ảnh hưởng creative cũ
      cre.value.DeleteImageInfo()
    }
  } catch {
    cre.value.SetDefaultImages()
  }

  if (showModal || showModal === 0) {
    status.value.previewItem = cre.value.images[showModal]
    await helper.sleep(1)
    status.value.editingImage = status.value.previewItem?.image
    status.value.showModal = true
  } else {
    status.value.previewItem = cre.value.images[0]
  }

  cre.value.RepairDisplayPath()

  if (cre.value.IsTitleDesType2()) {
    if (!cre.value.titles) {
      cre.value.SetDefaultTitles()
    } else {
      cre.value.RepairTitles()
    }
  }

  cre.value.RepairSiteLink()

  if (cre.value.images?.length) {
    status.value.previewItem = helper.clone(cre.value.images[0])
  }

  cre.value.RepairInfoImages()
}

const fetchDataById = async () => {
  status.value.isLoading = true

  try {
    const result = await ctr_campaign.GetAdsByID(
      stateManager.value.dataModal?.id as number
    )

    if (result?.data) {
      if (!result?.data?.id) {
        window.message.error('Ad not found')
        return
      }

      cre.value = new creativeTypeClass(result?.data || {})

      try {
        await repairData() // Skip image check with already created creatives -> improve loading speed
      } catch (e) {
        console.error(e)
      }
    }
  } finally {
    status.value.isLoading = false
  }
}

watch(
  () => campaign2Store.adInfo,
  async (newValue, oldValue) => {
    if (newValue) {
      stateManager.value.dataModal = newValue
      await fetchDataById()
    }
  }
)

const closeModal = () => {
  campaign2Store.showModalAd = false
}

const finishAction = () => {
  campaign2Store.reGetCampaign = Date.now()
  closeModal()
}

const isCanEdit = computed(() => {
  return (
    campaign2Store.campaign?.IsDemandGen() ||
    campaign2Store.campaign?.IsPMax() ||
    campaign2Store.campaign?.IsGGDisplay() ||
    campaign2Store.campaign?.IsTrafficTiktok()
  )
})

const handleAdPreview = () => {
  const url = props.campaign.url || cre.value.url
  if (!url) return
  const refCreative = cre.value.ToEncodedQuery()

  const separator = url.includes('?') ? '&' : '?'
  const uri = `${url}${separator}__bt=true&refCreative=${refCreative}`

  window.open(uri, '_blank')
}

const isShowAdPreview = computed(() => {
  return window.arb.isCompany() && !!props.campaign.url
})
</script>

<template>
  <n-modal
    v-model:show="campaign2Store.showModalAd"
    style="height: 97vh; width: 97vw"
  >
    <n-card class="overflow-y-scroll">
      <template #header>Ad of creative: {{ cre.name }}</template>

      <template #header-extra>
        <n-icon
          size="26"
          class="ml-auto button-close cursor-pointer"
          @click="closeModal"
          ><Close2 /></n-icon
      ></template>
      <div class="wrapper flex flex-col px-3 flex-1 bg-white">
        <n-alert
          type="info"
          v-if="stateManager.dataModal?.creative_id"
          :show-icon="false"
        >
          {{
            // hiếu phan bảo xóa 27/10/2025
            Creative.cre_tem
          }}
          <a
            :href="`/creative/${stateManager.dataModal?.creative_id}`"
            target="_blank"
            class="ml-2"
            ><n-button type="success" size="small">Open</n-button></a
          >
        </n-alert>
        <div class="h-screen flex flex-col bg-base my-12 flex-1 gap-4">
          <ManualVerify
            v-if="props.campaign.IsManualReview()"
            :ts="TS.GOOGLE"
            :creative_id="cre.id"
            @finishAction="finishAction"
          />

          <div v-if="status.isLoading">
            <Skeleton />
          </div>
          <div v-else>
            <div v-if="isShowAdPreview" class="flex justify-end">
              <n-popover trigger="hover">
                <template #trigger>
                  <n-button
                    type="primary"
                    @click="handleAdPreview"
                    class="mt-2 mr-2 mb-2"
                    size="small"
                  >
                    Preview Landing Page
                  </n-button>
                </template>
                <span
                  >Preview Landing Page with Ad Creative Referrer
                  Parameter</span
                >
              </n-popover>
            </div>
            <AIVerify :cre="cre" :status="status" />

            <CreativeBody
              :cre="cre"
              :stateManager="stateManager"
              :status="status"
            >
            </CreativeBody>
          </div>
        </div>

        <SubmitForm
          :cre="cre"
          :stateManager="stateManager"
          :status="status"
          closeButton="Close"
          @closeForm="closeModal"
          @submitForm="submitForm"
          v-if="isCanEdit"
        />
      </div>
    </n-card>
  </n-modal>
</template>
