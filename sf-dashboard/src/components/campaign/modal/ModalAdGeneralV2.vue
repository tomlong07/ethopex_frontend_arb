<script setup lang="ts">
import CreativeBody from '@/components/creative3/CreativeBody.vue'

import {
  CreativeStateManager,
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import { ModalStateCreative } from '@/types/components/modal'

import useAdDataStore from '@/store/adDataStore'
import AIVerify from '@/components/ai_verify/AIVerify.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import ManualVerify from './ManualVerify.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import Close2 from '@/assets/icons/Close2.vue'
import { MessageReactive, SelectOption } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import { AIVerifyClass } from '@/types/components/creative-class'
import SubmitForm from '@/components/common/SubmitForm.vue'
import { debounceV2 } from '@/utils'
import { AD_SETUP, TS } from '@/enum/campaign'
import { fetchCreativeNew, RenderLabel, renderTag } from '../modules/Creative'
import JSONButton from '@/components/ai_verify/JSONButton.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { CRE_TYPE } from '@/enum/creative'
import useUploadMediaCreativeStore from '@/store/useUploadMediaCreativeStore'
const useMediaStore = useUploadMediaCreativeStore()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
const adDataStore = useAdDataStore()

const status = ref(new StatusCreativeManager())
// const messageManage = ref<MessageReactive[]>([])

const stateManager = ref(
  new CreativeStateManager({
    dataModal: {} as ModalStateCreative,
    disabledType: true,
    isModalAd: true,
  })
)

const cre = ref<creativeTypeClass>(new creativeTypeClass({}))

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

  if (cre.value.IsFacebook()) {
    if (!cre.value.titles) {
      cre.value.SetDefaultTitles()
    } else {
      cre.value.RepairTitlesFB()
    }
  }

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

const fixCreativeAPIPublic = () => {
  if (!props.campaign.IsAPIPublic()) return

  if (!cre.value.type) {
    switch (true) {
      case props.campaign.IsTrafficFacebook():
        cre.value.type = CRE_TYPE.FACEBOOK
        cre.value.ad_type = 'flexible'
        break

      case props.campaign.IsTrafficGoogle():
        cre.value.type = CRE_TYPE.PMAX
        break

      case props.campaign.IsTrafficPocPoc():
        cre.value.type = CRE_TYPE.PP_BANNER
        break

      case props.campaign.IsTrafficNewsbreak():
        cre.value.type = CRE_TYPE.NEWSBREAK
        break

      default:
        cre.value.type = CRE_TYPE.NATIVE
        break
    }
  }
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

      fixCreativeAPIPublic()

      if (
        props.campaign.IsTrafficTaboola() ||
        props.campaign.IsTrafficNewsbreak()
      ) {
        cre.value.titles = cre.value.titles.map((item) => {
          const titleStr = item.title ?? ''
          const desStr = item.description ?? ''

          const titleParse =
            titleStr.includes('[') && titleStr.includes(']')
              ? JSON.parse(titleStr)
              : titleStr

          const desParse =
            desStr.includes('[') && desStr.includes(']')
              ? JSON.parse(desStr)
              : desStr

          if (Array.isArray(titleParse)) {
            item.title = titleParse.join(', ')
          } else {
            item.title = titleParse
          }

          if (Array.isArray(desParse)) {
            item.description = desParse.join(', ')
          } else {
            item.description = desParse
          }

          return item
        })
      }

      // Check retry_test condition
      if (retry_test.value) {
        if (stateManager.value.dataModal?.ai_verify) {
          cre.value.ai_verify = new AIVerifyClass(
            stateManager.value.dataModal.ai_verify
          )
          cre.value.input_verify = stateManager.value.dataModal.input_verify
          cre.value.output_verify = stateManager.value.dataModal.output_verify
          cre.value.example_verify = stateManager.value.dataModal.example_verify

          if (cre.value?.images?.length) {
            handleRetryTestMedia()
          }
        } else {
          cre.value.ai_verify = new AIVerifyClass({})
        }
      }

      try {
        await repairData() // Skip image check with already created creatives -> improve loading speed
      } catch {}
    }
  } finally {
    status.value.isLoading = false
  }
}

