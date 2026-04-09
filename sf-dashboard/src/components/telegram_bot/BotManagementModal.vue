<script lang="ts" setup>
import { ref, watch } from 'vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_bot_telegram } from '@/services/ctr_bot_telegram'
import useTelegram from '@/store/details/useTelegram'
import Close2 from '@/assets/icons/Close2.vue'
import PencilFill from '@/assets/icons/PencilFill.vue'
import useRuleStoreV3 from '@/store/details/ruleV3'

interface Bot {
  id: number
  name: string
  token: string
  status: 'active' | 'inactive'
}

const show = defineModel<boolean>('show', { default: false })
const ruleStoreV3 = useRuleStoreV3()
const store = useTelegram()
const isSubmitBtnLoading = ref(false)

const createDefaultBot = (): Omit<Bot, 'id'> => ({
  name: '',
  token: '',
  status: 'active'
})

const newBot = ref(createDefaultBot())
const editIndex = ref<number>(-1)
const editBot = ref(createDefaultBot())

// Reset form
const resetBotForm = () => {
  newBot.value = createDefaultBot()
}

const cancelEdit = () => {
  editIndex.value = -1
  editBot.value = createDefaultBot()
}

watch(show, (newValue) => {
  if (newValue) {
    resetBotForm()
    store.loadBot()
    cancelEdit()
  }
})

const startEdit = (index: number) => {
  editIndex.value = index
  const bot = store.listBot[index]
  editBot.value = { ...bot }
}

// Refresh list bot
const refreshBotList = () => {
  ruleStoreV3.getListBot()
}

const updateBot = async (index: number) => {
  try {
    const result = await ctr_bot_telegram.UpdateBot(editBot.value)

    if (result.status) {
      refreshBotList()
      Object.assign(store.listBot[index], editBot.value)
      cancelEdit()
      window.message.success('Bot updated successfully!')
    }
  } catch {
    window.message.error('Failed to update bot!')
  }
}

const addBot = async () => {
  isSubmitBtnLoading.value = true
  try {
    const result = await ctr_bot_telegram.AddBot(newBot.value)
    if (result.status) {
      store.listBot.push(result.data)
      refreshBotList()
      resetBotForm()
      window.message.success('Bot added successfully!')
    }
  } catch {
    window.message.error('Failed to add bot!')
  } finally {
    isSubmitBtnLoading.value = false
  }
}

const deleteBot = async (id: number) => {
  try {
    const result = await ctr_bot_telegram.DeleteBot(id)

    if (result.status) {
      refreshBotList()
      store.listBot = store.listBot.filter(b => b.id !== id)
      window.message.success('Bot deleted successfully!')
    }
  } catch {
    window.message.error('Failed to delete bot!')
  }
}

const isFormValid = (bot: typeof newBot.value) => 
  bot.name.trim() && bot.token.trim()
</script>

<template>
  <n-modal 
    v-model:show="show" 
    :trap-focus="false"
  >
    <n-card 
      title="Manage Bots" 
      size="huge" 
      :style="{ width: '800px', height: '600px' }"
    >
      <!-- Danh sách bot -->
      <div class="max-h-[260px] overflow-y-auto border rounded-lg p-3 mb-5 space-y-3">
        <div v-for="(bot, index) in store.listBot" 
          :key="bot.id"
          class="border rounded-lg p-3 bg-gray-50"
        >
          <!-- View mode -->
          <div v-if="editIndex !== index" class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-semibold text-sm text-gray-800 mb-1">
                {{ bot.name }}
              </div>
            </div>
            <div class="flex space-x-1">
              <n-button 
                size="tiny" 
                quaternary 
                circle 
                class="!bg-transparent" 
                @click="startEdit(index)"
              >
                <template #icon>
                  <PencilFill style="width:12px;height:12px;color:#000" />
                </template>
              </n-button>
              <n-popconfirm 
                @positive-click="() => deleteBot(bot.id)" 
                positive-text="Delete" 
                negative-text="Cancel"
                type="error"
              >
                <template #trigger>
                  <n-button 
                    size="tiny" 
                    quaternary 
                    circle
                    class="!bg-transparent"
                  >
                    <template #icon>
                      <Close2 />
                    </template>
                  </n-button>
                </template>
                Are you sure you want to delete this bot?
              </n-popconfirm>
            </div>
          </div>

          <!-- Edit mode -->
          <div v-else class="space-y-3">
            <FloatingWrapper name="Bot Name">
              <n-input v-model:value="editBot.name" />
            </FloatingWrapper>

            <FloatingWrapper name="Token">
              <n-input 
                v-model:value="editBot.token" 
                type="password" 
                show-password-on="click" 
              />
            </FloatingWrapper>

            <div 
              class="select-option-wrapper" 
              :class="editBot.status === 'active' ? 'select-option-green' : 'select-option-red'"
            >
              <FloatingWrapper name="Status">
                <n-select 
                  v-model:value="editBot.status" 
                  :options="store.statusOptions" 
                  :to="false" 
                />
              </FloatingWrapper>
            </div>

            <div class="flex justify-end space-x-2">
              <n-button 
                size="small" 
                secondary 
                @click="cancelEdit"
              >
                Cancel
              </n-button>
              <n-button 
                size="small" 
                color="#f43f5e" 
                :disabled="!isFormValid(editBot)"
                @click="updateBot(index)"
              >
                Save
              </n-button>
            </div>
          </div>
        </div>

        <div v-if="!store.listBot.length" 
          class="text-gray-400 text-sm text-center py-3"
        >
          No bots yet.
        </div>
      </div>

      <!-- Form thêm bot mới -->
      <div class="space-y-3">
        <FloatingWrapper name="New Bot Name">
          <n-input v-model:value="newBot.name" />
        </FloatingWrapper>

        <FloatingWrapper name="New Bot Token">
          <n-input 
            v-model:value="newBot.token" 
            type="password" 
            show-password-on="click" 
          />
        </FloatingWrapper>

        <div 
          class="select-option-wrapper" 
          :class="newBot.status === 'active' ? 'select-option-green' : 'select-option-red'"
        >
          <FloatingWrapper name="Status">
            <n-select 
              v-model:value="newBot.status" 
              :options="store.statusOptions" 
            />
          </FloatingWrapper>
        </div>
      </div>

      <div class="flex justify-end">
        <n-button 
          class="my-4 ml-auto" 
          color="#f43f5e" 
          size="medium" 
          type="success"
          :loading="isSubmitBtnLoading"
          :disabled="!isFormValid(newBot)" 
          @click="addBot"
        >
          Add Bot
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>