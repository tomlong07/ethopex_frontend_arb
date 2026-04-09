<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import BackPage from '@/components/common/BackPage.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import useTelegram from '@/store/details/useTelegram'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { SelectOption } from 'naive-ui'
import SkeletonDetailFull from '@/components/skeleton/skeletonDetailFull.vue'
import { ctr_bot_telegram } from '@/services/ctr_bot_telegram'
import { ctr_topic_telegram } from '@/services/ctr_topic_telegram'

const store = useTelegram()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)
const isAddMode = computed(() => id === 0)
const isLoading = ref(true)

const isSubmitBtnLoading = ref(false)
const name = `Telegram Topic`

const resetDataTopic = () => {
  store.dataTopic = {
    topic_id: null,
    name: '',
    chat_id: null,
  }
}
const chatOptions = ref<SelectOption[]>([])

onMounted(async () => {
  if (isAddMode.value) {
    resetDataTopic()
  } else {
    const result = await ctr_topic_telegram.GetTopicByID(id)
    if (result?.status) {
      store.dataTopic = result.data
    }
  }

  const chats = await ctr_bot_telegram.ListChat()

  if (chats?.status) {
    chatOptions.value = chats.data.map((b: any) => ({
      label: b.name,
      value: b.id,
    }))
  }

  isLoading.value = false
})

const submitForm = async () => {
  try {
    isSubmitBtnLoading.value = true
    if (!store.dataTopic.name.trim()) {
      window.message.error(`Submit failed: Name is required`)
      return
    }
    if (!store.dataTopic.chat_id) {
      window.message.error(`Submit failed: Chat ID is required`)
      return
    }

    if (isAddMode.value) {
      const result = await ctr_topic_telegram.AddTopic(store.dataTopic)
      if (result?.status) {
        window.message.success(`Add telegram topic successfully`)
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    } else {
      const result = await ctr_topic_telegram.UpdateTopic(store.dataTopic)
      if (result?.status) {
        window.message.success(`Update telegram topic successfully`)
      }
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <BackPage
        v-if="feSettings?.page_list"
        :url="feSettings?.page_list || ''"
        :name="name"
        class="mt-6"
      />
      <SkeletonDetailFull v-if="isLoading" />
      <div
        v-else
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card :title="name">
          <div class="flex my-4 items-center">
            <FloatingWrapper name="ID Telegram Topic" rounded>
              <n-input-number v-model:value="store.dataTopic.topic_id" />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center">
            <FloatingWrapper name="Name" rounded>
              <n-input v-model:value="store.dataTopic.name" />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center">
            <FloatingWrapper name="Chat ID" rounded>
              <n-select
                v-model:value="store.dataTopic.chat_id"
                :options="chatOptions"
                placeholder=""
                clearable
              />
            </FloatingWrapper>
          </div>
        </n-card>

        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
