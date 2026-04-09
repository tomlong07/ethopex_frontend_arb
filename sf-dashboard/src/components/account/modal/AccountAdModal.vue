<script setup lang="ts">
import useAccountAd from '@/store/useAccountAd'

import { LabelModal } from '@/types/components/account-ad'
import {
  CreateLabelModal,
  ChooseLabelsModal,
  ChooseCategoriesModal,
} from '@/components/account_ad'

import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_account_category } from '@/services/ctr_account_category'
import { ctr_supply_account } from '@/services/ctr_supply_account'
const templateV2Store = useTemplateV2(helper.truePath())()
const accountAdStore = useAccountAd()

const isLoading = ref<boolean>(false)

const dataModal = ref<{ [key: string]: any }>({})

const dataModalInfo = ref<LabelModal>(new LabelModal())

//Lấy thông tin ở store để sử dụng
watch(
  () => accountAdStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      if (accountAdStore.isLabels) {
        dataModalInfo.value = new LabelModal()
        dataModalInfo.value.id = accountAdStore.dataLabel.id
        dataModalInfo.value.labels = accountAdStore.dataLabel.labels || []

        dataModalInfo.value.updateSelectOptions()
      }

      if (accountAdStore.isCategories) {
        dataModalInfo.value = new LabelModal()
        dataModalInfo.value.id = accountAdStore.dataCategories.id
        dataModalInfo.value.categories =
          accountAdStore.dataCategories.categories || []

        dataModalInfo.value.updateCategorySelectOptions()
      }

      if (accountAdStore.isId || accountAdStore.isAdvertiser) {
        dataModal.value = {}

        isLoading.value = true

        let result: any

        if (accountAdStore.isId) {
          result = await ctr_supply_account.GetByAccountAdID(accountAdStore.id)
        }

        if (accountAdStore.isAdvertiser) {
          result = await ctr_supply_account.GetByAdvertiserID(accountAdStore.id)
        }

        dataModal.value = result?.data || {}

        isLoading.value = false
      }
    }
  }
)
const name = computed<string>(() => {
  return helper.capitalizeFirstLetter(accountAdStore.type || '')
})

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  let result: any
  let obj_labels = dataModalInfo.value.labels || []

  if (!accountAdStore.isLabels) return

  const selectedAccounts = accountAdStore.accountSelected

  if (selectedAccounts?.length) {
    const _payload = {
      accounts: selectedAccounts.map((item) =>
        item.account_id?.replaceAll(/-/g, '')
      ),
      obj_labels,
    }

    result = await ctr_supply_account.UpdateLabelsForAccountAds(_payload)
    accountAdStore.accountSelected = []
  } else {
    const _payload = {
      accounts: dataModalInfo.value.id ? [dataModalInfo.value.id] : [],
      obj_labels,
    }
    result = await ctr_supply_account.UpdateLabelsForAccountAds(_payload)
  }

  if (result?.status) {
    window.message.success('Update success')
    await accountAdStore.GetAccountAdsDetail()

    //Cập nhật lại màu cho tất cả row
    dataModalInfo.value.updateColorMap()

    if (accountAdStore.watchId) {
      accountAdStore.dataToChange = obj_labels
    } else {
      if (dataModalInfo.value.id) {
        templateV2Store.gridApiV2?.forEachNode((node) => {
          if (node.data.id === dataModalInfo.value.id) {
            node.setData({
              ...node.data,
              labels: obj_labels,
            })
          }
        })
      }
    }

    accountAdStore.showModal = false
  }
  isSubmitting.value = false
}

const submitCategories = async () => {
  isSubmitting.value = true

  let result: any
  let obj_categories = dataModalInfo.value.categories || []

  if (accountAdStore.isCategories) {
    result = await ctr_account_category.Submit(dataModalInfo.value.id, {
      categories: obj_categories,
      pixels: [],
    })
  }

  if (result?.status) {
    window.message.success('Update success')

    if (dataModalInfo.value.id) {
      templateV2Store.gridApiV2?.forEachNode((node) => {
        if (node.data.id === dataModalInfo.value.id) {
          node.setData({
            ...node.data,
            categories: obj_categories,
          })
        }
      })
    }

    accountAdStore.showModal = false
  }
  isSubmitting.value = false
}
</script>

<template>
  <n-modal v-model:show="accountAdStore.showModal">
    <n-card
      style="width: 95%"
      title="Info"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      v-if="accountAdStore.isId || accountAdStore.isAdvertiser"
    >
      <n-spin :show="isLoading">
        <div
          style="height: 800px"
          class="overflow-y-scroll border border-gray-300 rounded-lg shadow-sm"
        >
          <ObjectDisplay :data="dataModal" />
        </div>
      </n-spin>
    </n-card>

    <n-card
      style="width: 600px; height: 720px"
      :title="`Update ${name}`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      v-if="accountAdStore.isLabels"
    >
      <ChooseLabelsModal :dataModalInfo="dataModalInfo" />

      <CreateLabelModal :dataModalInfo="dataModalInfo" />

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="isSubmitting"
            @click="submitForm()"
          >
            Submit
          </n-button>
        </div>
      </template>
    </n-card>

    <n-card
      style="width: 600px; height: 720px"
      :title="`Update ${name}`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      v-if="accountAdStore.isCategories"
    >
      <ChooseCategoriesModal :dataModalInfo="dataModalInfo" />

      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="isSubmitting"
            @click="submitCategories()"
          >
            Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
