<script setup lang="ts">
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const dataConfig = addsenseAcountStore()

const isAddPage = computed(() => !+(window.route?.params?.id || 0))

const name = 'Generation'
</script>

<template>
  <div class="flex items-center" v-if="isAddPage">
    <FloatingWrapper :name="name" rounded>
      <n-input
        v-model:value="dataConfig.adsenseAccountConfig.generation"
        placeholder="Generation"
        maxlength="100"
      />
    </FloatingWrapper>
  </div>
</template>