const handleRetryTestMedia = () => {
  const videos = (cre.value?.ai_verify?.videos || []).reduce(
    (map: Record<string, any>, v: any) => {
      map[v.urlVideo()] = v
      return map
    },
    {}
  )

  const images = (cre.value?.ai_verify?.images || []).reduce(
    (map: Record<string, any>, img: any) => {
      map[img.urlImage()] = img
      return map
    },
    {}
  )

  cre.value.images.forEach((img: any) => {
    const videoMatch = videos[img.image]
    const imageMatch = images[img.image]

    if (videoMatch) {
      img.video_summary = videoMatch.video_summary
      img.content_safety = videoMatch.content_safety
      img.rule_violated = videoMatch.rule_violated
    }

    if (imageMatch) {
      img.video_summary = imageMatch.video_summary
      img.content_safety = imageMatch.content_safety
      img.rule_violated = imageMatch.rule_violated
    }
  })
}

const updateHandleCre_ = (value: number) => {
  adDataStore.adInfo.creative_id = value
  fetchCreativeDataById()
}

const fetchCreativeDataById = async () => {
  //Lấy creative data-> gán vào ad
  status.value.isLoading = true

  try {
    const result = await ctr_creative.GetByID({
      id: adDataStore.adInfo.creative_id,
    })
    if (result?.data) {
      if (!result?.data?.id) {
        window.message.error('Creative not found')
        return
      }

      cre.value = new creativeTypeClass(result?.data || {}) //Đổi data ở tính năng clone creative từ ts khác

      try {
        await repairData() //Không check image với creative đã tạo nữa -> tăng tốc độ load
      } catch {}
      cre.value.id = Number(stateManager.value.dataModal?.id) //Để update ad theo id đó
    }
  } finally {
    status.value.isLoading = false
  }
}

const retry_test = ref(false)

watch(
  () => adDataStore.adInfo,
  async (newValue, oldValue) => {
    retry_test.value = false
    if (newValue) {
      if (!stateManager.value.dataModal) {
        stateManager.value.dataModal = {}
      }

      if (newValue.retry_test === true) {
        retry_test.value = true

        // CHỈ set ai_verify từ newValue, không phải cả newValue
        stateManager.value.dataModal.ai_verify = newValue.ai_verify
        stateManager.value.dataModal.input_verify = newValue.input_verify
        stateManager.value.dataModal.output_verify = newValue.output_verify
        stateManager.value.dataModal.example_verify = newValue.example_verify
        stateManager.value.dataModal.id = newValue.id
      } else {
        stateManager.value.dataModal = newValue
      }

      await fetchDataById()
    }
  }
)

const closeModal = () => {
  adDataStore.showModal = false
}

const finishAction = () => {
  adDataStore.reGetCampaign = Date.now()
  closeModal()
}
const messageManage = ref<MessageReactive[]>([])

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

  if (cre.value.Invalid()) return

  status.value.isSubmitting = true

  const result = await ctr_creative.UpdateAds({
    ...cre.value.Payload(),
    creative_id: adDataStore.adInfo.creative_id,
  })

  if (result?.status) {
    if (helper.IsString(result.data)) {
      window.message.success(result.data)
      await fetchDataById() //Lấy data mới nhất
      useMediaStore.resetAllState()
    }
  }

  status.value.isSubmitting = false
}

const isShowAdPreview = computed(() => {
  return window.arb.isCompany() && (!!props.campaign.url || !!cre.value.url)
})

const handleAdPreview = () => {
  const url = props.campaign.url || cre.value.url
  if (!url) return
  const refCreative = cre.value.ToEncodedQuery()

  const separator = url.includes('?') ? '&' : '?'
  const uri = `${url}${separator}__bt=true&refCreative=${refCreative}`

  window.open(uri, '_blank')
}
//comit
const isLoading = ref(false)
const creativeOptions = ref<SelectOption[]>([])
const name = 'Creative'
const handleCreativeSearch = debounceV2(async (query?: string) => {
  fetchCreative(query)
}, 300)

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option, true)
}

const fetchCreative = async (q?: string) => {
  isLoading.value = true

  const opts = {
    id: adDataStore.adInfo?.creative_id
      ? adDataStore.adInfo.creative_id.toString()
      : '',
    q: q,
  }

  creativeOptions.value = await fetchCreativeNew(
    TS.FACEBOOK || '',
    opts,
    TS.FACEBOOK
  )

  isLoading.value = false
}

