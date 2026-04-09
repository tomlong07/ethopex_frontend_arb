<script setup lang="ts">
import { pixelTrigger } from '@/types/components/pixel_manager'
import BackPage from '@/components/common/BackPage.vue'

import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'

import { ctr_pixel_trigger } from '@/services/ctr_pixel_trigger'
import ctr_demand_source from '@/services/ctr_demand_source'
import { ctr_category } from '@/services/ctr_category'
import { ctr_account } from '@/services/ctr_account'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import AdAccount from '@/components/pixel_triggers_detail/pixelAdAccount.vue'
import Campaigns from '@/components/pixel_triggers_detail/pixelCampaigns.vue'
import Ids from '@/components/pixel_triggers_detail/pixelIds.vue'
import Name from '@/components/pixel_triggers_detail/pixelName.vue'
import Triggers from '@/components/pixel_triggers_detail/pixelTriggers.vue'
import Publisher from '@/components/pixel_triggers_detail/Publisher.vue'
const usePixelTriggersDetail = PixelTriggersDetail()
if (usePixelTriggersDetail.isAddPage) {
  usePixelTriggersDetail.clearData()
}
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const name = 'pixel trigger'

const isSubmitBtnLoading = ref<boolean>(false)
const duplicateId = computed<number>(() =>
  Number(window.route.query.duplicate || 0)
)

const payload = computed(() => {
  const obj = helper.clone(usePixelTriggersDetail.pixelConfig)
  let pl = {
    name: obj.name,
    pixel_ids: obj.pixel_ids,
    status: obj.status,
    triggers: [] as any[],
    publisher: obj.publisher,
  }

  obj.triggers.forEach((element: pixelTrigger) => {
    //Loại các giá trị không chọn
    if (!element.field || !element.value || !element.value.length) {
      return
    }
    pl.triggers.push({
      field: element.field,
      condition: element.condition,
      value: element.value.map(String),
    })
  })
  return pl
})

const textShow = computed<string>(() => {
  return usePixelTriggersDetail.isAddPage ? 'Add' : 'Edit'
})

onMounted(async () => {
  usePixelTriggersDetail.isLoading = true
  if (usePixelTriggersDetail.isEditPage) {
    //get demand config by id
    const result = await ctr_pixel_trigger.GetByID(usePixelTriggersDetail.id)
    if (result?.status) {
      const rawData = result.data

      usePixelTriggersDetail.pixelConfig = {
        name: rawData.name,
        status: rawData.status,
        pixel_ids: JSON.parse(rawData.pixel_ids),
        triggers: [],
        publisher: rawData.publisher || null,
      }

      try {
        rawData.triggers.forEach((element: any) => {
          let valueNow = element.value
          if (
            element.value &&
            element.value.length &&
            (element.field == 'category' || element.field == 'campaign')
          ) {
            valueNow = element.value.map(Number)
          }
          usePixelTriggersDetail.pixelConfig.triggers.push({
            field: element.field,
            condition: element.condition,
            value: valueNow,
          })
        })
      } catch (error) {
        console.error(error)
      }
    } else {
      usePixelTriggersDetail.isDisable = true
    }
  }
  if (duplicateId.value) {
    await fetchDuplicate()
  }
  getListTrafficSource()
  getListDemandSource()
  getListCategory()
  getListMcc()
  getListCountry()
  if (usePixelTriggersDetail.isEditPage) {
    usePixelTriggersDetail.getListCampaignsByTrigger()
  }

  usePixelTriggersDetail.isLoading = false
})

const getListTrafficSource = async () => {
  usePixelTriggersDetail.optionPixel.trafficSource = []
  let fetchTraffic = await ctr_traffic_source.GetAllTrafficSource()
  usePixelTriggersDetail.optionPixel.trafficSource =
    fetchTraffic?.data?.traffic_sources || []
}

const getListDemandSource = async () => {
  const result = await ctr_demand_source.GetAllDemandSource()

  usePixelTriggersDetail.optionPixel.demandSource =
    result?.data?.demand_sources || []
}

