<script lang="ts" setup>
import { ref, watch, onMounted } from 'vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { ctr_chat_telegram } from '@/services/ctr_chat_telegram'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_topic_telegram } from '@/services/ctr_topic_telegram'

const ruleStoreV3 = useRuleStoreV3()
const name = 'Topic ID'

const loadingTopic = ref(false)
const listTopic = ref<{ id: number; name: string }[]>([])

const loadTopics = async (chatId: number | null | undefined) => {
  if (!chatId) {
    listTopic.value = []
    return
  }

  try {
    loadingTopic.value = true
    const result = await ctr_chat_telegram.ListTopic(chatId)
    listTopic.value = result.data || []
  } catch {
    window.message.error('Failed to load topics!')
  } finally {
    loadingTopic.value = false
  }
}

watch(
  () => ruleStoreV3.ruleV3.chat_id,
  (chatId) => {
    ruleStoreV3.ruleV3.topic_id = null
    loadTopics(chatId)
  }
)

onMounted(() => {
  if (ruleStoreV3.ruleV3.chat_id) {
    loadTopics(ruleStoreV3.ruleV3.chat_id)
  }
})

const handleTest = async () => {
  try {
    const payload = {
      topic_id: ruleStoreV3.ruleV3.topic_id || 0,
      chat_id: ruleStoreV3.ruleV3.chat_id,
      bot_id: ruleStoreV3.ruleV3.bot_id,
      message: 'Test message',
    }

    const result = await ctr_topic_telegram.TestSend(payload)

    if (result?.status) {
      window.message.success('Sent successfully!')
    } else {
      window.message.error('Send failed!')
    }
  } catch {
    window.message.error('Send failed!')
  }
}
</script>

<template>
  <div class="flex gap-2 items-center" v-if="ruleStoreV3.ruleV3.isOnTelegram()">
    <FloatingWrapper :name="name">
      <n-select
        v-model:value="ruleStoreV3.ruleV3.topic_id"
        clearable
        value-field="id"
        label-field="name"
        placeholder=""
        :loading="loadingTopic"
        :options="listTopic"
      />
    </FloatingWrapper>
    <n-button
      size="small"
      type="warning"
      :disabled="!ruleStoreV3.ruleV3.chat_id"
      @click="handleTest"
      class="w-16"
    >
      Test
    </n-button>
  </div>
</template>
