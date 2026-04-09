<template>
  <div class="flex justify-end bg-gray-100 py-2">
    <div>
      <div class="font-bold text-xs text-gray-500 pb-1 mx-2">&nbsp;</div>
      <n-popover trigger="hover">
        <template #trigger>
          <n-button text @click="showModal = true">
            <n-icon :component="ManagerColumn" size="20" class="custom-icon" />
          </n-button>
        </template>
        <span>Manager Columns</span>
      </n-popover>
    </div>
    <!-- Modal -->
    <n-modal
      v-model:show="showModal"
      preset="card"
      title="Order Column Setting"
      class="w-[600px]"
      :bordered="false"
      size="small"
      :segmented="{
        content: 'soft',
        footer: 'soft',
      }"
    >
      <div class="py-2">
        <draggableComponent
          v-model="localColumns"
          :disabled="templateV2Store.baseConfigs?.offOrder"
          item-key="field"
          class="space-y-2 max-h-[60vh] overflow-y-auto pr-2"
          :animation="300"
          :scroll="true"
          :scroll-speed="20"
        >
          <template #item="{ element }">
            <div
              class="p-3 bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-lg flex justify-between items-center transition-colors group cursor-grab active:cursor-grabbing"
            >
              <div class="flex gap-3 items-center flex-1 min-w-0">
                <div class="flex flex-col min-w-0">
                  <span class="font-medium text-gray-700 truncate">
                    {{ element.headerName }}
                  </span>
                  <span class="text-xs text-gray-400 truncate">
                    {{ element.field }}
                  </span>
                </div>
              </div>

              <div class="flex items-center gap-2 flex-shrink-0">
                <div
                  class="flex items-center drag-handle cursor-move p-1 hover:bg-gray-200 rounded transition-colors"
                >
                  <n-icon :component="Drag" size="16" class="text-gray-400" />
                </div>
              </div>
            </div>
          </template>
        </draggableComponent>
      </div>

      <template #footer>
        <div class="flex justify-end gap-2">
          <n-button @click="clearColumnsSettings" size="small" color="#2d5cc8">
            Reset
          </n-button>
          <n-button @click="handleCancel" size="small"> Cancel </n-button>
          <n-button
            type="primary"
            color="#f43f5e"
            @click="handleSave"
            size="small"
          >
            Save
          </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { NButton, NModal, NIcon } from 'naive-ui'
import draggableComponent from 'vuedraggable'
import Drag from '@/assets/icons/Drag.vue'
import { useTemplateV2 } from '@/store/templateV2Store'
import ManagerColumn from '@/assets/icons/ManagerColumn.vue'
import { ctr_table_settings } from '@/services/ctr_table_settings'
import { ResponseColumnsV2 } from '@/class/template_v2'

const props = defineProps<{
  columns: ResponseColumnsV2
}>()

const templateV2Store = useTemplateV2(helper.truePath())()

const showModal = ref(false)
const localColumns = ref<any[]>([])

watch(showModal, (newVal) => {
  if (newVal && props.columns.columns) {
    localColumns.value = props.columns.columns.map((col) => ({ ...col }))
  }
})

const handleCancel = () => {
  showModal.value = false
  // Reset lại columns
  if (props.columns.columns) {
    localColumns.value = props.columns.columns.map((col) => ({ ...col }))
  }
}

const handleSave = async () => {
  templateV2Store.isFetching = true
  try {
    const orderedFields = localColumns.value.map((col) => col.field)

    const result = await templateV2Store.saveOrderColumn(orderedFields)

    if (result) {
      showModal.value = false

      await templateV2Store.fetchPermissionColumns()
      templateV2Store.reAssignColumns = Date.now()
    }
  } finally {
    templateV2Store.isFetching = false
  }
}

const clearColumnsSettings = async () => {
  const result = await ctr_table_settings.Clear({
    router: window.location.pathname,
  })

  if (result?.status) {
    window.location.reload()
  }
}
</script>

<style scoped>
:deep(.n-card__content) {
  padding: 16px;
}

:deep(.n-card__footer) {
  padding: 12px 16px;
}

.overflow-y-auto::-webkit-scrollbar {
  width: 6px;
}

.overflow-y-auto::-webkit-scrollbar-track {
  background: #f1f1f1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb {
  background: #cbd5e1;
  border-radius: 3px;
}

.overflow-y-auto::-webkit-scrollbar-thumb:hover {
  background: #94a3b8;
}

.custom-icon {
  transition: color 0.2s ease;
}

.custom-icon:hover {
  color: var(--n-text-color-hover);
}
</style>
