<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import { ReportV2 } from '@/constants/report-v2'
import { CDN_IMAGE_MINIO_S3_IMAGE } from '@/constants/urls'

const generalStore = useGeneralStore()

const goHome = () => {
  try {
    helper.clearLocalStorageByPrefix(ReportV2.KEY_STORAGE_SAVE_REPORT)
  } catch {}

  window.location.href = generalStore.homePage
}
</script>

<template>
  <div
    class="flex flex-col cursor-pointer logo-wrapper text-neutral-500"
    @click="goHome"
    title="Go Home"
  >
    <div class="border-none">
      <n-image
        class="custom-img-logo"
        :src="`${CDN_IMAGE_MINIO_S3_IMAGE}/pub-power-black.png`"
        width="126"
        preview-disabled
      />
    </div>
  </div>
</template>
