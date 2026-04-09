<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import BackPage from '@/components/common/BackPage.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import useTelegram from '@/store/details/useTelegram'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { SelectOption } from 'naive-ui'
import { ctr_chat_telegram } from '@/services/ctr_chat_telegram'
import SkeletonDetailFull from '@/components/skeleton/skeletonDetailFull.vue'
import { ctr_bot_telegram } from '@/services/ctr_bot_telegram'
import CustomSwitch from '@/components/common/CustomSwitch.vue'

const store = useTelegram()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)
const isAddMode = computed(() => id === 0)
const isLoading = ref(true)

const isSubmitBtnLoading = ref(false)
const name = `Telegram chat`

const resetDataChat = () => {
  store.dataChat = {
    chat_id_telegram: null,
    name: '',
    bot_id: null,
    status: 'active',
  }
}
const botOptions = ref<SelectOption[]>([])

onMounted(async () => {
  if (isAddMode.value) {
    resetDataChat()
  } else {
    const result = await ctr_chat_telegram.GetChatByID(id)
    if (result?.status) {
      store.dataChat = result.data
    }
  }

  const bots = await ctr_bot_telegram.ListBot()
  if (bots?.status) {
    botOptions.value = bots.data.map((b: any) => ({
      label: b.name,
      value: b.id,
    }))
  }

  isLoading.value = false
})

const submitForm = async () => {
  try {
    isSubmitBtnLoading.value = true
    if (!store.dataChat.name.trim()) {
      window.message.error(`Submit failed: Name is required`)
      return
    }
    if (!store.dataChat.bot_id) {
      window.message.error(`Submit failed: Bot ID is required`)
      return
    }

    if (isAddMode.value) {
      const result = await ctr_chat_telegram.AddChat(store.dataChat)
      if (result?.status) {
        window.message.success(`Add telegram chat successfully`)
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    } else {
      const result = await ctr_chat_telegram.UpdateChat(store.dataChat)
      if (result?.status) {
        window.message.success(`Update telegram chat successfully`)
      }
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}

const statusSwitch = computed({
  get: () => (store.dataChat.status === 'active' ? 'on' : 'off'),
  set: (val: string) => {
    store.dataChat.status = val === 'on' ? 'active' : 'in_active'
  },
})
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
            <FloatingWrapper name="ID Telegram Chat" rounded>
              <n-input-number v-model:value="store.dataChat.chat_id_telegram" />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center">
            <FloatingWrapper name="Name" rounded>
              <n-input v-model:value="store.dataChat.name" />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center">
            <FloatingWrapper name="Bot ID" rounded>
              <n-select
                v-model:value="store.dataChat.bot_id"
                :options="botOptions"
                placeholder=""
                clearable
              />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center gap-5">
            <div class="font-bold text-xs">Status</div>
            <div>
              <CustomSwitch
                v-model="statusSwitch"
                type="onoff"
                size="small"
                true-label="Active"
                false-label="Inactive"
              />
            </div>
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
