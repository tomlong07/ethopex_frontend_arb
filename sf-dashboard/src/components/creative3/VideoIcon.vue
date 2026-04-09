<script setup lang="ts">
import PlayCircleFill from '@/assets/icons/PlayCircleFill.vue'
</script>

<template>
  <n-icon
    :component="PlayCircleFill"
    class="video-media-icon"
    color="gray"
    size="24"
  />
</template>

<style scoped lang="scss">
.video-media-icon {
  position: absolute;
  top: 25px;
  left: calc(50% - 12px);
  background-color: white;
  border-radius: 100%;
}
</style>
