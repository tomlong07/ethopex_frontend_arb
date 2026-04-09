<script setup lang="ts">
import useInfoContact from '@/store/useInfoContact'
import { NSelect } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import Close2 from '@/assets/icons/Close2.vue'
import PencilFill from '@/assets/icons/PencilFill.vue'
import CKEditor from '@/components/common/CKEditor.vue'
import { ref, watch, nextTick, computed, CSSProperties } from 'vue'
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'

const infoContactStore = useInfoContact()

const { loadCkeditorScript, initEditor } = useCkeditorLoader()
const noteEditorRef = ref<InstanceType<typeof CKEditor>>()
const editEditorRefs = ref<Record<number, InstanceType<typeof CKEditor>>>({})
const editorKey = ref(0)
const editEditorKey = ref(0)
const previewImage = ref<string>('')
const showImageModal = ref(false)

const classNow = computed(() => {
  const status = infoContactStore.selectedContact?.status
  const option = infoContactStore.statusOptions.find(opt => opt.value === status)
  
  const color = (option?.style as CSSProperties | undefined)?.color
  
  return color ? `select-option-${color}` : ''
})
const isChanging = ref(false)

const handleChangeStatus = async (value: string) => {
  const contact = infoContactStore.selectedContact

  isChanging.value = true

  const result = await infoContactStore.changeStatus(
    contact.id,
    value,
    '/form-registration/update-status'
  )

  isChanging.value = false

  if (result.success) {
    infoContactStore.selectedContactStatus = value
  }
}

async function handleDelete(index: number) {
  try {
    await infoContactStore.deleteNote(index)
  } catch {
    window.message.error('Delete failed!')
  }
}
const loadEditor = async (editorRef: any, index?: number) => {
  try {
    await loadCkeditorScript()
    await nextTick()
    
    if (index !== undefined) {
      setTimeout(() => {
        const ref = editEditorRefs.value[index]
        if(ref) {
          initEditor({ value: ref })
        }
      }, 100)
    } else {
      initEditor(editorRef)
    }
  } catch (error) {
    console.error('CKEditor load failed', error)
  }
}

const handleSubmitNote = async () => {
  await infoContactStore.submitAddNote()
  editorKey.value++ // Reset editor
}

function handleEditorChange(content: string) {
  infoContactStore.noteContent = content
}

function handleEditEditorChange(content: string) {
  infoContactStore.editContent = content
}

function handleContentClick(e: MouseEvent) {
  const target = e.target as HTMLElement

  if (target && target.tagName === 'IMG') {
    const src = (target as HTMLImageElement).src
    if (src) {
      previewImage.value = src
      showImageModal.value = true
    }
  }
}

// Khởi tạo editor khi modal mở
watch(
  () => infoContactStore.showDetailModal,
  (isOpen) => {
    if (isOpen) {
      loadEditor(noteEditorRef)
    }
  }
)

// Khởi tạo edit editor khi bắt đầu edit
watch(
  () => infoContactStore.editIndex, (index) => {
  if (index !== null && index !== undefined && index >= 0) {
    editEditorKey.value++
    nextTick(() => loadEditor(null, index))
  }
})
</script>

