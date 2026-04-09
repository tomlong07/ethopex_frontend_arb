<script setup lang="ts">
import { MessageReactive } from 'naive-ui'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import storage from '@/plugins/storage'
import { useSharedMethodCreative } from '@/components/campaign/composables/creative'

import SubmitForm from '@/components/common/SubmitForm.vue'

import { processImage } from '@/components/creative3/helper'

import {
  creativeTypeClass,
  newCreativeClass,
  StatusCreativeManager,
  CreativeStateManager,
  PermissionCreative,
} from '@/types/components/creative-v2'

import BackPage from '@/components/common/BackPage.vue'

import { ModalStateCreative } from '@/types/components/modal'
import useCreativeModal from '@/store/useCreativeModal'
import { ctr_creative } from '@/services/ctr_creative'
import { ctr_creative_request } from '@/services/ctr_creative_request'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import CreativeBody from '@/components/creative3/CreativeBody.vue'
import OpenNewTab from '@/components/creative3/OpenNewTab.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import { MapRatioValid } from '@/constants/media'
const useMediaCreativeStore = useUploadMediaCreativeStore()
import { useLocale } from '@/lang/messages'
import useUploadMediaCreativeStore from '../../store/useUploadMediaCreativeStore'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const creativeMenuModal = useCreativeModal()

const props = defineProps({
  dataModal: {
    type: Object as () => ModalStateCreative,
    required: false,
  },
  disabledType: {
    type: Boolean,
    default: false,
  },

  traffic_source: {
    type: String,
    required: false,
  },

  sourceCopy: {
    type: String,
    required: false,
  },
})

const isAdBlock = ref(false)

const stateManager = new CreativeStateManager({
  dataModal: props.dataModal,
  disabledType: props.disabledType,
  route: window.route,
})
const cre = ref<creativeTypeClass>(
  stateManager.isAddPage()
    ? newCreativeClass(stateManager.createInfoModal())
    : new creativeTypeClass({})
)
const status = ref(new StatusCreativeManager())
const { beforeMountHandle3 } = useSharedMethodCreative()

const messageManage = ref<MessageReactive[]>([])
interface Media {
  media: string
  thumb: string
}

interface CreatorMedia {
  id: number
  user_id: number
  request_id: number
  medias: Media[]
}
const feSettings = ref<FeSettings>()

onBeforeMount(() => {
  if (stateManager.isNormalMode()) {
    beforeMountHandle3(cre, stateManager)
    useFeSettings(feSettings, window.route?.meta?.url as string)
  }
})

const getPermission = async () => {
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )
  status.value.permissionCreative = new PermissionCreative(result?.data || {})
}

onMounted(async () => {
  try {
    switch (true) {
      case stateManager.isAddPage():
        if (stateManager.isDuplicatePage()) {
          await fetchDuplicate()
        } else {
          if (
            stateManager.isNormalMode() &&
            storage.getData() &&
            stateManager.CreativeMediaRequest() === null &&
            stateManager.CreativeRequest() === null
          ) {
            status.value.showModalSaveForm = true
            return
          }
        }
        if (
          stateManager.CreativeMediaRequest() !== null &&
          stateManager.CreativeRequest() !== null
        ) {
          await fetchCreativeMediaRequest()
        }
        status.value.isLoading = false
        return
      case stateManager.isEditPage():
        getPermission()

        await fetchDataById()
        return
    }
  } finally {
    isAdBlock.value = await helper.isAdBlockEnabled()
  }
})

const fetchDuplicate = async () => {
  const result = await ctr_creative.Duplicate(stateManager.duplicateId())
  if (!result?.status) {
    window.message.error('Creative not found')
    return
  }

  cre.value = new creativeTypeClass(result?.data || {}) //Đổi data ở tính năng clone creative từ ts khác

  try {
    await repairData() //Không check image với creative đã tạo nữa -> tăng tốc độ load
  } catch {}
}

