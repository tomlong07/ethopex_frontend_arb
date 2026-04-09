<script setup lang="ts">
import { fixDataHandle } from '@/components/campaign/help/FixData'
import {
  AdFormatsRewarded,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'

import { useReportV2 } from '@/store/report/report-v2'
import { addTargetBlankToLinks } from '@/utils/utils'

import { useCkeditorLoader } from '@/composables/useCkeditorLoader'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TS } from '@/enum/campaign'
import AdFormatsConfig from '../campaign/modules/AdFormats.vue'
import { AdFormats, UnlockContentConfig } from '@/types/components/dialog'
import { CellComponent } from 'tabulator-tables'
import Logging from '@/utils/Log'

const CKEditor = defineAsyncComponent(() => import('../common/CKEditor.vue'))
const BiddingStrategy = defineAsyncComponent(
  () => import('@/components/campaign/modules/taboola/BiddingStrategy.vue')
)

const ConversionGoals = defineAsyncComponent(
  () => import('@/components/campaign/modules/google/ConversionGoals.vue')
)

// !! State

const modalBidding = ref(false)
const data = ref<campaignTypeClass>(new campaignTypeClass({}))
const statusData = ref(new StatusCampManager())
const reportStoreV2 = useReportV2(helper.truePath())()

const { loadCkeditorScript, initEditor } = useCkeditorLoader()
const noteDataEditorRef = ref<InstanceType<typeof CKEditor>>()
const noteData = ref<string>('')

const isSubmit = ref(false)
const cellRef = ref<CellComponent | null>(null)
//Truyền vào data rỗng để tránh validate (đã validate campaign manual ko hiển thị modal rồi)
const FreezeData = new FreezeClass({ params: {}, query: {} } as any)

const isAnt = window.arb.isAnt()

const initAdFormats = () => {
  return {
    display: new AdFormats({ hasDialog: false, hasType: true, status: 'on' }),
    anchor: new AdFormats({ hasDialog: false, hasType: false }),
    interstitial: new AdFormats({ hasDialog: false, hasType: false }),
    rewarded: new AdFormatsRewarded(),
    unlock_content: new UnlockContentConfig(),
  }
}

const setCell = (cell: CellComponent) => {
  if (cell) cellRef.value = cell
}

// !! Func
const changeDataRow = async (value: any) => {
  // Khởi tạo trước
  const adFormatsSafe = {
    ...initAdFormats(),
    ...value.campaign_name?.ad_formats,
    rewarded: {
      ...initAdFormats().rewarded,
      ...value.campaign_name?.ad_formats?.rewarded,
    },
    unlock_content: {
      ...initAdFormats().unlock_content,
      ...value.campaign_name?.ad_formats?.unlock_content,
    },
  }

  data.value = new campaignTypeClass({
    id: value.campaign_name?.id,
    create_campaign: value.campaign_name?.create_campaign,
    traffic_source: value.traffic_source as TS,
    demand_source: value.demand_source as TS,
    conversion_goals: value.campaign_name?.conversion_goals,
    ad_formats: adFormatsSafe,
    campaign_type: value.campaign_name?.campaign_type,
    min_epc: value.campaign_name?.min_epc,
    conversion_logic: value.campaign_name?.conversion_logic,
    bidding: value.campaign_name?.bidding,
    budget: value.campaign_name?.budget,
    bidding_status: value.campaign_name?.bidding_status,
    cpc: value.campaign_name?.cpc,
    // TS "taboola"
    budget_type: value.campaign_name?.budget_type,
    bidding_strategy: value.campaign_name?.bidding_strategy,
  })

  if (!reportStoreV2.mapCampaignInfo[value.campaign_name?.id]) {
    reportStoreV2.mapCampaignInfo[value.campaign_name?.id] = helper.clone(value)
  }

  if (data.value.IsManual() && data.value.IsTrafficTaboola()) return
  fixDataHandle(data)
  modalBidding.value = true
}

