<script setup lang="ts">
import useAccountAd from '@/store/useAccountAd'
import { LabelModal } from '@/types/components/account-ad'

import {
  ChooseLabelsModal,
  CreateLabelModal,
  ChooseCategoriesModal,
} from '@/components/account_ad'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_supply_account } from '@/services/ctr_supply_account'

const accountAdStore = useAccountAd()
const templateV2Store = useTemplateV2(helper.truePath())()

const dataModalInfo = ref<LabelModal>(new LabelModal())

watch(
  () => accountAdStore.showModalBulk,
  async (newValue, oldValue) => {
    if (newValue) {
      dataModalInfo.value = new LabelModal()

      dataModalInfo.value.updateSelectOptions()
      dataModalInfo.value.updateCategorySelectOptions()
    }
  }
)

const submitBulkAccounts = async () => {
  accountAdStore.isSubmittingBulk = true

  const payload = {
    ids: templateV2Store.itemSelectedV2.map((item: any) => item.id),
    labels: dataModalInfo.value.labels,
    categories: dataModalInfo.value.categories,
  }
  const result = await ctr_supply_account.UpdateBulk(payload)

  if (result?.status) {
    window.message.success('All accounts updated successfully!')
    accountAdStore.showModalBulk = false
    templateV2Store.itemSelectedV2 = []

    templateV2Store.reInitTable()
  }

  accountAdStore.isSubmittingBulk = false
}
</script>

<template>
  <n-modal v-model:show="accountAdStore.showModalBulk">
    <n-card
      style="width: 95%"
      title="Set Bulk Accounts"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="flex items-center">
        <div class="w-1/2 flex flex-col gap-4">
          <div class="w-1/6 font-bold">Labels</div>
          <div class="w-5/6">
            <ChooseLabelsModal :dataModalInfo="dataModalInfo" />
            <CreateLabelModal :dataModalInfo="dataModalInfo" />
          </div>
        </div>
        <div class="w-1/2 flex flex-col gap-4">
          <div class="w-1/6 font-bold">Categories</div>
          <div class="w-5/6">
            <ChooseCategoriesModal :dataModalInfo="dataModalInfo" />
          </div>
        </div>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="accountAdStore.isSubmittingBulk"
            @click="submitBulkAccounts()"
          >
            Submit
          </n-button>
        </div>
      </template></n-card
    >
  </n-modal>
</template>
