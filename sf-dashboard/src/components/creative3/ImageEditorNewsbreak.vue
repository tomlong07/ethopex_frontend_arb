<script setup lang="ts">
//@ts-ignores
import VueCropper from 'vue-cropperjs'
import 'cropperjs/dist/cropper.css'

import Close from '@/assets/icons/Close.vue'

import { imageRatio, coordinatesType } from '@/types/components/creative'

import {
  CreativeStateManager,
  creativeTypeClass,
  images as imgType,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import Checkmark from '@/assets/icons/Checkmark.vue'
import ImageEditorIcon from '@/assets/icons/ImageEditorIcon.vue'
import RefreshIcon from '@/assets/icons/RefreshIcon.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import HandPointRight from '@/assets/icons/HandPointRight.vue'
import { URL_UPLOAD } from '@/constants/urls'
import { MapRatioValid } from '@/constants/media'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const dataImage = computed(() => {
  return props.cre.images.find(
    (item) => item.image == props.status.editingImage
  )
})

const handleToggleCrop = (val: boolean, currentData: any) => {
  dataImage.value?.image_ratio?.forEach((ratio: any) => {
    if (ratio !== currentData) {
      ratio.off = !currentData.off
    }
  })
}

const showConfirm = ref<boolean>(false)

const oldData = ref<imgType[]>([])

const itemRefs = ref<{ [key: string]: any }>({})

const setCropperRef = (url: string, key: string, el: any) => {
  if (!itemRefs.value) {
    itemRefs.value = {}
  }
  itemRefs.value[keyCropper(url, key)] = el
}

const keyCropper = (url: string, key: string) => {
  return url + '_' + key
}

const getSizeFloat = (size: string) => {
  let sizeArr = size.split(':')
  try {
    return parseFloat(sizeArr[0]) / parseFloat(sizeArr[1])
  } catch {
    return 1
  }
}

const cropstart = (data: imageRatio) => {
  data.change = true
}
const cropend = (data: imageRatio, url: string) => {
  const cropperKey = keyCropper(url, data.ratio)
  const cropper = itemRefs.value[cropperKey]

  if (cropper) {
    saveCropperState(cropper, data)
  }

  if (!props.status.isChangeData) {
    props.status.isChangeData = true
  }
}

const resetCrop = (data: imageRatio, url: string) => {
  const cropperKey = keyCropper(url, data.ratio)

  itemRefs.value[cropperKey].reset()

  data.zoom = 1
  data.canvasData = undefined
  data.coordinates = undefined
  data.change = false
  setDefaultCanvasSize(itemRefs.value[cropperKey], data.zoom)

  saveCropperState(itemRefs.value[cropperKey], data)

  cropend(data, url)
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

//Mỗi lần mở edit clone data cũ để rollback khi cancel
//isChangeData đánh dấu để phát hiện data đã đc user change chưa để hiện confirm
watch(
  () => props.status.showModal,
  (newValue, oldValue) => {
    if (newValue === true) {
      oldData.value = helper.clone(props.cre.images)
      if (props.status.editingImage) {
        changeCropper(props.status.editingImage)
      }
      props.status.isChangeData = false
    }
  }
)

const changeCropper = async (image: string) => {
  showCropper.value = false
  changeEditorImage(image)

  // const hasImage = dataImage.value?.image_ratio?.some((item) => item.image)
  // if (!hasImage) {
  //   dataImage.value?.image_ratio?.forEach((item) => {
  //     item.image = image
  //   })
  // }

  //Init lại cropper để reactive vuecropper
  await helper.sleep(10)
  showCropper.value = true
}

const changeEditorImage = (image: string) => {
  if (!image) {
    return
  }
  props.status.editingImage = image
}

const submitCallback = async () => {
  const errorImages = document.querySelectorAll('.image-ratio-error')

  if (errorImages && errorImages.length > 0) {
    window.message.error(arb?.mess('cre_condition'))
    return
  }

  props.status.showModal = false
}

const cancelCallback = () => {
  props.cre.images = helper.clone(oldData.value)
  props.status.showModal = false
}

const showCropper = ref<boolean>(true)

const editedImage = (dataImage: imgType) => {
  let found = false

  if (dataImage.image_ratio) {
    found = dataImage.image_ratio.some((item) => item.change)
    if (found) {
      return found
    }
  }

  return found
}

const openConfirm = () => {
  if (props.status.isChangeData) {
    showConfirm.value = true

    return
  }

  cancelCallback()
}

const src = (url: string) => {
  if (!url) {
    return ''
  }

  if (url.includes('http')) {
    return url
  }

  if (!url.includes(URL_UPLOAD)) {
    url = URL_UPLOAD + url
  }

  return url
}

const openImage = (url: string = '') => {
  if (!url) return
  window.open(src(url), '_blank')
}

const ratioText = (ratio: string) => {
  return MapRatioValid[ratio]
    ? `The minimum size is ${MapRatioValid[ratio].width}x${MapRatioValid[ratio].height} (Google: ${MapRatioValid[ratio].gwidth}x${MapRatioValid[ratio].gheight})`
    : ''
}

const imageValid = (data: imageRatio) => {
  if (data?.coordinates) {
    if (MapRatioValid[data.ratio]) {
      const validWidth = MapRatioValid[data.ratio].gwidth as number
      const validHeight = MapRatioValid[data.ratio].gheight as number

      if (
        data.coordinates.width < validWidth ||
        data.coordinates.height < validHeight
      ) {
        return false
      }
    }
  }

  return true
}

//Lọc bỏ video
const listImages = computed(() => {
  return props.cre.images.filter(
    (item) =>
      !item.image.includes('.mp4') &&
      (item.image.includes('.jpg') ||
        item.image.includes('.png') ||
        item.image.includes('.bmp') ||
        item.image.includes('.gif') ||
        item.image.includes('.jpeg'))
  )
})
watch(
  () => props.cre.type,
  (newType) => {
    if (newType?.toLowerCase() !== 'facebook' && props.status.showModal) {
      props.status.showModal = false
    }
  }
)

const restoreCropperState = (cropper: any, data: imageRatio) => {
  try {
    if (data.canvasData) {
      cropper.setCanvasData(data.canvasData)
    }

    if (data.coordinates) {
      cropper.setData(data.coordinates)
    }
  } catch (error) {
    console.error('Restore error:', error)
  }
}

const saveCropperState = (cropper: any, data: imageRatio) => {
  // Lưu vị trí CropBox (vùng crop)
  const cropBoxData = repairInfo(cropper.getData())
  // Lưu thêm thông tin về scale
  // const imageData = cropper.getImageData()
  cropBoxData.scaleX = data.zoom || 1
  cropBoxData.scaleY = data.zoom || 1

  data.coordinates = cropBoxData

  // Lưu vị trí Canvas (ảnh gốc)
  const canvasInfo = cropper.getCanvasData()
  data.canvasData = {
    left: Math.floor(canvasInfo.left),
    top: Math.floor(canvasInfo.top),
    width: Math.floor(canvasInfo.width),
    height: Math.floor(canvasInfo.height),
  }
}

const setDefaultCanvasSize = (cropper: any, zoom: number) => {
  const containerData = cropper.getContainerData()
  const imageData = cropper.getImageData()

  const targetWidth = containerData.width * zoom
  const targetHeight = containerData.height * zoom
  const scale = Math.min(
    targetWidth / imageData.naturalWidth,
    targetHeight / imageData.naturalHeight
  )

  const newWidth = imageData.naturalWidth * scale
  const newHeight = imageData.naturalHeight * scale

  cropper.setCanvasData({
    left: (containerData.width - newWidth) / 2,
    top: (containerData.height - newHeight) / 2,
    width: newWidth,
    height: newHeight,
  })
}

const getZoomValue = (data: imageRatio) => {
  return data.zoom || 1
}

const setZoomValue = (data: imageRatio, sliderValue: number) => {
  const cropperKey = keyCropper(dataImage.value?.image || '', data.ratio)
  if (itemRefs.value[cropperKey]) {
    const cropper = itemRefs.value[cropperKey]

    if (!cropper) return

    cropper.scale(sliderValue)

    data.zoom = sliderValue
    data.change = true

    saveCropperState(cropper, data)

    cropend(data, dataImage.value?.image || '')
  }
}
const ready = (data: imageRatio, url: string) => {
  try {
    const cropperKey = keyCropper(url, data.ratio)
    const cropper = itemRefs.value[cropperKey]

    if (!cropper) return

    // Nếu đã có dữ liệu → restore
    if (data.coordinates) {
      if (!data.coordinates.scaleX && !data.coordinates.scaleY) {
        data.coordinates.scaleX = 1
        data.coordinates.scaleY = 1
      }
      restoreCropperState(cropper, data)
      return
    }

    data.zoom = 1
    setDefaultCanvasSize(cropper, data.zoom)

    // Lưu state ban đầu
    saveCropperState(cropper, data)
  } catch (error) {
    console.error('Ready error:', error)
  }
}
</script>

<template>
  <n-modal
    v-model:show="props.status.showModal"
    preset="dialog"
    type="success"
    :closable="false"
    :show-icon="false"
    class="modal-editor-image"
    style="width: 1080px; height: 95vh; padding: 0"
    :close-on-esc="false"
    :mask-closable="false"
    :on-esc="openConfirm"
    :on-mask-click="openConfirm"
    v-if="props.cre.type?.toLowerCase() !== 'facebook'"
  >
    <n-card class="h-16" embedded
      ><div class="flex items-center gap-2 text-xl px-4 h-full select-none">
        <n-icon size="22"><ImageEditorIcon /></n-icon>Image Editor
        <n-icon
          size="26"
          class="ml-auto button-editor-image cursor-pointer"
          @click="openConfirm"
          ><Close
        /></n-icon></div
    ></n-card>

    <n-card class="h-36" :bordered="false">
      <template class="flex gap-4 flex-col h-36 p-2">
        <div class="h-8">
          System has automatically adjusted your images to fit our various
          widgets. If needed, you can edit your cropping selections by dragging
          the rectangle to the desired position.
        </div>
        <div
          class="flex flex-row gap-4 overflow-auto list-image-editor"
          style="height: calc(100% - 2rem)"
        >
          <div
            v-for="dataImage in listImages"
            :key="dataImage.image"
            :class="[
              dataImage.image == props.status.editingImage
                ? 'selected-image'
                : '',
            ]"
            class="max-w-full max-h-full overflow-hidden border-image-editor rounded-md cursor-pointer relative w-28 h-16 shrink-0"
            @click="changeCropper(dataImage.image)"
          >
            <n-image
              width="116"
              class="flex items-center"
              object-fit="cover"
              :src="src(dataImage.image)"
              :preview-disabled="true"
            />

            <span
              class="absolute bottom-2 right-2 edited-button"
              v-if="editedImage(dataImage)"
              >Edited</span
            >
          </div>
        </div>
      </template>
    </n-card>
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      class="overflow-y-scroll"
      style="
        height: calc(95vh - 18rem);
        padding-left: 10px;
        padding-right: 10px;
      "
    >
      <div v-if="dataImage && showCropper">
        <n-grid x-gap="48" y-gap="48" :cols="2">
          <n-gi v-for="(data, ind) in dataImage.image_ratio" :key="ind">
            <div>
              <div draggable="false" class="flex flex-col gap-4">
                <n-image
                  v-if="data.by_ai && data.image"
                  :src="src(data.image)"
                />

                <div
                  v-else
                  class="cropper-container"
                  :class="{
                    'cropper-disabled': data.off && props.cre.IsNewsbreak(),
                  }"
                >
                  <vue-cropper
                    :ref="(el:any) => setCropperRef(dataImage?.image as string, data.ratio as string, el)"
                    :src="src(dataImage.image)"
                    :data="data.coordinates"
                    alt="Source Image"
                    :background="true"
                    :zoomable="false"
                    :viewMode="0"
                    :initialAspectRatio="getSizeFloat(data.ratio)"
                    :aspectRatio="getSizeFloat(data.ratio)"
                    :responsive="true"
                    :guides="false"
                    :center="true"
                    :autoCrop="true"
                    :autoCropArea="1"
                    :minCropBoxWidth="28"
                    :checkCrossOrigin="true"
                    :wheelZoomRatio="0.1"
                    crossOrigin="anonymous"
                    :checkOrientation="false"
                    @cropstart="cropstart(data)"
                    @cropend="cropend(data, dataImage?.image || '')"
                    @ready="ready(data, dataImage?.image || '')"
                  >
                  </vue-cropper>
                </div>
                <div class="flex">
                  <div class="ratio-value flex flex-row gap-4 items-center">
                    <n-popover trigger="hover" v-if="ratioText(data.ratio)">
                      <template #trigger>
                        <n-tag size="large">{{ data.ratio }}</n-tag>
                      </template>
                      <span>{{ ratioText(data.ratio) }}</span>
                    </n-popover>
                    <n-tag size="large" v-else>{{ data.ratio }}</n-tag>

                    <n-switch
                      v-if="props.cre.IsNewsbreak()"
                      v-model:value="data.off"
                      :checked-value="false"
                      :unchecked-value="true"
                      @update:value="(val: boolean) => handleToggleCrop(val, data)"
                    >
                      <template #checked-icon>
                        <n-icon :component="Checkmark" color="#121212" />
                      </template>
                      <template #unchecked-icon>
                        <n-icon :component="Close" />
                      </template>
                    </n-switch>

                    <n-button
                      class="w-24"
                      strong
                      secondary
                      type="info"
                      v-if="data.image && !data.by_ai"
                      @click="openImage(data.image)"
                    >
                      Preview
                    </n-button>

                    <n-popover trigger="hover" v-if="data.image && !data.by_ai">
                      <template #trigger>
                        <n-icon size="16"><InformationCircleOutline /></n-icon>
                      </template>
                      <span>{{ arb.mess('image_use') }}</span>
                    </n-popover>
                  </div>

                  <div
                    class="ml-auto"
                    :class="{ invisible: !data.change }"
                    @click="resetCrop(data, dataImage?.image || '')"
                  >
                    <n-popover trigger="hover">
                      <template #trigger>
                        <n-icon
                          name="Refresh"
                          size="24"
                          class="text-blue-500 cursor-pointer button-editor-image"
                          :component="RefreshIcon"
                        />
                      </template>
                      <span>Reset Crop</span>
                    </n-popover>
                  </div>
                </div>

                <div
                  class="flex items-center gap-3"
                  v-if="props.cre.IsNewsbreak()"
                >
                  <div class="flex items-center gap-1 cursor-pointer">
                    <span>Resize Crop:</span>
                  </div>

                  <n-slider
                    :value="getZoomValue(data)"
                    @update:value="(val: number) => setZoomValue(data, val)"
                    :step="0.1"
                    :min="0.1"
                    :max="2"
                    :disabled="data.off && props.cre.IsNewsbreak()"
                    class="flex-1"
                  >
                    <template #thumb>
                      <n-icon-wrapper :size="20" :border-radius="12">
                        <n-icon :size="14" :component="HandPointRight" />
                      </n-icon-wrapper>
                    </template>
                  </n-slider>
                </div>

                <div class="flex items-center" v-if="!data.by_ai">
                  <n-icon
                    :component="Checkmark"
                    v-if="imageValid(data)"
                    size="18"
                    color="#18a058"
                  />
                  <n-icon :component="Close" v-else size="18" color="#d03050" />

                  <span
                    :class="{
                      'text-red-500 image-ratio-error': !imageValid(data),
                    }"
                  >
                    Width: {{ data.coordinates?.width }}px, Height:
                    {{ data.coordinates?.height }}px
                    {{ !imageValid(data) ? `(${arb?.mess('img_warn')})` : '' }}
                  </span>
                </div>
              </div>
            </div>
          </n-gi>
        </n-grid>
      </div>
    </n-card>

    <n-card class="h-16 p-2 justify-center" embedded>
      <div class="flex h-full select-none">
        <div class="flex items-center gap-2">
          <n-icon size="20"><InformationCircleOutline /></n-icon>
          Note that these cropping selections will be saved to your images for
          use within any future ads.
        </div>
        <div class="ml-auto flex flex-row gap-4 items-center">
          <n-button @click="openConfirm">Cancel</n-button>

          <n-button type="info" @click="submitCallback"> Save </n-button>
        </div>
      </div></n-card
    >
  </n-modal>

  <n-modal
    v-model:show="showConfirm"
    preset="dialog"
    content="Please note that the changes that were made will not be saved."
    positive-text="Continue"
    negative-text="Quit without saving"
    :show-icon="false"
    :closable="false"
    @negative-click="cancelCallback"
  />
</template>

<style lang="scss" scoped>
@use '@/css/ImageEditor.scss';
.cropper-container {
  position: relative;
  transition: opacity 0.3s ease;
}

.cropper-container.cropper-disabled {
  opacity: 0.5;
  cursor: not-allowed !important;
}

.cropper-container.cropper-disabled * {
  pointer-events: none;
}

.cropper-container.cropper-disabled::after {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  cursor: not-allowed;
  z-index: 10;
}
</style>

<style lang="scss">
.modal-editor-image {
  .n-dialog__content {
    margin: 0;
  }
}
</style>
