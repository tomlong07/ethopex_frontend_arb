<script setup lang="ts">
import { UploadCustomRequestOptions, UploadFileInfo } from 'naive-ui'

import { SnapData } from '@/types/components/creative'
import { creativeTypeClass } from '@/types/components/creative-v2'

import Plus from '@/assets/icons/Plus.vue'

import CreativeSnapchatEditor from '@/components/creative3/CreativeSnapchatEditor.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { ctr_creative } from '@/services/ctr_creative'
import ImageEditorIcon from '@/assets/icons/ImageEditorIcon.vue'
import Minus from '@/assets/icons/Minus.vue'
import { FULL_URL_MEDIA, URL_UPLOAD } from '@/constants/urls'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  isShow: {
    type: Boolean,
    required: true,
  },
})

const editImage = ref<SnapData>()
const editor = ref<InstanceType<typeof CreativeSnapchatEditor>>()

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.isShow,
  async (newValue, oldValue) => {
    if (newValue === true) {
      props.cre.info_image = [
        { title: '', description: '', call_to_action: '', image: '' },
      ]
    } else {
      props.cre.info_image = undefined
    }
  }
)

const beforeUpload = async (data: {
  file: UploadFileInfo
  fileList: UploadFileInfo[]
}) => {
  const fileExtension = data.file.type?.toLowerCase()
  const isImage =
    fileExtension &&
    (fileExtension.startsWith('image/jpeg') ||
      fileExtension.startsWith('image/png') ||
      fileExtension.startsWith('image/bmp') ||
      fileExtension.startsWith('image/gif'))
  const fileSize = data.file.file?.size
  const isLt10M = fileSize && fileSize / 1024 / 1024 < 10

  if (!isImage) {
    window.message.error('Only JPG, JPEG, BMP, GIF, or PNG images are allowed')
    return false
  }

  if (isImage && !isLt10M) {
    window.message.error('The image must be smaller than 10 MB')
    return false
  }

  return true
}

const isUploading = ref<boolean>(false)

const createUploadHandler = (index: number) => {
  return async ({ file }: UploadCustomRequestOptions) => {
    isUploading.value = true

    const formData = new FormData()
    formData.append('file', file.file as File)

    const result = await ctr_creative.uploadImage(formData)

    try {
      if (props.cre.info_image) {
        props.cre.info_image[index].image = result?.data_object?.thumb[0]
        changeEditImage(props.cre.info_image[index])
      }
    } catch {}

    isUploading.value = false
  }
}

const addASnap = () => {
  props.cre.info_image?.push({ title: '', image: '' })
}

const removeThisSnap = (index: number) => {
  props.cre.info_image?.splice(index, 1)
}

const removeThisImage = (index: number) => {
  if (props.cre.info_image) {
    try {
      props.cre.info_image[index].image = ''
      props.cre.info_image[index].coordinates = undefined
    } catch {}
  }
}

const changeEditImage = (item: SnapData) => {
  editImage.value = item

  editor?.value?.changeShowModal(true)
}

onMounted(() => {
  if (!props.cre.info_image) {
    props.cre.info_image = [
      { title: '', description: '', call_to_action: '', image: '' },
    ]
  }
})

const isLoadingCTA = ref<boolean>(false)

const autoCTAFromTitle = async (title: string, index: number) => {
  if (!title) {
    return
  }

  isLoadingCTA.value = true

  const result = await ctr_creative.CallToActionByKeyword({
    keyword: title,
  })

  if (result?.status) {
    if (props.cre.info_image) {
      props.cre.info_image[index].call_to_action = result.data
    }
  }

  isLoadingCTA.value = false
}
</script>

<template>
  <div class="flex" v-if="props.isShow">
    <n-table :single-line="false">
      <thead>
        <tr>
          <th class="w-4">No</th>
          <th class="w-3/4">Info</th>
          <th class="w-1/4">Image</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in props.cre.info_image" :key="index">
          <td class="w-4 text-xs">
            {{ index + 1 }}
          </td>
          <td class="w-3/4">
            <div class="flex flex-col gap-4">
              <div class="flex items-center">
                <div class="font-bold w-1/5 text-xs">Title</div>
                <div class="w-4/5">
                  <n-input
                    :class="{ 'empty-value-inputs': !item.title }"
                    v-model:value="item.title"
                    placeholder="Title"
                  ></n-input>
                </div>
              </div>

              <div class="flex items-center">
                <div class="font-bold w-1/5 text-xs">Description</div>
                <div class="w-4/5">
                  <n-input
                    :class="{ 'empty-value-inputs': !item.description }"
                    v-model:value="item.description"
                    placeholder="Description"
                  ></n-input>
                </div>
              </div>

              <div class="flex items-center">
                <div class="font-bold w-1/5 text-xs">Call to action</div>

                <div class="flex w-4/5 gap-2">
                  <n-input
                    :class="{ 'empty-value-inputs': !item.call_to_action }"
                    v-model:value="item.call_to_action"
                    placeholder="Call to action"
                  ></n-input>

                  <n-button
                    :disabled="!item.title || isLoadingCTA"
                    color="#f43f5e"
                    type="default"
                    @click="autoCTAFromTitle(item.title || '', index)"
                    >Auto</n-button
                  >
                </div>
              </div>
            </div>
          </td>

          <td class="w-1/4 relative">
            <n-upload
              class="empty-value-inputs"
              v-if="!item.image"
              directory-dnd
              :action="FULL_URL_MEDIA"
              :show-file-list="false"
              :custom-request="createUploadHandler(index)"
              :disabled="isUploading"
              @before-upload="beforeUpload"
            >
              <n-upload-dragger>
                <n-text> Upload Image </n-text>
              </n-upload-dragger>
            </n-upload>

            <div v-if="item.image">
              <n-image
                class="max-h-28"
                :src="URL_UPLOAD + item.image"
                object-fit="contain"
              />
              <RemoveButton
                @onClick="() => removeThisImage(index)"
                class="remove-media-2"
              />
            </div>
          </td>
          <td>
            <n-button-group>
              <n-popover trigger="hover">
                <template #trigger>
                  <n-button
                    ghost
                    @click="changeEditImage(item)"
                    :disabled="!item.image"
                  >
                    <n-icon size="16"><ImageEditorIcon /></n-icon>
                  </n-button>
                </template>
                <span>Edit image to ratio 16x9</span>
              </n-popover>

              <n-button
                ghost
                class="dynamic-button"
                :disabled="props.cre.info_image?.length === 1"
                @click="removeThisSnap(index)"
              >
                <template #icon>
                  <n-icon size="12"><Minus /></n-icon>
                </template>
              </n-button>
              <n-button ghost class="dynamic-button" @click="addASnap">
                <template #icon>
                  <n-icon size="12"><Plus /></n-icon>
                </template>
              </n-button>
            </n-button-group>
          </td>
        </tr>
      </tbody>
    </n-table>

    <CreativeSnapchatEditor :editImage="editImage" :cre="cre" ref="editor" />
  </div>
</template>
