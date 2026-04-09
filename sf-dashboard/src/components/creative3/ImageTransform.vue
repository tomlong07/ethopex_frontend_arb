<script setup lang="ts">
import { SnapData, images as imgType } from '@/types/components/creative'
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

import { ctr_creative } from '@/services/ctr_creative'
import { URL_UPLOAD } from '@/constants/urls'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const createImage = async () => {
  if (!props.cre.info_image || !props.cre.info_image.length) {
    return
  }

  const founds = document.querySelectorAll('.empty-value-inputs')

  if (founds && founds.length) {
    window.message.warning(
      'Please complete all required fields for image transformation'
    )

    founds[0].scrollIntoView({ behavior: 'smooth', block: 'center' })

    founds.forEach((element) => {
      helper.hightlightDiv2(element)
    })

    return
  }

  props.status.isTransforming = true
  props.status.isUploading = true

  for (let index = 0; index < props.cre.info_image.length; index++) {
    const element = props.cre.info_image[index]
    await uploadImageTransform(element)
  }

  props.status.isTransforming = false
  props.status.isUploading = false
}

const uploadImageTransform = async (element: SnapData) => {
  if (!element.coordinates) {
    window.message.warning('Please crop the image to a 16:9 ratio')
    return
  }
  const result = await ctr_creative.UploadImageSnapchat({
    text1: element.title,
    text2: element.description,
    text3: element.call_to_action,
    image: element.image,
    coordinates: element.coordinates,
  })

  if (!result.status) {
    window.message.error('Failed to upload the image')
    return
  }

  try {
    let data = result.data

    data = JSON.parse(data)
    let thumb = data.data_object.thumb[0]
    props.cre.images?.push({ image: thumb })
  } catch {}
}

const isVideo = (i?: imgType): boolean => {
  if (i) {
    return i?.image?.includes('.mp4')
  }
  return false
}

const isImage = (i?: imgType): boolean => {
  if (i) {
    return !isVideo(i)
  }
  return true
}

const src = (path: string | undefined) => {
  if (path?.includes('http') || path?.includes('https')) {
    return path
  }
  return `${URL_UPLOAD}${
    path ? path : '/assets/img/thumb_007cc1f0c93c0758ea61a23e0888891a.png'
  }`
}

watch(
  () => props.status.createImageSnapchat,
  () => {
    createImage()
  }
)
</script>

<template>
  <n-card title="Image Transform" v-if="props.cre.IsSnapchat()">
    <n-spin :show="props.status.isTransforming">
      <div class="min-h-400" id="image-transform">
        <n-grid
          x-gap="12"
          :cols="4"
          v-if="props.cre.images && props.cre.images.length"
        >
          <n-grid-item v-for="(item, index) in props.cre.images" :key="index">
            <n-image :src="src(item.image)" v-if="isImage(item)" />

            <video
              v-if="isVideo(item)"
              :key="src(item?.image)"
              class="flex items-center w-auto h-full rounded-md"
              controls
              preload="none"
              :poster="item?.thumb ? src(item?.thumb) : undefined"
            >
              <source type="video/mp4" :src="src(item?.image)" />
            </video>
          </n-grid-item>
        </n-grid>
      </div>
    </n-spin>
  </n-card>
</template>

<style scoped lang="scss">
.min-h-400 {
  min-height: 400px;
}
</style>