const repairImages = async () => {
  if (cre.value.IsResponsive() || cre.value.IsPocpocBanner()) return
  if (cre.value.IsDemandGenVideo()) return
  let errorImages = 0

  for (let index = 0; index < cre.value?.images?.length; index++) {
    const element = cre.value.images[index]

    try {
      const processedImage = await processImage(element.image, 605, 605)
      if (processedImage) {
        errorImages++

        const formData = new FormData()
        formData.append('file', processedImage as File)

        const result = await ctr_creative.uploadImage(formData)

        try {
          cre.value.images[index].image = result.data_object.thumb[0]
          cre.value.images[index].image_ratio = undefined
        } catch {}
      }
    } catch {
      break
    }
  }

  if (errorImages) {
    messageManage.value.push(
      arb?.infof(
        Creative.value.img_small,
        {
          duration: 10000,
          keepAliveOnHover: true,
          closable: true,
        },
        errorImages
      )
    )
  }

  let hasRatioError: number | undefined = undefined
  loop1: for (let index = 0; index < cre.value?.images?.length; index++) {
    const element = cre.value.images[index]
    if (element.image_ratio) {
      let ratioCheck: any = undefined
      if (helper.IsString(element.image_ratio)) {
        ratioCheck = JSON.parse(element.image_ratio as unknown as string)
      } else {
        ratioCheck = element.image_ratio
      }

      if (!ratioCheck) continue
      for (let i = 0; i < ratioCheck.length; i++) {
        const e = ratioCheck[i]

        if (!e.ratio || !e.image) {
          continue
        }

        const valid = MapRatioValid[e.ratio]

        if (!valid) {
          continue
        }

        try {
          const processedImageRatio = await processImage(
            e.image,
            valid.gwidth as number,
            valid.gheight as number
          )

          if (processedImageRatio) {
            if (e.change) {
              //Nếu là đã change coor thì ko báo lỗi nữa, để crop lại ảnh
              continue
            } else {
              hasRatioError = index
              break loop1
            }
          }
        } catch {
          break loop1
        }
      }
    }
  }

  if (hasRatioError || hasRatioError === 0) {
    messageManage.value.push(
      arb?.warning(Message.value.cre_condition, {
        duration: 10000,
        keepAliveOnHover: true,
        closable: true,
      })
    )
    return hasRatioError
  }

  return
}

const repairData = async (
  opts: { [key: string]: any } = { checkImage: false }
) => {
  let showModal: number | undefined = undefined
  try {
    if (opts?.checkImage) showModal = await repairImages()

    cre.value.RepairImageRatio()

    //Xóa bỏ để clone creative không bị ảnh hưởng creative cũ
    if (stateManager.isModalMode()) cre.value.DeleteImageInfo()
  } catch {
    cre.value.SetDefaultImages()
  }

  if (showModal || showModal === 0) {
    status.value.previewItem = cre.value.images[showModal]
    await helper.sleep(1)
    status.value.editingImage = status.value.previewItem?.image
    status.value.showModal = true
  } else {
    status.value.previewItem = cre.value.images?.[0]
  }

  cre.value.RepairDisplayPath()

  if (cre.value.IsFacebook()) {
    if (cre.value?.titles) {
      cre.value.RepairTitlesFB()
    } else {
      cre.value.SetDefaultTitles()
    }
  }

  if (cre.value.IsTitleDesType2()) {
    if (cre.value?.titles) {
      cre.value.RepairTitles()
    } else {
      cre.value.SetDefaultTitles()
    }
  }

  cre.value.RepairSiteLink()

  if (cre.value.images?.length) {
    const firstImage = cre.value.images[0]
    status.value.previewItem = firstImage ? helper.clone(firstImage) : undefined
  } else {
    status.value.previewItem = undefined
  }

  cre.value.RepairInfoImages()
}

const clearMessages = () => {
  if (messageManage.value.length) {
    messageManage.value.forEach((element) => {
      element.destroy()
    })

    messageManage.value = []
  }
}

const fetchDataById = async () => {
  status.value.isLoading = true

  try {
    const result = await ctr_creative.GetByID({ id: stateManager.id() })
    if (result?.data) {
      if (!result?.data?.id) {
        window.message.error('Creative not found')
        return
      }

      cre.value = new creativeTypeClass(result?.data || {}) //Đổi data ở tính năng clone creative từ ts khác

      try {
        await repairData() //Không check image với creative đã tạo nữa -> tăng tốc độ load
      } catch {}
    }
  } finally {
    status.value.isLoading = false
  }
}
const fetchCreativeMediaRequest = async () => {
  status.value.isLoading = true

  try {
    const result = await ctr_creative_request.GetByID({
      id: stateManager.CreativeRequest(),
    })

    if (result?.data) {
      // Kiểm tra nếu không tìm thấy id
      if (!result?.data?.id) {
        window.message.error('Creative media not found')
        return
      }

      const creatorMedias = result.data?.creator_medias || []

      // Tìm media phù hợp với điều kiện
      const filteredMedia = creatorMedias.find(
        (media: CreatorMedia) =>
          media.request_id === stateManager.CreativeRequest() &&
          media.id === stateManager.CreativeMediaRequest()
      )

      if (filteredMedia) {
        const { medias } = filteredMedia
        cre.value.images = medias.map((media: Media) => ({
          image: media.media,
          thumb: media.thumb,
        }))
        cre.value.creative_media = stateManager.CreativeMediaRequest()
        try {
          await repairData() //Không check image với creative đã tạo nữa -> tăng tốc độ load
        } catch {}
      } else {
        window.message.error('No matching creative media found')
      }
    }
  } finally {
    status.value.isLoading = false
  }
}

