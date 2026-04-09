<script setup lang="ts">
import { CronjobTask } from '@/class/cronjob'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { ctr_cronjob } from '@/services/ctr_cronjob'

const dataConfig = ref<CronjobTask>(new CronjobTask())

const loading = ref<boolean>(false)

const submitForm = async () => {
  loading.value = true

  dataConfig.value.initData()

  try {
    const result = await ctr_cronjob.InsertCronjobCustom(dataConfig.value)

    if (result?.status) {
      window.message.success('Campaign statuses updated successfully')

      return
    }
    window.message.error('An error occurred while updating campaign statuses')
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <div class="p-3">
    <div class="flex justify-center mt-6">
      <div
        class="bg-gray-100 border shadow-sm 2xl:w-4/6 xl:w-full lg:w-full md:w-full sm:w-full"
      >
        <div class="flex p-3 pb-2 border-b border-b-slate-200">
          <div class="flex flex-col gap-4 w-full">
            <div class="flex gap-4 flex-col">
              <div class="text-xs text-gray-500">Name</div>
              <n-input
                v-model:value="dataConfig.name"
                :disabled="loading"
                size="medium"
                placeholder="Name to log this task"
              />
            </div>

            <div class="flex gap-4 flex-col">
              <div class="text-xs text-gray-500">Campaign IDs</div>
              <n-input
                v-model:value="dataConfig.campaigns"
                :disabled="loading"
                type="textarea"
                placeholder="Enter campaign IDs separated by commas"
              />
            </div>

            <div class="flex gap-4 items-center">
              <div class="text-xs text-gray-500">Status</div>
              <CustomSwitch
                v-model="dataConfig.meta"
                :disabled="loading"
                true-label="On"
                false-label="Off"
                size="small"
              />
            </div>

            <div class="flex flex-row-reverse sticky bottom-0">
              <n-button
                color="#f43f5e"
                size="medium"
                :loading="loading"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
