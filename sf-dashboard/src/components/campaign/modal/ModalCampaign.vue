<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3'
import { markRaw } from 'vue'
import Close from '@/assets/icons/Close.vue'
import {
  campaignTypeClass,
  presetCampaign,
} from '@/types/components/campaign-v2'
import { ONOFF } from '@/enum/campaign'
import { SelectOption } from 'naive-ui'
import helper from '@/utils/helper'
import { usePresetCampaign } from '@/store/campaign/usePresetCampaign'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import Checkmark from '@/assets/icons/Checkmark.vue'
import { debounceV2 } from '@/utils'
import ButtonSetCampaign from './cell/ButtonSetCampaign.vue'
import DefaultPresetCell from './cell/DefaultPresetCell.vue'
import { useDialog } from 'naive-ui'
import { ctr_campaign } from '@/services/ctr_campaign'
import { themeAlpine } from 'ag-grid-community'
const dialog = useDialog()

const store = usePresetCampaign()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const pixelOptions = ref<SelectOption[]>([])
const accountOpts = ref<SelectOption[]>([])

const isLoadingTable = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isLoadingPixel = ref<boolean>(false)

const page = ref(1)
const pageSize = ref(20)
const totalRecords = ref(0)

const presetName = ref<string>(props.campaign?.campaign_preset?.name || '')
const accountValue = ref<string>(
  props.campaign?.campaign_preset?.ad_account_name || ''
)
const defaultPreset = ref<ONOFF>(
  (props.campaign?.campaign_preset?.default_preset as ONOFF) ?? ONOFF.OFF
)
const accountAd = ref<string | null>(
  props.campaign?.campaign_preset?.ad_account || null
)
const pixel = ref<string | null>(props.campaign?.campaign_preset?.pixel || null)

const resetDefaults = () => {
  presetName.value = ''
  accountValue.value = ''
  accountAd.value = null
  pixel.value = null
  defaultPreset.value = ONOFF.OFF
}

const fetchAccounts = async (query?: string) => {
  try {
    isLoading.value = true
    const result = await ctr_traffic_source.GetAccountV2({
      object: props.campaign.traffic_source,
      id: undefined,
      q: query || '',
      limit: 100,
    })
    if (!result || !result.status) {
      accountAd.value = null
      accountOpts.value = []
      return
    }
    accountOpts.value = result?.data?.accounts || []
  } finally {
    isLoading.value = false
  }
}

// const convertAdAccount = (value: string) => {
//   if (!value) return ''
//   return accountOpts.value.find((item: any) => item.id === value)?.value
// }

const accountNow = computed<string>(() => {
  for (let index = 0; index < accountOpts.value.length; index++) {
    if (accountOpts.value[index].id === accountAd.value) {
      return accountOpts.value[index].value as string
    }
  }

  return ''
})

const isDisabledPixel = computed(() => {
  return !accountAd.value
})

const refetchAccounts = async () => {
  await helper.sleep(0)
  fetchAccounts()
}

const handleSearchAccounts = debounceV2(async (query: string) => {
  await fetchAccounts(query)
}, 500)

const fetchPixel = async (value: string) => {
  try {
    isLoadingPixel.value = true
    if (!value) return
    const result = await ctr_traffic_source.GetFacebookPixel({
      account_id: value,
    })
    if (result && result.status) {
      pixelOptions.value = (result?.data || []).map((item: any) => ({
        label: item.name,
        value: item.id,
      }))
    } else {
      pixelOptions.value = []
      pixel.value = null
    }
  } finally {
    isLoadingPixel.value = false
  }
}

const handleAccountChange = () => {
  pixel.value = null
}

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

// payload
const createPresetCampaignPayload = (): presetCampaign => {
  return {
    name: presetName.value || undefined,
    default_preset: defaultPreset.value,
    provider: props.campaign.traffic_source,
    ad_account: accountAd.value || undefined,
    pixel: pixel.value || undefined,
    ad_account_name: accountValue.value || undefined,
  }
}

