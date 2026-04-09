<script setup lang="ts">
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import CustomSwitch from '../common/CustomSwitch.vue'
import { LIMIT_PAGE_VIEW } from '@/constants/limits'

const kwsetStore = useKeywordSetStore()
const changeAutoOptimize = async (newValue: boolean) => {
  let result: any = {}

  if (kwsetStore.isAddPage) {
    //Cập nhật luôn, ko gửi ajax
    result.status = true
  } else {
    kwsetStore.isLoadingAutoOptimize = true
    const stop = kwsetStore.validateKW(newValue)
    if (stop) {
      return
    }

    let tempData = helper.clone(kwsetStore.dataConfig)
    tempData.auto_optimize = newValue

    result = await kwsetStore.updateData(kwsetStore.id, tempData)
  }

  if (result?.status) {
    kwsetStore.dataConfig.auto_optimize = newValue

    if (
      kwsetStore.dataConfig.auto_optimize &&
      kwsetStore.dataConfig.hasOwnProperty('limit_page_view') === false
    ) {
      kwsetStore.dataConfig.limit_page_view = LIMIT_PAGE_VIEW
    }

    if (newValue) {
      kwsetStore.isLoadingAutoOptimize = false
      return
    }

    kwsetStore.isLoadingAutoOptimize = false
  }
}

const isDisabled = computed(() => {
  return kwsetStore.isLoading || kwsetStore.isDisable || !window.arb.isCompany()
})
</script>
<template>
  <div class="items-center">
    <div class="text-xs w-32 font-bold text-gray-400">Auto Optimize</div>
    <div class="mt-2">
      <CustomSwitch
        v-model="kwsetStore.dataConfig.auto_optimize"
        type="boolean"
        trueLabel="On"
        falseLabel="Off"
        size="small"
        :disabled="isDisabled"
        :loading="kwsetStore.isLoadingAutoOptimize"
        @update:modelValue="(value: any) => changeAutoOptimize(value)"
      />
    </div>
  </div>
</template>
