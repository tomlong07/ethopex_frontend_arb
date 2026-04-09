<script setup lang="ts">
import { fixDataHandle } from '@/components/campaign/help/FixData'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import { ctr_campaign } from '@/services/ctr_campaign'
import { CellComponent } from 'tabulator-tables'
import Logging from '@/utils/Log'
import Skeleton from '../skeleton/Skeleton.vue'

import BiddingAndBudget from '@/components/campaign/modules/facebook/BiddingAndBudget.vue'
import AdGroupBiddingAndBudget from '@/components/campaign/modules/facebook/AdGroupBiddingAndBudget.vue'

const showModal = ref(false)
const isLoading = ref(false)
const selectedAdgroupId = ref()
const originRow = ref()

const campaign = ref<campaignTypeClass>(new campaignTypeClass({}))
const originCampaign = ref<campaignTypeClass>(new campaignTypeClass({}))

const isSubmit = ref(false)
const cellRef = ref<CellComponent | null>(null)
//Truyền vào data rỗng để tránh validate (đã validate campaign manual ko hiển thị modal rồi)
const FreezeData = new FreezeClass({ params: {}, query: {} } as any)

const setCell = (cell: CellComponent) => {
  if (cell) cellRef.value = cell
}

// !! Func
const changeDataRow = async (value: any) => {
  originRow.value = value
  selectedAdgroupId.value = undefined
  if (!value.campaign_name?.id) return

  campaign.value = new campaignTypeClass({ id: value.campaign_name?.id })
  getCampaignByID(value.campaign_name?.id)

  if (value.ad_group?.id) {
    selectedAdgroupId.value = value.ad_group.id
  }

  showModal.value = true
}

const payload = computed(() => {
  if (campaign.value.IsOffAdvantageCampaignBudget()) {
    if (
      !campaign.value.ad_groups?.length ||
      !originCampaign.value?.ad_groups?.length
    ) {
      window.message.error('No ad groups available to update!')
      return []
    }

    // Tạo map để tra cứu nhanh ad group gốc theo id
    const originAdGroupsMap = new Map(
      originCampaign.value.ad_groups.map((ag) => [ag.id, ag])
    )
    let pl: any[] = []

    campaign.value.ad_groups?.forEach((currentAdGroup) => {
      const originAdGroup = originAdGroupsMap.get(currentAdGroup.id)

      if (!originAdGroup) return
      if (String(currentAdGroup.bidding) !== String(originAdGroup.bidding)) {
        pl.push({
          campaign_id: campaign.value.id,
          adgroup_id: currentAdGroup.id,
          field: 'bidding',
          value: String(currentAdGroup.bidding),
        })
      }

      if (String(currentAdGroup.budget) !== String(originAdGroup.budget)) {
        pl.push({
          campaign_id: campaign.value.id,
          adgroup_id: currentAdGroup.id,
          field: 'budget',
          value: String(currentAdGroup.budget),
        })
      }
    })
    return pl
  }
  return [
    {
      campaign_id: campaign.value.id,
      field: 'bidding',
      value: String(campaign.value.bidding),
    },

    {
      campaign_id: campaign.value.id,
      field: 'budget',
      value: String(campaign.value.budget),
    },
  ]
})

const submitForm = async () => {
  if (!campaign.value.id) return

  if (!payload.value.length) {
    showModal.value = false

    return
  }

  isSubmit.value = true

  const result = await ctr_campaign.UpdateField(payload.value)

  if (result?.status) {
    window.message.success('Update success')
    const row = cellRef.value?.getRow()
    if (row) {
      const row = cellRef.value?.getRow()
      if (!row) return

      if (campaign.value.IsOnAdvantageCampaignBudget()) {
        const old = row.getData().campaign_name || {}

        const newValue = {
          bidding: campaign.value.bidding,
          budget: campaign.value.budget,
        }

        const updateValue = { ...old, ...newValue }

        try {
          row.update({ campaign_name: updateValue })
          cellRef.value?.setValue(updateValue, true)
        } catch (error) {
          Logging.error('[submitForm] Error updating row data:', error)
        }
      } else {
        const old = row.getData().ad_group || {}

        if (old.id) {
          const newValue: Record<string, any> = {}
          payload.value.forEach((element) => {
            if (element.field === 'budget') {
              newValue.budget = Number(element.value)
            }

            if (element.field === 'bidding') {
              newValue.bidding = element.value
            }
          })
          const updateValue = { ...old, ...newValue }

          try {
            row.update({ ad_group: updateValue })
            cellRef.value?.setValue(updateValue, true)

            const cellsToForce = [row.getCell('ad_group_budget')]

            cellsToForce.forEach((cell) => {
              if (cell) cell.setValue(cell.getValue(), true) // truyền lại chính value cũ + true để force redraw
            })
          } catch (error) {
            Logging.error('[submitForm] Error updating row data:', error)
          }
        }
      }
    }

    showModal.value = false
  }

  isSubmit.value = false
}

