<script setup lang="ts">
import { ctr_account } from '@/services/ctr_account'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import useAccountAd from '@/store/useAccountAd'
import { SelectOption } from 'naive-ui'

const accountAdStore = useAccountAd()

const props = defineProps<{
  accounts: any[]
}>()

const isLoading = ref(true)
const isSubmit = ref(false)
const typeOptions = ref<SelectOption[]>([])
const mccID = ref(null)
const emit = defineEmits(['clearSelected'])

const getFilterMcc = async () => {
  try {
    isLoading.value = true
    const result = await ctr_filter_v2.GetFilterMcc()
    typeOptions.value = result?.data || undefined
  } finally {
    isLoading.value = false
  }
}

const reRenderTable = async () => {
  accountAdStore.gridApi?.showLoadingOverlay()
  await accountAdStore.GetAccountAdsDetail()
  accountAdStore.gridApi?.hideOverlay()
  emit('clearSelected')
}

const handleChangeAccounts = async () => {
  try {
    isSubmit.value = true
    if (!mccID) {
      window.message.error('Please selected MCC ID!')
      return
    }
    const _payload = {
      account_ids:
        props.accounts && props.accounts.length
          ? props.accounts.map((item) => item.account_id)
          : null,
      new_mcc_id: mccID.value,
    }
    const result = await ctr_account.UpdateAccountcMCC(_payload)
    if (result.status) {
      window.message.success('Updated Accounts successfully!')
      accountAdStore.showModalChangeMCC = false

      await reRenderTable()
    }
  } catch (error) {
    console.error(error)
  } finally {
    isSubmit.value = false
  }
}

watch(
  () => accountAdStore.showModalChangeMCC,
  async (v) => {
    if (v) {
      mccID.value = null
      await getFilterMcc()
    }
  }
)
</script>
<template>
  <Modal
    v-model="accountAdStore.showModalChangeMCC"
    title="Change Accounts MCC"
    @submit="handleChangeAccounts"
    :loading="isSubmit"
  >
    <FloatingWrapper name="Mcc ID" rounded>
      <n-select
        v-model:value="mccID"
        placeholder="Mcc ID"
        clearable
        filterable
        class="w-full"
        :loading="isLoading"
        :options="typeOptions"
        :consistent-menu-width="false"
      />
    </FloatingWrapper>
  </Modal>
</template>
