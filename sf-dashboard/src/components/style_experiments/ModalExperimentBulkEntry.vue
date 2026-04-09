<script lang="ts" setup>
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
const StyleExperimentStore = useStyleExperimentStore()

const submitBulkIds = () => {
  if (!StyleExperimentStore.modalIds) {
    window.message.error(`Submit failed: Invalid ids, please check!`)
    return
  }
  StyleExperimentStore.dataConfig.updateStyles = helper.stringToArray(
    StyleExperimentStore.modalIds,
    true
  )
  StyleExperimentStore.showModal = false
}
</script>

<template>
  <n-modal
    v-model:show="StyleExperimentStore.showModal"
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
        v-model:value="StyleExperimentStore.modalIds"
        type="textarea"
        placeholder="Eg. id 1, id 2..."
        rows="10"
      />
    </div>
    <template #action>
      <n-button @click="StyleExperimentStore.showModal = false">
        Cancel</n-button
      >
      <n-button type="error" @click="submitBulkIds"> Save</n-button>
    </template>
  </n-modal>
</template>
