<template>
  <div class="flex justify-center" v-if="dataConfig.isCreatorMedia">
    <div class="flex items-center w-full">
      <Skeleton v-if="dataConfig.isLoading" />

      <n-card class="card-flex-gap-4">
        <template #header>
          <div class="flex flex-row items-center gap-2">
            Media
            <n-popover trigger="hover">
              <template #trigger>
                <n-icon :component="QuestionCircleRegular" size="14"></n-icon>
              </template>
              <span>{{ textMedia }}</span>
            </n-popover>
          </div>
        </template>

        <!-- Các thành phần -->
        <UploadMedia :cre="dataConfig.cre" :status="dataConfig.status" />
        <Media
          :cre="dataConfig.cre"
          :status="dataConfig.status"
          :stateManager="dataConfig.stateManager"
        />
        <Preview
          :cre="dataConfig.cre"
          :status="dataConfig.status"
          class="mt-2"
          :stateManager="dataConfig.stateManager"
        />

        <!-- Nút Submit -->
        <div
          class="flex flex-row-reverse sticky bottom-0 p-2 gap-2"
          style="
            backdrop-filter: blur(10px);
            background: rgba(255, 255, 255, 0.8);
            z-index: 10;
          "
        >
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="dataConfig.isSubmitBtnLoading"
            v-if="dataConfig.isCreatorMedia"
            :disabled="
              isSubmitBtnMediaDisabled ||
              !dataConfig.permissionCreativeRequest.isAcceptCreatorMedia()
            "
            @click="submitMedia"
          >
            Submit
          </n-button>
        </div>
      </n-card>
    </div>
  </div>
</template>
<script setup lang="ts">
import Preview from '@/components/creative3/Preview.vue'
import Media from '@/components/creative3/Media.vue'
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import useCreativeRequestStore from '@/store/details/useCreativeStore'
import { ctr_creative_request } from '@/services/ctr_creative_request'
import UploadMedia from '../creative3/UploadMedia.vue'
import { FeSettings } from '@/class/fe_settings'
import { LIMIT_VIDEO } from '@/constants/limits'

import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  feSettings: {
    type: Object as () => FeSettings,
    required: false,
    default: () => ({}),
  },
})

const dataConfig = useCreativeRequestStore()

// Phần sử lý cho creator media
const isSubmitBtnMediaDisabled = ref(true) // Trạng thái nút Submit
const textMedia = computed(() => {
  return arb?.formatString(Creative.value.media_general, LIMIT_VIDEO + 'MB')
})
// Hàm lấy creative media
function getCreativeMedia() {
  if (!Array.isArray(dataConfig.cre.images)) {
    console.warn('Images is not an array:', dataConfig.cre.images)
    return []
  }

  return dataConfig.cre.images.map((image) => {
    const isMatchingImage = dataConfig.status.previewItem?.image === image.image // Kiểm tra khớp
    return {
      media: image.image || '',
      thumb: isMatchingImage ? dataConfig.status.previewItem?.thumb || '' : '', // Gán `thumb` nếu khớp
      type: image.image.endsWith('.mp4') ? 'video' : 'image',
    }
  })
}

// Hàm kiểm tra trạng thái nút Submit
function updateSubmitButtonState() {
  isSubmitBtnMediaDisabled.value = !(
    Array.isArray(dataConfig.cre.images) && // Phải là mảng
    dataConfig.cre.images.some((image) => image.image) && // Có ít nhất một `image`
    dataConfig.status.isUploading === false &&
    dataConfig.status.isUploadingThumbnail === false
  ) // Đang không upload
}

// Theo dõi `cre` để cập nhật trạng thái nút Submit
watch(
  [() => dataConfig.cre, () => dataConfig.status],
  () => {
    updateSubmitButtonState()
  },
  { deep: true }
)

// Hàm gửi media
const submitMedia = async () => {
  if (isSubmitBtnMediaDisabled.value) return // Tránh double-submit
  if (!dataConfig.permissionCreativeRequest.isAcceptCreatorMedia()) return

  isSubmitBtnMediaDisabled.value = true // Khóa nút

  try {
    dataConfig.creativeMeadiaModel.medias = getCreativeMedia()

    if (dataConfig.creativeRequestModel.id) {
      dataConfig.creativeMeadiaModel.request_id =
        dataConfig.creativeRequestModel.id
    } else {
      throw new Error('Request ID is required.')
    }
    // Clone dữ liệu và kiểm tra các trường bắt buộc
    const creativeMediaTemp = helper.clone(dataConfig.creativeMeadiaModel)
    if (!creativeMediaTemp.medias.length) {
      throw new Error('Media is required.')
    }

    // Gửi dữ liệu
    const result = await ctr_creative_request.UpdateMedia(creativeMediaTemp)
    if (result.status) {
      window.message.success('Submit success!')
      if (props.feSettings.page_list) {
        window.router.push({ path: props.feSettings.page_list })
      }
    } else {
      throw new Error(result.message || 'Unknown error')
    }
  } catch (error) {
    console.error(error)
  } finally {
    isSubmitBtnMediaDisabled.value = false // Mở khóa nút
  }
}
</script>
