<script setup lang="ts">
//@ts-ignores
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import { SnapData, coordinatesType } from '@/types/components/creative'
import { creativeTypeClass } from '@/types/components/creative-v2'

import ImageEditorIcon from '@/assets/icons/ImageEditorIcon.vue'
import { URL_UPLOAD } from '@/constants/urls'

const props = defineProps({
  editImage: {
    type: Object as () => SnapData,
    required: true,
    default: () => ({} as SnapData),
  },

  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})

const editorComp = ref()

const showModal = ref<boolean>(false)
const ratio = 16 / 9

const cropstart = (data: SnapData) => {}

const cropend = () => {
  ready()
  if (props.editImage.coordinates && props.cre.info_image) {
    for (let index = 0; index < props.cre.info_image.length; index++) {
      if (props.cre.info_image[index].image == props.editImage.image) {
        props.cre.info_image[index].coordinates = props.editImage.coordinates
        break
      }
    }
  }
}

const ready = () => {
  props.editImage.coordinates = repairInfo(editorComp?.value?.getData())
}

const repairInfo = (data: coordinatesType) => {
  for (const key in data) {
    if (Object.hasOwnProperty.call(data, key)) {
      data[key as keyof coordinatesType] = Math.floor(
        data[key as keyof coordinatesType]
      )
    }
  }

  return data
}

const changeShowModal = (status: boolean) => {
  showModal.value = status
}

const saveImageEdit = () => {
  changeShowModal(false)
}

defineExpose({
  changeShowModal,
})
</script>

<template>
  <n-modal
    v-model:show="showModal"
    preset="dialog"
    type="success"
    :closable="false"
    :show-icon="false"
    class="modal-editor-image"
    style="padding: 0"
    :close-on-esc="false"
    :mask-closable="false"
  >
    <n-card class="h-16" embedded
      ><div class="flex items-center gap-2 text-xl px-4 h-full select-none">
        <n-icon size="22"><ImageEditorIcon /></n-icon>Image Editor
      </div></n-card
    >

    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      class="overflow-y-scroll"
      style="padding-left: 10px; padding-right: 10px"
    >
      <div v-if="props.editImage">
        <div style="height: 500px">
          <div draggable="false" class="flex flex-col gap-4">
            <vue-cropper
              ref="editorComp"
              :src="URL_UPLOAD + editImage.image"
              :data="editImage.coordinates"
              alt="Source Image"
              :background="false"
              :zoomable="false"
              :viewMode="3"
              :initialAspectRatio="ratio"
              :aspectRatio="ratio"
              :responsive="true"
              :guides="false"
              :center="false"
              :autoCrop="true"
              :autoCropArea="1"
              :minCropBoxWidth="28"
              :checkCrossOrigin="false"
              crossOrigin="anonymous"
              :checkOrientation="false"
              @cropstart="cropstart"
              @cropend="cropend"
              @ready="ready"
            >
            </vue-cropper>

            <div class="flex">
              <div class="ratio-value flex flex-row gap-4 items-center">
                <n-tag size="large">16:9</n-tag>
              </div>
            </div>
          </div>
        </div>
      </div>
    </n-card>

    <n-card class="h-16 p-2 not-border" embedded>
      <div class="flex h-full select-none">
        <div class="ml-auto flex flex-row gap-4 items-center">
          <n-button type="primary" @click="saveImageEdit"> Save </n-button>
        </div>
      </div></n-card
    >
  </n-modal>
</template>
