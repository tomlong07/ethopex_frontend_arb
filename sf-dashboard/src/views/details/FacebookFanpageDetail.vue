<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import NameFanpage from '@/components/facebook_fanpage/NameFanpage.vue'
import ShowNameFanpage from '@/components/facebook_fanpage/ShowNameFanpage.vue'
import FanpageUrl from '@/components/facebook_fanpage/FanpageUrl.vue'
import FanpageId from '@/components/facebook_fanpage/FanpageId.vue'

import { ModeClassString, StatusClass } from '@/types/components/base'

import { facebookFanpageTypeArray } from '@/types/components/manager-facebook-fanpage'
import { ctr_supply_account } from '@/services/ctr_supply_account'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const modeData = helper.deepFreeze(
  new ModeClassString(window.route)
) as ModeClassString

const statusData = ref(new StatusClass('facebook fanpage'))

const dataConfig = ref(
  new facebookFanpageTypeArray({ traffic_source: 'facebook', status: 'on' })
)

const submitForm = async () => {
  statusData.value.isSubmitBtnLoading = true
  let result = await ctr_supply_account.SaveLinkPage(dataConfig.value)

  if (result?.status) {
    window.message.success(`Submit success!`)

    if (modeData.isAddPage() && feSettings.value?.page_list) {
      window.router.push({ path: feSettings.value.page_list })
    }
  }

  statusData.value.isSubmitBtnLoading = false
}

onMounted(async () => {
  statusData.value.isLoading = true

  if (modeData.isEditPage()) {
    const id = modeData.id
    const res = await ctr_supply_account.GetLinkPageByID(id)
    dataConfig.value = new facebookFanpageTypeArray(res?.data || {})
  }

  statusData.value.isLoading = false
})

const addMore = () => {
  dataConfig.value.addNewFB()
}
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 items-center">
    <div class="flex flex-col my-12 flex-1 gap-4 w-full lg:w-1/2">
      <BackPage
        :url="feSettings?.page_list"
        :name="statusData.name"
        v-if="feSettings?.page_list"
      />
      <Skeleton v-if="statusData.isLoading" />
      <n-grid x-gap="14" y-gap="14" cols="1" v-else class="">
        <n-gi class="flex flex-col gap-4">
          <n-card class="card-flex-gap-4">
            <div
              class="flex flex-col gap-4"
              v-for="(item, index) in dataConfig.items"
              :key="index"
            >
              <n-divider v-if="index !== 0" />

              <div class="ml-auto" v-if="dataConfig.items.length > 1">
                {{ index + 1 }}
              </div>

              <NameFanpage v-model="dataConfig.items[index].name" disabled />

              <ShowNameFanpage v-model="dataConfig.items[index].show_name" />

              <FanpageUrl v-model="dataConfig.items[index].link" disabled />

              <FanpageId v-model="dataConfig.items[index].post_id" disabled />
            </div>
            <n-button
              class="ml-auto"
              type="primary"
              @click="addMore"
              disabled
              v-if="modeData.isAddPage()"
            >
              Add</n-button
            >
          </n-card>
        </n-gi>
      </n-grid>
      <div class="flex flex-row-reverse sticky bottom-0 p-2">
        <div class="flex items-center gap-4">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="statusData.isLoading"
            :loading="statusData.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
