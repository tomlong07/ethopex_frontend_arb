<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'
import NameDemand from '@/components/demand/NameDemand.vue'
import ShowNameDemand from '@/components/demand/ShowNameDemand.vue'
import FixAddTitle from '@/components/demand/FixAddTitle.vue'
import MacrosDemand from '@/components/demand/MacrosDemand.vue'
import StatusDemand from '@/components/demand/StatusDemand.vue'
import demainStore from '@/store/details/useDemainStore'
import ctr_demand_source from '@/services/ctr_demand_source'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const dataConfig = demainStore()

const id = Number(window.route.params.id || 0)
const isAddMode = computed<boolean>(() => id === 0)

const isSubmitBtnLoading = ref<boolean>(false)

const name = `demand source`

onMounted(() => {
  dataConfig.clearData()
})

const submitForm = async () => {
  try {
    isSubmitBtnLoading.value = true

    if (!dataConfig.demandConfig.name) {
      window.message.error(`Submit failed: Name is required`)
      return
    }
    if (!dataConfig.demandConfig.show_name) {
      window.message.error(`Submit failed: Show Name is required`)
      return
    }

    if (isAddMode.value) {
      const result = await ctr_demand_source.AddConfig(dataConfig.demandConfig)
      if (result?.status) {
        window.message.success(`Add ${name} successfully`)

        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value?.page_list })
        }
      }
    } else {
      const result = await ctr_demand_source.EditConfig(dataConfig.demandConfig)
      if (result?.status) window.message.success(`Update ${name} successfully`)
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <BackPage
        :url="feSettings?.page_list"
        :name="name"
        v-if="feSettings?.page_list"
        class="mt-6"
      />
      <div v-show="dataConfig.isLoadingMacros">
        <Skeleton />
      </div>
      <div
        v-show="!dataConfig.isLoadingMacros"
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card title="Demand Source">
          <NameDemand />
          <ShowNameDemand />
          <StatusDemand />
          <FixAddTitle />
          <MacrosDemand />
        </n-card>

        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="dataConfig.isDisable"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tab-pane-macros {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}
.macro {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }
  .dynamic-button {
    padding: 0 0.5rem;
  }
}
</style>
