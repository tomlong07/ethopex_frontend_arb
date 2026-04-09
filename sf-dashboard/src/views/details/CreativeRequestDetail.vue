<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'
import useCreativeRequestStore from '@/store/details/useCreativeStore'
import NameCreativeRequest from '@/components/creative_request/NameCreativeRequest.vue'
import DescriptionCreativeReq from '@/components/creative_request/DescriptionCreativeReq.vue'
import LandingPageCreative from '@/components/creative_request/LandingPageCreative.vue'
import MediaCreator from '@/components/creative_request/MediaCreator.vue'
import SubmitMedia from '@/components/creative_request/SubmitMedia.vue'
import { ctr_creative_request } from '@/services/ctr_creative_request'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import { URL_UPLOAD } from '@/constants/urls'

const dataConfig = useCreativeRequestStore()

const isSubmitBtnDisabled = ref<boolean>(false)

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const validateFields = (data: any) => {
  const requiredFields = [
    { field: data.name, message: 'Name is required.' },
    { field: data.description, message: 'Description is required.' },
    { field: data.keyword_set_id, message: 'Keyword Set is required.' },
    { field: data.landing_page_id, message: 'Landing Page is required.' },
  ]
  for (const { field, message } of requiredFields) {
    if (!field) throw new Error(message)
  }
}

