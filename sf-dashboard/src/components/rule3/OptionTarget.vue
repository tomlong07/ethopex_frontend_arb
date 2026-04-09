<script setup lang="ts">
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import useRuleStoreV3 from '@/store/details/ruleV3'
import { debounceV2 } from '@/utils'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const ruleStoreV3 = useRuleStoreV3()

const name = `Option Target`

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.traffic_sources?.includes(TS.FACEBOOK)
  )
})

const getOptionTarget = async (q?: string) => {
  ruleStoreV3.loadingOpsTarget = true

  const result = await ctr_filter_v2.OptionTarget()

  ruleStoreV3.optionTarget = result?.data || []

  ruleStoreV3.loadingOpsTarget = false
}

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      getOptionTarget()
    } else {
      ruleStoreV3.optionTarget = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    getOptionTarget()
  }
})

const handleSearch = debounceV2(async (q: string = '') => {
  getOptionTarget(q)
}, 300)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_fb_option_target"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      :max-tag-count="2"
      :placeholder="''"
      :loading="ruleStoreV3.loadingOpsTarget"
      :options="ruleStoreV3.optionTarget"
      @search="handleSearch"
    />
  </FloatingWrapper>
</template>
