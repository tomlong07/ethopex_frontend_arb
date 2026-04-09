<script setup lang="ts">
import { onMounted, ref, computed } from 'vue'
import BackPage from '@/components/common/BackPage.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import { ctr_bot_telegram } from '../../services/ctr_bot_telegram'
import useTelegram from '@/store/details/useTelegram'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import SkeletonDetailFull from '@/components/skeleton/skeletonDetailFull.vue'

const store = useTelegram()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)
const isAddMode = computed(() => id === 0)
const isEditMode = computed(() => !isAddMode.value)
const isLoading = ref(true)

const isSubmitBtnLoading = ref(false)
const name = `Telegram bot`

const resetDataBot = () => {
  store.dataBot = {
    id: 0,
    name: '',
    token: '',
    status: 'active',
  }
}

const statusSwitch = computed({
  get: () => (store.dataBot.status === 'active' ? 'on' : 'off'),
  set: (val: string) => {
    store.dataBot.status = val === 'on' ? 'active' : 'in_active'
  },
})

const submitForm = async () => {
  try {
    isSubmitBtnLoading.value = true
    if (!store.dataBot.name.trim()) {
      window.message.error(`Submit failed: Name is required`)
      return
    }
    if (!store.dataBot.token.trim()) {
      window.message.error(`Submit failed: Token is required`)
      return
    }

    if (isAddMode.value) {
      const result = await ctr_bot_telegram.AddBot(store.dataBot)
      if (result?.status) {
        window.message.success(`Add telegram bot successfully`)
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      }
    } else {
      const result = await ctr_bot_telegram.UpdateBot(store.dataBot)
      if (result?.status) {
        window.message.success(`Update telegram bot successfully`)
      }
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}

onMounted(async () => {
  if (isEditMode.value) {
    const result = await ctr_bot_telegram.GetBotByID(id)
    if (result?.status && result.data) {
      store.dataBot = { ...result.data }
    }
  } else {
    resetDataBot()
  }

  isLoading.value = false
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
            <FloatingWrapper name="Name" rounded>
              <n-input v-model:value="store.dataBot.name" />
            </FloatingWrapper>
          </div>
          <div class="flex my-4 items-center">
            <FloatingWrapper name="Token" rounded>
              <n-input v-model:value="store.dataBot.token" />
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
