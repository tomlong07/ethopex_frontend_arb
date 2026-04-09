<script lang="ts" setup>
import { ref, watch, computed } from 'vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import useTelegram from '@/store/details/useTelegram'
import Close2 from '@/assets/icons/Close2.vue'
import PencilFill from '@/assets/icons/PencilFill.vue'
import { ctr_chat_telegram } from '@/services/ctr_chat_telegram'

interface Chat {
  id: number
  chat_id_telegram: number
  name: string
  bot_id: number | null
  status: 'active' | 'inactive'
}

const show = defineModel<boolean>('show', { default: false })
const store = useTelegram()
const isSubmitBtnLoading = ref(false)

const createDefaultChat = (): Omit<Chat, 'id'> => ({
  chat_id_telegram: 0,
  name: '',
  bot_id: null,
  status: 'active'
})

const newChat = ref(createDefaultChat())
const editIndex = ref<number>(-1)
const editChat = ref(createDefaultChat())

// Reset form
const resetNewChatForm = () => {
  newChat.value = createDefaultChat()
}

const cancelEdit = () => {
  editIndex.value = -1
  editChat.value = createDefaultChat()
}

const botOptions = computed(() => 
  store.listBot.map(b => ({
    label: b.name,
    value: b.id
  }))
)

watch(show, (newValue) => {
  if (newValue) {
    resetNewChatForm()
    store.loadBot()
    store.loadChat()
    cancelEdit()
  }
})

const startEdit = (index: number) => {
  editIndex.value = index
  const chat = store.listChat[index]
  editChat.value = { ...chat }
}

const updateChat = async (index: number) => {
  try {
    const result = await ctr_chat_telegram.UpdateChat(editChat.value)

    if (result.status) {
      Object.assign(store.listChat[index], editChat.value)
      cancelEdit()
      window.message.success('Chat updated successfully!')
    }
  } catch {
    window.message.error('Failed to update chat!')
  }
}

const addChat = async () => {
  isSubmitBtnLoading.value = true
  try {
    const result = await ctr_chat_telegram.AddChat(newChat.value)
    if (result.status) {
      store.listChat.push(result.data)
      resetNewChatForm()
      window.message.success('Chat added successfully!')
    }
  } catch {
    window.message.error('Failed to add chat!')
  } finally {
    isSubmitBtnLoading.value = false
  }
}

const deleteChat = async (id: number) => {
  try {
    const result = await ctr_chat_telegram.DeleteChat(id)

    if (result.status) {
      store.listChat = store.listChat.filter(b => b.id !== id)
      window.message.success('Chat deleted successfully!')
    }
  } catch {
    window.message.error('Failed to delete chat!')
  }
}

const isFormValid = (chat: typeof newChat.value) => 
  chat.name.trim() && chat.bot_id !== null
</script>

<template>
  <n-modal 
    v-model:show="show" 
    :trap-focus="false"
  >
    <n-card 
      title="Manage Chats" 
      size="huge" 
      :style="{ width: '800px', height: '600px' }"
    >
      <!-- Danh sách chat -->
      <div class="max-h-[260px] overflow-y-auto border rounded-lg p-3 mb-5 space-y-3">
        <div v-for="(chat, index) in store.listChat" 
          :key="chat.id"
          class="border rounded-lg p-3 bg-gray-50"
        >
          <div v-if="editIndex !== index" class="flex justify-between items-start">
            <div class="flex-1">
              <div class="font-semibold text-sm text-gray-800 mb-1">
                {{ chat.name }}
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
                @positive-click="() => deleteChat(chat.id)" 
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
                Are you sure you want to delete this chat?
              </n-popconfirm>
            </div>
          </div>

          <!-- Edit -->
          <div v-else class="space-y-3">
            <FloatingWrapper name="ID Chat Telegram">
              <n-input-number v-model:value="editChat.chat_id_telegram" />
            </FloatingWrapper>

            <FloatingWrapper name="Name">
              <n-input v-model:value="editChat.name" />
            </FloatingWrapper>

            <FloatingWrapper name="Bot ID">
              <n-select 
                v-model:value="editChat.bot_id"
                placeholder=""
                :to="false"
                :options="botOptions"
              />
            </FloatingWrapper>

            <div 
              class="select-option-wrapper" 
              :class="editChat.status === 'active' ? 'select-option-green' : 'select-option-red'"
            >
              <FloatingWrapper name="Status">
                <n-select 
                  v-model:value="editChat.status" 
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
                :disabled="!isFormValid(editChat)"
                @click="updateChat(index)"
              >
                Save
              </n-button>
            </div>
          </div>
        </div>

        <div v-if="!store.listChat.length" 
          class="text-gray-400 text-sm text-center py-3"
        >
          No chats yet.
        </div>
      </div>

      <!-- Form thêm chat mới -->
      <div class="space-y-3">
        <FloatingWrapper name="New ID Chat Telegram">
          <n-input-number 
            v-model:value="newChat.chat_id_telegram" />
        </FloatingWrapper>

        <FloatingWrapper name="New Chat Name">
          <n-input 
            v-model:value="newChat.name" />
        </FloatingWrapper>

        <FloatingWrapper name="Bot ID">
          <n-select 
            v-model:value="newChat.bot_id"
            placeholder=""
            :options="botOptions"
          />
        </FloatingWrapper>

        <div 
          class="select-option-wrapper" 
          :class="newChat.status === 'active' ? 'select-option-green' : 'select-option-red'"
        >
          <FloatingWrapper name="Status">
            <n-select 
              v-model:value="newChat.status" 
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
          :disabled="!isFormValid(newChat)" 
          @click="addChat"
        >
          Add Chat
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>