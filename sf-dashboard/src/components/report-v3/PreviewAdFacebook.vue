<script setup lang="ts">
import Landing from '@/assets/icons/Landing.vue'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import EyeOutline from '@/assets/icons/EyeOutline.vue'
import { useReportV2 } from '@/store/report/report-v2'
import useReportV2ModalFacebook from '@/store/report/report-v2-modal-facebook'
import Copy from '@/assets/icons/Copy.vue'
import { TType } from '@/enum/naiveui'
const reportStoreV2 = useReportV2(helper.truePath())()
const previewFacebookInfo = useReportV2ModalFacebook()

const onNegativeClick = () => {
  previewFacebookInfo.showModal = false
}

const classNow = (value: string) => {
  return (helper.classRender(value) as TType) || null
}

const openLinkPreview = (type: any, landingAd?: string) => {
  switch (type) {
    case 'edit':
      window.open(`/campaign/facebook/${previewFacebookInfo.id}`, '_blank')
      break
    case 'landingpage':
      window.open(landingAd ?? previewFacebookInfo.url, '_blank')
      break
  }
}

const changeAdId = async (idpreview: any) => {
  isLoading.value = true
  previewFacebookInfo.adId = String(idpreview)
  previewFacebookInfo.handleClick()

  await helper.sleep(200)
  isLoading.value = false
}

const copyPostID = (item: any) => {
  const postID = item?.creative?.effective_object_story_id || ''

  if (!postID) {
    window.message.error('No Post ID')
    return
  }

  const [part1, part2] = postID.split('_')

  if (!part1 || !part2) {
    window.message.error('Invalid Post ID format')
    return
  }

  const post = `https://www.facebook.com/${part1}/posts/${part2}/`

  helper.copyText(post)
  window.message.success('Copied!')
}

const isLoading = ref(false)
</script>

<template>
  <div>
    <n-modal
      v-model:show="previewFacebookInfo.showModal"
      preset="dialog"
      :show-icon="false"
      style="width: 70vw"
      @negative-click="onNegativeClick"
    >
      <template #header>
        <div class="flex-row">
          <div>Preview Ads</div>
        </div>
      </template>
      <div style="margin-top: 30px">
        <div class="flex" style="border: 1px solid #e5e4e7; padding: 15px">
          <div
            class="mr-4"
            :style="{
              width: reportStoreV2.permission?.preview_ad ? '50%' : '100%',
            }"
            style="border-right: 1px solid #e5e4e7; padding: 10px"
          >
            <div class="pb-3.5 font-bold text-sm text-gray-500">List Ads</div>
            <n-scrollbar style="max-height: 700px" class="flex gap-4">
              <div
                v-for="(k, index) in previewFacebookInfo.listAds"
                :key="index"
                class="flex flex-col"
              >
                <n-divider v-if="index !== 0" />

                <div
                  class="text-camp-custom-q flex flex-col"
                  :class="
                    k.id === previewFacebookInfo.adId ? ' bg-blue-50' : ''
                  "
                >
                  <div class="flex gap-2">
                    <div
                      class="overflow-hidden text-ellipsis w-96 text-nowrap p-1.5"
                      :title="k.name"
                    >
                      {{ k.name }}
                    </div>
                    <div class="flex ml-auto gap-2">
                      <n-popover trigger="hover">
                        <template #trigger>
                          <n-button
                            @click="openLinkPreview('edit')"
                            type="info"
                            secondary
                          >
                            <n-icon :component="Settings20Regular" size="20" />
                          </n-button>
                        </template>
                        <span>Edit</span>
                      </n-popover>

                      <n-popover trigger="hover">
                        <template #trigger>
                          <n-button
                            @click="openLinkPreview('landingpage', k.url)"
                            type="info"
                            secondary
                          >
                            <n-icon :component="Landing" size="16" />
                          </n-button>
                        </template>
                        <span>Landing Page</span>
                      </n-popover>

                      <n-popover trigger="hover">
                        <template #trigger>
                          <n-button
                            @click="copyPostID(k)"
                            type="info"
                            secondary
                          >
                            <n-icon :component="Copy" size="16" />
                          </n-button>
                        </template>
                        <span>Copy Post ID</span>
                      </n-popover>

                      <n-popover
                        trigger="hover"
                        v-if="reportStoreV2.permission?.preview_ad"
                      >
                        <template #trigger>
                          <n-button
                            @click="changeAdId(k.id)"
                            type="info"
                            secondary
                          >
                            <n-icon :component="EyeOutline" size="18" />
                          </n-button>
                        </template>
                        <span>Preview</span>
                      </n-popover>
                    </div>
                  </div>

                  <n-table :single-line="false" size="small">
                    <thead>
                      <tr>
                        <th class="w-1/6"></th>
                        <th class="w-4/6">ID</th>
                        <th class="w-1/6">Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td class="w-1/6">Campaign</td>
                        <td :title="k.campaign?.id" class="w-4/6">
                          {{ k.campaign?.id }}
                        </td>

                        <td class="w-1/6">
                          <n-tag
                            size="small"
                            :type="classNow(k.campaign?.status || '')"
                          >
                            {{ k.campaign?.status }}</n-tag
                          >
                        </td>
                      </tr>
                      <tr>
                        <td class="w-1/6">Ad</td>
                        <td :title="k.id" class="w-4/6">{{ k.id }}</td>

                        <td class="w-1/6">
                          <n-tag
                            size="small"
                            :type="classNow(k?.status || '')"
                            >{{ k.status }}</n-tag
                          >
                        </td>
                      </tr>

                      <tr>
                        <td class="w-1/6">Adset</td>
                        <td :title="k.adset?.id" class="w-4/6">
                          {{ k.adset?.id }}
                        </td>
                        <td class="w-1/6">
                          <n-tag
                            size="small"
                            :type="classNow(k.adset?.status || '')"
                          >
                            {{ k.adset?.status }}</n-tag
                          >
                        </td>
                      </tr>
                    </tbody>
                  </n-table>
                </div>
              </div>
            </n-scrollbar>
          </div>
          <div
            style="
              width: 50%;
              /* min-height: 750px; */
              min-width: 540;
              padding: 10px;
            "
            v-if="reportStoreV2.permission?.preview_ad"
            class="overflow-auto"
          >
            <div class="pb-3.5 font-bold text-sm text-gray-500">Preview</div>
            <n-spin :show="isLoading">
              <div>
                <div id="previewBox">Select an ad to preview</div>
              </div>
            </n-spin>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>
