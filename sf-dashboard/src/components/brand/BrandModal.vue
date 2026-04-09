<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import useBrandStore from '@/store/useBrandStore'

const brandStore = useBrandStore()
const isRequest = computed(() => brandStore.isRequest)
</script>
<template>
  <n-modal v-model:show="brandStore.showModal">
    <n-card
      class="w-full max-w-[60vw] max-h-[80vh] overflow-auto"
      title="Add Brand"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button @click="brandStore.showModal = false">
          <n-icon :component="Close" size="25" /></button
      ></template>

      <div class="space-y-4">
        <BrandName />
        <BrandUpload />
        <BrandBussinessName />
        <BrandContactPage />
        <BrandHomepage />
        <BrandShort />
      </div>

      <template #footer>
        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            @click="brandStore.submit"
            :loading="isRequest"
            :disabled="isRequest"
            type="success"
          >
            Submit
          </n-button>
        </div></template
      >
    </n-card>
  </n-modal>
</template>
