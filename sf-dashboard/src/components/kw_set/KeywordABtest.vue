<script setup lang="ts">
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import CustomSwitch from '../common/CustomSwitch.vue'
import { LIMIT_PAGE_VIEW } from '@/constants/limits'

const kwsetStore = useKeywordSetStore()
const changeABTestHandle = async (newValue: boolean) => {
  let result: any = {}

  if (kwsetStore.isAddPage) {
    //Cập nhật luôn, ko gửi ajax
    result.status = true
  } else {
    kwsetStore.isLoadingKeywordAB = true
    const stop = kwsetStore.validateKW(newValue)
    if (stop) {
      return
    }

    let tempData = helper.clone(kwsetStore.dataConfig)
    tempData.keyword_ab_test = newValue

    result = await kwsetStore.updateData(kwsetStore.id, tempData)
  }

  if (result?.status) {
    kwsetStore.dataConfig.keyword_ab_test = newValue

    if (
      kwsetStore.dataConfig.keyword_ab_test &&
      kwsetStore.dataConfig.hasOwnProperty('limit_page_view') === false
    ) {
      kwsetStore.dataConfig.limit_page_view = LIMIT_PAGE_VIEW
    }

    if (newValue) {
      kwsetStore.isLoadingKeywordAB = false
      return
    }

    kwsetStore.isLoadingKeywordAB = false
  }
}

const isDisabled = computed(() => {
  return kwsetStore.isLoading || kwsetStore.isDisable || !window.arb.isCompany()
})
</script>
<template>
  <div class="items-center" v-if="!kwsetStore.dataConfig.auto_optimize">
    <div class="text-xs w-32 font-bold text-gray-400">Keyword A/B Test a</div>
    <div class="mt-2">
      <CustomSwitch
        v-model="kwsetStore.dataConfig.keyword_ab_test"
        type="boolean"
        trueLabel="On"
        falseLabel="Off"
        size="small"
        :disabled="isDisabled"
        :loading="kwsetStore.isLoadingKeywordAB"
        @update:modelValue="(value: any) => changeABTestHandle(value)"
      />
    </div>
  </div>
</template>
