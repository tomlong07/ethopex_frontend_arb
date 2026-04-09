<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'
import useRuleStoreV3, { conditionTypeV3 } from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import { percentOfOptions, RuleThanOption } from '@/options/rule'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import CollapseSection from '../common/CollapseSection.vue'
const ruleStoreV3 = useRuleStoreV3()
const ruleConditionOption = ref<SelectOption[]>([])
const isLoading = ref(false)

const ruleConditionOptionComputed = computed<SelectOption[]>(() => {
  if (ruleStoreV3.ruleV3.isDataFromListCampaign()) {
    return ruleConditionOption.value
  }

  const excludedValues = ['cost_all_time']
  return ruleConditionOption.value.filter(
    (item) => !excludedValues.includes(item.value as string)
  )
})

const percentOfOptionsByRuleType = computed(() => {
  if (ruleStoreV3.isSectionChoose) {
    return percentOfOptions
  }

  return [percentOfOptions[0]]
})

const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)

const getConditionOptions = async () => {
  isLoading.value = true

  const result = await ctr_rule.GetCondition()

  ruleConditionOption.value = result?.data || []
  isLoading.value = false
}

const initDefaultCondition = () => {
  if (!ruleStoreV3.ruleV3.conditions) {
    ruleStoreV3.ruleV3.conditions = []
  }

  if (!ruleStoreV3.ruleV3.conditions?.length) {
    addCondition()
  }
}

const isShow = computed(() => {
  if (
    ruleStoreV3.ruleV3.isRuleStopCampaign() ||
    ruleStoreV3.ruleV3.isDataFromLink() ||
    ruleStoreV3.ruleV3.isVersion2()
  ) {
    return false
  }
  return true
})

watch(
  () => isShow.value,
  (newValue) => {
    if (newValue) {
      getConditionOptions()

      initDefaultCondition()
    } else {
      ruleStoreV3.ruleV3.conditions = []
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    getConditionOptions()

    initDefaultCondition()
  }
})

const removeCondition = function (index: number) {
  if (
    !ruleStoreV3.ruleV3.conditions ||
    ruleStoreV3.ruleV3.conditions.length === 1
  )
    return

  ruleStoreV3.ruleV3.conditions?.splice(index, 1)
}

const addCondition = () => {
  if (!ruleStoreV3.ruleV3) return

  if (!ruleStoreV3.ruleV3.conditions) ruleStoreV3.ruleV3.conditions = []

  ruleStoreV3.ruleV3.conditions?.push(new conditionTypeV3())
}
</script>

<template>
  <CollapseSection name="rule_condition" header="Rule Condition" v-if="isShow">
    <n-grid x-gap="12" cols="1 2800:2">
      <n-gi class="flex flex-col gap-4">
        <div
          v-for="(tp_condition, index) in ruleStoreV3.ruleV3.conditions"
          :key="index"
          class="rows-condition flex"
        >
          <div class="flex items-center flex-1">
            <div class="w-1/5">
              <div class="pr-2 flex gap-2 flex-col">
                <FloatingWrapper
                  :name="index <= 0 ? 'If' : 'And'"
                  :required="true"
                  :error="ruleStoreV3.showErr[`field:${index}`]"
                >
                  <n-select
                    v-model:value="tp_condition.field"
                    @update:value="(val: string | null) =>
                    ruleStoreV3.onRuleConditionChange(val, { conditionIndex: index }, 'ruleV1')"
                    placeholder="Metric"
                    filterable
                    label-field="name"
                    :options="ruleConditionOptionComputed"
                    :loading="isLoading"
                  />
                </FloatingWrapper>
                <FloatingWrapper
                  v-if="tp_condition.field === 'rpc_last_x_conversions'"
                >
                  <n-input
                    placeholder="Conversions"
                    v-model:value="tp_condition.field_extra"
                    :allow-input="onlyAllowNumber"
                  />
                </FloatingWrapper>
              </div>
            </div>
            <div class="w-1/5">
              <div class="pr-2">
                <FloatingWrapper :name="'Compare'">
                  <n-select
                    v-model:value="tp_condition.comparison"
                    placeholder="Compare"
                    filterable
                    :options="
                      ruleStoreV3.getComparisonOptions(tp_condition.field || '')
                    "
                    :loading="isLoading"
                  />
                </FloatingWrapper>
              </div>
            </div>
            <div class="w-1/5">
              <div class="pr-2">
                <FloatingWrapper :name="'Than'">
                  <n-select
                    v-if="ruleStoreV3.isCampaignStatus(tp_condition.field)"
                    v-model:value="tp_condition.value"
                    placeholder="Value"
                    :options="RuleThanOption"
                    :loading="isLoading"
                  />

                  <n-input-number
                    v-else
                    v-model:value="tp_condition.value"
                    placeholder="Amount"
                    :loading="isLoading"
                  />
                </FloatingWrapper>
              </div>
            </div>
            <div
              class="w-1/5"
              v-if="!ruleStoreV3.isCampaignStatus(tp_condition.field)"
            >
              <div class="pr-2">
                <FloatingWrapper :name="'Compare Type'">
                  <n-select
                    v-model:value="tp_condition.comparison_type"
                    placeholder=""
                    clearable
                    :disabled="tp_condition.field === 'runtime_campaign'"
                    :options="percentOfOptionsByRuleType"
                    :loading="isLoading"
                  />
                </FloatingWrapper>
              </div>
            </div>
            <div
              class="w-1/5"
              v-if="!ruleStoreV3.isCampaignStatus(tp_condition.field)"
            >
              <div class="pr-2 flex gap-2 flex-col">
                <FloatingWrapper :name="'Metric'">
                  <n-select
                    v-model:value="tp_condition.comparison_field"
                    placeholder=""
                    filterable
                    clearable
                    label-field="name"
                    :disabled="tp_condition.field === 'runtime_campaign'"
                    :options="ruleConditionOptionComputed"
                    :loading="isLoading"
                  />
                </FloatingWrapper>
                <FloatingWrapper
                  :name="'Conversions'"
                  v-if="
                    tp_condition.comparison_field === 'rpc_last_x_conversions'
                  "
                >
                  <n-input
                    placeholder=""
                    v-model:value="tp_condition.comparison_field_extra"
                    :allow-input="onlyAllowNumber"
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
              @click="removeCondition(index)"
            >
              <template #icon>
                <n-icon>
                  <Close2 />
                </n-icon>
              </template>
            </n-button>
          </div>
        </div>
        <n-button icon-placement="left" @click="addCondition" class="w-24">
          <template #icon>
            <n-icon>
              <PlusSmall />
            </n-icon>
          </template>
          Add
        </n-button>
      </n-gi>
    </n-grid>
  </CollapseSection>
</template>