const getListCategory = async () => {
  const res = await ctr_category.getCategoryIAB()
  usePixelTriggersDetail.optionPixel.pixelCategoryOptions = res?.data || []
}
const getListMcc = async (opts = { q: '' } as { q: string }) => {
  let res = (await ctr_account.GetAllMCC(opts.q)) || []

  usePixelTriggersDetail.optionPixel.Mccs = []

  if (res?.data) {
    for (let index = 0; index < res.data.length; index++) {
      const element = res.data[index]

      usePixelTriggersDetail.optionPixel.Mccs.push({
        name: element.id + '-' + element.account_id + '-' + element.name,
        id: String(element.id),
      })
    }
  }
}

const getListCountry = async (opts = { q: '' } as { q: string }) => {
  let res = (await ctr_traffic_source.GetCountries(opts.q)) || []

  usePixelTriggersDetail.optionPixel.countryOptions = []

  if (res?.data) {
    for (let index = 0; index < res.data?.coutries?.length; index++) {
      const element = res?.data?.coutries[index]

      if (element.value === 'ALL') continue

      usePixelTriggersDetail.optionPixel.countryOptions.push({
        name: element.name,
        id: element.value,
      })
    }
  }
}

const fetchDuplicate = async () => {
  const result = await ctr_pixel_trigger.GetByID(duplicateId.value)
  if (result?.status) {
    const rawData = result.data

    usePixelTriggersDetail.pixelConfig = {
      name: rawData.name,
      status: rawData.status,
      pixel_ids: JSON.parse(rawData.pixel_ids),
      triggers: [],
      publisher: rawData.publisher,
    }

    try {
      rawData.triggers.forEach((element: any) => {
        let valueNow = element.value
        if (
          element.value &&
          element.value.length &&
          (element.field == 'category' || element.field == 'campaign')
        ) {
          valueNow = element.value.map(Number)
        }
        usePixelTriggersDetail.pixelConfig.triggers.push({
          field: element.field,
          condition: element.condition,
          value: valueNow,
        })
      })
    } catch (error) {
      console.error(error)
    }
  } else {
    usePixelTriggersDetail.isDisable = true
  }
}

const submitForm = async () => {
  if (usePixelTriggersDetail.pixelConfig.name == '') {
    window.message.error(`Submit failed: Name is required`)
    isSubmitBtnLoading.value = false
    return
  }

  isSubmitBtnLoading.value = true
  if (usePixelTriggersDetail.isAddPage) {
    const result = await ctr_pixel_trigger.Add(payload.value)
    if (result?.status) {
      window.message.success('Add pixel trigger successfully')
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (usePixelTriggersDetail.isEditPage) {
    const result = await ctr_pixel_trigger.Edit(
      usePixelTriggersDetail.id,
      payload.value
    )
    if (result?.status) {
      window.message.success('Update pixel successfully')
    }
  }

  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 gap-4">
    <BackPage
      :url="feSettings?.page_list"
      :name="name"
      v-if="feSettings?.page_list"
      class="mt-6"
    />
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <div class="flex flex-col bg-base flex-1 gap-4">
          <n-grid x-gap="14" y-gap="14" :cols="1">
            <n-gi class="flex flex-col gap-4">
              <n-card
                :title="`${textShow} ${name}`"
                class="card-flex-gap-4 rounded-xl"
              >
                <Name />
                <PixelTriggerStatus />
                <Publisher />
              </n-card>
              <n-card title="Pixels" class="rounded-xl">
                <Ids />
              </n-card>
              <n-card
                title="Triggers"
                class="mb-4 mt-4 card-rule-condition rounded-xl"
              >
                <Triggers />
              </n-card>
            </n-gi>
          </n-grid>
          <Campaigns />
          <AdAccount />
        </div>
        <div class="flex flex-row-reverse sticky bottom-0 right-1 py-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="usePixelTriggersDetail.isDisable"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }

  .dynamic-button {
    padding: 0 0.5rem;
  }
}
</style>
