<script setup lang="ts">
import {
  creativeType,
  SnapData,
  images as img,
} from '@/types/components/creative'

import { ctr_creative } from '@/services/ctr_creative'
import { URL_UPLOAD } from '@/constants/urls'

const props = defineProps({
  cre: {
    type: Object as () => creativeType,
    required: true,
  },

  listImage: {
    type: Array as () => img[],
    required: true,
  },

  isShow: {
    type: Boolean,
    required: true,
  },

  isModal: {
    type: Boolean,
    required: true,
  },
})

const createImage = async () => {
  if (!props.cre.info_image || !props.cre.info_image.length) {
    return
  }

  const founds = document.querySelectorAll('.empty-value-inputs')

  if (founds && founds.length) {
    window.message.error('Please fill all information for image transform')

    founds[0].scrollIntoView({ behavior: 'smooth', block: 'center' })

    founds.forEach((element) => {
      helper.hightlightDiv2(element)
    })

    return
  }

  showSpin.value = true

  for (let index = 0; index < props.cre.info_image.length; index++) {
    const element = props.cre.info_image[index]
    await uploadImageTransform(element)
  }

  showSpin.value = false
}

const uploadImageTransform = async (element: SnapData) => {
  if (!element.coordinates) {
    window.message.warning('Please crop the image to 16:9')
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
    window.message.error('Image upload failed')
    return
  }

  try {
    let data = result.data

    data = JSON.parse(data)
    let thumb = data.data_object.thumb[0]
    props.cre.images?.push({ image: thumb })

    if (props.isModal) {
      props.listImage.push({ image: thumb })
    }
  } catch {}
}

const showSpin = ref<boolean>(false)

defineExpose({
  createImage,
})
</script>

<template>
  <n-card title="Image Transform" v-if="isShow">
    <n-spin :show="showSpin">
      <div class="min-h-400" id="image-transform">
        <n-grid
          x-gap="12"
          :cols="4"
          v-if="props.cre.images && props.cre.images.length"
        >
          <n-grid-item v-for="(item, index) in props.cre.images" :key="index">
            <n-image :src="URL_UPLOAD + item.image" />
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
