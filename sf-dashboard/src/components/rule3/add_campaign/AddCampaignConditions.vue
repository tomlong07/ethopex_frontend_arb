<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'
import useRuleStoreV3, { conditionTypeV3 } from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { RuleComparisonOption } from '@/options/rule'

const ruleStoreV3 = useRuleStoreV3()

const ruleConditionOption = ref<SelectOption[]>([])
const isLoading = ref(false)

const percentOfOptions = [
  { label: '% of', value: 'percent_of', disabled: false },
  { label: '% of campaign', value: 'percent_of_campaign', disabled: false },
]

const isShow = computed(() => {
  return (
    ruleStoreV3.ruleV3.isDataFromListCampaign() &&
    ruleStoreV3.ruleV3.add_campaign.IsDynamic()
  )
})

const percentOfOptionsByRuleType = computed(() => {
  if (ruleStoreV3.isSectionChoose) {
    return percentOfOptions
  }

  return [percentOfOptions[0]]
})

const initDefaultCondition = () => {
  if (!ruleStoreV3.ruleV3.add_campaign.conditions) {
    ruleStoreV3.ruleV3.add_campaign.conditions = []
  }

  if (!ruleStoreV3.ruleV3.add_campaign.conditions?.length) {
    addConditionAddCampaign()
  }
}

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      getConditionOptions()

      initDefaultCondition()
    } else {
      ruleStoreV3.ruleV3.add_campaign.conditions = []
    }
  }
)

const ruleConditionOptionComputed = computed<SelectOption[]>(() => {
  if (ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    return ruleConditionOption.value
  }

  const excludedValues = ['cost_all_time']
  return ruleConditionOption.value.filter(
    (item) => !excludedValues.includes(item.value as string)
  )
})

const getConditionOptions = async () => {
  isLoading.value = true

  let result = await ctr_rule.GetCondition()

  ruleConditionOption.value = result?.data || []
  isLoading.value = false
}

onMounted(() => {
  if (isShow.value) {
    getConditionOptions()

    initDefaultCondition()
  }
})

const removeConditionAddCamp = function (index: number) {
  if (!ruleStoreV3.ruleV3.add_campaign?.conditions) {
    return
  }

  ruleStoreV3.ruleV3.add_campaign?.conditions.splice(index, 1)
}

const addConditionAddCampaign = () => {
  if (!ruleStoreV3.ruleV3.add_campaign) {
    return
  }

  if (!ruleStoreV3.ruleV3.add_campaign?.conditions)
    ruleStoreV3.ruleV3.add_campaign.conditions = []

  ruleStoreV3.ruleV3.add_campaign.conditions?.push(new conditionTypeV3())
}
</script>

<template>
  <n-card
    v-if="isShow"
    title="Rule Add Campaign Condition"
    class="card-rule-condition card-flex-gap-4"
  >
    <div
      v-for="(tp_condition, index) in ruleStoreV3.ruleV3.add_campaign
        .conditions"
      :key="index"
      class="rows-condition flex"
    >
      <div class="flex items-center flex-1">
        <div class="w-1/5">
          <div class="pr-2">
            <FloatingWrapper :name="index <= 0 ? 'If' : 'And'">
              <n-select
                v-model:value="tp_condition.field"
                placeholder="Metric"
                filterable
                label-field="name"
                :options="ruleConditionOptionComputed"
                :loading="isLoading"
              />
            </FloatingWrapper>
          </div>
        </div>
        <div class="w-1/5">
          <div class="pr-2">
            <FloatingWrapper :name="'Is'">
              <n-select
                v-model:value="tp_condition.comparison"
                placeholder="Compare"
                filterable
                :options="RuleComparisonOption"
              />
            </FloatingWrapper>
          </div>
        </div>
        <div class="w-1/5">
          <div class="pr-2">
            <FloatingWrapper :name="'Than'">
              <n-input-number
                v-model:value="tp_condition.value"
                placeholder="Amount"
              />
            </FloatingWrapper>
          </div>
        </div>
        <div class="w-1/5">
          <div class="pr-2">
            <FloatingWrapper>
              <n-select
                v-model:value="tp_condition.comparison_type"
                placeholder="Compare Type"
                clearable
                :disabled="tp_condition.field === 'runtime_campaign'"
                :options="percentOfOptionsByRuleType"
                :loading="isLoading"
              />
            </FloatingWrapper>
          </div>
        </div>
        <div class="w-1/5">
          <div class="pr-2">
            <FloatingWrapper>
              <n-select
                v-model:value="tp_condition.comparison_field"
                placeholder="Metric"
                filterable
                clearable
                label-field="name"
                :disabled="tp_condition.field === 'runtime_campaign'"
                :options="ruleConditionOptionComputed"
                :loading="isLoading"
              />
            </FloatingWrapper>
          </div>
        </div>
      </div>
      <div class="mt-1">
        <n-button
          class="remove-condition"
          icon-placement="left"
          tertiary
          @click="removeConditionAddCamp(index)"
        >
          <template #icon>
            <n-icon>
              <Close2 />
            </n-icon>
          </template>
        </n-button>
      </div>
    </div>
    <n-button
      icon-placement="left"
      class="w-24"
      @click="addConditionAddCampaign"
    >
      <template #icon>
        <n-icon>
          <PlusSmall />
        </n-icon>
      </template>
      Add
    </n-button>
  </n-card>
</template>
