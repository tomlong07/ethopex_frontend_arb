<script lang="ts" setup>
import useAccountAd from '@/store/useAccountAd'
import AddingSubGoogle from '../AddingSubGoogle.vue'
import { ctr_account } from '@/services/ctr_account'
import { useLocale } from '@/lang/messages'

const AccDetail = useLocale(
  () => import('@/lang/vi/acc_detail'),
  () => import('@/lang/en/acc_detail')
)

const accountAdStore = useAccountAd()
const isSyncAdsLoading = ref<boolean>(false)

const id = Number(window.route.params.id || 0)

//Viết ngắn lại
const onSyncAds = async () => {
  isSyncAdsLoading.value = true
  const result = await ctr_account.SyncAccountAds(id)
  accountAdStore.accountAd = result?.data || {}
  isSyncAdsLoading.value = false
}
</script>
<template>
  <div class="flex justify-between my-2">
    <span>
      <n-tag
        v-if="accountAdStore.isGoogleAccount"
        type="success"
        class="mr-2 n-tag-exclude"
        :title="AccDetail.delay_en"
      >
        Enabled:
        {{ accountAdStore.accountAdsDetail?.total_account_ads_enabled }}
      </n-tag>
      <n-tag
        v-if="accountAdStore.isGoogleAccount"
        type="error"
        class="mr-2 n-tag-exclude"
        :title="AccDetail.delay_su"
      >
        Suspended:
        {{ accountAdStore.accountAdsDetail?.total_account_ads_suspended }}
      </n-tag>
    </span>
    <!-- Add Account -->
    <div v-if="accountAdStore.isGeneralAccount" class="flex items-center">
      <AddingSubGoogle
        :id="accountAdStore.accountAd.id"
        :object="accountAdStore.accountAd.object"
      />
    </div>
    <n-button
      v-if="!accountAdStore.isGeneralAccount"
      color="#f43f5e"
      size="small"
      type="success"
      :loading="isSyncAdsLoading"
      @click="onSyncAds"
    >
      Sync Ads
    </n-button>
  </div>
</template>