const payload = computed(() => {
  if (data.value.IsTrafficFacebook()) {
    return [
      {
        campaign_id: data.value.id,
        field: 'budget',
        value: String(data.value.budget),
        note: noteData.value,
      },
    ]
  }

  let pl = [
    {
      campaign_id: data.value.id,
      field: 'bidding',
      value: String(data.value.bidding),
      note: noteData.value,
    },
    {
      campaign_id: data.value.id,
      field: 'cpc',
      value: String(data.value.cpc),
      note: noteData.value,
    },
    {
      campaign_id: data.value.id,
      field: 'budget',
      value: String(data.value.budget),
      note: noteData.value,
    },
  ]

  if (isAnt && data.value) {
    pl.push(
      {
        campaign_id: data.value.id,
        field: 'ad_formats',
        value: data.value.ad_formats as any,
        note: noteData.value,
      },
      {
        campaign_id: data.value.id,
        field: 'conversion_logic',
        value: String(data.value.conversion_logic),
        note: noteData.value,
      },
      {
        campaign_id: data.value.id,
        field: 'min_epc',
        value: String(data.value.min_epc),
        note: noteData.value,
      }
    )
  }
  if (data.value.IsAPI()) {
    pl.push({
      campaign_id: data.value.id,
      field: 'conversion_goals',
      value: String(data.value.conversion_goals),
      note: noteData.value,
    })
  }
  return pl
})

const submitForm = async () => {
  isSubmit.value = true
  if (data.value.id) {
    const result = await ctr_campaign.UpdateField(payload.value)

    if (result?.status) {
      window.message.success('Update success')
      const row = cellRef.value?.getRow()
      if (row) {
        const old = row.getData().campaign_name || {}
        const updateValue = { ...old, ...data.value }

        try {
          row.update({ campaign_name: updateValue })
          // Force redraw các cell "cứng đầu"
          const cellsToForce = [
            row.getCell('bidding'),
            row.getCell('budget'),
            row.getCell('cpc'),
          ]

          cellsToForce.forEach((cell) => {
            if (cell) cell.setValue(cell.getValue(), true) // truyền lại chính value cũ + true để force redraw
          })
        } catch (error) {
          Logging.error('[submitForm] Error updating row data:', error)
        }
      }

      modalBidding.value = false
    }
  }

  isSubmit.value = false
}

const onChangeNoteDataEditor = (content: string) => {
  noteData.value = addTargetBlankToLinks(content)
}

const loadNoteDataEditor = async () => {
  try {
    await loadCkeditorScript()
    initEditor(noteDataEditorRef)
  } catch (error) {
    console.error('CKEditor load failed', error)
  }
}

defineExpose({
  setCell,
  changeDataRow,
})

// !! Lifecycle hook
watch(modalBidding, async (newVal) => {
  if (newVal) {
    loadNoteDataEditor()
    statusData.value.permission.label = true
  }
})
</script>

<template>
  <n-modal
    v-model:show="modalBidding"
    size="huge"
    aria-modal="true"
    preset="dialog"
    :show-icon="false"
    style="width: 900px; height: 720px"
    title="Change Info"
  >
    <div
      class="my-4 card-flex-gap-4 max-h-[580px] scroll-thin-custom overflow-y-scroll"
    >
      <n-card>
        <BiddingStrategy :campaign="data" v-if="data.IsTrafficTaboola()" />
        <CampaignTBBidding :campaign="data" v-if="data.IsTrafficTaboola()" />
        <CampaignGGBidding
          :campaign="data"
          v-if="data.IsTrafficGoogle()"
          :FreezeData="FreezeData"
        />

        <CampaignGGBudget
          :campaign="data"
          :FreezeData="FreezeData"
          v-if="data.IsTrafficGoogle()"
        />

        <ConversionGoals
          :campaign="data"
          :FreezeData="FreezeData"
          :isDisabled="true"
          v-if="data.IsTrafficGoogle()"
        />
        <CampaignModuleBudget :campaign="data" width="w-16" v-else />
        <AdFormatsConfig
          :campaign="data"
          :statusData="statusData"
          :stateLabel="reportStoreV2.reportFilterState"
          inModal
          v-if="isAnt"
        />
        <div class="flex flex-col gap-2" v-if="reportStoreV2.hasPermissionNote">
          <div class="w-16 text-xs font-semibold text-gray-500">Note</div>
          <div class="flex-1 min-w-0">
            <CKEditor
              id="noteDataEditor"
              ref="noteDataEditorRef"
              :initData="noteData"
              :autoInit="false"
              @changeEditor="onChangeNoteDataEditor"
              title="Note Data"
              :isOpenTool="false"
              :onlyColorToolbar="true"
            />
          </div>
        </div>
      </n-card>
    </div>

    <div class="flex flex-row-reverse bottom-4 z-10 sticky">
      <n-button
        color="#f43f5e"
        size="medium"
        type="success"
        :loading="isSubmit"
        @click="submitForm"
      >
        Submit
      </n-button>
    </div>
  </n-modal>
</template>
