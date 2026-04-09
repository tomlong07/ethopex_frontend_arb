<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import useGeneralStore from '@/store/useGeneralStore'
import { ctr_campaign } from '@/services/ctr_campaign'
import Close2 from '@/assets/icons/Close2.vue'
import { ONOFF, TS } from '@/enum/campaign'

const generalStore = useGeneralStore()

const traffic_source = ref<string | undefined>()

const trafficSourceNow = computed<SelectOption | undefined>(() => {
  return (
    trafficSourceOptions.value.find(
      (item) => item.value === traffic_source.value
    ) || undefined
  )
})

const isLoadingDivCreative = ref<boolean>(false)
const isCreatingCreative = ref<boolean>(false)

const offModal = () => {
  generalStore.changeModalCopyCampaign(false)
}

const showModalCopyCampaign = computed<boolean>(() => {
  return generalStore.showModalCopyCampaign
})

watch(showModalCopyCampaign, async (newValue, oldValue) => {
  if (newValue === true) {
    if (generalStore.sourceCopyCampaign?.traffic_source) {
      const result = await ctr_campaign.GetCopySource(
        generalStore.sourceCopyCampaign?.traffic_source
      )
      trafficSourceOptions.value = result?.data || []
    }
  }
})

const trafficSourceOptions = ref<SelectOption[]>([])

const textCopyCampaign = computed<string>(() => {
  let text = '...' as string

  if (traffic_source.value) {
    text = traffic_source.value
    trafficSourceOptions.value.find((item) => {
      if (item.value === traffic_source.value) {
        text = item.label as string
      }
    })
  }
  return (
    ': ' +
    helper.capitalizeFirstLetter(
      generalStore.sourceCopyCampaign?.traffic_source || ''
    ) +
    ' to ' +
    text
  )
})

const openDuplicateCampaign = async () => {
  if (!trafficSourceNow.value) {
    return
  }

  const traffic_source_query =
    trafficSourceNow.value.is_general === ONOFF.ON &&
    trafficSourceNow.value.value !== TS.SNAPCHAT
      ? 'general'
      : traffic_source.value

  let url = `/campaign/${traffic_source_query}/add?copy=true&duplicate=${generalStore.sourceCopyCampaign?.id}&traffic_source=${traffic_source.value}`

  window.open(url, '_blank')

  offModal()
}
</script>
<template>
  <div>
    <n-modal
      v-model:show="generalStore.showModalCopyCampaign"
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
              Copy Campaign {{ textCopyCampaign }}
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
              <div class="w-1/6 font-bold">Traffic Source</div>
              <div class="w-5/6 flex gap-4">
                <n-select
                  :options="trafficSourceOptions"
                  v-model:value="traffic_source"
                ></n-select>

                <n-button
                  color="#f43f5e"
                  size="medium"
                  type="success"
                  :loading="isCreatingCreative"
                  :disabled="isLoadingDivCreative || !traffic_source"
                  @click="openDuplicateCampaign"
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
