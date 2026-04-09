<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'
import { ColumnItem } from '@/types/state/general'
import useInfoContact from '@/store/useInfoContact'
import DetailModal from '@/components/info_contact/DetailModal.vue'
import Close2 from '@/assets/icons/Close2.vue'
import { PencilFill } from '@/assets'
import CKEditor from '@/components/common/CKEditor.vue'
import { ref, watch, nextTick } from 'vue'
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'
import InfoContactAction from '@/components/info_contact/cell/InfoContactAction.vue'
import InfoContactContract from '@/components/info_contact/cell/InfoContactContract.vue'
import InfoContactCreatedAt from '@/components/info_contact/cell/InfoContactCreatedAt.vue'
import InfoContactStatusApproved from '@/components/info_contact/cell/InfoContactStatusApproved.vue'
import InfoContactLink from '@/components/info_contact/cell/InfoContactLink.vue'
import InfoContactRevenue from '@/components/info_contact/cell/InfoContactRevenue.vue'
import InfoContactSocialMedia from '@/components/info_contact/cell/InfoContactSocialMedia.vue'
import InfoContactSetUp from '@/components/info_contact/cell/InfoContactSetUp.vue'
import InfoContactSystemEmail from '@/components/info_contact/cell/InfoContactSystemEmail.vue'
import InfoContactSystemManager from '@/components/info_contact/cell/InfoContactSystemManager.vue'
import InfoContactStatus from '@/components/info_contact/cell/InfoContactStatus.vue'

const templateV2Store = useTemplateV2(helper.truePath())()
const infoContactStore = useInfoContact()

const { loadCkeditorScript, initEditor } = useCkeditorLoader()
const noteEditorRef = ref<InstanceType<typeof CKEditor>>()
const editEditorRefs = ref<Record<number, InstanceType<typeof CKEditor>>>({})
const editorKey = ref(0)
const editEditorKey = ref(0)
const previewImage = ref<string>('')
const showImageModal = ref(false)

templateV2Store.componentMap = (column: ColumnItem) => {
  if (!column.field) return

  switch (column.field) {
    case 'status':
      return InfoContactStatus
    case 'action':
      return InfoContactAction
    case 'linkedin_url':
    case 'facebook_page_url':
      return InfoContactLink
    case 'daily_revenue_usd':
      return InfoContactRevenue
    case 'telegram_whatsapp':
      return InfoContactSocialMedia
    case 'created_at':
      return InfoContactCreatedAt
    case 'status_approved':
      return InfoContactStatusApproved
    case 'set_up':
      return InfoContactSetUp
    case 'contract':
      return InfoContactContract
    case 'system_email':
      return InfoContactSystemEmail
    case 'system_manager':
      return InfoContactSystemManager
  }
  return
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
        if (ref) {
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
  () => infoContactStore.showModal,
  (isOpen) => {
    if (isOpen) {
      loadEditor(noteEditorRef)
    }
  }
)

// Khởi tạo edit editor khi bắt đầu edit
watch(
  () => infoContactStore.editIndex,
  (index) => {
    if (index !== null && index !== undefined && index >= 0) {
      editEditorKey.value++
      nextTick(() => loadEditor(null, index))
    }
  }
)
</script>

<template>
  <n-modal v-model:show="infoContactStore.showModal" :trap-focus="false">
    <n-card
      style="width: 1000px; height: calc(100vh - 40px)"
      size="huge"
      title="Note"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div
        class="max-h-[280px] overflow-y-auto border rounded-lg p-3 mb-3 space-y-3 scroll-thin-custom"
      >
        <div
          v-for="(item, index) in infoContactStore.selectedContact?.notes"
          :key="index"
          class="border border-gray-200 rounded-lg p-3 bg-gray-50 hover:bg-gray-100 transition"
        >
          <div class="flex justify-between items-center mb-1">
            <div>
              <span class="font-semibold text-sm text-gray-800">
                {{ item.user_email }}
              </span>
              <div class="text-xs text-[#9ca3af]">
                <span class="text-gray-600">{{ item.user_name }}</span>
                {{ new Date(item.created_at).toLocaleString() }}
              </div>
            </div>

            <!-- Nút Edit / Delete -->
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
                  <PencilFill style="width: 12px; height: 12px; color: #000" />
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
                :minimalToolbar="true"
              />
            </div>
            <div class="flex justify-end space-x-2">
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
            class="text-gray-700 text-sm prose prose-sm max-w-none"
            v-html="item.content"
            @click="handleContentClick"
          ></div>
        </div>

        <div
          v-if="!infoContactStore.selectedContact?.notes?.length"
          class="text-gray-400 text-sm text-center py-3"
        >
          No notes yet.
        </div>
      </div>
      <div
        class="h-[240px] overflow-y-auto border rounded-lg p-3 scroll-thin-custom"
      >
        <CKEditor
          :key="editorKey"
          id="noteEditor"
          ref="noteEditorRef"
          :initData="infoContactStore.noteContent || ''"
          :autoInit="false"
          @changeEditor="handleEditorChange"
          title="Note Data"
          :minimalToolbar="true"
        />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="ml-auto"
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="infoContactStore.isLoading"
            :disabled="!infoContactStore.noteContent?.trim()"
            @click="handleSubmitNote"
          >
            Add Note
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
  <!-- Image Preview Modal -->
  <n-modal v-model:show="showImageModal" :mask-closable="true">
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
  <!-- Detail Modal -->
  <DetailModal />
</template>
<style>
.prose img {
  cursor: pointer;
}
</style>
