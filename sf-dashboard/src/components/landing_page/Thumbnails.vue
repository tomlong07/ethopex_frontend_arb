<script setup lang="ts">
import { ctr_landing_page } from '@/services/ctr_landing_page'
import { landingTypeClass } from '@/types/components/landing'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import ModalThumbnailAI from '@/components/landing_page/modal/ModalThumbnailAI.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { UploadFileInfo, UploadCustomRequestOptions } from 'naive-ui'
import { VueDraggableNext as draggable } from 'vue-draggable-next'
import GalleryCard from '@/components/gallery/GalleryCard.vue'
import {
  dataThumb,
  ModalGalleryInfo,
  ModalThumbnailInfo,
} from '@/types/components/gallery'
import { validateImageThumb } from '../creative3/helper'
import useLandingStore from '@/store/useLandingStore'
import { ModeClassString } from '@/types/components/base'
import useLandingStoreNew from '@/store/details/landingNewStore'
import { ctr_creative } from '@/services/ctr_creative'
import RefreshIcon from '@/assets/icons/RefreshIcon.vue'
import { MAX_THUMB_LANDING } from '@/constants/limits'

const landingNewStore = useLandingStoreNew()

const landingStore = useLandingStore()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
  modeData: {
    type: Object as () => ModeClassString,
    required: true,
  },
})

const name = `Thumbnail`
const MAX_THUMB = MAX_THUMB_LANDING

const isUploading = ref<boolean>(false)
const showModalGallery = ref<boolean>(false)

const dataModalGallery = ref<ModalGalleryInfo>(
  new ModalGalleryInfo({
    isModal: true,
  })
)

const isShow = computed<boolean>(() => {
  if (props.landing.IsDemandCJ()) return false
  if (props.landing.IsDemandPubPower() && props.landing.IsDirectLinkOn())
    return false

  if (landingNewStore.permissions.landingSpecial) return true

  if (!window.arb.isCompany()) return false

  return true
})

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (newValue) {
      if (!props.landing.thumbnails) {
        props.landing.thumbnails = []
      }
    } else {
      props.landing.thumbnails = undefined
    }
  }
)

const modalManagerThumbAI = ref<ModalThumbnailInfo>(new ModalThumbnailInfo())

const src = (path: string | undefined) => {
  return helper.src(path)
}

const onRemoveImage = (i: number) => {
  props.landing.thumbnails?.splice(i, 1)
}

const isDisabled = computed(() => {
  if (
    props.landing.thumbnails?.length &&
    props.landing.thumbnails?.length >= maxThumbNow.value
  ) {
    return true
  }
  return isUploading.value
})

const openModal = () => {
  modalManagerThumbAI.value.changeShowModal(true)
}

const openModalGallery = () => {
  showModalGallery.value = true
  dataModalGallery.value.selectedMedia = []
  dataModalGallery.value.numberOfMediaSelected =
    props.landing.thumbnails?.length || 0
}

const pendingFiles = ref<number>(0) // Số lượng file đang chờ xử lý
const fileList = ref<UploadFileInfo[]>([])
const addMediaToQueue = (file: UploadFileInfo) => {
  fileList.value.push(file)
}

// Giảm số lượng file chờ khi một file đã sẵn sàng
const reducePendingFile = () => {
  pendingFiles.value -= 1
}

const customRequest = async (
  { file }: UploadCustomRequestOptions,
  newIndex?: number
) => {
  if (file.file instanceof File && file.status === 'pending') {
    file.status = 'uploading'
    isUploading.value = true

    const formData = new FormData()
    formData.append('file', file.file as File)

    const result = await ctr_creative.uploadImage(formData)

    if (result?.status === 'success') {
      try {
        if (props.landing.thumbnails && (newIndex || newIndex == 0)) {
          props.landing.thumbnails[newIndex].path =
            result?.data_object?.thumb[0] || ''
          props.landing.thumbnails[newIndex].SetSuccess()
          props.landing.thumbnails[newIndex].EndLoading()
        }
        file.status = 'finished'
      } catch (error) {
        console.error(error)

        file.status = 'error'
      }
    } else {
      try {
        window.message.error(JSON.stringify(result?.errors))
      } catch {
        window.message.error('Upload failed')
      }

      file.status = 'error'
    }
  }
}

