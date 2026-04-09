<template>
  <div
    ref="el"
    class="repor-bulk-action fixed z-50 shadow-2xl cursor-move bg-white rounded-lg"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
      border: generalStore.isDark ? '1px solid #797979' : 'none',
    }"
    @mousedown="startDrag"
    @touchstart="startTouchDrag"
  >
    <div
      class="flex justify-between bg-[#2d5bc8e3] items-center py-1 px-3 rounded-t-lg"
    >
      <div class="text-white font-medium text-xs">Bulk Action</div>
      <button
        class="ml-2 w-6 h-6 flex items-center justify-center rounded-full text-white transition-colors duration-200 hover:bg-blue-700 hover:text-white"
        @click="closeBulkStatus"
      >
        ✕
      </button>
    </div>

    <div class="py-2 px-2 space-y-4">
      <div class="flex justify-center items-center">
        <n-space>
          <template v-for="(btn, index) in bulkButtons" :key="index">
            <n-button
              v-if="btn.show && !btn.isPopover"
              round
              strong
              secondary
              :type="btn.type"
              :style="{ color: btn.color }"
              size="small"
              @click="btn.action"
              :class="{ 'custom-css': btn.isCustomCss }"
            >
              {{ btn.label }}
            </n-button>

            <n-popover
              v-if="btn.show && btn.isPopover"
              trigger="click"
              ref="appendPopover"
            >
              <template #trigger>
                <n-button type="info" size="small" round strong secondary>
                  {{ btn.label }}
                </n-button>
              </template>
              <div class="flex items-center gap-2">
                <n-input
                  v-model:value="appendText"
                  type="text"
                  placeholder="Campaign name…"
                  class="w-40"
                  size="small"
                />
                <n-button
                  size="small"
                  type="primary"
                  @click="bulkAppendNameCampaigns"
                >
                  Apply
                </n-button>
              </div>
            </n-popover>
          </template>
        </n-space>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useDraggable } from '@/composables/useDraggable'
import { ctr_campaign } from '@/services/ctr_campaign'
import { useReportV2 } from '@/store/report/report-v2'
import useGeneralStore from '@/store/useGeneralStore'
import { Tabulator } from 'tabulator-tables'
import type { PopoverInst } from 'naive-ui'

interface Props {
  tabulator: Tabulator | null
}

const props = defineProps<Props>()

// !! Store
const reportStoreV2 = useReportV2(helper.truePath())()
const generalStore = useGeneralStore()

const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)

const bulkButtons = computed<any[]>(() => [
  {
    label: 'Off',
    type: 'error',
    action: () => bulkChangeStatus('off'),
    show: reportStoreV2.isGroupByCampaign,
  },
  {
    label: 'On',
    type: 'success',
    action: () => bulkChangeStatus('on'),
    show: reportStoreV2.isGroupByCampaign,
  },
  {
    label: 'Name',
    isPopover: true,
    show: reportStoreV2.isGroupByCampaign,
  },
  {
    label: ' Copy IDs',
    color: '#8a2be2',
    action: () => handleCopyField('campaign'),
    show: reportStoreV2.isGroupByCampaign,
    isCustomCss: true
  },
  {
    label: 'Copy KeyWord',
    color: '#8a2be2',
    action: () => handleCopyField('keyword'),
    show: reportStoreV2.isGroupByKeyword,
    isCustomCss: true
  },
  {
    label: 'Copy Geo',
    color: '#8a2be2',
    action: () => handleCopyField('geo'),
    show: reportStoreV2.isGroupByGeo,
    isCustomCss: true
  },
])

// !! State
const el = ref<HTMLElement | null>(null)
const { position, startDrag, startTouchDrag } = useDraggable(el, {
  offset: { left: isHardMenu.value ? 300 : 100, bottom: 8 },
})

const appendText = ref<string>('')
const appendPopover = ref<PopoverInst | null>(null)