const hasAnyOn = (excludeId?: number) => {
  const arr = Array.isArray(rowData?.value) ? rowData.value : []
  return arr.some(
    (item: any) => item?.default_preset === ONOFF.ON && item?.id !== excludeId
  )
}

const SavePresetCampaign = async () => {
  const payload = createPresetCampaignPayload()
  const willBeOn = payload.default_preset === ONOFF.ON

  const isUpdate = !!store.status
  const currentId = isUpdate ? store.editPreset?.id : undefined

  const needConfirm = willBeOn && hasAnyOn(currentId)

  if (needConfirm) {
    const confirmed = await store.confirmDefaultPreset(dialog)
    if (!confirmed) return
  }

  isLoading.value = true
  try {
    if (isUpdate) {
      const result = await ctr_campaign.UpdatePresetCampaign(currentId, payload)
      if (result && result.status) {
        window.message.success('Preset campaign updated successfully.')
        fetchPresetCampaign()
      }
    } else {
      const result = await ctr_campaign.AddPresetCampaign(payload)
      if (result && result.status) {
        window.message.success('Preset campaign saved successfully.')
        fetchPresetCampaign()
        resetDefaults()
      }
    }
  } finally {
    isLoading.value = false
  }
}

const handlePageSizeChange = async (size: number) => {
  page.value = 1 // reset về trang 1
  pageSize.value = size
  await fetchPresetCampaign()
}

const fetchPresetCampaign = async () => {
  try {
    isLoadingTable.value = true
    const result = await ctr_campaign.GetPresetCampaigns(
      props.campaign.traffic_source as string,
      {
        page: page.value || 1,
        size: pageSize.value,
      }
    )
    if (result?.status) {
      totalRecords.value = result.data.total || 0
      rowData.value = result.data.items || []
    } else {
      rowData.value = []
      totalRecords.value = 0
    }
  } finally {
    isLoadingTable.value = false
  }
}

watch(
  () => store.showModalLocation,
  async (val) => {
    if (val) {
      resetDefaults()
      isLoadingTable.value = true
      try {
        await fetchAccounts()
      } catch {}
      await fetchPresetCampaign()
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
    } else {
      resetDefaults()
    }
  }
)

watch(
  () => accountAd.value,
  (val) => {
    if (val) {
      // const isAccount = accountOpts.value.find((item: any) => item.id === val)
      fetchPixel(val as string)
    }
  }
)

watch(
  () => store.editPreset,
  async (val) => {
    const edit =
      val && (val as any).value !== undefined ? (val as any).value : val
    if (edit) {
      await fetchAccounts(edit.ad_account)
      presetName.value = edit.name || ''
      accountValue.value = edit.ad_account_name || ''
      accountAd.value = edit.ad_account || null
      pixel.value = edit.pixel || null
      defaultPreset.value = edit.default_preset || defaultPreset.value
    }
  }
)

// const convertPixel = (value: string) => {
//   if (!value) return ''
//   return pixelOptions.value.find((item) => item.id === value)?.name || ''
// }

const rowData = ref<any[]>([])

const components = {
  buttonSetCampaign: markRaw(ButtonSetCampaign),
  defaultPresetCell: markRaw(DefaultPresetCell),
}

const columnDefs = ref([
  {
    field: 'id',
    headerName: 'ID',
    width: 70,
    sortable: true,
    filter: false,
  },
  {
    field: 'name',
    headerName: 'Name',
    width: 220,
    sortable: true,
    filter: false,
  },
  {
    field: 'default_preset',
    headerName: 'Default Preset',
    width: 140,
    sortable: false,
    filter: false,
    cellRenderer: 'defaultPresetCell',
    cellRendererParams: {
      parentTrafficSource: props.campaign.traffic_source || '',
      fetchPresetCampaign: fetchPresetCampaign,
      resetDefaults: resetDefaults,
      allRowData: rowData,
    },
  },
  {
    field: 'ad_account_name',
    headerName: 'Ad Account',
    width: 420,
    sortable: false,
    filter: false,
  },
  {
    field: 'pixel_name',
    headerName: 'Pixel',
    width: 300,
    sortable: true,
    filter: false,
    // cellRenderer: (params: any) => {
    //   return convertPixel(params.value)
    // },
  },
  {
    field: 'action',
    headerName: 'Action',
    width: 160,
    sortable: false,
    filter: false,
    cellRenderer: 'buttonSetCampaign',
    cellRendererParams: {
      parentCampaign: props.campaign,
      parentTrafficSource: props.campaign.traffic_source || '',
      parentAdGroups: (props.campaign as any)?.ad_groups || [],
    },
  },
])

