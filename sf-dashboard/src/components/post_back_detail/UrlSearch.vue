<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import usePostBack from '@/store/details/usePostBack'
import PostbackTestResult from './PostbackTestResult.vue';

const postBackStore = usePostBack()
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper name="Url Search">
      <n-input
        v-model:value="postBackStore.payload.url_search"
        placeholder=""
      />
    </FloatingWrapper>

    <n-button
      type="success"
      @click="postBackStore.handleTest('Search')"
      :loading="postBackStore.isTestUrlSearchLoading"
    >
      Test
    </n-button>
  </div>

  <PostbackTestResult v-if="postBackStore.dataTest?.event == 'Search'" />
</template>
