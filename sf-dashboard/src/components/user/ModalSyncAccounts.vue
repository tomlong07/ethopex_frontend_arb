<script setup lang="ts">
import { User } from '@/class/user'
import Modal from '../common/Modal.vue'
import LabelSelect from './LabelSelect.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import {
  BasedInvoiceOptions,
  PersonnelOptions,
  PubCommission,
} from '@/options/user'
import { ctr_user } from '@/services/ctr_user'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'

const vModel = defineModel<boolean>({
  default: false,
})

const props = defineProps({
  user: {
    type: Object as () => User,
    required: true,
  },
})
const validator = (x: number) => x > 0
const isLoading = ref(false)
const account = ref<User>(new User())

const submit = async () => {
  if (!account.value) return
  if (!window.route.params?.id) {
    window.message.error('User ID not found!')
    return
  }
  try {
    isLoading.value = true

    const _payload = {
      label: account.value.label,
      user_id: Number(window.route.params?.id),
      revenue_sharing_rate: account.value.revenue_sharing_rate,
      based_invoice: account.value.based_invoice,
      rate_share: account.value.rate_share,
      publisher_commission: account.value.publisher_commission,
      personnel_type: account.value.personnel_type,
    }

    const result = await ctr_user.SyncAccounts(_payload)
    if (result.status) {
      window.message.success('Submit successfully!')
      vModel.value = false
    }
  } catch (error) {
    console.log(error)
  } finally {
    isLoading.value = false
  }
}

const assignData = () => {
  account.value = new User(props.user)
}
</script>
<template>
  <Modal
    @before-open="assignData"
    v-model="vModel"
    size="lg"
    title="Sync Accounts"
    @submit="submit"
  >
    <div class="text-sm text-gray-600">
      Synchronize all settings for users managed by
      <n-tag size="small" :bordered="false"> {{ props.user.email }} </n-tag>
    </div>
    <LabelSelect v-model="account.label" />
    <FloatingWrapper name="Revenue Share Rate" class="my-4">
      <n-input-number
        v-model:value="account.revenue_sharing_rate"
        class="w-full"
        placeholder="Revenue share rate"
        :validator="validator"
      />
    </FloatingWrapper>
    <FloatingWrapper name="Based Invoice" class="my-4">
      <n-select
        v-model:value="account.based_invoice"
        clearable
        placeholder=""
        :options="BasedInvoiceOptions"
      />
    </FloatingWrapper>
    <FloatingWrapper name="Rate Share" class="my-4">
      <n-input-number
        v-model:value="account.rate_share"
        class="w-full"
        placeholder="Rate share"
        min="0"
      />
    </FloatingWrapper>
    <FloatingWrapper name="Pub Commission" class="my-4">
      <template #extra>
        <div class="flex items-center">
          <n-popover trigger="hover" placement="right">
            <template #trigger>
              <n-icon size="16">
                <InformationCircleOutline />
              </n-icon>
            </template>
            <span>Share commission with the account manager</span>
          </n-popover>
        </div>
      </template>
      <n-select
        v-model:value="account.publisher_commission"
        placeholder="Publisher Commissionus"
        :options="PubCommission"
      />
    </FloatingWrapper>

    <FloatingWrapper name="Personnel Type" class="my-4">
      <template #extra>
        <div class="flex items-center">
          <n-popover trigger="hover" placement="right">
            <template #trigger>
              <n-icon size="16">
                <InformationCircleOutline />
              </n-icon>
            </template>
            <span
              >Distinguish company personnel accounts and external Publisher
              accounts</span
            >
          </n-popover>
        </div>
      </template>
      <n-select
        v-model:value="account.personnel_type"
        placeholder="Personnel Type"
        :options="PersonnelOptions"
      />
    </FloatingWrapper>
  </Modal>
</template>
