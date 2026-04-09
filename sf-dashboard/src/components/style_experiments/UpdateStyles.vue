<script setup lang="ts">
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const StyleExperimentStore = useStyleExperimentStore()

const initShowModal = () => {
  StyleExperimentStore.modalIds =
    StyleExperimentStore.dataConfig.updateStyles?.join('\n') || ''
  StyleExperimentStore.showModal = true
}
</script>

<template>
  <div class="flex">
    <div class="w-full flex items-center flex-row">
      <FloatingWrapper 
        name="Update Style Ids"
      >
        <n-select
          v-model:value="StyleExperimentStore.dataConfig.updateStyles"
          filterable
          multiple
          clearable
          tag
          :max-tag-count="10"
          :options="StyleExperimentStore.styleOptions"
          placeholder=""
        />
      </FloatingWrapper>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button class="ml-2" color="#f43f5e" @click="initShowModal">
            Bulk Entry
          </n-button>
        </template>
        <span>Enter multiple ids separated by commas or lines.</span>
      </n-tooltip>
    </div>
  </div>
</template>
