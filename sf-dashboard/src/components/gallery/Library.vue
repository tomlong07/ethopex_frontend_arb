<script setup lang="ts">
import {
  MediaGalleryInfo,
  MediaLibraryClass,
  ModalGalleryInfo,
  StatusMediaLibraryClass,
} from '@/types/components/gallery'
import CheckMarkGreen from '@/assets/icons/CheckMarkGreen.vue'
import { ctr_gallery } from '@/services/ctr_gallery'

const RemoveButton = defineAsyncComponent(
  () => import('@/components/creative3/RemoveButton.vue')
)
const props = defineProps({
  dataMedia: {
    type: Object as () => MediaLibraryClass,
    required: true,
  },
  statusMedia: {
    type: Object as () => StatusMediaLibraryClass,
    required: true,
  },

  modalInfo: {
    type: Object as () => ModalGalleryInfo,
    required: false,
    default: () => {
      return new ModalGalleryInfo()
    },
  },
})

const showPreview = ref<boolean>(false)
const isSubmitting = ref<boolean>(false)
const editIndex = ref<number>(0)
const imgInfo = ref<MediaGalleryInfo>({})
const backupImgInfo = ref<MediaGalleryInfo>({})

const handleClickImage = (item: MediaGalleryInfo, index: number) => {
  imgInfo.value = item
  backupImgInfo.value = helper.clone(item)
  editIndex.value = index
  showPreview.value = true
}

const handleClickSelect = (item: MediaGalleryInfo, index: number) => {
  if (!item.path) return

  if (!props.modalInfo.isModal) {
    handleClickImage(item, index)
  }

  if (isSelected(item)) {
    const i = props.modalInfo.selectedMedia.indexOf(item.path)
    if (i > -1) {
      props.modalInfo.selectedMedia.splice(i, 1)
    }
  } else {
    if (props.modalInfo.singleSelection) {
      props.modalInfo.selectedMedia = []
    }
    props.modalInfo.selectedMedia.push(item.path)
  }
}

const src = (path: string | undefined) => {
  return helper.src(path)
}

const onRemoveImage = (i: number) => {
  const ok = confirm('Are your sure delete this image?')
  if (!ok) return
  if (!props.dataMedia.isHasDeletePermission()) return

  props.dataMedia.removeMedia(i)
}

const submit = async () => {
  if (!props.dataMedia.isHasUpdatePermission()) return
  isSubmitting.value = true
  const result = await ctr_gallery.Edit(imgInfo.value)
  if (result?.status) {
    props.dataMedia.media[editIndex.value] = imgInfo.value
    window.message.success('Success')
    showPreview.value = false
  }
  isSubmitting.value = false
}

const isSelected = (item: MediaGalleryInfo): boolean => {
  if (!props.modalInfo.isModal || !item.path) return false

  return props.modalInfo.selectedMedia.includes(item.path)
}
const itemHovered = ref<MediaGalleryInfo>({})

const changeItemHovered = (item: MediaGalleryInfo) => {
  itemHovered.value = item
}
const isHovered = (item: MediaGalleryInfo) => {
  return item.path === itemHovered.value.path
}

const backupData = () => {
  //Backup lại data để hiển thị lại cho đúng nếu có sửa và ko submit
  for (const key in backupImgInfo.value) {
    if (Object.prototype.hasOwnProperty.call(backupImgInfo.value, key)) {
      imgInfo.value[key as keyof MediaGalleryInfo] = backupImgInfo.value[
        key as keyof MediaGalleryInfo
      ] as any
    }
  }
}

const handleClose = () => {
  backupData()
  showPreview.value = false
}

const isDebug = computed(() => {
  return helper.isDebug()
})

const hasLoadMore = computed(() => {
  return props.dataMedia.media.length < props.dataMedia.totalMedia
})

const loadMoreMedia = () => {
  props.dataMedia.fetchMedia()
}
</script>
<template>
  <div>
    <div class="flex justify-center min-h-[200px]">
      <n-spin :show="props.dataMedia.isProcessing">
        <div v-if="props.dataMedia.media?.length == 0">
          {{ props.dataMedia.isProcessing ? 'Loading...' : 'No Media' }}
        </div>
        <div v-else class="flex flex-wrap gap-4">
          <div
            v-for="(item, index) in props.dataMedia.media"
            :key="index"
            class="flex h-96 w-80 justify-center items-center cursor-pointer"
          >
            <div
              class="h-80 w-72 flex flex-col justify-center relative border-2"
              :class="isSelected(item) ? 'border-blue-500' : 'border-gray-300'"
            >
              <n-image
                :title="item.name"
                :src="src(item.path)"
                class="h-72 w-72 flex items-center shadow-md"
                object-fit="contain"
                preview-disabled
                @click="handleClickSelect(item, index)"
              />
              <div
                v-if="isSelected(item)"
                class="absolute top-1 left-1 flex justify-center"
              >
                <CheckMarkGreen />
              </div>
              <RemoveButton
                @onClick="() => onRemoveImage(index)"
                v-if="props.dataMedia.isHasDeletePermission()"
              />

              <div
                class="h-16 justify-center flex items-center"
                :class="{ 'bg-sky-600 text-white': isHovered(item) }"
                @click="handleClickImage(item, index)"
                @mouseenter="changeItemHovered(item)"
                @mouseleave="changeItemHovered({})"
              >
                <div
                  class="mx-1 text-xs overflow-hidden text-ellipsis line-clamp-2"
                  :title="item.name"
                >
                  {{ isHovered(item) ? 'Info' : item.name }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </n-spin>

      <n-modal
        v-model:show="showPreview"
        :mask-closable="false"
        :close-on-esc="false"
        @mask-click="handleClose"
        @esc="handleClose"
      >
        <n-card
          style="width: 800px; height: 850px"
          title="Preview"
          size="huge"
          role="dialog"
          aria-modal="true"
        >
          <div class="flex flex-col gap-4">
            <div class="flex justify-center w-full">
              <img :src="src(imgInfo.path)" class="h-[500px] w-[500px]" />
            </div>
            <div class="flex items-center">
              <div class="w-1/6 font-bold">Name</div>
              <div class="w-5/6 flex gap-2">
                <n-input maxlength="500" v-model:value="imgInfo.name" />
              </div>
            </div>
            <div class="flex items-center">
              <div class="w-1/6 font-bold">Source</div>
              <div class="w-5/6 flex gap-2">
                <n-input
                  maxlength="500"
                  placeholder="Source"
                  v-model:value="imgInfo.source"
                />
              </div>
            </div>

            <div class="flex items-center">
              <div class="w-1/6 font-bold">Tags</div>
              <div class="w-5/6 flex gap-2">
                <n-dynamic-tags
                  v-model:value="imgInfo.tags"
                  :max="20"
                  type="primary"
                />
              </div>
            </div>

            <div class="flex items-center" v-if="isDebug">
              <div class="w-1/6 font-bold">Path</div>
              <div class="w-5/6 flex gap-2">
                <n-input :value="imgInfo.path" disabled />
              </div>
            </div>
          </div>
          <template #footer v-if="props.dataMedia.isHasUpdatePermission()">
            <div class="flex justify-end">
              <n-button
                class="button-apply"
                color="#f43f5e"
                :loading="isSubmitting"
                @click="submit()"
              >
                Submit
              </n-button>
            </div>
          </template>
        </n-card>
      </n-modal>
    </div>
    <div class="flex justify-center" v-if="hasLoadMore">
      <n-button @click="loadMoreMedia">Load More</n-button>
    </div>
  </div>
</template>