watch(
  () => adDataStore.showModal,
  async (v) => {
    if (v && props.campaign.IsTrafficFacebook()) {
      await fetchCreative()
    }
  }
)

const isShow = computed(() => {
  if (window.arb.isDev() || window.arb.isCompany()) return true

  return false

  if (retry_test.value) return false
  if (adDataStore.adInfo.ad_setup === AD_SETUP.USE_EXISTING_POST) return false
  if (!stateManager.value.dataModal?.ad_id) return true

  if (props.campaign.IsTrafficFacebook()) return true
  if (props.campaign.IsTrafficGoogle()) return true
  if (props.campaign.IsTrafficTiktok()) return true
  if (props.campaign.IsTrafficTaboola()) return true
  if (props.campaign.IsTrafficNewsbreak()) return true

  return false
})
const showBtts = window.arb.isAdmin() || window.arb.isDev()
</script>

<template>
  <n-modal
    v-model:show="adDataStore.showModal"
    style="height: 97vh; width: 1024px"
  >
    <n-card class="overflow-y-scroll scroll-thin-custom">
      <template #header>Ad of creative: {{ cre.name }}</template>

      <template #header-extra>
        <n-icon
          size="26"
          class="ml-auto button-close cursor-pointer"
          @click="closeModal"
          ><Close2 /></n-icon
      ></template>
      <div class="wrapper flex flex-col px-3 flex-1 bg-white">
        <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
          <ManualVerify
            v-if="cre.IsVerifyStatusPending()"
            :ts="String(campaign.traffic_source)"
            :creative_id="cre.id"
            @finishAction="finishAction"
          />
          <div v-if="status.isLoading">
            <Skeleton />
          </div>
          <div v-else class="flex flex-col gap-4 bg-white">
            <n-card
              class="card-flex-gap-4"
              :bordered="cre.ai_verify?.compliance_status ? true : false"
            >
              <template #header>{{
                cre.ai_verify?.compliance_status ? 'AI Review Result' : ''
              }}</template>
              <template #header-extra
                ><div class="flex gap-2 items-center">
                  <n-popover
                    trigger="hover"
                    v-if="isShowAdPreview"
                    placement="left"
                  >
                    <template #trigger>
                      <n-button round @click="handleAdPreview" size="small">
                        Preview Landing Page
                      </n-button>
                    </template>
                    <span
                      >Preview Landing Page with Ad Creative Referrer
                      Parameter</span
                    >
                  </n-popover>
                  <JSONButton
                    type="info"
                    :model-value="cre.AI_Input_JSON()"
                    name="Input"
                    v-if="showBtts && cre.ai_verify?.compliance_status"
                  />
                  <JSONButton
                    :model-value="cre.AI_Example_JSON()"
                    name="Example"
                    v-if="showBtts && cre.ai_verify?.compliance_status"
                  />
                  <JSONButton
                    type="success"
                    :model-value="cre.AI_Output_JSON()"
                    name="Output"
                    v-if="showBtts && cre.ai_verify?.compliance_status"
                  />
                </div>
              </template>
              <AIVerify
                :cre="cre"
                :status="status"
                v-if="cre.ai_verify?.compliance_status"
              />
            </n-card>
            <n-card
              v-if="props.campaign.IsTrafficFacebook()"
              class="card-flex-gap-4"
            >
              <FloatingWrapper name="Creative"
                ><n-select
                  class="flex-1 min-w-0"
                  v-if="adDataStore.adInfo"
                  v-model:value="adDataStore.adInfo.creative_id"
                  filterable
                  remote
                  value-field="id"
                  label-field="name"
                  :loading="isLoading"
                  :placeholder="name"
                  :render-label="renderCreativeLabel"
                  :render-tag="(props: any)=>renderTag(props, false)"
                  :options="creativeOptions"
                  :max-tag-count="1"
                  :disabled="false"
                  @search="handleCreativeSearch"
                  :on-update:value="updateHandleCre_"
              /></FloatingWrapper>
            </n-card>

            <CreativeBody
              :cre="cre"
              :stateManager="stateManager"
              :status="status"
            >
            </CreativeBody>
          </div>
        </div>
        <SubmitForm
          v-if="isShow"
          :cre="cre"
          :stateManager="stateManager"
          :status="status"
          closeButton="Close"
          @closeForm="closeModal"
          @submitForm="submitForm"
        />
      </div>
    </n-card>
  </n-modal>
</template>
