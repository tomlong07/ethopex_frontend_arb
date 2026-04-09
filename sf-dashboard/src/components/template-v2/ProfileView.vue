<script setup lang="ts">
import { ctr_report } from '@/services/ctr_report'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()
const STORAGE_KEY = `current_view_${helper.truePath()}`
const isInitializing = ref(true)

interface View {
  id: number
  name: string
  filters?: string
  column_display?: string
  group_by?: string
  custom_filter?: string
  path: string
}

const views = ref<View[]>([])
const currentViewId = ref<number | null>(null)
const showActionPopover = ref(false)
const newViewName = ref('')
const loading = ref(false)

const currentView = computed(() =>
  currentViewId.value
    ? views.value.find((v) => v.id === currentViewId.value)
    : null
)

const isDefaultView = computed(() => currentViewId.value === null)

watch(currentViewId, (id) => {
  const view = id ? views.value.find((v) => v.id === id) : null
  newViewName.value = view?.name || ''
})

watch(showActionPopover, (show) => {
  if (show) {
    newViewName.value = currentView.value?.name || 'My View'
  } else {
    newViewName.value = ''
  }
})

const buildPayload = () => ({
  filters: JSON.stringify(templateV2Store.filterList || {}),
  column_display: JSON.stringify(templateV2Store.columnSettings || []),
  group_by: (templateV2Store.groupByV2 || []).join(','),
  custom_filter: JSON.stringify(templateV2Store.customFilterV2 || {}),
  path: helper.truePath(),
})

const parseJSON = (str: string | undefined, fallback: any) => {
  if (!str) return fallback
  try {
    return JSON.parse(str)
  } catch {
    return fallback
  }
}

const validateFilters = (savedFilters: any): any => {
  if (!savedFilters || typeof savedFilters !== 'object') return {}

  const currentFilters = templateV2Store.filterConfigs?.filters || []
  const normalized: any = {}

  for (const key in savedFilters) {
    const savedValue = savedFilters[key]

    if (
      templateV2Store.datePicker.hasDatePicker &&
      ['start_date', 'end_date', 'start_month', 'end_month'].includes(key)
    ) {
      normalized[key] = savedValue
      continue
    }

    const filterConfig = currentFilters.find((f: any) => f.key === key)

    if (!filterConfig) {
      continue
    }

    const isCurrentMultiple = filterConfig.multiple === true
    const isSavedArray = Array.isArray(savedValue)

    // Kiểm tra type giữa array và string
    if (isCurrentMultiple && !isSavedArray) {
      normalized[key] =
        savedValue !== null && savedValue !== undefined ? [savedValue] : []
    } else if (!isCurrentMultiple && isSavedArray) {
      normalized[key] = null
    } else {
      normalized[key] = savedValue
    }
  }

  return normalized
}

const applyViewDataSilently = (view: View) => {
  try {
    const savedFilters = parseJSON(view.filters, {})
    templateV2Store.filterList = validateFilters(savedFilters)
    templateV2Store.columnSettings = parseJSON(view.column_display, [])
    templateV2Store.groupByV2 = view.group_by?.split(',').filter(Boolean) || []
    templateV2Store.customFilterV2 = parseJSON(view.custom_filter, {})
    return true
  } catch (e) {
    console.error('Failed to apply view:', e)
    return false
  }
}

const applyViewData = (view: View) => {
  const success = applyViewDataSilently(view)
  if (success && !isInitializing.value) {
    templateV2Store.reInitTable()
  }
  return success
}

const fetchViews = async () => {
  loading.value = true
  try {
    const response = await ctr_report.ReportProfiles(helper.truePath())
    if (!response.status) return

    views.value = response.data || []

    const savedId = localStorage.getItem(STORAGE_KEY)
    if (savedId === 'null') {
      currentViewId.value = null
    } else if (savedId) {
      const view = views.value.find((v) => v.id === Number(savedId))
      if (view) {
        currentViewId.value = view.id
        applyViewDataSilently(view)
      } else {
        currentViewId.value = null
        localStorage.setItem(STORAGE_KEY, 'null')
      }
    }
  } catch (error) {
    window.message.error('Failed to load views')
    console.error('Failed to fetch views:', error)
  } finally {
    loading.value = false
    isInitializing.value = false
  }
}

const handleViewChange = (id: number | null) => {
  if (id === null) {
    currentViewId.value = null
    localStorage.setItem(STORAGE_KEY, 'null')

    templateV2Store.resetToDefaultView()
    templateV2Store.reInitTable()

    return
  }

  const view = views.value.find((v) => v.id === id)
  if (!view) return

  if (applyViewData(view)) {
    currentViewId.value = id
    localStorage.setItem(STORAGE_KEY, id.toString())
    window.message.success(`Applied view: ${view.name}`)
  } else {
    window.message.error('Failed to apply view')
  }
}

