<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import Close from '@/assets/icons/Close.vue'
import {
  campaignTypeClass,
  presetLocation,
  adGroups,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import helper from '@/utils/helper'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'
import { ctr_campaign } from '@/services/ctr_campaign'
import ButtonSetLocations from './cell/ButtonSetLocations.vue'
import LocationsCell from './cell/LocationsCell.vue'
import ModalBulkEntryLocation from './ModalBulkEntryLocation.vue'
import { RowSelectionOptions, themeAlpine } from 'ag-grid-community'

const store = usePresetLocations()

const props = defineProps({
  dataSelect: {
    type: Object,
    required: false,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: false,
  },
})

const dataOption = ref<SelectOption[]>([])
const isLoadingTable = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const activeTab = ref('add')

const presetName = ref<string>(props.campaign?.location_preset?.name || '')
const presetSelectedValues = ref<string[]>(
  props.campaign?.location_preset?.locations || []
)

const optionsWithDisabled = computed<SelectOption[]>(() => {
  // bỏ option ALL
  return dataOption.value.filter((opt) => opt.value !== 'ALL') as SelectOption[]
})

watch(
  () => store.editPreset,
  (val) => {
    if (val) {
      if (store.editPreset) {
        presetName.value = store.editPreset.name || ''
        presetSelectedValues.value = store.editPreset.locations || []
      }
    }
  }
)

watch(
  () => [presetName.value, presetSelectedValues.value],
  ([name, selected]) => {
    const isEmpty =
      (!name || !name.toString().trim()) && (!selected || selected.length === 0)

    if (isEmpty) {
      activeTab.value = 'add'
      store.status = false
    }
  },
  { immediate: true }
)

// payload
const createPresetLocationPayload = (): presetLocation => {
  return {
    name: presetName.value || undefined,
    locations: presetSelectedValues.value.length
      ? presetSelectedValues.value
      : undefined,
    traffic_source: props.campaign.traffic_source,
  }
}

function validatePresetLocationPayload(payload: {
  name?: string
  locations?: any[]
}) {
  const errors: string[] = []
  if (!payload.name || payload.name.trim() === '') {
    errors.push('Name is required')
  }
  if (!Array.isArray(payload.locations) || payload.locations.length === 0) {
    errors.push('Locations must not be empty')
  }
  return {
    valid: errors.length === 0,
    errors,
  }
}

const SavePresetLocation = async () => {
  const payload = createPresetLocationPayload()
  const result = validatePresetLocationPayload(payload)
  if (!result.valid) {
    window.message.error(result.errors.join(', '))
    return
  }

  isLoading.value = true

  try {
    if (store.status) {
      // update existing preset
      const result = await ctr_campaign.UpdatePresetLocation(
        store.editPreset.id,
        payload
      )
      if (result && result.status) {
        window.message.success('Updated preset location')
        fetchPresetLocation()
        // apply updated preset to campaign manually
        // store.savePresetLocation(
        //   {
        //     ...payload,
        //     name: presetName.value,
        //   },
        //   props.campaign
        // )
        // store.clearEditPreset()
        // presetName.value = ''
        // presetSelectedValues.value = []
      }
    } else {
      const result = await ctr_campaign.AddPresetLocations(payload)
      if (result && result.status) {
        window.message.success('Saved preset location')
        fetchPresetLocation()
        presetName.value = ''
        presetSelectedValues.value = []
      }
    }
  } finally {
    isLoading.value = false
  }
}

const fetchPresetLocation = async () => {
  try {
    isLoadingTable.value = true

    const result = await ctr_campaign.GetPresetLocations(
      props.campaign.traffic_source as string
    )
    if (result && result.status && Array.isArray(result.data)) {
      const mapped = result.data.map((item: any) => {
        let parsedLocations: any = item.locations

        if (
          typeof item.locations === 'string' &&
          item.locations.trim().length
        ) {
          try {
            parsedLocations = JSON.parse(item.locations)
          } catch {
            parsedLocations = item.locations
          }
        }

        const selectList: any[] = Array.isArray(props.dataSelect)
          ? props.dataSelect
          : []
        const names = Array.isArray(parsedLocations)
          ? parsedLocations
              .map(
                (value: string) =>
                  selectList.find((s) => s.value === value)?.name
              )
              .filter(Boolean)
          : []

        let display = ''
        if (names.length) {
          display = names.join(', ')
        } else if (Array.isArray(parsedLocations)) {
          display = parsedLocations.join(', ')
        } else if (parsedLocations) {
          display = String(parsedLocations)
        }

        const maxLen = 70
        const displayTrimmed =
          display && display.length > maxLen
            ? display.slice(0, maxLen) + '...'
            : display

        return {
          id: item.id,
          name: item.name,
          locations: parsedLocations,
          locations_names: names,
          locations_display: displayTrimmed,
          locations_display_full: display,
          traffic_source: item.traffic_source,
        }
      })

      rowData.value = mapped
    } else {
      rowData.value = []
    }
  } catch {
    console.error('fetchPresetLocation error')
  } finally {
    isLoadingTable.value = false
  }
}

watch(
  () => store.showModalLocation,
  (val) => {
    if (val) {
      dataOption.value = (props.dataSelect as SelectOption[]) || []
      fetchPresetLocation()
    } else {
      store.clearEditPreset()
      store.status = false
    }
  }
)

watch(
  () => store.status,
  (val) => {
    if (val) {
      activeTab.value = 'edit'
    } else {
      activeTab.value = 'add'
      presetName.value = ''
      presetSelectedValues.value = []
    }
  }
)

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

const components = {
  buttonSetLocations: markRaw(ButtonSetLocations),
  locationsCell: markRaw(LocationsCell),
}

const columnDefs = ref([
  {
    field: 'id',
    headerName: 'ID',
    width: 100,
    sortable: true,
    filter: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 200,
    sortable: true,
    filter: false,
  },
  {
    field: 'locations',
    headerName: 'Location',
    width: 580,
    sortable: true,
    filter: false,
    cellRenderer: 'locationsCell',
    valueGetter: (params: any) => {
      return params.data.locations_names
    },
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 150,
    sortable: false,
    filter: false,
    cellRenderer: 'buttonSetLocations',
    cellRendererParams: {
      parentCampaign: props.campaign,
      parentTrafficSource: props.campaign.traffic_source || '',
      parentAdGroups: props.adgroup,
    },
  },
])

const rowData = ref<any[]>([])

// Cấu hình mặc định cho columns
const defaultColDef = ref({
  resizable: true,
  sortable: true,
  filter: false,
})

const openModal = () => {
  store.isModal = true
}

const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'multiRow',
  checkboxes: false,
  headerCheckbox: false,
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>
<template>
  <n-modal
    preset="dialog"
    v-model:show="store.showModalLocation"
    type="success"
    :closable="false"
    :show-icon="false"
    class="modal-add-country"
    style="width: 1080px; height: 95vh; padding: 0"
    :close-on-esc="true"
    :mask-closable="true"
  >
    <n-card class="h-16" embedded
      ><div class="flex items-center gap-2 text-xl h-full select-none">
        Country preset ({{
          helper.capitalizeFirstLetter(props.campaign.traffic_source)
        }})
        <n-icon
          size="26"
          class="ml-auto button-editor-image cursor-pointer not-filter-icon"
          @click="store.showModalLocation = false"
          ><Close
        /></n-icon></div
    ></n-card>

    <n-card class="form-general" :bordered="false">
      <template class="flex gap-4 flex-col">
        <div style="height: calc(100% - 2rem)">
          <div class="flex gap-1 justify-between items-center">
            <n-button-group class="ml-auto">
              <n-button
                @click="() => store.handleTabChange('new')"
                type="primary"
                ghost
              >
                Create new
              </n-button>
            </n-button-group>
          </div>

          <div>
            <div class="mb-2">
              <span>Name</span> <span class="required"></span>
              <n-input
                v-model:value="presetName"
                :placeholder="'Enter name'"
                class="field-input"
              />
            </div>

            <span>Countries</span> <span class="required"></span>
            <div class="flex gap-2" style="align-items: flex-start">
              <div style="flex: 1; min-width: 0">
                <n-select
                  v-model:value="presetSelectedValues"
                  filterable
                  multiple
                  clearable
                  value-field="value"
                  label-field="name"
                  placeholder="Please select"
                  :options="optionsWithDisabled"
                  class="field-select"
                  max-tag-count="responsive"
                  :filter="filterHandle"
                />
              </div>

              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    class="min-w-28"
                    style="flex-shrink: 0"
                    @click="openModal"
                  >
                    Bulk Entry
                  </n-button>
                </template>
                <span
                  >Enter multiple country codes or names separated by commas or
                  lines.</span
                >
              </n-tooltip>
            </div>

            <ModalBulkEntryLocation
              :options="optionsWithDisabled"
              :selected-val="presetSelectedValues"
              @update:selected-values="presetSelectedValues = $event"
            />
          </div>

          <div class="mt-3 flex justify-end">
            <n-button
              color="#f43f5e"
              type="success"
              class="save-button"
              @click="SavePresetLocation"
              :loading="isLoading"
            >
              Save
            </n-button>
          </div>
        </div>
      </template>
    </n-card>
    <n-card
      :bordered="false"
      role="dialog"
      aria-modal="true"
      style="height: calc(-19rem + 95vh)"
    >
      <n-spin :show="isLoadingTable" style="min-height: 500px">
        <div class="ag-grid-wrapper">
          <ag-grid-vue
            style="height: calc(-22rem + 95vh); width: 100%"
            :theme="customTheme"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :defaultColDef="defaultColDef"
            :components="components"
            :pagination="false"
            :suppressPaginationPanel="true"
            :rowSelection="rowSelection"
            :domLayout="'normal'"
            :alwaysShowHorizontalScroll="false"
          ></ag-grid-vue>
        </div>
      </n-spin>
    </n-card>
  </n-modal>
</template>
<style lang="scss">
.ag-grid-wrapper {
  height: 100%;
  width: 100%;
  overflow: hidden;
  position: relative;
}

.modal-add-country {
  .n-dialog__content {
    margin: 0;
  }
  .form-general .n-card__content:first-child {
    padding-top: 10px;
  }
}

.ag-action-button svg {
  display: block;
  width: 16px;
  height: 16px;
}
</style>