// !! Helper
const getRowsData = () =>
  (props.tabulator?.getRows() || [])?.map((r) => r.getData())

const getSelectedCampaignIds = () => {
  const rowsData = getRowsData()
  return rowsData
    .filter((d) => d.selected && d.campaign_name?.id)
    .map((d) => d.campaign_name.id)
}
const getRowsForUpdate = () => props.tabulator?.getRows() || []

// !! Func
const bulkChangeStatus = async (status: string): Promise<void> => {
  const selectedIds = getSelectedCampaignIds()

  if (
    !window.confirm(
      `Are you sure you want to change status to "${
        status === 'on' ? 'On' : 'Off'
      }" for ${selectedIds.length} selected campaign(s)?`
    )
  )
    return

  const loading = window.message.loading('Changing is on process. Please wait!')
  try {
    const { status: ok, data } = (await ctr_campaign.BulkChangeStatus({
      ids: selectedIds,
      status,
    })) as any
    if (!ok) return
    window.message.success(data || 'Status updated successfully!')
  } catch (err) {
    console.error(err)
  } finally {
    loading.destroy()
  }
}

const bulkAppendNameCampaigns = async () => {
  const selectedIds = getSelectedCampaignIds()

  if (!selectedIds.length) {
    window.message.warning('No campaigns selected!')
    return
  }

  if (
    !window.confirm(
      `Are you sure you want to Append to ${selectedIds.length} campaign(s)?`
    )
  )
    return

  const loading = window.message.loading('Updating campaign names...')

  try {
    const { status: ok, data } = (await ctr_campaign.BulkAppendNameCampaigns({
      ids: selectedIds,
      append_text: appendText.value,
    })) as any

    if (!ok) {
      window.message.error('Failed to update campaign names!')
      return
    }

    getRowsForUpdate().forEach((row) => {
      const data = row.getData();
      if (selectedIds.includes(data.campaign_name?.id)) {
       
        data.campaign_name.name += appendText.value;

        const cellEl = row.getCell("campaign")?.getElement();
        if (cellEl) {
          cellEl.innerHTML = data.campaign_name.name;
        }
      }
    });

    window.message.success(data || 'Campaign names updated!')
    appendText.value = ''
  } catch (err) {
    console.error(err)
    window.message.error('Error while updating campaign names!')
  } finally {
    loading.destroy()
  }
}

const fieldExtractor: Record<'keyword' | 'geo' | 'campaign', (row: any) => any> = {
  keyword: (row) => row.keyword,
  geo: (row) => row.geo,
  campaign: (row) => row.campaign_name?.id,
}

const handleCopyField = (field: 'keyword' | 'geo' | 'campaign') => {
  const rowsData = getRowsData()
 
  const extractor = fieldExtractor[field]

  const values = rowsData
    .filter((d) => d.selected)
    .map(extractor)
    .filter(Boolean)
    .join(field === 'campaign' ? ',' : '\n')

  if (!values) {
    window.message.warning(`No ${field} selected!`)
    return
  }

  navigator.clipboard
    .writeText(values)
    .then(() => window.message.success(`Copied ${field}!`))
    .catch(() => window.message.error(`Failed to copy ${field}!`))
}


const closeBulkStatus = () => {
  reportStoreV2.toggleBulkAction()
}
</script>

<style scoped>
.repor-bulk-action {
  user-select: none;
  max-width: 600px;
  max-height: 80vh;
  overflow: hidden;
}

.custom-css:hover {
  background-color: rgba(46, 51, 56, 0.1);;;
  color: inherit;
}
.dark .n-button.custom-css {
  background-color: rgba(255, 255, 255, 0.1);
}
.dark .n-button.custom-css:hover {
  background-color: rgba(46, 51, 56, 1);
}
@media (max-width: 767px) {
  .repor-bulk-action {
    border-top: 4px solid #3b82f6;
  }
}
</style>