const uploadListMedia = async () => {
  isUploading.value = true

  if (pendingFiles.value > 0) {
    reducePendingFile()

    // Khi tất cả file đã sẵn sàng, upload chúng
    if (pendingFiles.value === 0) {
      let ajax: Promise<void>[] = []

      for (let index = 0; index < fileList.value.length; index++) {
        const element = fileList.value[index]
        const newImage = new dataThumb({
          path: '',
        })
        newImage.SetPending()
        props.landing.thumbnails?.push(newImage)
        const newIndex = props.landing.thumbnails?.length
          ? props.landing.thumbnails?.length - 1
          : undefined

        ajax.push(
          customRequest(
            { file: element } as UploadCustomRequestOptions,
            newIndex
          )
        )
      }

      await Promise.all(ajax)

      fileList.value = []
      isUploading.value = false
    }
  }
}

const warning = ref()

const maxThumbNow = computed(() => {
  if (landingNewStore.permissions.validateThumb()) {
    return MAX_THUMB
  }
  return 1
})

const beforeUpload = async (data: any) => {
  if (landingNewStore.permissions.validateThumb()) {
    const ok = await validateImageThumb(data)
    if (!ok) {
      return false
    }
  }

  if (
    pendingFiles.value + (props.landing.thumbnails?.length || 0) >=
    maxThumbNow.value
  ) {
    //Chỉ thông báo 1 lần nếu upload nhiều files, nếu message đã hủy thì thông báo lại
    if (!warning.value) {
      warning.value = window.message.warning(
        `Too many files. You can only upload up to ${maxThumbNow.value} files.`,
        {
          onAfterLeave: () => {
            // Callback khi message bị xóa
            warning.value = undefined
          },
        }
      )
    }

    return false
  }

  pendingFiles.value += 1
  // Increase the count of files pending processing (add at the start to keep logic consistent)
  // If an error occurs, call reducePendingFile to decrease the count

  addMediaToQueue(data.file)

  return true
}

const addToLanding = () => {
  if (!props.landing.thumbnails || !Array.isArray(props.landing.thumbnails)) {
    props.landing.thumbnails = []
  }

  const remainingSpace = MAX_THUMB_LANDING - props.landing.thumbnails.length
  const itemsToAdd = dataModalGallery.value.selectedMedia.slice(
    0,
    remainingSpace
  ) // Lấy chỉ những phần tử đủ để không vượt quá maxLength

  itemsToAdd.forEach((element) => {
    const newImage = new dataThumb({ path: element })
    newImage.SetSuccess()
    props.landing.thumbnails?.push(newImage)
  })

  showModalGallery.value = false
}

const isDisabledCreateByAI = computed(() => {
  return (
    (!props.landing.IsAcceptNotCategory() &&
      !props.landing.category_id?.length) ||
    isDisabled.value
  )
})

const titleCreateByAI = computed(() => {
  if (
    !props.landing.IsAcceptNotCategory() &&
    !props.landing.category_id?.length
  ) {
    return 'Please generate content or choose at least one category.'
  }
  return isDisabled.value
    ? 'You have reached the maximum number of thumbnails.'
    : ''
})

watch(
  () => modalManagerThumbAI.value.newSubmit,
  async (newValue, oldValue) => {
    if (newValue) {
      if (
        !props.landing.thumbnails ||
        !Array.isArray(props.landing.thumbnails)
      ) {
        props.landing.thumbnails = []
      }

      const remainingSpace = MAX_THUMB_LANDING - props.landing.thumbnails.length
      const itemsToAdd = modalManagerThumbAI.value.dataAI.slice(
        0,
        remainingSpace
      ) // Lấy chỉ những phần tử đủ để không vượt quá maxLength

      let ajax: Promise<void>[] = []
      itemsToAdd.forEach((element) => {
        props.landing.thumbnails?.push(element)
        const newIndex = props.landing.thumbnails?.length
          ? props.landing.thumbnails?.length - 1
          : undefined

        ajax.push(uploadToAI(element, newIndex))
      })

      await Promise.all(ajax)
    }
  }
)

