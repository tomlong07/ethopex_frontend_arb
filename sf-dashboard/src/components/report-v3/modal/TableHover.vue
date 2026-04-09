<script setup lang="ts">
import { BudgetOption, useRecommendation } from '@/store/campaignRecommendation'
const rcmStore = useRecommendation()

const props = defineProps({
  item: {
    type: Object as () => BudgetOption,
    required: true,
  },

  type: {
    type: String,
    required: true,
  },
})

const isConversion = computed(() => {
  return props.type === 'conversion'
})
const isCostPerConv = computed(() => {
  return props.type === 'costPerConv'
})

const isCost = computed(() => {
  return props.type === 'cost'
})

const formatCurrency = (value: number) => {
  return helper.currencyFormatterAuto3(value)
}

const formatConversions = (value: number) => {
  return helper.formatNumberV2(value, 2)
}

const currentBudget = computed(() => {
  return rcmStore.dataRawBudget?.currentBudgetAmountMicros
    ? (rcmStore.dataRawBudget?.currentBudgetAmountMicros / 1e6).toFixed(2)
    : 0
})

const costPerConversionNow2 = (conversionsDiff: number, costDiff: number) => {
  try {
    const result = constPerConv(conversionsDiff, costDiff)

    return formatK(result)
  } catch {
    return 0
  }
}

const formatK = (value: number) => {
  return helper.formatNumberK(Number(value.toFixed(2)))
}

const constPerConv = (conversionsDiff: number, costDiff: number) => {
  try {
    if (conversionsDiff === 0) return 0

    return costDiff / conversionsDiff
  } catch {
    return 0
  }
}
</script>

<template>
  <n-table>
    <thead>
      <tr>
        <th></th>
        <th>Daily budget</th>
        <th v-if="isConversion">Weekly conv.</th>
        <th v-if="isCostPerConv">Cost / conv.</th>
        <th v-if="isCost">Weekly cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-right">Current</td>
        <td>${{ currentBudget }}</td>

        <td v-if="isConversion">
          {{ formatConversions(item.impact.baseMetrics.conversions) }}
        </td>
        <td v-if="isCostPerConv">
          +${{
            costPerConversionNow2(
              item.impact.baseMetrics.conversions,
              Number(item.impact.baseMetrics.costMicros) / 1e6
            )
          }}
        </td>

        <td v-if="isCost">
          {{ formatCurrency(Number(item.impact.baseMetrics.costMicros) / 1e6) }}
        </td>
      </tr>
      <tr>
        <td class="text-right">New</td>
        <td>
          {{ formatCurrency(Number(props.item.budgetAmountMicros) / 1e6) }}
        </td>
        <td v-if="isConversion">
          {{ formatConversions(item.impact.potentialMetrics.conversions) }}
        </td>
        <td v-if="isCostPerConv">
          +${{
            costPerConversionNow2(
              item.impact.potentialMetrics.conversions,
              Number(item.impact.potentialMetrics.costMicros) / 1e6
            )
          }}
        </td>
        <td v-if="isCost">
          {{
            formatCurrency(
              Number(item.impact.potentialMetrics.costMicros) / 1e6
            )
          }}
        </td>
      </tr>
      <tr>
        <td class="text-right">Change</td>
        <td class="!text-green-500">
          +{{
            formatCurrency(
              (Number(item.budgetAmountMicros) -
                Number(rcmStore.dataRawBudget?.currentBudgetAmountMicros)) /
                1e6
            )
          }}
        </td>
        <td class="!text-green-500" v-if="isConversion">
          +{{
            formatConversions(
              item.impact.potentialMetrics.conversions -
                item.impact.baseMetrics.conversions
            )
          }}
        </td>
        <td class="!text-green-500" v-if="isCostPerConv">
          +${{
            formatK(
              constPerConv(
                item.impact.potentialMetrics.conversions,
                Number(item.impact.potentialMetrics.costMicros) / 1e6
              ) -
                constPerConv(
                  item.impact.baseMetrics.conversions,
                  Number(item.impact.baseMetrics.costMicros) / 1e6
                )
            )
          }}
        </td>
        <td class="!text-green-500" v-if="isCost">
          +{{
            formatCurrency(
              (Number(item.impact.potentialMetrics.costMicros) -
                Number(item.impact.baseMetrics.costMicros)) /
                1e6
            )
          }}
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
