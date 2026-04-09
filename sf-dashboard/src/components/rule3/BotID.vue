<script lang="ts" setup>
import { ONOFF } from '@/enum/campaign'
import { ref, onMounted, watch } from 'vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'
import BotManagementModal from '../telegram_bot/BotManagementModal.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = 'Bot ID'

const showBotModal = ref(false)
const openBotModal = () => {
  showBotModal.value = true
}

watch(
  () => ruleStoreV3.ruleV3.is_notify_telegram,
  (newValue) => {
    if (newValue == ONOFF.ON) {
      ruleStoreV3.getListBot()
    } else {
      ruleStoreV3.ruleV3.bot_id = null
    }
  }
)

onMounted(() => {
  if (ruleStoreV3.ruleV3.isOnTelegram()) {
    ruleStoreV3.getListBot()
  }
})
</script>

<template>
  <div class="flex gap-2 items-center" v-if="ruleStoreV3.ruleV3.isOnTelegram()">
    <FloatingWrapper :name="name">
      <n-select
        v-model:value="ruleStoreV3.ruleV3.bot_id"
        value-field="id"
        label-field="name"
        clearable
        :placeholder="''"
        :loading="ruleStoreV3.loadingBot"
        :options="ruleStoreV3.listBot"
      />
    </FloatingWrapper>

    <n-button size="small" @click="openBotModal">Manage</n-button>
  </div>

  <BotManagementModal v-model:show="showBotModal" />
</template>
