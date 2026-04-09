<script setup lang="ts">
import useRuleStoreV3, {
  conditionTypeV3,
  RuleLogic,
} from '@/store/details/ruleV3'
import { SelectOption } from 'naive-ui'
import { percentOfOptions, RuleComparisonOption } from '@/options/rule'
import Close2 from '@/assets/icons/Close2.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import { ctr_rule } from '@/services/ctr_rule'

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
    !ruleStoreV3.ruleV3.isVersion2()
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

// Add rule logics

const ruleLogics = ref<RuleLogic[]>([])
const resetVModel = () => {
  ruleStoreV3.ruleV3.name = ''
  ruleStoreV3.ruleV3.interval = ''
  ruleStoreV3.ruleV3.interval_exclude = ''
  ruleStoreV3.ruleV3.include_today = undefined
  ruleStoreV3.ruleV3.conditions = []
}

const addRuleLogic = () => {
  ruleLogics.value?.push({
    name: ruleStoreV3.ruleV3.name,
    interval: ruleStoreV3.ruleV3.interval,
    interval_exclude: ruleStoreV3.ruleV3.interval_exclude,
    include_today: ruleStoreV3.ruleV3.include_today,
    conditions: ruleStoreV3.ruleV3.conditions,
  })
  resetVModel()
  UpdateRuleLogics()
  initDefaultCondition()
}

const UpdateRuleLogics = () => {
  if (isShow) {
    ruleStoreV3.ruleV3.rule_logics = ruleLogics.value || []
  }
}

const removeRuleLogic = (index: number) => {
  if (index === -1) return
  ruleLogics.value.splice(index, 1)
}

const selectedRuLogic = (index: number) => {
  if (index === -1) return
  Object.assign(ruleStoreV3.ruleV3, ruleLogics.value[index])
  ruleStoreV3.ruleV3.conditions = ruleLogics.value[index]?.conditions || []
}
</script>

<template>
  {{ isShow }}
  <n-grid x-gap="12" cols="1 2800:2">
    <n-gi class="flex flex-col gap-4">
      <n-card
        v-if="isShow"
        title="Rule Condition"
        class="card-flex-gap-4 card-rule-condition"
      >
        <div
          v-for="(tp_condition, index) in ruleStoreV3.ruleV3.conditions"
          :key="index"
          class="rows-condition flex"
        >
          <div class="flex items-center flex-1">
            <div class="w-1/5">
              <div class="font-bold">{{ index <= 0 ? 'If' : 'And' }}</div>
              <div class="pr-2 flex gap-2 flex-col">
                <n-select
                  v-model:value="tp_condition.field"
                  placeholder="Metric"
                  filterable
                  label-field="name"
                  :options="ruleConditionOptionComputed"
                  :loading="isLoading"
                />

                <n-input
                  placeholder="Conversions"
                  v-model:value="tp_condition.field_extra"
                  :allow-input="onlyAllowNumber"
                  v-if="tp_condition.field === 'rpc_last_x_conversions'"
                />
              </div>
            </div>
            <div class="w-1/5">
              <div class="font-bold">Is</div>
              <div class="pr-2">
                <n-select
                  v-model:value="tp_condition.comparison"
                  placeholder="Compare"
                  filterable
                  :options="RuleComparisonOption"
                  :loading="isLoading"
                />
              </div>
            </div>
            <div class="w-1/5">
              <div class="font-bold">Than</div>
              <div class="pr-2">
                <n-input-number
                  v-model:value="tp_condition.value"
                  placeholder="Amount"
                  :loading="isLoading"
                />
              </div>
            </div>
            <div class="w-1/5">
              <div class="font-bold">&nbsp;</div>
              <div class="pr-2">
                <n-select
                  v-model:value="tp_condition.comparison_type"
                  placeholder="Compare Type"
                  clearable
                  :disabled="tp_condition.field === 'runtime_campaign'"
                  :options="percentOfOptionsByRuleType"
                  :loading="isLoading"
                />
              </div>
            </div>
            <div class="w-1/5">
              <div class="font-bold">&nbsp;</div>
              <div class="pr-2 flex gap-2 flex-col">
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

                <n-input
                  placeholder="Conversions"
                  v-model:value="tp_condition.comparison_field_extra"
                  :allow-input="onlyAllowNumber"
                  v-if="
                    tp_condition.comparison_field === 'rpc_last_x_conversions'
                  "
                />
              </div>
            </div>
          </div>
          <div>
            <div class="font-bold">&nbsp;</div>
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
        <div class="flex gap-2">
          <n-button icon-placement="left" @click="addCondition" class="w-24">
            <template #icon>
              <n-icon>
                <PlusSmall />
              </n-icon>
            </template>
            Add
          </n-button>
          <n-button
            v-if="
              ruleStoreV3.ruleV3.conditions &&
              ruleStoreV3.ruleV3.conditions.length > 0
            "
            icon-placement="left"
            @click="addRuleLogic"
            class="w-fit"
            type="success"
          >
            <template #icon>
              <n-icon>
                <PlusSmall />
              </n-icon>
            </template>
            Create rule
          </n-button>
        </div>
      </n-card>
    </n-gi>
  </n-grid>
  <n-grid
    v-if="ruleLogics && ruleLogics.length > 0"
    :x-gap="12"
    :y-gap="8"
    :cols="4"
  >
    <n-grid-item>
      <n-card
        v-for="(item, index) in ruleLogics"
        :key="index"
        :title="item.name ? item.name : `Rule logic ${index + 1}`"
        closable
        hoverable
        class="cursor-pointer focus:bg-blue-400"
        @close="removeRuleLogic(index)"
        @click="selectedRuLogic(index)"
      >
      </n-card>
    </n-grid-item>
  </n-grid>
</template>
