<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'

import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'
const domainConfig = useDomainConfigStore()

const textShow = computed<string>(() => {
  return domainConfig.modeData.isAddPage() ? 'Add' : 'Edit'
})
</script>

<template>
  <n-card :title="`${textShow} ${domainConfig.name}`" class="rounded-md">
    <div class="space-y-6">
      <FloatingWrapper name="Name" rounded>
        <n-input
          v-model:value="domainConfig.dataConfig.name"
          :loading="domainConfig.isLoading"
          :disabled="domainConfig.isLoading || domainConfig.isDisable"
          :placeholder="`Name of ${domainConfig.name}`"
        />
      </FloatingWrapper>
      <div class="flex">
        <div class="mr-5 flex items-center font-medium text-gray-400">
          Status
        </div>
        <CustomSwitch
          v-model="domainConfig.dataConfig.status"
          :disabled="domainConfig.isLoading || domainConfig.isDisable"
          type="onoff"
          true-label="On"
          false-label="Off"
        />
      </div>
      <FloatingWrapper name="Description" rounded>
        <n-input
          v-model:value="domainConfig.dataConfig.description"
          type="textarea"
          placeholder="Description"
          :disabled="domainConfig.isLoading"
        />
      </FloatingWrapper>
    </div>
  </n-card>
</template>