const handleCreateView = async () => {
  if (!newViewName.value.trim()) {
    window.message.warning('Please enter view name')
    return
  }

  loading.value = true
  try {
    const response = await ctr_report.CreateReportProfile({
      name: newViewName.value.trim(),
      ...buildPayload(),
    })

    if (response.status) {
      await fetchViews()
      const newView = views.value[0]
      if (newView) {
        currentViewId.value = newView.id
        localStorage.setItem(STORAGE_KEY, newView.id.toString())
        applyViewData(newView)
        window.message.success(`Created view: ${newView.name}`)
      }
      newViewName.value = ''
      showActionPopover.value = false
    } else {
      window.message.error('Failed to create view')
    }
  } catch (error) {
    window.message.error('Failed to create view')
    console.error('Failed to create view:', error)
  } finally {
    loading.value = false
  }
}

const handleUpdateView = async () => {
  if (!currentView.value || !newViewName.value.trim()) {
    window.message.warning('Invalid view or name')
    return
  }

  loading.value = true
  try {
    const response = await ctr_report.UpdateReportProfile({
      id: currentView.value.id,
      name: newViewName.value.trim(),
      ...buildPayload(),
    })

    if (response.status) {
      await fetchViews()
      const updated = views.value.find((v) => v.id === currentView.value!.id)
      if (updated) {
        applyViewData(updated)
        window.message.success(`Updated view: ${updated.name}`)
      }
      showActionPopover.value = false
    } else {
      window.message.error('Failed to update view')
    }
  } catch (error) {
    window.message.error('Failed to update view')
    console.error('Failed to update view:', error)
  } finally {
    loading.value = false
  }
}

const handleDeleteView = async () => {
  if (!currentView.value) return
  if (!window.confirm(`Delete view "${currentView.value.name}"?`)) return

  loading.value = true
  try {
    const response = await ctr_report.DeleteReportProfile({
      id: currentView.value.id,
    })
    if (response.status) {
      views.value = views.value.filter((v) => v.id !== currentView.value!.id)
      currentViewId.value = null
      localStorage.setItem(STORAGE_KEY, 'null')
      window.message.success('View deleted')
      showActionPopover.value = false
    } else {
      window.message.error('Failed to delete view')
    }
  } catch (error) {
    window.message.error('Failed to delete view')
    console.error('Failed to delete view:', error)
  } finally {
    loading.value = false
  }
}

onMounted(() => fetchViews())
</script>

<template>
  <div
    class="flex items-center justify-end gap-2 p-2 bg-gray-100 main-group-child"
  >
    <div class="flex items-center gap-2">
      <n-select
        size="small"
        :options="views.map((v) => ({ label: v.name, value: v.id }))"
        v-model:value="currentViewId"
        class="small-select-dropdown w-36"
        clearable
        :loading="loading"
        @update:value="handleViewChange"
      />
    </div>

    <div class="flex items-center gap-2">
      <n-popover
        trigger="click"
        placement="bottom-end"
        v-model:show="showActionPopover"
      >
        <template #trigger>
          <n-button size="small" class="bg-gray-200 hover:bg-gray-300">
            Action
          </n-button>
        </template>
        <div class="flex flex-col gap-3 p-2 min-w-[280px]">
          <template v-if="isDefaultView">
            <div class="text-sm font-medium">Create New View</div>
            <div class="flex gap-2">
              <n-input
                size="medium"
                v-model:value="newViewName"
                placeholder="Enter view name"
              />
              <n-button
                size="medium"
                type="success"
                :disabled="!newViewName.trim()"
                @click="handleCreateView"
              >
                Create
              </n-button>
            </div>
          </template>

          <template v-else>
            <div class="text-sm font-medium">Manage View</div>
            <div class="flex flex-col gap-2">
              <div class="flex gap-2">
                <n-input
                  size="medium"
                  v-model:value="newViewName"
                  placeholder="Enter view name"
                  @keyup.enter="handleCreateView"
                />
                <n-button
                  size="medium"
                  type="success"
                  :disabled="!newViewName.trim()"
                  @click="handleCreateView"
                >
                  Create
                </n-button>
                <n-button
                  size="medium"
                  type="primary"
                  :disabled="!newViewName.trim()"
                  @click="handleUpdateView"
                  class="flex-1"
                >
                  Update
                </n-button>
                <n-button
                  size="medium"
                  type="error"
                  @click="handleDeleteView"
                  class="flex-1"
                >
                  Delete
                </n-button>
              </div>
            </div>
          </template>
        </div>
      </n-popover>
    </div>
  </div>
</template>

<style scoped>
.n-button + .n-button {
  margin-left: 0;
}
</style>
