<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import {
  UrlPageView,
  UrlSearch,
  UrlConversion,
  Macros,
  Submit,
} from '@/components/post_back_detail'

import SkeletonDetailCenter from '@/components/skeleton/SkeletonDetailCenter.vue'
import usePostBack from '@/store/details/usePostBack'

const postBackStore = usePostBack()

onMounted(() => {
  postBackStore.resetPayload()
  postBackStore.dataTest = null
  postBackStore.idPostBack = Number(window.route?.params?.id || 0)
  postBackStore.fetchPostBackDetail()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center items-start">
      <div class="grid gap-4 grid-cols-1 p-5 w-full max-w-4xl">
        <BackPage :url="'/postback'" name="Post Back" class="mt-3" />
        <div v-if="postBackStore.isFetchPostBackDetailLoading">
          <SkeletonDetailCenter />
        </div>
        <n-card
          v-else
          class="rounded-[5px] !border-gray2"
          :title="postBackStore.titleCard"
        >
          <div class="flex flex-col gap-4">
            <UrlPageView />
            <UrlSearch />
            <UrlConversion />
            <Macros />
            <Submit />
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
