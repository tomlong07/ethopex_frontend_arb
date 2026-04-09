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

import useAdDataStore from '@/store/adDataStore'
import { MessageReactive, SelectOption } from 'naive-ui'
import AIVerify from '@/components/ai_verify/AIVerify.vue'

import { campaignTypeClass } from '@/types/components/campaign-v2'
import ManualVerify from './ManualVerify.vue'
import { AIVerifyClass } from '@/types/components/creative-class'
import { debounceV2 } from '@/utils'
import { fetchCreativeNew, RenderLabel, renderTag } from '../modules/Creative'
import { ctr_campaign } from '@/services/ctr_campaign'
import { ctr_creative } from '@/services/ctr_creative'
import { AD_SETUP, TS } from '@/enum/campaign'
import Close2 from '@/assets/icons/Close2.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const adDataStore = useAdDataStore()

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

  const result = await ctr_creative.UpdateAds({
    ...cre.value.Payload(),
    creative_id: adDataStore.adInfo.creative_id,
  })

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
    }

    // Check retry_test condition
    if (stateManager.value.dataModal?.retry_test) {
      if (stateManager.value.dataModal.ai_verify) {
        cre.value.ai_verify = stateManager.value.dataModal.ai_verify
      }
    }

    try {
      await repairData() // Skip image check with already created creatives -> improve loading speed
    } catch (e) {
      console.error(e)
    }
  } finally {
    status.value.isLoading = false
  }
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

watch(
  () => adDataStore.adInfo,
  async (newValue, oldValue) => {
    if (newValue) {
      if (!stateManager.value.dataModal) {
        stateManager.value.dataModal = {}
      }

      if (newValue.retry_test === true) {
        // CHỈ set ai_verify từ newValue, không phải cả newValue
        stateManager.value.dataModal.ai_verify = new AIVerifyClass(
          newValue.ai_verify || newValue
        )
        stateManager.value.dataModal.retry_test = true
        stateManager.value.dataModal.id = newValue.id
      } else {
        stateManager.value.dataModal = newValue

        if (stateManager.value.dataModal) {
          stateManager.value.dataModal.retry_test = false
        }
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

const isLoading = ref(false)
const name = 'Creative'

const creativeOptions = ref<SelectOption[]>([])
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
    'facebook'
  )

  isLoading.value = false
}
const handleCreativeSearch = debounceV2(async (query?: string) => {
  fetchCreative(query)
}, 300)

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option, true)
}
watch(
  () => adDataStore.showModal,
  async (v) => {
    if (v && props.campaign.IsTrafficFacebook()) {
      await fetchCreative()
    }
  }
)

const updateHandleCre_ = (value: number) => {
  adDataStore.adInfo.creative_id = value
  fetchCreativeDataById()
}

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
    v-model:show="adDataStore.showModal"
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
        <div class="h-screen flex flex-col bg-base my-12 flex-1 gap-4">
          <ManualVerify
            v-if="props.campaign.IsManualReview()"
            :ts="TS.FACEBOOK"
            :creative_id="cre.id"
            @finishAction="finishAction"
          />
          <div v-if="status.isLoading">
            <Skeleton />
          </div>
          <div v-else class="flex gap-2 flex-col">
            <div class="flex justify-end" v-if="isShowAdPreview">
              <n-popover trigger="hover">
                <template #trigger>
                  <n-button
                    type="primary"
                    @click="handleAdPreview"
                    class="mt-2 mr-2"
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

            <div class="flex gap-4" v-if="props.campaign.IsTrafficFacebook()">
              <n-card class="w-1/2">
                <div class="flex items-center">
                  <div class="font-bold w-1/6">Creative</div>
                  <n-select
                    class="w-5/6"
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
                  />
                </div>
              </n-card>
              <n-card class="w-1/2 opacity-0"></n-card>
            </div>

            <CreativeBody
              :cre="cre"
              :stateManager="stateManager"
              :status="status"
            >
            </CreativeBody>
          </div>
        </div>

        <SubmitForm
          v-if="adDataStore.adInfo.ad_setup !== AD_SETUP.USE_EXISTING_POST"
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