const uploadToAI = async (item: dataThumb, newIndex?: number) => {
  item.loading = true
  let payload: { [key: string]: any } = {
    tags:
      landingStore.getNamesByIds(props.landing.category_id || []) || item.tags,
    number: 1,
  }

  payload.title =
    props.modeData.isEditPage() || item.title
      ? (props.landing.title as string) || ''
      : item.prompt

  const result = await ctr_landing_page.GenerateThumbnail(payload)

  if (result?.status && result?.data?.thumbnails) {
    try {
      item.path = result?.data?.thumbnails[0] || ''
      item.SetSuccess()
    } catch {
      item.SetError()
    }
  } else {
    item.SetError()
  }

  item.loading = false
}
</script>
<template>
  <div
    class="flex items-center justify-between font-bold text-xs -mb-1 mt-2"
    v-if="isShow"
  >
    <div class="flex items-center justify-between gap-2">
      {{ name }} <span class="text-red-500">*</span>

      <n-popover trigger="hover">
        <template #trigger>
          <n-icon :component="QuestionCircleRegular" />
        </template>
        Maximum number of thumbnails: {{ maxThumbNow }}
      </n-popover>
    </div>
    <div class="text-gray-500 font-medium">
      <div v-if="maxThumbNow !== 1">
        Number: {{ props.landing.thumbnails?.length || 0 }}/{{ maxThumbNow }}
      </div>
    </div>
  </div>
  <div class="flex justify-between gap-2" v-if="isShow">
    <div class="flex gap-4">
      <n-upload
        class="h-32 w-64"
        directory-dnd
        multiple
        :accept="'image/*'"
        :show-file-list="false"
        :default-upload="false"
        :on-before-upload="beforeUpload"
        :on-change="uploadListMedia"
        :disabled="isDisabled"
      >
        <n-upload-dragger class="w-64 h-24">
          <n-text> Drag and drop files or click to upload </n-text>
        </n-upload-dragger>
      </n-upload>

      <draggable
        v-if="props.landing.thumbnails"
        v-model="landing.thumbnails"
        item-key="index"
        animation="200"
        ghost-class="drag-ghost"
        class="flex flex-wrap gap-4"
      >
        <div
          class="flex flex-col"
          v-for="(item, index) in props.landing.thumbnails"
          :key="index"
        >
          <div class="h-24 w-24 flex justify-center border relative">
            <div
              class="h-24 w-24 flex justify-center border relative items-center uppercase"
            >
              <n-spin :show="item.loading">
                <n-image
                  :src="src(item.path)"
                  class="h-24 w-24 flex items-center shadow-md"
                  object-fit="fill"
                  v-if="item.path"
                ></n-image>

                <n-tag
                  :type="item.ColorClass()"
                  v-if="item.isAi && item.IsError() && !item.loading"
                  :title="item.prompt"
                  >{{ item.status }}</n-tag
                >
              </n-spin>

              <RemoveButton @onClick="() => onRemoveImage(index)" />
            </div>
          </div>
          <n-button
            v-if="props.modeData.isEditPage() || item.IsOpenRecreate()"
            type="info"
            size="small"
            class="h-8 text-xs"
            @click="() => uploadToAI(item, index)"
            ><n-icon :component="RefreshIcon" size="24"
          /></n-button>
        </div>
      </draggable>
    </div>

    <div class="flex gap-2">
      <n-button size="small" :disabled="isDisabled" @click="openModalGallery"
        >Gallery</n-button
      >
      <n-button
        size="small"
        :disabled="isDisabledCreateByAI"
        :title="titleCreateByAI"
        @click="openModal"
        >Create By AI</n-button
      >
    </div>

    <ModalThumbnailAI
      :modalThumbnailInfo="modalManagerThumbAI"
      :landing="props.landing"
    />

    <n-modal v-model:show="showModalGallery">
      <n-card
        style="width: 95%; height: 90vh"
        title="Gallery"
        size="huge"
        role="dialog"
        aria-modal="true"
        :bordered="false"
        class="card-flex-gap-4 overflow-auto relative"
      >
        <GalleryCard :modalInfo="dataModalGallery" />
        <div class="flex flex-row-reverse sticky bottom-0 p-4">
          <n-button
            class="button-apply"
            color="#f43f5e"
            size="small"
            @click="addToLanding()"
          >
            Add To Landing Page
          </n-button>
        </div>
      </n-card>
    </n-modal>
  </div>
</template>

<style lang="scss">
.drag-ghost {
  opacity: 0.5; /* Giảm độ trong suốt của item khi kéo */
}
</style>