const name = `Creative`
const submitForm = async () => {
  clearMessages()

  if (cre.value.Invalid()) return

  if (cre.value.IsTitleDesType2()) cre.value.RemoveEmptyTitleDescription()

  status.value.isSubmitting = true

  const showModal = await repairImages()

  if (showModal || showModal === 0) {
    status.value.previewItem = cre.value.images[showModal]

    await helper.sleep(1)

    status.value.showModal = true
    status.value.isSubmitting = false

    return
  }

  status.value.isSubmitting = true

  if (stateManager.isAddPage()) {
    //Trường hợp facebook single image tạo multiple creative
    if (
      cre.value.IsAcceptMultipleCreatives() &&
      cre.value.images?.length > 1 &&
      status.value.uploadMultipleCreative
    ) {
      const ok = confirm(
        'You are generating multiple creatives. Are you sure to continue?'
      )

      if (!ok) {
        status.value.isSubmitting = false
        return
      }
      let _payloadValidate: any = []
      const emptyCreative = cre.value
      for (let index = 0; index < emptyCreative.images?.length; index++) {
        const image = emptyCreative.images[index]

        let payload = emptyCreative.Payload()

        payload.images = [image]
        if (index !== 0) {
          payload.name += ` ${index + 1}`
        }
        _payloadValidate.push(payload)
      }

      const checkRes = await ctr_creative.CheckValidateCreative(
        _payloadValidate
      )
      if (!checkRes.status) {
        status.value.isSubmitting = false
        return
      }

      for (let index = 0; index < cre.value.images?.length; index++) {
        const image = cre.value.images[index]

        let payload = cre.value.Payload()

        payload.images = [image]
        if (index !== 0) {
          payload.name += ` ${index + 1}`
        }
        const result = await ctr_creative.Add(payload)
        if (result?.status) {
          window.message.success(`Create ${name} success!`)
        } else {
          return
        }
      }

      window.message.success('Create multiple creatives success!')
      storage.remove()
      if (stateManager.isModalMode()) {
        if (stateManager.dataModal?.modalMenu) {
          creativeMenuModal.callback()
          creativeMenuModal.changeShowModal(false)
          return
        }

        return
      }
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }

      return
    }

    const result = await ctr_creative.Add(cre.value.Payload())
    if (result?.status) {
      window.message.success(`Create ${name} success!`)
      storage.remove()

      if (stateManager.isModalMode()) {
        if (stateManager.dataModal?.modalMenu) {
          creativeMenuModal.changeResult(result)
          creativeMenuModal.callback()
          creativeMenuModal.changeShowModal(false)
          return
        }

        return result
      }

      if (stateManager.isNormalMode()) {
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    }
  } else {
    const result = await ctr_creative.Edit(cre.value.Payload())
    if (result?.status) {
      window.message.success(`Update ${name} success!`)

      if (stateManager.isModalMode() && stateManager.dataModal?.modalMenu) {
        creativeMenuModal.changeResult(Date.now()) //Để refresh lại data select options
        creativeMenuModal.callback()

        creativeMenuModal.changeShowModal(false)
        return
      }

      //Nếu có change ratio thì lấy lại data để cho đúng vs data vừa change
      if (cre.value.IsHasChangeImageRatio()) await fetchDataById()
    }
  }

  status.value.isSubmitting = false
}

const changeDataByModal = async (data: creativeTypeClass) => {
  status.value.isLoading = true
  cre.value = new creativeTypeClass(helper.clone(data))

  await repairData({ checkImage: true }) //true là checkImage xem để resize

  status.value.isLoading = false
}

const currentTab = ref('content')

const switchTab = (tab: string) => {
  currentTab.value = tab
}

const handleTabChange = (tab: string) => {
  currentTab.value = tab
}
defineExpose({
  submitForm,
  changeDataByModal,
  getPayload: () => cre.value.Payload(),
})
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <CreativeDraftConfirm :cre="cre" :statusData="status" />
    <div class="h-screen flex flex-col bg-base my-6 flex-1 gap-4">
      <n-alert type="warning" :show-icon="false" closable v-if="isAdBlock">
        AdBlock is blocking some features. Please disable it for the best
        experience.
      </n-alert>
      <BackPage
        :url="feSettings?.page_list"
        :name="name"
        v-if="feSettings?.page_list && stateManager.isNormalMode()"
      />

      <OpenNewTab
        v-if="stateManager.isEditPage() && stateManager.isModalMode()"
        :stateManager="stateManager"
      />

      <div v-if="status.isLoading">
        <Skeleton />
      </div>

      <CreativeBody
        v-else
        :cre="cre"
        :stateManager="stateManager"
        :status="status"
        :currentTab="currentTab"
        @tab-change="handleTabChange"
      />
    </div>

    <SubmitForm
      :status="status"
      @submitForm="submitForm"
      :cre="cre"
      @switchTab="switchTab"
      :currentTab="currentTab"
      v-if="
        stateManager.isNormalMode() ||
        (stateManager.isModalMode() && stateManager.dataModal?.modalMenu)
      "
    />
  </div>
</template>

<style lang="scss">
@use '@/css/CreativeDetail.scss';
</style>
