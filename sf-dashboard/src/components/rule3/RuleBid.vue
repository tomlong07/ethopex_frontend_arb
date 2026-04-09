<script setup lang="ts">
import useRuleStoreV3, { bidTypeV3 } from '@/store/details/ruleV3'
import CollapseSection from '../common/CollapseSection.vue'
import { RuleBidComparisonOption } from '../../options/rule'
import MainInterval from './MainInterval.vue'
const ruleStoreV3 = useRuleStoreV3()

watch(
  () => ruleStoreV3.ruleV3.isRuleBid(),
  (newValue) => {
    if (newValue) {
      if (!ruleStoreV3.ruleV3.bid) {
        ruleStoreV3.ruleV3.bid = new bidTypeV3()
      }
    } else {
      ruleStoreV3.ruleV3.bid = undefined
    }
  }
)
const onlyAllowNumber = (value: string) => !value || /^\d+$/.test(value)
const isDisplayInterval = computed(() => {
  const field_comparison = [
    'supply_cpc_rt',
    'supply_cpc',
    'epc_rt',
    'epc',
    'demand_cpc',
  ].includes(ruleStoreV3.ruleV3.bid?.field_comparison || '')
  if (!field_comparison) {
    ruleStoreV3.ruleV3.bid!.interval = undefined
  }
  if (!ruleStoreV3.ruleV3.bid?.include_today) {
    ruleStoreV3.ruleV3.bid!.include_today = false
  }
  return (
    ruleStoreV3.ruleV3.rule_type === 'duplicate_campaign' &&
    ruleStoreV3.ruleV3.isBidPercent() &&
    field_comparison
  )
})
const optionRuleBidComparison = computed(() => {
  const isAdgroup = ruleStoreV3.ruleV3.rule_type?.includes('ad_group')
  if (ruleStoreV3.ruleV3.rule_type === 'duplicate_campaign' || isAdgroup) {
    return RuleBidComparisonOption.filter(
      (option) => option.value !== 'rpc_last_x_conversions'
    )
  }
  return RuleBidComparisonOption
})
</script>

<template>
  <CollapseSection
    name="rule_bid"
    header="Rule Bid"
    v-if="
      ruleStoreV3.ruleV3.isRuleBid() || ruleStoreV3.ruleV3.isAddDuplicateRule()
    "
  >
    <div class="flex flex-col gap-4" v-if="ruleStoreV3.ruleV3.bid">
      <div class="grid grid-cols-[144px_auto_1fr] gap-2">
        <n-select
          v-model:value="ruleStoreV3.ruleV3.bid.bid_type"
          placeholder="Bid Type"
          :consistent-menu-width="false"
          :options="[
            {
              label: 'Set Bid To',
              value: 'equal',
              disabled: false,
            },
            {
              label: 'Increase Bid By',
              value: 'increase',
              disabled: false,
            },
            {
              label: 'Decrease Bid By',
              value: 'decrease',
              disabled: false,
            },
          ]"
        />

        <n-input-group class="gap-0">
          <n-input-number
            v-model:value="ruleStoreV3.ruleV3.bid.bid_value"
            min="0"
            clearable
            class="w-28"
            placeholder="Enter Bid Value"
          />
          <n-select
            v-model:value="ruleStoreV3.ruleV3.bid.bid_unit"
            class="w-[58px]"
            placeholder="Bid Unit"
            :options="[
              { label: '$', value: 'currency' },
              { label: '%', value: 'percent' },
            ]"
          />
        </n-input-group>

        <n-input-group class="w-fit gap-2">
          <div class="w-40">
            <n-select
              v-model:value="ruleStoreV3.ruleV3.bid.field_comparison"
              clearable
              filterable
              :options="optionRuleBidComparison"
              v-if="ruleStoreV3.ruleV3.isBidPercent()"
              placeholder="Select Field Comparison"
              :consistent-menu-width="false"
            />
          </div>
          <div v-if="isDisplayInterval" class="flex items-center gap-2">
            <div class="w-48">
              <n-select
                v-model:value="ruleStoreV3.ruleV3.bid.interval"
                filterable
                clearable
                placeholder="Considering Data From"
                :options="ruleStoreV3.intervalOptions"
              />
            </div>
            <div class="flex items-center">
              <div class="text-xs w-24 font-bold">Include Today:</div>
              <div class="w-fit">
                <CustomSwitch
                  v-model="ruleStoreV3.ruleV3.bid.include_today"
                  type="boolean"
                  true-label="ON"
                  false-label="OFF"
                  size="small"
                />
              </div>
            </div>
          </div>

          <div
            class="w-40"
            v-if="
              ruleStoreV3.ruleV3.isBidPercent() &&
              ruleStoreV3.ruleV3.bid.field_comparison ===
                'rpc_last_x_conversions'
            "
          >
            <n-input
              placeholder="Conversions"
              v-model:value="ruleStoreV3.ruleV3.bid.field_comparison_extra"
              :allow-input="onlyAllowNumber"
            />
          </div>
          <MainInterval />
        </n-input-group>
      </div>

      <!-- Bid Limits Section -->
      <div class="grid grid-cols-[320px_auto] gap-2">
        <n-input-group-label>
          Do not allow the Bid to be lower than
        </n-input-group-label>
        <n-input-group class="gap-0">
          <n-input-number
            class="w-40"
            v-model:value="ruleStoreV3.ruleV3.bid.bid_value_min"
            min="0"
            clearable
            placeholder="Enter Minimum Bid Value"
          />
        </n-input-group>

        <n-input-group-label>
          Do not allow the Bid to be higher than
        </n-input-group-label>
        <n-input-group class="gap-0">
          <n-input-number
            class="w-40"
            v-model:value="ruleStoreV3.ruleV3.bid.bid_value_max"
            min="0"
            clearable
            placeholder="Enter Maximum Bid Value"
          />
        </n-input-group>
      </div>
    </div>
  </CollapseSection>
</template>
