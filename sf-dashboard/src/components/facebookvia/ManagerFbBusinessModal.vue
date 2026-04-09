<script setup lang="ts">
import useManagerFacebookBusiness from '@/store/useManagerFacebookBusiness'

import { LabelModal } from '@/types/components/account-ad'
import { CreateLabelModal, ChooseLabelsModal } from '@/components/account_ad'

import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_supply_account } from '@/services/ctr_supply_account'

const templateV2Store = useTemplateV2(helper.truePath())()

const managerFbBusinessStore = useManagerFacebookBusiness()

const isLoading = ref<boolean>(false)

const dataModal = ref<{ [key: string]: any }>({})
const dataModalInfo = ref<LabelModal>(new LabelModal())

//Lấy thông tin ở store để sử dụng
watch(
  () => managerFbBusinessStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      if (managerFbBusinessStore.isLabels) {
        dataModalInfo.value = new LabelModal()
        dataModalInfo.value.id = managerFbBusinessStore.dataLabel.id
        dataModalInfo.value.labels =
          managerFbBusinessStore.dataLabel.labels || []

        dataModalInfo.value.updateSelectOptions()
      }

      if (managerFbBusinessStore.isAdvertiser) {
        dataModal.value = {}

        isLoading.value = true

        let result: any

        if (managerFbBusinessStore.isAdvertiser) {
          result = await ctr_supply_account.GetByAdvertiserID(
            managerFbBusinessStore.id
          )
        }

        dataModal.value = result?.data || {}

        isLoading.value = false
      }
    }
  }
)

const isSubmitting = ref(false)

const submitForm = async () => {
  isSubmitting.value = true

  let result: any
  let obj_labels = dataModalInfo.value.labels || []

  if (managerFbBusinessStore.isLabels) {
    result = await ctr_supply_account.UpdateLabelAdvertiser(
      dataModalInfo.value.id,
      { obj_labels: obj_labels }
    )
  }

  if (result?.status) {
    window.message.success('Update success')

    //Cập nhật lại màu cho tất cả row
    dataModalInfo.value.updateColorMap()

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

    managerFbBusinessStore.showModal = false
  }
  isSubmitting.value = false
}
</script>

<template>
  <n-modal v-model:show="managerFbBusinessStore.showModal">
    <n-card
      style="width: 95%"
      title="Info"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      v-if="managerFbBusinessStore.isAdvertiser"
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
      :title="`Update labels`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      v-if="managerFbBusinessStore.isLabels"
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
  </n-modal>
</template>
