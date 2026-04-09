<script setup lang="ts">
import { useStyleExperimentStore } from '@/store/adsense/styleExperimentStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const StyleExperimentStore = useStyleExperimentStore()

onMounted(() => {
  StyleExperimentStore.getAdsenseAccounts()
})

const updateAdsenseAccount = (value: any) => {
  StyleExperimentStore.dataConfig.adsenseAccount = value
  StyleExperimentStore.dataConfig.generation = null
  StyleExperimentStore.dataConfig.updateStyles = []

  StyleExperimentStore.getGenerationByAdsense()
}
</script>

<template>
  <div class="flex">
    <div class="w-full flex flex-row">
      <FloatingWrapper 
        name="Adsense Account"
      >
        <n-select
          v-model:value="StyleExperimentStore.dataConfig.adsenseAccount"
          tag
          value-field="pub_id"
          label-field="show_name"
          :options="StyleExperimentStore.adsenseAccountOptions"
          :on-update:value="updateAdsenseAccount"
          placeholder=""
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