<template>
  <n-modal v-model:show="infoContactStore.showDetailModal">
    <n-card
      :style="{ width: '900px', maxHeight: '90vh' }"
      size="large"
      title="Contact Details"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div
        class="overflow-y-auto scroll-thin-custom max-h-[calc(90vh-120px)] relative"
      >
        <div
          class="flex items-center justify-between mb-5 pb-4 sticky top-0 z-50 bg-white shadow-sm"
        >
          <div class="flex items-center gap-3">
            <span class="text-gray-500 text-sm">ID:</span>
            <span class="font-semibold text-sm">
              {{ infoContactStore.selectedContact?.id }}
            </span>
          </div>
          <div class="select-option-wrapper" :class="classNow">
            <n-select
              :value="infoContactStore.selectedContactStatus"
              :options="infoContactStore.statusOptions"
              size="small"
              :loading="isChanging"
              :on-update:value="handleChangeStatus"
              class="w-[120px]"
            />
          </div>
        </div>
        <div class="grid grid-cols-2 gap-6">
          <div class="space-y-5">
            <!-- Personal Information -->
            <FloatingWrapper name="Personal Information">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">
                      Name:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.name
                      }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      Email:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.email
                      }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      Telegram/Whatsapp:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.telegram_whatsapp
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </FloatingWrapper>

            <!-- Company Information -->
            <FloatingWrapper name="Company Information">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">
                      Company Name:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.company_name
                      }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      Company Address:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.company_address
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </FloatingWrapper>

            <!-- Revenue -->
            <FloatingWrapper name="Revenue">
              <div
                class="bg-gradient-to-br from-green-50 to-emerald-50 rounded-lg p-4 border border-green-200"
              >
                <div>
                  <label class="text-xs text-gray-500 block mb-1"
                    >Daily Revenue (USD)</label
                  >
                  <p class="text-md font-bold text-green-700">
                    {{
                      infoContactStore.formatCurrency(
                        infoContactStore.selectedContact?.daily_revenue_usd
                      )
                    }}
                  </p>
                </div>
              </div>
            </FloatingWrapper>
          </div>

          <div class="space-y-5">
            <!-- Traffic & Monetization -->
            <FloatingWrapper name="Traffic & Sources">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">
                      Main Traffic Source:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.main_traffic_source
                      }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      Main Feed Provider:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.main_feed_provider
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </FloatingWrapper>

            <!-- Monetization Details -->
            <FloatingWrapper name="Monetization">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-3">
                  <div>
                    <p class="text-xs text-gray-500">
                      Main Monetization Type:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.main_monetization_type
                      }}</span>
                    </p>
                  </div>
                  <div>
                    <p class="text-xs text-gray-500">
                      Optimization Platform:
                      <span class="text-xs font-medium text-gray-800">{{
                        infoContactStore.selectedContact?.optimization_platform
                      }}</span>
                    </p>
                  </div>
                </div>
              </div>
            </FloatingWrapper>

            <!-- Social Links -->
            <FloatingWrapper name="Social Media">
              <div class="bg-gray-50 rounded-lg p-4">
                <div class="space-y-2">
                  <div v-if="infoContactStore.selectedContact?.linkedin_url">
                    <span class="text-xs text-gray-500 block mb-1"
                      >LinkedIn</span
                    >
                    <a
                      :href="infoContactStore.selectedContact?.linkedin_url"
                      target="_blank"
                      class="text-xs text-blue-600 hover:underline break-all"
                    >
                      {{ infoContactStore.selectedContact?.linkedin_url }}
                    </a>
                  </div>
                  <div
                    v-if="infoContactStore.selectedContact?.facebook_page_url"
                  >
                    <label class="text-xs text-gray-500 block mb-1"
                      >Facebook Page</label
                    >
                    <a
                      :href="
                        infoContactStore.selectedContact?.facebook_page_url
                      "
                      target="_blank"
                      class="text-xs text-blue-600 hover:underline break-all"
                    >
                      {{ infoContactStore.selectedContact?.facebook_page_url }}
                    </a>
                  </div>
                  <div
                    v-if="
                      !infoContactStore.selectedContact?.linkedin_url &&
                      !infoContactStore.selectedContact?.facebook_page_url
                    "
                  >
                    <p class="text-xs text-gray-400">No social media links</p>
                  </div>
                </div>
              </div>
            </FloatingWrapper>
          </div>
        </div>
        <!-- Notes Preview -->
        <FloatingWrapper name="Notes" class="mt-5">
          <div class="bg-gray-50 rounded-lg p-4">
            <div class="space-y-2">
              <div
                v-for="(note, index) in infoContactStore.selectedContact?.notes"
                :key="index"
                class="text-xs bg-white rounded p-2 border"
              >
                <div class="flex justify-between items-center mb-1">
                  <div>
                    <span class="font-semibold text-sm text-gray-800">
                      {{ note.user_email }}
                    </span>
                    <div class="text-xs text-[#9ca3af]">
                      <span class="text-[#4b5563]">{{ note.user_name }}</span>
                      {{ new Date(note.created_at).toLocaleString() }}
                    </div>
                  </div>
                  <div class="flex space-x-1">
                    <n-button
                      size="tiny"
                      quaternary
                      circle
                      type="primary"
                      class="!bg-transparent hover:!bg-gray-200"
                      @click="infoContactStore.startEdit(index as number)"
                    >
                      <template #icon>
                        <PencilFill
                          style="width: 12px; height: 12px; color: #000"
                        />
                      </template>
                    </n-button>

                    <n-popconfirm
                      @positive-click="() => handleDelete(index as number)"
                      positive-text="Delete"
                      negative-text="Cancel"
                      type="error"
                    >
                      <template #trigger>
                        <n-button
                          size="tiny"
                          quaternary
                          class="text-black !bg-transparent hover:!bg-gray-200"
                          circle
                          type="error"
                        >
                          <template #icon>
                            <Close2 />
                          </template>
                        </n-button>
                      </template>
                      Are you sure you want to delete this note?
                    </n-popconfirm>
                  </div>
                </div>
                <!-- Đang edit -->
                <div v-if="infoContactStore.editIndex === index">
                  <div class="mb-8">
                    <CKEditor
                      :key="`edit-${editEditorKey}-${index}`"
                      :id="`editNoteEditor-${index}`"
                      :ref="(el: any) => { if (el) editEditorRefs[index] = el }"
                      :initData="infoContactStore.editContent"
                      :autoInit="false"
                      @changeEditor="handleEditEditorChange"
                      title="Edit Note"
                      class="min-h-[400px]"
                      :minimalToolbar="true"
                    />
                  </div>
                  <div class="flex justify-end space-x-2 mt-8">
                    <n-button
                      size="tiny"
                      secondary
                      @click="infoContactStore.cancelEdit"
                    >
                      Cancel
                    </n-button>
                    <n-button
                      size="tiny"
                      color="#f43f5e"
                      @click="infoContactStore.updateNote(index)"
                      :loading="infoContactStore.isSavingNote"
                    >
                      Save
                    </n-button>
                  </div>
                </div>

                <!-- Không edit -->
                <div 
                  v-else 
                  class="text-gray-600 text-sm prose prose-sm max-w-none"
                  v-html="note.content"
                  @click="handleContentClick"
                ></div>
              </div>
              <div v-if="!infoContactStore.selectedContact?.notes?.length">
                <p class="text-xs text-gray-400 text-center py-2">
                  No notes available
                </p>
              </div>
            </div>
            <div class="mt-3">
              <CKEditor
                :key="editorKey"
                id="newNoteEditor"
                ref="noteEditorRef"
                :initData="infoContactStore.noteContent || ''"
                :autoInit="false"
                @changeEditor="handleEditorChange"
                title="Add Note"
                class="h-[420px]"
                :minimalToolbar="true"
              />
            </div>
            <div class="flex justify-end mt-2 sticky bottom-0 z-50">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :loading="infoContactStore.isLoading"
                @click="handleSubmitNote"
              >
                Add Note
              </n-button>
            </div>
          </div>
        </FloatingWrapper>
      </div>
    </n-card>
  </n-modal>
  <!-- Image Preview Modal -->
  <n-modal
    v-model:show="showImageModal"
    :mask-closable="true"
  >
    <img 
      :src="previewImage"
      alt="Preview"
      style="
        max-width: 90vw;
        max-height: 90vh;
        width: auto;
        height: auto;
        display: block;
      "
    />
  </n-modal>
</template>
