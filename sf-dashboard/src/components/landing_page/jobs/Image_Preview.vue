<script setup lang="ts">
import { CDN_IMAGE_MINIO_S3 } from '@/constants/urls'
</script>
<template>
  <div class="flex justify-center w-full image_preview size-36">
    <img
      :src="`${CDN_IMAGE_MINIO_S3}/arb/images/image_preview.jpg`"
      alt=""
      class="object-cover rounded-sm"
    />
  </div>
</template>