defineExpose({
  setCell,
  changeDataRow,
})

const getCampaignByID = async (id: number) => {
  isLoading.value = true
  try {
    const result = await ctr_campaign.GetByID(id)
    campaign.value = new campaignTypeClass(result?.data || {})
    fixDataHandle(campaign)

    originCampaign.value = new campaignTypeClass(result?.data || {})
    fixDataHandle(originCampaign)

    if (campaign.value.ad_groups?.length && !selectedAdgroupId.value) {
      selectedAdgroupId.value = campaign.value.ad_groups[0].id
    }
  } finally {
    isLoading.value = false
  }
  return null
}

const selectedAdgroup = computed(() =>
  campaign.value.ad_groups?.find((x) => x.id === selectedAdgroupId.value)
)

const setToAllAdgroups = (adgroup: any) => {
  if (!campaign.value.ad_groups) return
  campaign.value.ad_groups.forEach((ag) => {
    ag.budget = adgroup.budget
    ag.bidding = adgroup.bidding
  })
}
</script>

<template>
  <n-modal
    v-model:show="showModal"
    size="huge"
    aria-modal="true"
    preset="dialog"
    :show-icon="false"
    style="width: 900px; height: 400px"
    title="Change Info"
  >
    <div class="flex flex-col h-[320px]">
      <Skeleton v-if="isLoading" :numberLoop="2" />

      <div v-else class="flex-1 overflow-y-auto scroll-thin-custom px-1 pt-2">
        <n-card v-if="campaign.advantage_campaign_budget">
          <BiddingAndBudget
            :campaign="campaign"
            :FreezeData="FreezeData"
            v-if="campaign.IsOnAdvantageCampaignBudget()"
          />

          <div v-else class="flex flex-col gap-4">
            <n-tabs
              v-model:value="selectedAdgroupId"
              type="card"
              animated
              size="large"
              class="w-full"
              tab-style="max-width: 140px; padding: 8px;"
            >
              <n-tab-pane
                v-for="(item, index) in campaign.ad_groups"
                :key="String(item.id || '') + index"
                :name="Number(item.id)"
              >
                <template #tab>
                  <div class="truncate max-w-[120px] text-sm">
                    {{ item.name }}
                  </div>
                </template>
              </n-tab-pane>
            </n-tabs>

            <div class="flex flex-col gap-4 px-2" v-if="selectedAdgroup">
              <h3
                class="font-semibold text-md mb-2 truncate"
                :title="selectedAdgroup.name"
              >
                {{ selectedAdgroup.name }}
              </h3>

              <div>
                <!-- Ở report luôn là trường hợp edit nên luôn ko đc sửa budget type -->
                <AdGroupBiddingAndBudget
                  :adgroup="selectedAdgroup"
                  :campaign="campaign"
                  :isEditPage="true"
                />
              </div>

              <n-button
                type="primary"
                class="w-32"
                size="small"
                v-if="
                  campaign.ad_groups?.length && campaign.ad_groups?.length > 1
                "
                @click="setToAllAdgroups(selectedAdgroup)"
                >Apply to All</n-button
              >
            </div>
          </div>
        </n-card>

        <n-card v-else> No Data </n-card>
      </div>

      <div class="flex justify-end mt-4">
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
    </div>
  </n-modal>
</template>
