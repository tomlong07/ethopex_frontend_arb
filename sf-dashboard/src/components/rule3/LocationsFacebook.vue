<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { TS } from '@/enum/campaign'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Facebook Locations'
const traffic_source = TS.FACEBOOK

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isNotDataFromLink() &&
    !ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.traffic_sources?.includes(traffic_source)
  )
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      ruleStoreV3.fetchLocationsFacebook()
    } else {
      ruleStoreV3.ruleV3.apply_location_fb = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    ruleStoreV3.fetchLocationsFacebook()
  }
})

const locationOptionsShow = computed<SelectOption[]>(() => {
  const selected = ruleStoreV3.ruleV3.apply_location_fb ?? []
  const hasAll = selected.includes('ALL')
  const hasAnyOther = selected.length > 0 && !hasAll

  return ruleStoreV3.locationOptionsFacebook.map(({ value, ...rest }) => {
    const isAll = value === 'ALL'

    return {
      value,
      ...rest,
      disabled: hasAll || (hasAnyOther && isAll),
    }
  })
})

const filterHandle = (pattern: string, option: any) => {
  return (
    option?.name?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.code?.toLowerCase().includes(pattern.toLowerCase()) ||
    option?.value?.toLowerCase().includes(pattern.toLowerCase())
  )
}

watch(
  () => ruleStoreV3.ruleV3.rule_type,
  (newRuleType) => {
    if (newRuleType === 'duplicate_campaign' && isShow.value) {
      ruleStoreV3.ruleV3.apply_location_fb = ['ALL']
    }
  }
)
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_location_fb"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      :loading="ruleStoreV3.loadingLocationsFacebook"
      :placeholder="''"
      :options="locationOptionsShow"
      :max-tag-count="5"
      :filter="filterHandle"
    />
  </FloatingWrapper>
</template>
