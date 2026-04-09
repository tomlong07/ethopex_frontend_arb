<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = addsenseAcountStore()

const isEditPage = computed<boolean>(() => !!+(window.route?.params?.id ?? 0))

const name = 'Channels'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="dataConfig.adsenseAccountConfig.channels"
      :disabled="isEditPage"
      placeholder="Enter channels line by line, or paste in a list."
      type="textarea"
      :autosize="{
        minRows: 5,
        maxRows: 10,
      }"
    />
  </FloatingWrapper>
</template>
