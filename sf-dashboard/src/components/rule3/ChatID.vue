<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import useRuleStoreV3 from '@/store/details/ruleV3'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_chat_telegram } from '@/services/ctr_chat_telegram'
import ChatManagementModal from '../telegram_bot/ChatManagementModal.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Chat ID'

const showChatModal = ref(false)
const openChatModal = () => {
  showChatModal.value = true
}

watch(
  () => ruleStoreV3.ruleV3.is_notify_telegram,
  (newValue) => {
    if (newValue == ONOFF.ON) {
      ruleStoreV3.getListChat()
    } else {
      ruleStoreV3.ruleV3.chat_id = null
    }
  }
)

const loadingChat = ref(false)
const listChat = ref<{ id: number; name: string }[]>([])

const loadChat = async (botId: number | null | undefined) => {
  if (!botId) {
    listChat.value = []
    return
  }

  try {
    loadingChat.value = true
    const result = await ctr_chat_telegram.ListChat(botId)
    listChat.value = result.data || []
  } catch {
    window.message.error('Failed to load chat!')
  } finally {
    loadingChat.value = false
  }
}

watch(
  () => ruleStoreV3.ruleV3.bot_id,
  (botId) => {
    ruleStoreV3.ruleV3.chat_id = null
    loadChat(botId)
  }
)

onMounted(() => {
  if (ruleStoreV3.ruleV3.isOnTelegram()) {
    loadChat(ruleStoreV3.ruleV3.bot_id)
  }
})
</script>

<template>
  <div class="flex gap-2 items-center" v-if="ruleStoreV3.ruleV3.isOnTelegram()">
    <FloatingWrapper :name="name">
      <n-select
        v-model:value="ruleStoreV3.ruleV3.chat_id"
        clearable
        value-field="id"
        label-field="name"
        :placeholder="''"
        :loading="loadingChat"
        :options="listChat"
      >
      </n-select>
    </FloatingWrapper>

    <n-button size="small" @click="openChatModal">Manage</n-button>
  </div>

  <ChatManagementModal v-model:show="showChatModal" />
</template>
