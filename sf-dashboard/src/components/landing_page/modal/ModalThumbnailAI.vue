<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import Plus from '@/assets/icons/Plus.vue'
import { ModalThumbnailInfo } from '@/types/components/gallery'
import Minus from '@/assets/icons/Minus.vue'
import { MAX_THUMB_LANDING } from '@/constants/limits'

const MAX_THUMB = MAX_THUMB_LANDING
const MAX_THUMB_GALLERY = 10

const props = defineProps({
  modalThumbnailInfo: {
    type: Object as () => ModalThumbnailInfo,
    required: true,
  },
  landing: {
    type: Object as () => landingTypeClass,
    required: false,
  },
})

const isGalleryPage = computed(() => {
  return !props.landing
})

const closeModal = () => {
  props.modalThumbnailInfo.showModal = false
}

const processCreate = async () => {
  props.modalThumbnailInfo.submitToThumb()

  props.modalThumbnailInfo.changeShowModal(false)
}

watch(
  () => props.modalThumbnailInfo.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      props.modalThumbnailInfo.resetDataAI()
    }
  }
)

const removeThisItem = (index: number) => {
  props.modalThumbnailInfo.removeADataAI(index)
}

const addItem = () => {
  props.modalThumbnailInfo.addNewDataAI()
}

const isMaxThumb = computed(() => {
  if (isGalleryPage.value)
    return props.modalThumbnailInfo.dataAI.length >= MAX_THUMB_GALLERY
  return (
    (props.landing?.thumbnails?.length || 0) +
      props.modalThumbnailInfo.dataAI.length >=
    MAX_THUMB
  )
})

const isNotCreate = computed(() => {
  if (isGalleryPage.value)
    return props.modalThumbnailInfo.dataAI.length >= MAX_THUMB_GALLERY

  return (props.landing?.thumbnails?.length || 0) >= MAX_THUMB
})
</script>

<template>
  <n-modal
    v-model:show="props.modalThumbnailInfo.showModal"
    :mask-closable="false"
    :close-on-esc="false"
    @mask-click="closeModal"
    @esc="closeModal"
  >
    <div class="relative">
      <n-card
        style="width: 1000px; height: 450px"
        title="Create Thumbnails By AI"
        size="huge"
        role="dialog"
        aria-modal="true"
        :bordered="false"
        class="card-flex-gap-4 overflow-auto"
      >
        <div class="flex items-center">
          <div class="w-1/6 font-bold">Prompts</div>
          <div class="w-5/6 flex flex-col gap-4">
            <div
              class="flex items-center gap-2"
              v-for="(item, index) in props.modalThumbnailInfo.dataAI"
              :key="index"
            >
              <n-input
                type="textarea"
                v-model:value="props.modalThumbnailInfo.dataAI[index].prompt"
                :placeholder="'Prompt ' + (index + 1)"
              />

              <n-button-group>
                <n-button
                  ghost
                  class="dynamic-button"
                  :disabled="props.modalThumbnailInfo.dataAI?.length === 1"
                  @click="removeThisItem(index)"
                >
                  <template #icon>
                    <n-icon size="12"><Minus /></n-icon>
                  </template>
                </n-button>
                <n-button
                  ghost
                  class="dynamic-button"
                  :disabled="isMaxThumb"
                  @click="addItem"
                >
                  <template #icon>
                    <n-icon size="12"><Plus /></n-icon>
                  </template>
                </n-button>
              </n-button-group>
            </div>
          </div>
        </div>
      </n-card>

      <div class="absolute bottom-4 right-4">
        <n-button
          class="button-apply"
          color="#f43f5e"
          @click="processCreate()"
          :disabled="isNotCreate"
        >
          Create
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
