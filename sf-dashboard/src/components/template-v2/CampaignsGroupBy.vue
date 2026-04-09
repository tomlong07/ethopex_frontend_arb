<script setup lang="ts">
import ViewModel from '@/components/template-v2/ViewModel.vue'

import GroupDate from '@/components/template-v2/date/GroupDate.vue'

import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import { IconTrafficSourcesCDN } from '@/map/campaign'

import useGeneralStore from '@/store/useGeneralStore'
const generalStore = useGeneralStore()

const templateV2Store = useTemplateV2(helper.truePath())()

const isShowModal = ref<boolean>(false)

const onClickCampaignV2 = (item: TSAdd, event: MouseEvent) => {
  if (!item.value || !item.url) return
  isShowModal.value = true
  const url = item.url
  if (!url) return
  // Check if Ctrl, Command, or middle click
  if (event.ctrlKey || event.metaKey || event.button === 1) {
    window.open(url, '_blank')
  } else {
    window.router.push({ path: url })
    isShowModal.value = false
  }
}

interface TSAdd {
  value: string
  label: string
  url: string
  logo?: string
  logoSize: string
}

const trafficSourceAdd = ref<TSAdd[]>([])

const fetchListAddCampaign = async () => {
  if (!templateV2Store.baseConfigs.url) return
  const result = await ctr_filter_v2.TrafficSourceAddCampaign(
    templateV2Store.baseConfigs.url
  )

  trafficSourceAdd.value = result?.data || []
}

onMounted(async () => {
  fetchListAddCampaign()
})
watch(isShowModal, async (value) => {
  const app = document.querySelector('#arb-app')
  if (value) {
    await nextTick() // Chờ modal render xong
    app?.setAttribute('inert', '')
    // Focus phần tử trong modal (ví dụ nút đóng, thẻ tiêu đề, v.v.)
    const modal = document.querySelector('[role="dialog"]') as HTMLElement
    if (modal) {
      modal.focus() // Thêm tabindex="-1" cho <n-card> hoặc phần tử chứa modal để nó focus được
    }
  } else {
    app?.removeAttribute('inert')
  }
})

const getInfo = (ts: string) => {
  return IconTrafficSourcesCDN[ts] || null
}
</script>

<template>
  <div
    class="flex justify-between relative bg-gray-100 main-group-child campaign-group-by"
  >
    <div class="flex">
      <div
        class="group-btn p-2 flex justify-start mx-2"
        v-if="templateV2Store.datePicker.hasDatePicker"
      >
        <GroupDate
          v-if="
            templateV2Store.datePicker.isDefault ||
            templateV2Store.datePicker.isThisMonth ||
            templateV2Store.datePicker.isMultiMonth
          "
          classContainer="flex-row"
        />
      </div>
      <ViewModel />
    </div>

    <div class="flex items-center py-2 pl-2" v-if="trafficSourceAdd.length">
      <n-button
        class="mr-4"
        color="#f43f5e"
        size="small"
        @click="isShowModal = true"
      >
        {{ templateV2Store.baseConfigs.addNameV2 }}
      </n-button>
    </div>
  </div>
  <n-modal v-model:show="isShowModal">
    <n-card
      style="width: 1000px"
      title="Select your Traffice Source you want create!"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      tabindex="-1"
    >
      <div class="grid grid-cols-4 gap-4">
        <div
          v-for="(item, index) in trafficSourceAdd"
          :key="index"
          class="border-exclude flex flex-col justify-center items-center mb-4 p-4 border-dotted border-2 border-gray-400 cursor-pointer rainbow"
          @click="(e) => onClickCampaignV2(item, e)"
          @mousedown.middle="(e) => onClickCampaignV2(item, e)"
        >
          <img
            class="rounded p-0.5"
            :style="
              generalStore.isDark ? { backgroundColor: 'white' } : undefined
            "
            :src="getInfo(item.value)?.URL()"
            :width="getInfo(item.value)?.size"
            :height="getInfo(item.value)?.size"
            loading="lazy"
          />
          <div class="text-lg font-semibold">{{ item.label }}</div>
        </div>
      </div>
    </n-card>
  </n-modal>
</template>
<style scoped lang="scss">
@use '@/css/CampaignGroupBy.scss';
</style>
