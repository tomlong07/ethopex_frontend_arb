<script setup lang="ts">
import { cronjobData } from '@/types/components/cronjob'
import { ctr_cronjob } from '@/services/ctr_cronjob'
import { CronTypeOptions } from '@/options/cronjob'

const isSubmitBtnLoading = ref(false)
const cronjobConfig = ref<cronjobData>({
  data: [],
  meta: '',
  name: '',
  type: '',
})

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  if (
    typeof cronjobConfig.value.data === 'string' &&
    cronjobConfig.value.data.trim()
  ) {
    cronjobConfig.value.data = cronjobConfig.value.data
      .split(/,|\n/) // Tách theo dấu phẩy hoặc xuống dòng
      .map((data) => parseInt(data.trim(), 10)) // Chuyển đổi từ chuỗi sang số nguyên
      .filter((data) => !isNaN(data)) // Loại bỏ các giá trị không phải số
  }
  const result = await ctr_cronjob.InsertCronjobCustom(cronjobConfig.value)
  if (result.status) {
    window.message.success('Submit successfully!')
    window.router.push({ path: '/cronjob' })
  }

  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div class="min-h-screen flex flex-col bg-base px-3 flex-1 mt-4">
    <div class="flex justify-center mt-6">
      <n-card
        title="Cronjob"
        class="2xl:w-2/3 xl:w-2/3 lg:w-2/3 md:w-2/3 sm:w-2/3"
      >
        <!-- Type -->
        <div class="flex items-center my-4">
          <div class="w-1/6 font-bold">Type</div>
          <div class="w-5/6">
            <n-select
              v-model:value="cronjobConfig.type"
              placeholder="Select"
              filterable
              :options="CronTypeOptions"
            />
          </div>
        </div>

        <!-- Name -->
        <div class="flex items-center my-4">
          <div class="w-1/6 font-bold">Name</div>
          <div class="w-5/6">
            <n-input
              v-model:value="cronjobConfig.name"
              class="w-auto"
              placeholder="Enter placement name."
            />
          </div>
        </div>
        <!-- Meta -->
        <div
          v-if="cronjobConfig.type === 'CHANGE_STATUS_CAMPAIGN'"
          class="flex items-center my-4"
        >
          <div class="w-1/6 font-bold">Meta</div>
          <div class="w-5/6">
            <n-input
              v-model:value="cronjobConfig.meta"
              class="w-auto"
              placeholder="Enter placement meta."
            />
          </div>
        </div>

        <!-- Data  -->
        <div class="flex items-center my-4">
          <div class="w-1/6 font-bold">Data</div>
          <div class="w-5/6">
            <n-input
              v-model:value="cronjobConfig.data"
              placeholder="Enter placement Data line by line, or paste in a list."
              type="textarea"
              :autosize="{
                minRows: 5,
                maxRows: 10,
              }"
            />
          </div>
        </div>
      </n-card>
    </div>
    <div class="flex flex-row-reverse sticky bottom-0 p-2">
      <n-button
        color="#f43f5e"
        size="medium"
        type="success"
        :loading="isSubmitBtnLoading"
        @click="submitForm"
      >
        Submit
      </n-button>
    </div>
  </div>
</template>
<style lang="scss"></style>
