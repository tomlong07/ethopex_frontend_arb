<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import { ctr_account } from '@/services/ctr_account'
import AccountAdModal from '@/components/account/modal/AccountAdModal.vue'
import useAccountAd from '@/store/useAccountAd'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import AccountAdName from '@/components/account/AccountAdName.vue'
import AccountId from '@/components/account/AccountId.vue'
import AccountStatusDetail from '@/components/account/AccountStatusDetail.vue'
import AccountEmail from '@/components/account/AccountEmail.vue'
import AccountPixelId from '@/components/account/AccountPixelId.vue'
import AccountPixelToken from '@/components/account/AccountPixelToken.vue'
import AccountTimeZone from '@/components/account/AccountTimeZone.vue'
import AccountAdTable from '@/components/account/AccountAdTable.vue'
import AddingFacebook from '@/components/account/AddingFacebook.vue'
import AddingGoogle from '@/components/account/AddingGoogle.vue'
import TabAccountMcc from '@/components/account/tab/TabAccountMcc.vue'

const AccountLabels = defineAsyncComponent(
  () => import('@/components/template-v2/AccountLabels.vue')
)

const accountAdStore = useAccountAd()

const feSettings = ref(new FeSettings())

useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)
const isAdmin = window.arb.isAdmin()
const isLoading = ref<boolean>(false)
const isSubmitBtnLoading = ref<boolean>(false)
const activeTab = ref<string>('account-info')
const typeAdd = computed<any>(() => window.route.params.type)
const isAddPage = computed<boolean>(() => {
  return id == 0
})

const isEditPage = computed<boolean>(() => !isAddPage.value)

const isNoAccountTypeSelected = computed(() => {
  return (
    !accountAdStore.isGoogleAccount &&
    !accountAdStore.isGeneralAccount &&
    !accountAdStore.isFacebookAccount &&
    !accountAdStore.isTiktokAccount
  )
})

const genTitle = computed<string>(() => {
  if (accountAdStore.isGoogleAccount) return 'Google'
  if (accountAdStore.isFacebookAccount) return 'Facebook'
  if (accountAdStore.isTiktokAccount) return 'Tiktok'
  return ''
})
const selectedMccName = computed(() => {
  return (
    accountAdStore.mccOptions.find(
      (opt) => opt.value === accountAdStore.tabAccountMcc.name
    ) || null
  )
})
const validateFormAccMcc = () => {
  const { count, time_delay } = accountAdStore.tabAccountMcc

  if (!count || count < 1 || count > 100) {
    window.message.error('Number must be a number from 1 to 100')
    return false
  }

  if (!time_delay || time_delay < 1) {
    window.message.error('Time delay must be greater than or equal to 1')
    return false
  }

  return true
}
const submitForm = async () => {
  isSubmitBtnLoading.value = true
  if (activeTab.value === 'account-info') {
    const result = await ctr_account.SaveAccount(id, accountAdStore.accountAd)
    isSubmitBtnLoading.value = false
    if (result?.status) window.message.success('Submit successfully!')
  }
  if (activeTab.value === 'account-mcc') {
    if (!validateFormAccMcc()) return
    const payload = {
      account_id: accountAdStore.tabAccountMcc.name,
      name: selectedMccName.value?.label,
      count: accountAdStore.tabAccountMcc.count,
      time_delay: accountAdStore.tabAccountMcc.time_delay,
    }
    const result = await ctr_account.AddAccountMcc(payload)
    isSubmitBtnLoading.value = false
    if (result?.status) {
      accountAdStore.tabAccountMcc = {
        name: null,
        count: null,
        time_delay: null,
      }
      window.message.success('Submit successfully!')
    }
  }
}

const getById = async () => {
  isLoading.value = true

  const result = await ctr_account.Get(id)
  accountAdStore.accountAd = result?.data || {}
  isLoading.value = false
}
onMounted(async () => {
  if (isEditPage.value) await getById()
})

const isDev = window.arb.isDev()
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full">
        <BackPage
          :url="feSettings.page_list"
          name="Account"
          v-if="feSettings.page_list"
          class="mt-6"
        />

        <div class="mt-6" v-if="isEditPage && accountAdStore.isGoogleAccount">
          <n-tabs v-model:value="activeTab" type="line" animated>
            <n-tab-pane name="account-info" tab="Account Edit" />
            <n-tab-pane
              name="account-mcc"
              tab="Account Mcc (DEV)"
              v-if="isDev"
            />
          </n-tabs>
        </div>

        <div v-if="isLoading">
          <Skeleton />
        </div>
        <n-grid
          v-show="isEditPage && activeTab === 'account-info'"
          x-gap="12"
          :cols="1"
          v-else
        >
          <n-gi>
            <div class="flex items-center justify-end gap-2 my-2">
              <AccountLabels v-if="accountAdStore.isGoogleAccount" />
            </div>

            <n-card :title="genTitle" class="mb-4">
              <AccountAdName />
              <AccountId />
              <AccountStatusDetail />
              <AccountEmail v-if="isNoAccountTypeSelected" />
              <AccountPixelId v-if="isNoAccountTypeSelected" />
              <AccountPixelToken v-if="isNoAccountTypeSelected" />
              <AccountTimeZone />
            </n-card>
          </n-gi>
          <n-gi v-if="isEditPage">
            <AccountAdTable />
          </n-gi>
        </n-grid>

        <TabAccountMcc
          v-if="
            isEditPage &&
            activeTab === 'account-mcc' &&
            accountAdStore.isGoogleAccount &&
            isAdmin
          "
        />

        <div
          v-if="isEditPage"
          class="flex flex-row-reverse sticky bottom-0 p-2"
        >
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            class="ml-2"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
        <template v-if="isAddPage">
          <AddingFacebook v-if="typeAdd === 'facebook'" />
          <AddingGoogle v-if="typeAdd === 'google' || typeAdd === 'general'" />
        </template>
      </div>

      <AccountAdModal />
    </div>
  </div>
</template>
