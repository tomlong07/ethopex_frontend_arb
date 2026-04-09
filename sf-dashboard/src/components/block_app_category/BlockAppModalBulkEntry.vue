<script setup lang="ts">
import { useBlockAppCategory } from '@/store/details/blockAppCategory'

const blockAppCategoryStore = useBlockAppCategory()

const submitBulkIds = () => {
  if (!blockAppCategoryStore.modalData) {
    window.message.error(`Submit failed: Invalid ids, please check!`)
    return
  }

  blockAppCategoryStore.blockAppCategoryData.accounts = helper
    .stringToArray(blockAppCategoryStore.modalData, true)
    ?.map((item: any) => String(item))

  blockAppCategoryStore.showModal = false
}
</script>

<template>
  <n-modal
    v-model:show="blockAppCategoryStore.showModal"
    preset="dialog"
    :closable="false"
    type="success"
    :show-icon="false"
    style="width: 60vw"
  >
    <template #header>
      <div class="flex-row">
        <div>Ids bulk entry</div>
        <span class="text-sm font-normal"
          >Entries should be on separate commas or lines.</span
        >
      </div>
    </template>
    <div>
      <n-input
        v-model:value="blockAppCategoryStore.modalData"
        type="textarea"
        placeholder="Eg. id 1, id 2...."
        rows="10"
      />
    </div>
    <template #action>
      <n-button @click="blockAppCategoryStore.showModal = false">
        Cancel
      </n-button>
      <n-button type="error" @click="submitBulkIds"> Save </n-button>
    </template>
  </n-modal>
</template>
