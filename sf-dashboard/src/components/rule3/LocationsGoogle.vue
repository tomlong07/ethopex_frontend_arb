<script lang="ts" setup>
import useRuleStoreV3 from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
const ruleStoreV3 = useRuleStoreV3()

const name = 'Google Locations'
const traffic_source = 'google'
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
      ruleStoreV3.fetchLocationsGoogle()
    } else {
      ruleStoreV3.ruleV3.apply_country = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    ruleStoreV3.fetchLocationsGoogle()
  }
})

const locationOptionsShow = computed<SelectOption[]>(() => {
  const selected = ruleStoreV3.ruleV3.apply_country ?? []
  const hasAll = selected.includes('ALL')
  const hasAnyOther = selected.length > 0 && !hasAll

  return ruleStoreV3.locationOptionsGoogle.map(({ value, ...rest }) => {
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

const isDisable = computed(() => {
  if (
    ruleStoreV3.ruleV3.traffic_sources?.length === 1 &&
    ruleStoreV3.ruleV3.traffic_sources?.includes(traffic_source)
  ) {
    return false
  } else {
    ruleStoreV3.ruleV3.apply_country = []
    return true
  }
})
</script>

<template>
  <FloatingWrapper :name="name" v-if="isShow">
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="12">
            <QuestionCircleRegular />
          </n-icon>
        </template>
        Only allow selection when selecting a google traffic source
      </n-popover>
    </template>
    <n-select
      v-model:value="ruleStoreV3.ruleV3.apply_country"
      filterable
      multiple
      clearable
      value-field="value"
      label-field="name"
      :loading="ruleStoreV3.loadingLocationsGoogle"
      :placeholder="''"
      :options="locationOptionsShow"
      :max-tag-count="5"
      :filter="filterHandle"
      :disabled="isDisable"
    />
  </FloatingWrapper>
</template>
