<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'

import { FacebookViaType } from '@/types/components/facebook-via'
import IDViaFacebook from '@/components/facebookvia/IDViaFacebook.vue'
import StatusFacebookVia from '@/components/facebookvia/StatusFacebookVia.vue'
import NameFacebookVia from '@/components/facebookvia/NameFacebookVia.vue'
import EmailFacebookVia from '@/components/facebookvia/EmailFacebookVia.vue'
import UserFacebookVia from '@/components/facebookvia/UserFacebookVia.vue'
import AdAccountFacebookVia from '@/components/facebookvia/AdAccountFacebookVia.vue'
import BulkModel from '@/components/facebookvia/BulkModel.vue'
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import { ctr_supply_account } from '@/services/ctr_supply_account'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const facebookConfig = useFacebookViaStore()
const submitForm = async () => {
  facebookConfig.statusData.isSubmitBtnLoading = true

  const result = await ctr_supply_account.SaveSupplyUser(
    facebookConfig.dataConfig
  )

  if (facebookConfig.modeData.isAddPage()) {
    if (result?.status) {
      window.message.success(`Submit success!`)

      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    } else {
      facebookConfig.infomationError = result
    }
  }

  if (facebookConfig.modeData.isEditPage()) {
    if (result?.status) {
      window.message.success(`Update success!`)
    } else {
      facebookConfig.infomationError = result
    }
  }

  facebookConfig.statusData.isSubmitBtnLoading = false
}

onMounted(async () => {
  facebookConfig.prefetch()

  facebookConfig.selectData.getAdAccounts('', facebookConfig.modeData.id)

  facebookConfig.statusData.isLoading = true

  if (facebookConfig.modeData.isEditPage()) {
    const id = facebookConfig.modeData.id
    const res = await ctr_supply_account.GetSupplyUserByID(id)
    facebookConfig.dataConfig = new FacebookViaType(res?.data || {})
  }

  facebookConfig.selectData.getUsers(facebookConfig.dataConfig.user_id)
  facebookConfig.statusData.isLoading = false
})

onUnmounted(() => {
  facebookConfig.clearData()
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base my-6 flex-1 gap-4">
      <BackPage
        :url="feSettings?.page_list"
        :name="facebookConfig.statusData.name"
        v-if="feSettings?.page_list"
      />
      <div class="flex justify-center items-start">
        <div class="w-full max-w-[923px]">
          <Skeleton v-if="facebookConfig.statusData.isLoading" />
          <n-grid x-gap="14" y-gap="14" cols="1" v-else>
            <n-gi class="flex flex-col gap-4">
              <n-card class="card-flex-gap-4">
                <IDViaFacebook />

                <StatusFacebookVia />

                <NameFacebookVia />

                <EmailFacebookVia />

                <UserFacebookVia />

                <AdAccountFacebookVia />
              </n-card>
            </n-gi>
          </n-grid>
          <div class="flex flex-row-reverse sticky bottom-0 py-2">
            <div class="flex items-center gap-4">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :disabled="facebookConfig.statusData.isLoading"
                :loading="facebookConfig.statusData.isSubmitBtnLoading"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </div>

          <BulkModel />
        </div>
      </div>
    </div>
  </div>
</template>