const submitForm = async () => {
  if (isSubmitBtnDisabled.value) return // Tránh double-submit
  isSubmitBtnDisabled.value = true // Khóa nút ngay lập tức

  try {
    if (dataConfig.isNotEdit) {
      throw new Error('Not Allow.')
    }
    // Clone dữ liệu từ creativeRequestModel
    let creativeRequestTemp = helper.clone(dataConfig.creativeRequestModel)
    // Kiểm tra các trường bắt buộc
    validateFields(creativeRequestTemp)
    // Trim dữ liệu trước khi gửi
    creativeRequestTemp.name = creativeRequestTemp.name.trim()
    // Gửi dữ liệu
    const result = dataConfig.modeData.isAddPage()
      ? await ctr_creative_request.Add(creativeRequestTemp)
      : await ctr_creative_request.Update(creativeRequestTemp)

    if (result.status === true) {
      window.message.success('Submit success!')
      setTimeout(() => {
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value?.page_list })
        }
      }, 1500)
    } else {
      throw new Error(result.message || 'Unknown error')
    }
  } catch (error) {
    // Hiển thị lỗi
    window.message.error((error as Error).message || 'Submit failed')
  } finally {
    // Đảm bảo nút được mở khóa
    dataConfig.isSubmitBtnLoading = false
  }
}
onMounted(async () => {
  dataConfig.prefetch()
  dataConfig.clearData()
  dataConfig.clearMedia()
  dataConfig.isLoading = true
  try {
    if (dataConfig.modeData.isEditPage()) {
      if (!isNaN(Number(dataConfig.modeData.id))) {
        const result = await ctr_creative_request.GetByID({
          id: Number(dataConfig.modeData.id), // hoặc Number(modeData.id) nếu phù hợp hơn
        })

        if (result.status === true) {
          dataConfig.creativeRequestModel = result.data

          dataConfig.permissionCreativeRequest.changePermission(
            result.data?.permission || ''
          )

          if (dataConfig.permissionCreativeRequest.isAcceptCreatorMedia()) {
            // Kiểm tra nếu `result.data` và `creator_medias` tồn tại
            if (result?.data?.creator_medias?.length) {
              const filteredMedia = result.data.creator_medias

              if (filteredMedia.length && filteredMedia[0].id != 0) {
                const updatedImages = filteredMedia[0].medias.map(
                  (media: any) => ({
                    image: media.media || '', // Gán giá trị `media` từ `medias`
                    thumb: media.thumb || '', // Gán giá trị `thumb` từ `medias`
                  })
                )

                // Cập nhật `creativeMeadiaModel.value` và `cre.value.images`
                dataConfig.creativeMeadiaModel = filteredMedia[0]
                dataConfig.cre.images = updatedImages

                // Gán `status.value.previewItem` với ảnh đầu tiên
                if (updatedImages.length) {
                  dataConfig.status.previewItem = updatedImages[0]
                }
              } else {
                console.warn('No matching user_id found in creator_medias')
              }
            } else {
              console.warn('creator_medias is empty or undefined')
            }
          } else if (dataConfig.isPermissionUpdate) {
            if (result?.data?.creator_medias?.length) {
              // Xử lý danh sách hình ảnh và video và giữ cấu trúc `creator_medias`
              const updatedMedia = await Promise.all(
                result.data.creator_medias.map(async (creatorMedia: any) => {
                  // Trả về đối tượng mới cho từng phần tử
                  return {
                    id: creatorMedia.id,
                    user_id: creatorMedia.user_id,
                    user_email: creatorMedia.user_email,
                    medias: creatorMedia.medias.map((media: any) => ({
                      type:
                        media.media && media.media.endsWith('.mp4')
                          ? 'video'
                          : 'image', // Xác định loại
                      media: media.media ? `${URL_UPLOAD}${media.media}` : '',
                      thumb: media.thumb ? `${URL_UPLOAD}${media.thumb}` : '',
                    })),
                  }
                })
              )

              // Gán danh sách đã xử lý vào `listCreativeMeadiaModel`
              dataConfig.listCreativeMeadiaModel = updatedMedia
              const mediaRequestId = (
                dataConfig.modeData.params as {
                  media_request?: string | number
                }
              ).media_request
              if (mediaRequestId) {
                await nextTick()
                const targetElement = document.getElementById(
                  `media_request_${String(mediaRequestId)}` // Sử dụng template literals
                )
                if (targetElement) {
                  // Cuộn đến phần tử
                  setTimeout(() => {
                    targetElement.scrollIntoView({
                      behavior: 'smooth',
                      block: 'center',
                      inline: 'nearest',
                    })
                  }, 200)
                  // Thêm hiệu ứng nháy sáng
                  targetElement.classList.add('highlight')
                  setTimeout(() => {
                    targetElement.classList.remove('highlight')
                    targetElement.classList.add('highlight-border') // Thêm viền
                  }, 2000)
                } else {
                  console.warn(`Element with id="${mediaRequestId}" not found.`)
                }
              }
            }
          }
        } else {
          window.message.error('Fetch data failed')

          if (feSettings.value?.page_list) {
            window.router.push({ path: feSettings.value?.page_list })
          }
        }
      } else {
        console.error('modeData.id invalid')
        window.message.error('Invalid ID')
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value?.page_list })
        }
      }
    }
  } catch (error) {
    console.error('Error during onMounted:', error)
    window.message.error('An unexpected error occurred')
  } finally {
    dataConfig.isLoading = false
  }
})
const name = 'Creative Request'
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <div v-if="!dataConfig.isLoading">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
          class="mt-6"
        />
      </div>

      <div v-if="dataConfig.isLoading">
        <Skeleton />
      </div>
      <div
        v-else
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card
          :title="
            dataConfig.modeData.isAddPage() ? `Add ${name}` : `Edit ${name}`
          "
          class="card-flex-gap-4"
        >
          <NameCreativeRequest />
          <DescriptionCreativeReq />
          <LandingPageCreative />
          <CreativeRequestKeywordSet />

          <div class="flex flex-row-reverse">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              :title="dataConfig.isNotEdit ? 'Only pending can edit.' : ''"
              :loading="dataConfig.isSubmitBtnLoading"
              v-if="!dataConfig.isCreatorMedia"
              :disabled="isSubmitBtnDisabled || dataConfig.isNotEdit"
              @click="submitForm"
            >
              Submit
            </n-button>
          </div>
        </n-card>
        <SubmitMedia :feSettings="feSettings" />

        <MediaCreator />
      </div>
    </div>
  </div>
</template>
<style>
.n-upload {
  width: unset;
}
.media-container img,
.media-container video {
  max-height: 240px; /* Chiều cao tối đa */
  width: auto; /* Chiều rộng tự động điều chỉnh theo chiều cao */
  border-radius: 8px; /* Tùy chọn: Thêm góc bo tròn */
}
.highlight {
  background-color: #e6f7ff; /* Xanh nhạt */
  transition: background-color 0.5s ease-in-out; /* Hiệu ứng chuyển mượt */
}
.highlight-border {
  border: 1px solid #409eff !important; /* Màu xanh NaiveUI */
  transition: border 0.3s ease-in-out; /* Hiệu ứng viền */
}
</style>
