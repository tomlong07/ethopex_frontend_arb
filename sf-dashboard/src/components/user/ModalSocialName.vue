<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import { ctr_user } from '@/services/ctr_user'
import { useTemplateV2 } from '@/store/templateV2Store'

import { useShowNameStore } from '@/store/useShowNameStore'

const showNameStore = useShowNameStore()
const templateV2Store = useTemplateV2(helper.truePath())()
const isSubmitBtnLoading = ref(false)

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const result = await ctr_user.UpdateShowName(showNameStore.user)

  if (result?.status) {
    window.message.success('Success')
    showNameStore.showModal = false

    if (showNameStore.user.id) {
      templateV2Store.changeTableInfo({
        conditionKey: { id: showNameStore.user.id },
        key: 'show_name',
        value: showNameStore.user.show_name,
      })

      templateV2Store.gridApiV2?.forEachNode((node) => {
        if (node.data.id == showNameStore.user.id) {
          node.setDataValue('show_name', showNameStore.user.show_name)
        }
      })
    }
  }

  isSubmitBtnLoading.value = false
}
</script>

<template>
  <n-modal v-model:show="showNameStore.showModal">
    <n-card
      style="width: 600px; height: 400px"
      :bordered="false"
      title="Show Name"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button @click="showNameStore.showModal = false">
          <n-icon :component="Close" size="24" />
        </button>
      </template>

      <div class="flex flex-col gap-4">
        <n-input
          v-model:value="showNameStore.user.show_name"
          type="text"
          placeholder="Enter Show Name"
        ></n-input>

        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          class="ml-auto"
          style="margin-top: 20px"
          @click="submitForm"
          :loading="isSubmitBtnLoading"
          >Submit</n-button
        >
      </div>
    </n-card>
  </n-modal>
</template>
