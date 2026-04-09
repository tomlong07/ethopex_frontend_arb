<script setup lang="ts">
import useReportV2ModalTaboola from '@/store/report/report-v2-modal-taboola'
const storeReportV2ModalTaboola = useReportV2ModalTaboola()
</script>

<template>
  <div>
    <n-modal
      v-model:show="storeReportV2ModalTaboola.showModal"
      preset="dialog"
      :show-icon="false"
      style="width: 50vw"
    >
      <template #header>
        <div class="flex-row">
          <div>Ads Info</div>
        </div>
      </template>
      <div style="margin-top: 30px">
        <div class="" style="border: 1px solid #e5e4e7; padding: 15px">
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Title</div>
            <div class="w-3/4">
              <n-input
                :value="storeReportV2ModalTaboola.data.title"
                disabled
                placeholder="Title"
                class="w-full"
                readonly
              />
            </div>
          </div>
          <!-- Description -->
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Description</div>
            <div class="w-3/4">
              <n-input
                :value="storeReportV2ModalTaboola.data.description"
                disabled
                placeholder="Description"
                class="w-full"
                readonly
              />
            </div>
          </div>

          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold">Image</div>
            <div class="w-3/4">
              <n-input
                :value="storeReportV2ModalTaboola.data.thumbnail_url"
                disabled
                placeholder="Image"
                class="w-full"
                readonly
              />
            </div>
          </div>
          <div class="flex items-center my-4">
            <div class="w-1/4 font-bold"></div>
            <div class="w-3/4">
              <img
                :src="storeReportV2ModalTaboola.data.thumbnail_url"
                alt="image"
              />
            </div>
          </div>
        </div>
      </div>
    </n-modal>
  </div>
</template>
