<script setup lang="ts">
import promptLogs from '@/store/promptLogs'
import PromptLogDetail from './PromptLogDetail.vue'

const promptLogStore = promptLogs()

const promptLogDetail = ref<InstanceType<typeof PromptLogDetail>>()

//Mỗi lần click từ table vào sẽ load lại dữ liệu mới theo row đó
watch(
  () => promptLogStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      getThisPromptLog()
    }
  }
)

//Get lại cho luôn mới + có thể sử dụng làm nhiệm vụ khác
const getThisPromptLog = async () => {
  if (!promptLogStore.dataLog?.id) return
  promptLogStore.isLoading = true

  const result = await promptLogStore.getPromptLogByCreativeContent({
    id: promptLogStore.dataLog?.id,
  })

  if (!result.id) window.message.error('Cannot load prompt log detail')

  //Gán vào để khởi tạo class mới có thể sử dụng method
  promptLogStore.setDataLog(result)

  promptLogDetail.value?.changeDataLog(promptLogStore.dataLog)

  promptLogStore.isLoading = false
}

const changeLoading = (value: boolean) => {
  promptLogStore.isLoading = value
}

const changeShowModal = (value: boolean) => {
  promptLogStore.showModal = value
}

//Xóa bỏ row đó khỏi table bên ngoài khi đã duyệt xong
const callbackDeleteRow = () => {
  promptLogStore.callbackDeleteRow?.()
}

//Update row đó ở table khi retry test xong
const callbackUpdateRow = (data: any) => {
  promptLogStore.callbackUpdateRow?.(data)
}

const onChangeTab = (tab: string) => {
  if (tab === 'detail') {
    getThisPromptLog()
  }
}

const campaigns = computed(() => {
  return promptLogStore.dataLog?.campaigns || []
})
</script>

<template>
  <n-modal
    v-model:show="promptLogStore.showModal"
    preset="dialog"
    :style="{
      width: '90vw',
      maxWidth: '1440px',
      height: '90vh',
      maxHeight: '1440px',
    }"
    :show-icon="false"
  >
    <template #header>
      <div class="flex gap-4 items-center">
        Change Prompt Log Detail
        <span class="text-xxs text-gray-500 italic">{{
          promptLogStore.dataLog?.id
        }}</span>
      </div>
    </template>

    <!-- Tabs -->
    <n-tabs type="line" animated @update:value="onChangeTab">
      <n-tab-pane name="detail" tab="Prompt Log">
        <PromptLogDetail
          ref="promptLogDetail"
          isModal
          :isLoading="promptLogStore.isLoading"
          @changeLoading="changeLoading"
          @changeShowModal="changeShowModal"
          @callbackDeleteRow="callbackDeleteRow"
          @callbackUpdateRow="callbackUpdateRow"
        />
      </n-tab-pane>

      <n-tab-pane name="list" tab="List Campaign">
        <div
          class="p-3 max-h-[calc(90vh-200px)] overflow-auto scroll-thin-custom"
        >
          <div v-if="campaigns.length">
            <div class="mb-4 pb-3 border-b border-gray-200">
              <p class="text-sm text-gray-500">
                Total: {{ campaigns.length }} campaigns
              </p>
            </div>

            <div class="space-y-2">
              <div
                v-for="item in campaigns"
                :key="item.campaign_id"
                class="group flex flex-col gap-2 p-4 rounded-lg border border-gray-200 hover:border-blue-400 hover:bg-blue-50 transition-all duration-200 cursor-pointer"
              >
                <a
                  :href="`/campaign/${item.traffic_source}/${
                    item.campaign_id
                  }?ads=${item.ad_ids?.join(',')}&content=${
                    promptLogStore.dataLog?.creative_content
                  }`"
                  target="_blank"
                >
                  <div class="flex items-start gap-3">
                    <div class="flex-1 min-w-0">
                      <p
                        class="font-medium text-gray-800 group-hover:text-blue-600 transition-colors"
                      >
                        {{ item.campaign_name }}
                      </p>
                    </div>
                  </div>

                  <div class="flex flex-wrap gap-3 text-sm">
                    <div class="flex items-center gap-1">
                      <span class="text-gray-500">Source:</span>
                      <n-tag size="small" type="info">{{
                        item.traffic_source
                      }}</n-tag>
                    </div>

                    <div
                      class="flex items-center gap-1"
                      v-if="item.ad_ids?.length"
                    >
                      <span class="text-gray-500">Ad IDs:</span>
                      <n-tag
                        size="small"
                        v-for="adId in item.ad_ids"
                        :key="adId"
                      >
                        {{ adId }}
                      </n-tag>
                    </div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          <div v-else class="flex flex-col items-center justify-center py-16">
            <h3 class="text-lg font-medium text-gray-700 mb-2">
              No campaigns found
            </h3>
          </div>
        </div>
      </n-tab-pane>
    </n-tabs>
  </n-modal>
</template>
