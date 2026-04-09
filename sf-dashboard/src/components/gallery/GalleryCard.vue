<script setup lang="ts">
import {
  dataThumb,
  MediaLibraryClass,
  ModalGalleryInfo,
  ModalThumbnailInfo,
  StatusMediaLibraryClass,
} from '@/types/components/gallery'
import Skeleton from '@/components/skeleton/SkeletonDetailCenter.vue'
import Library from '@/components/gallery/Library.vue'
import SearchMedia from '@/components/gallery/SearchMedia.vue'
import ModalThumbnailAI from '@/components/landing_page/modal/ModalThumbnailAI.vue'
import { ctr_landing_page } from '@/services/ctr_landing_page'

const props = defineProps({
  modalInfo: {
    type: Object as () => ModalGalleryInfo,
    require: false,
  },
})

const dataMedia = ref<MediaLibraryClass>(
  new MediaLibraryClass({ MAX_MEDIA: 100 })
)

const isWaitingRenderImage = ref<boolean>(false)
const messageManager = ref()

const modalThumbnailInfo = ref<ModalThumbnailInfo>(new ModalThumbnailInfo())

const statusMedia = ref<StatusMediaLibraryClass>(new StatusMediaLibraryClass()) // Trạng thái upload media

onMounted(async () => {
  dataMedia.value.fetchPermissionMediaLibrary()

  statusMedia.value.isLoading = true
  dataMedia.value.fetchMedia()

  statusMedia.value.isLoading = false
})

const openModal = () => {
  modalThumbnailInfo.value.changeShowModal(true)
}

const isComp = window.arb.isCompany()

watch(
  () => modalThumbnailInfo.value.newSubmit,
  async (newValue, oldValue) => {
    if (newValue) {
      isWaitingRenderImage.value = true
      messageManager.value = window.message.loading('Creating thumbnail...', {
        duration: 0,
      })
      let ajax: Promise<void>[] = []

      modalThumbnailInfo.value.dataAI.forEach(async (element) => {
        ajax.push(uploadToAI(element))
      })

      await Promise.all(ajax)

      await dataMedia.value.refreshGallery()

      if (messageManager.value) {
        messageManager.value.destroy()
      }

      isWaitingRenderImage.value = false
    }
  }
)

const uploadToAI = async (item: dataThumb) => {
  await ctr_landing_page.GenerateThumbnail({
    prompt: item.prompt,
    tags: [],
  })
}
</script>
<template>
  <div class="flex flex-col gap-4 min-h-[600px] p-0">
    <Skeleton v-if="statusMedia.isLoading" />

    <div v-else class="flex flex-col gap-4">
      <n-card class="card-flex-gap-4">
        <GalleryUploadMedia
          :dataMedia="dataMedia"
          :statusMedia="statusMedia"
          v-if="dataMedia.isHasAddPermission()"
        />

        <div class="h-6" v-else></div>

        <n-button
          size="small"
          v-if="isComp"
          class="absolute right-4 top-4"
          @click="openModal"
          :disabled="isWaitingRenderImage"
          >Create By AI</n-button
        >
        <SearchMedia :dataMedia="dataMedia" :statusMedia="statusMedia" />

        <Library
          :dataMedia="dataMedia"
          :statusMedia="statusMedia"
          :modalInfo="props.modalInfo"
        />

        <ModalThumbnailAI :modalThumbnailInfo="modalThumbnailInfo" />
      </n-card>
    </div>
  </div>
</template>
