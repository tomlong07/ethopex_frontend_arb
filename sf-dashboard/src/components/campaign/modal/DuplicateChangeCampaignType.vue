<script setup lang="ts">
import duplicateChangeCampaignType from '@/store/campaign/duplicateChangeCampaignType'
import {
  campaignTypeClass,
  newCampaignClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_campaign } from '@/services/ctr_campaign'
import { CAMP_TYPE, TS } from '@/enum/campaign'
import Close2 from '@/assets/icons/Close2.vue'

const templateV2Store = useTemplateV2(helper.truePath())()

const duplicateChangeCampaignTypeStore = duplicateChangeCampaignType()

const offModal = () => {
  duplicateChangeCampaignTypeStore.showModal = false
}

const campaign = ref<campaignTypeClass>(newCampaignClass(TS.GOOGLE))

const campaignType = ref<string>(CAMP_TYPE.DEMANDGEN)
const isSubmitting = ref<boolean>(false)

const optionsCampaignType: SelectOption[] = [
  //   { label: 'Performance Max', value: CAMP_TYPE.PERFORMANCEMAX },
  { label: 'Demand Gen', value: CAMP_TYPE.DEMANDGEN },
]

const payload = computed<any>(() => {
  let payload = helper.clone(campaign.value)

  payload.clone_by_id = duplicateChangeCampaignTypeStore.campaignOriginal
  payload.change_campaign_type = campaignType.value

  return payload
})

const actionNow = async () => {
  isSubmitting.value = true
  const result = await ctr_campaign.Duplicate(
    duplicateChangeCampaignTypeStore.campaignOriginal
  )

  if (result?.status) {
    campaign.value = new campaignTypeClass(result?.data || {})
    campaign.value.HandleDuplicate()

    const resultCreateCampaign = await ctr_campaign.DuplicateCampaignCustom(
      payload.value
    )

    if (resultCreateCampaign?.status) {
      window.message.success('Duplicate campaign successfully')
      if (resultCreateCampaign?.data) {
        window.open(`/campaign/google/${resultCreateCampaign?.data}`, '_blank')
      }

      templateV2Store.reInitTable()
    }
  }

  isSubmitting.value = false
  duplicateChangeCampaignTypeStore.showModal = false
}
</script>

<template>
  <div>
    <n-modal
      v-model:show="duplicateChangeCampaignTypeStore.showModal"
      style="height: 200px; width: 600px"
      class="p-2"
    >
      <n-card
        :bordered="false"
        size="huge"
        role="dialog"
        aria-modal="true"
        content-style="padding: 12px;display:flex;flex-direction: column;gap:2rem"
      >
        <n-card :bordered="false" content-style="padding: 0px" class="h-9"
          ><div class="flex">
            <div class="font-medium text-lg">
              Duplicate campaign change campaign type
            </div>
            <n-icon
              size="26"
              class="ml-auto button-close cursor-pointer"
              @click="offModal"
              ><Close2
            /></n-icon></div
        ></n-card>
        <n-card :bordered="false" content-style="padding: 0px">
          <!-- 2 * h-9 + 2 *p-2 + 2* padding 12 + gap: 2rem *2-->
          <div class="flex gap-4 flex-col">
            <div class="flex items-center gap-2">
              <div class="w-32 font-bold">Campaign Type</div>
              <div class="flex-1 min-w-0 flex gap-4">
                <n-select
                  :options="optionsCampaignType"
                  v-model:value="campaignType"
                ></n-select>

                <n-button
                  color="#f43f5e"
                  size="medium"
                  type="success"
                  :loading="isSubmitting"
                  @click="actionNow"
                  >Create Campaign</n-button
                >
              </div>
            </div>
          </div>
        </n-card>
      </n-card>
    </n-modal>
  </div>
</template>