// Cấu hình mặc định cho columns
const defaultColDef = ref({
  resizable: true,
  sortable: true,
  filter: false,
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
    style="width: 1380px; height: 95vh; padding: 0"
    :close-on-esc="true"
    :mask-closable="true"
  >
    <n-card class="h-16" embedded
      ><div class="flex items-center gap-2 text-xl h-full select-none">
        Campaign preset ({{
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
            <!-- Name + Default Preset -->
            <div class="flex gap-4 mb-4">
              <div class="flex-1">
                <div class="mb-1">
                  <span>Name</span> <span class="required"></span>
                </div>
                <n-input
                  v-model:value="presetName"
                  placeholder="Enter name"
                  class="field-input w-full"
                />
                <n-input
                  v-model:value="accountNow"
                  placeholder="Enter account "
                  class="field-input w-full hidden"
                />
              </div>
              <div class="flex-1">
                <div class="mb-1">
                  <span>Default Preset</span>
                </div>
                <n-switch
                  v-model:value="defaultPreset"
                  checked-value="on"
                  unchecked-value="off"
                >
                  <template #checked-icon>
                    <n-icon :component="Checkmark" color="#121212" />
                  </template>
                  <template #unchecked-icon>
                    <n-icon :component="Close" />
                  </template>
                </n-switch>
              </div>
            </div>

            <!-- Ad Account + pixel -->
            <div class="flex gap-4">
              <div class="flex-1">
                <div class="mb-1">
                  <span>Ad Account</span><span class="required"></span>
                </div>
                <n-select
                  v-model:value="accountAd"
                  filterable
                  remote
                  value-field="id"
                  label-field="name"
                  :loading="isLoading"
                  placeholder="Select ad account"
                  :options="accountOpts"
                  clearable
                  :on-clear="refetchAccounts"
                  @search="handleSearchAccounts"
                  @update:value="handleAccountChange"
                />
              </div>
              <div class="flex-1">
                <div class="mb-1">
                  <span>Pixel</span><span class="required"></span>
                </div>
                <n-select
                  v-model:value="pixel"
                  filterable
                  clearable
                  placeholder="Select pixel"
                  :options="pixelOptions"
                  class="field-select w-full"
                  :loading="isLoadingPixel"
                  :disabled="isDisabledPixel"
                  :max-tag-count="1"
                  :filter="filterHandle"
                />
              </div>
            </div>
          </div>

          <div class="mt-3 flex justify-end">
            <n-button
              color="#f43f5e"
              type="success"
              class="save-button"
              @click="SavePresetCampaign"
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
      style="height: calc(-18rem + 93vh)"
    >
      <n-spin
        :show="isLoadingTable || store.isLoadingPixel"
        style="min-height: 500px"
      >
        <div class="ag-grid-wrapper">
          <ag-grid-vue
            style="height: calc(-23rem + 93vh); width: 100%"
            :theme="customTheme"
            :columnDefs="columnDefs"
            :rowData="rowData"
            :defaultColDef="defaultColDef"
            :components="components"
            :pagination="false"
            :suppressPaginationPanel="true"
            :rowSelection="'single'"
            :domLayout="'normal'"
            :alwaysShowHorizontalScroll="false"
          >
          </ag-grid-vue>
          <div class="flex justify-end items-center bg-card py-3">
            <n-pagination
              v-model:page="page"
              v-model:page-size="pageSize"
              :item-count="totalRecords"
              :page-sizes="[10, 40, 100, 200]"
              show-size-picker
              @update:page="fetchPresetCampaign"
              @update:page-size="handlePageSizeChange"
            />
          </div>
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
