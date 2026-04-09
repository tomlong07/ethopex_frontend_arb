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

import { MapRatioValid } from '@/constants/media'
import { URL_UPLOAD } from '@/constants/urls'

import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

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
  const image = props.cre.images.find(
    (item) => item.image === props.status.editingImage
  )

  if (!image) return null

  image.image_ratio?.forEach((ratio) => {
    if (!ratio.coordinates) return

    if (!ratio.coordinates.scaleX || ratio.coordinates.scaleX === 0) {
      ratio.coordinates.scaleX = 1
    }

    if (!ratio.coordinates.scaleY || ratio.coordinates.scaleY === 0) {
      ratio.coordinates.scaleY = 1
    }
  })

  return image
})

const handleToggleCrop = (val: boolean, currentData: any) => {
  if (props.cre.IsNewsbreak()) {
    dataImage.value?.image_ratio?.forEach((ratio: any) => {
      if (ratio !== currentData) {
        ratio.off = !currentData.off
      }
    })
  }
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
  ready(data, url)

  if (!props.status.isChangeData) {
    props.status.isChangeData = true
  }
}

const ready = (data: imageRatio, url: string) => {
  try {
    const dataInfo = repairInfo(
      itemRefs.value[keyCropper(url, data.ratio)].getData()
    )
    data.coordinates = dataInfo
  } catch {}
}

const resetCrop = (data: imageRatio, url: string) => {
  itemRefs.value[keyCropper(url, data.ratio)].reset()
  data.change = false
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

const showCropper = ref<boolean>(true)

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
  await helper.sleep(50)
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
    window.message.error(Message.value.cre_condition)
    return
  }

  props.status.showModal = false
}

const cancelCallback = () => {
  props.cre.images = helper.clone(oldData.value)
  props.status.showModal = false
}

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
          class="ml-auto button-editor-image cursor-pointer not-filter-icon"
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
                    :background="false"
                    :zoomable="false"
                    :viewMode="3"
                    :initialAspectRatio="getSizeFloat(data.ratio)"
                    :aspectRatio="getSizeFloat(data.ratio)"
                    :responsive="true"
                    :guides="false"
                    :center="false"
                    :autoCrop="true"
                    :autoCropArea="1"
                    :minCropBoxWidth="28"
                    :checkCrossOrigin="false"
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
                      v-if="!data.by_ai"
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
                      <span>{{ Message.image_use }}</span>
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
                    {{ !imageValid(data) ? `(${Creative.img_warn})` : '' }}
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
