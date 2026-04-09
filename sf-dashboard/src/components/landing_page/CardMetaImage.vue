<script setup lang="ts">
import { ctr_creative } from '@/services/ctr_creative'
import { ModeClassString } from '@/types/components/base'
import { landingTypeClass } from '@/types/components/landing'
import { UploadCustomRequestOptions } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

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

const fileId = ref<string[]>([])

const onCreateMeta = () => {
  return {
    image: '',
    keyword: '',
  }
}

//@ts-ignore
const uploadImage = async (options: UploadCustomRequestOptions, value: any) => {
  const { file } = options

  if (!fileId.value.includes(file.id)) {
    const formData = new FormData()
    formData.append('file', file.file as File)

    const result = await ctr_creative.uploadImage(formData)

    if (result.status === 'success') {
      const imageUrl = result.data_object.thumb[0]

      if (props.landing.demand_source === 'adsense') {
        if (props.landing.prelander === 'on') {
          value.image = imageUrl
        } else {
          props.landing.image = imageUrl
        }
      } else if (props.landing.demand_source === 'codefuel') {
        value.image = imageUrl
      } else {
        window.message.error(`No image exists!`)
      }
    } else {
      window.message.error(result.errors[0].message)
    }
  }
}
</script>
<template>
  <n-dynamic-input
    v-model:value="props.landing.landing_page_meta"
    class="mt-1"
    :on-create="onCreateMeta"
  >
    <template #create-button-default> Add keyword </template>
    <template #default="{ value }">
      <div class="w-full mb-4">
        <FloatingWrapper name="Keyword" medium rounded>
          <n-input v-model:value="value.keyword" type="text" />
        </FloatingWrapper>
        <div
          v-if="props.modeData.isEditPage() && value.image !== ''"
          class="mt-4"
        >
          <n-image width="100" :src="URL_UPLOAD + value.image" />
        </div>

        <n-upload
          v-model:value="value.image"
          directory-dnd
          :action="FULL_URL_MEDIA"
          class="mt-3"
          :custom-request="(options:any) => uploadImage(options, value)"
        >
          <n-button>Upload Image</n-button>
        </n-upload>
      </div>
      <hr class="border-b" />
    </template>
  </n-dynamic-input>
</template>
<style lang="css" scoped>
:deep(.n-dynamic-input-item__action) {
  margin: 4px 0 0 20px !important;
}
:deep(.n-upload .n-upload-trigger > .n-button) {
  border-radius: 7px;
}
</style>
