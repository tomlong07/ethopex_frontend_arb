<script setup lang="ts">
import { useRecommendation } from '@/store/campaignRecommendation'
const rcmStore = useRecommendation()

const props = defineProps({
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
        <th>Average target CPA</th>
        <th v-if="isConversion">Weekly conv.</th>
        <th v-if="isCostPerConv">Cost / conv.</th>
        <th v-if="isCost">Weekly cost</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td class="text-right">Current</td>
        <td>
          {{
            formatCurrency(
              Number(
                rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                  ?.targetAdjustment?.currentAverageTargetMicros ?? 0
              ) / 1e6
            )
          }}
        </td>

        <td v-if="isConversion">
          {{
            formatConversions(
              rcmStore.dataRawCPA?.impact?.baseMetrics?.conversions ?? 0
            )
          }}
        </td>
        <td v-if="isCostPerConv">
          +{{
            costPerConversionNow2(
              rcmStore.dataRawCPA?.impact?.baseMetrics?.conversions ?? 0,
              Number(
                rcmStore.dataRawCPA?.impact?.baseMetrics?.costMicros ?? 0
              ) / 1e6
            )
          }}
        </td>

        <td v-if="isCost">
          {{
            formatCurrency(
              Number(
                rcmStore.dataRawCPA?.impact?.baseMetrics?.costMicros ?? 0
              ) / 1e6
            )
          }}
        </td>
      </tr>
      <tr>
        <td class="text-right">New</td>
        <td>
          {{
            formatCurrency(
              (Number(
                rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                  ?.targetAdjustment?.currentAverageTargetMicros ?? 0
              ) *
                (rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                  ?.targetAdjustment?.recommendedTargetMultiplier ?? 0)) /
                1e6
            )
          }}
        </td>

        <td v-if="isConversion">
          {{
            formatConversions(
              rcmStore.dataRawCPA?.impact?.potentialMetrics?.conversions ?? 0
            )
          }}
        </td>

        <td v-if="isCostPerConv">
          +{{
            costPerConversionNow2(
              rcmStore.dataRawCPA?.impact?.potentialMetrics?.conversions ?? 0,
              Number(
                rcmStore.dataRawCPA?.impact?.potentialMetrics?.costMicros ?? 0
              ) / 1e6
            )
          }}
        </td>

        <td v-if="isCost">
          {{
            formatCurrency(
              Number(
                rcmStore.dataRawCPA?.impact?.potentialMetrics?.costMicros ?? 0
              ) / 1e6
            )
          }}
        </td>
      </tr>
      <tr>
        <td class="text-right">Change</td>

        <!-- Chênh lệch target micros -->
        <td class="!text-green-500">
          +{{
            formatCurrency(
              (Number(
                rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                  ?.targetAdjustment?.currentAverageTargetMicros ?? 0
              ) *
                (rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                  ?.targetAdjustment?.recommendedTargetMultiplier ?? 0) -
                Number(
                  rcmStore.dataRawCPA?.raiseTargetCpaRecommendation
                    ?.targetAdjustment?.currentAverageTargetMicros ?? 0
                )) /
                1e6
            )
          }}
        </td>

        <!-- Chênh lệch conversions -->
        <td class="!text-green-500" v-if="isConversion">
          +{{
            formatConversions(
              (rcmStore.dataRawCPA?.impact?.potentialMetrics?.conversions ??
                0) -
                (rcmStore.dataRawCPA?.impact?.baseMetrics?.conversions ?? 0)
            )
          }}
        </td>

        <!-- Chênh lệch cost per conversion -->
        <td class="!text-green-500" v-if="isCostPerConv">
          +${{
            formatK(
              costPerConversionNow2(
                rcmStore.dataRawCPA?.impact?.potentialMetrics?.conversions ?? 0,
                Number(
                  rcmStore.dataRawCPA?.impact?.potentialMetrics?.costMicros ?? 0
                ) / 1e6
              ) -
                costPerConversionNow2(
                  rcmStore.dataRawCPA?.impact?.baseMetrics?.conversions ?? 0,
                  Number(
                    rcmStore.dataRawCPA?.impact?.baseMetrics?.costMicros ?? 0
                  ) / 1e6
                )
            )
          }}
        </td>

        <!-- Chênh lệch cost -->
        <td class="!text-green-500" v-if="isCost">
          +{{
            formatCurrency(
              (Number(
                rcmStore.dataRawCPA?.impact?.potentialMetrics?.costMicros ?? 0
              ) -
                Number(
                  rcmStore.dataRawCPA?.impact?.baseMetrics?.costMicros ?? 0
                )) /
                1e6
            )
          }}
        </td>
      </tr>
    </tbody>
  </n-table>
</template>
