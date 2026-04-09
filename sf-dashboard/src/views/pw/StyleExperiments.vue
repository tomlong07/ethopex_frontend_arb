<script setup lang="ts">
import AdsenseAccount from '@/components/style_experiments/AdsenseAccount.vue'
import Generation from '@/components/style_experiments/Generation.vue'
import ModalExperimentBulkEntry from '@/components/style_experiments/ModalExperimentBulkEntry.vue'
import UpdateStyles from '@/components/style_experiments/UpdateStyles.vue'
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
const StyleExperimentStore = useStyleExperimentStore()

onMounted(() => {
  if (helper.isDebug()) {
    StyleExperimentStore.dataConfig.adsenseAccount = '8153055892847290'
    StyleExperimentStore.dataConfig.updateStyles = ['4789631193', '9936163354']
  }
})
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full max-w-[923px]">
        <div class="flex flex-wrap gap-4 mt-6">
          <ModalExperimentBulkEntry />
          <n-card :title="StyleExperimentStore.name" class="card-flex-gap-4">
            <template #header-extra>
              <ExperimentHeaderExtra />
            </template>

            <AdsenseAccount />
            <Generation />

            <UpdateStyles />

            <ExperimentCopyButton />
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>
