<template>
  <n-card class="card-flex-gap-4" v-if="dataConfig.isPermissionUpdate">
    <div class="max-w-[1200px] mx-auto w-full">
      <div class="flex justify-center mt-6">
        <div class="w-2/3 card-flex-gap-4">
          <!-- Lặp qua danh sách listCreativeMeadiaModel -->
          <div
            v-for="(item, index) in dataConfig.listCreativeMeadiaModel"
            :key="index"
          >
            <n-card class="card-flex-gap-4" :id="'media_request_' + item.id">
              <!-- Header của card -->
              <div class="flex items-center gap-4">
                <div class="font-medium text-lg">Media of Creator</div>
                <n-tag type="default" round> {{ item.user_email }} </n-tag>
                <n-button
                  size="medium"
                  type="success"
                  @click="createCreative(item)"
                >
                  Create creative
                </n-button>
              </div>
              <!-- Nội dung hình ảnh và video -->
              <n-image-group>
                <n-space class="media-container">
                  <!-- Lặp qua danh sách medias -->
                  <div
                    v-for="(media, mediaIndex) in item.medias"
                    :key="mediaIndex"
                    class="media-item"
                  >
                    <!-- Nếu là hình ảnh -->
                    <n-image
                      v-if="media.type === 'image'"
                      :width="100"
                      :src="media.media"
                    />
                    <!-- Nếu là video -->
                    <video
                      v-else-if="media.type === 'video'"
                      class="rounded-md max-h-300px w-auto"
                      controls
                      preload="none"
                      :poster="media.thumb"
                    >
                      <source :src="media.media" type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  </div>
                </n-space>
              </n-image-group>
            </n-card>
          </div>
        </div>
      </div>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import useCreativeRequestStore from '@/store/details/useCreativeStore'
const dataConfig = useCreativeRequestStore()
function createCreative(item: any) {
  // Điều hướng
  window.open(
    window.router.resolve({
      path: '/creative/add',
      query: {
        request_id: dataConfig.creativeRequestModel.id,
        creative_media: item.id,
      },
    }).href,
    '_blank'
  )
}
</script>
