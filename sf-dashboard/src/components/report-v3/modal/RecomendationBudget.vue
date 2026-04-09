<script lang="ts" setup>
import { useRecommendation } from '@/store/campaignRecommendation'
import TableHover from './TableHover.vue'
const rcmStore = useRecommendation()
const budgetCustom = ref<number | null>(null)

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

const changeDataRefCustom = (value: number | any) => {
  budgetCustom.value = value
  rcmStore.dataRef = value
  rcmStore.isCustomBudget = true
}

const handleClickCustom = () => {
  rcmStore.isCustomBudget = true
  rcmStore.dataRef = budgetCustom.value || 0
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <n-table>
      <thead>
        <tr>
          <th>Daily budget</th>
          <th>Weekly conv.</th>
          <th>Cost / conv.</th>
          <th>Weekly cost</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(item, index) in rcmStore.budgetOptionsShow" :key="index">
          <td>
            <n-radio
              :checked="
                item.budgetAmountMicros / 1e6 === rcmStore.dataRef &&
                !rcmStore.isCustomBudget
              "
              :value="item.budgetAmountMicros / 1e6"
              @change="
                rcmStore.changeDataRefDirect(item.budgetAmountMicros / 1e6)
              "
            >
              {{ formatCurrency(item.budgetAmountMicros / 1e6) }}

              <n-tag
                v-if="
                  rcmStore.dataRawBudget?.recommendedBudgetAmountMicros &&
                  item.budgetAmountMicros ===
                    rcmStore.dataRawBudget?.recommendedBudgetAmountMicros
                "
                type="info"
                class="uppercase font-semibold ml-4"
                size="small"
                >Recommended</n-tag
              >
            </n-radio>
          </td>
          <td class="!text-green-500">
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                +
                {{
                  formatConversions(
                    item.impact.potentialMetrics.conversions -
                      item.impact.baseMetrics.conversions
                  )
                }}
              </template>
              <TableHover :item="item" type="conversion" />
            </n-popover>
          </td>
          <td>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                +${{
                  formatK(
                    costPerConversionNow2(
                      item.impact.potentialMetrics.conversions,
                      Number(item.impact.potentialMetrics.costMicros) / 1e6
                    ) -
                      costPerConversionNow2(
                        item.impact.baseMetrics.conversions,
                        Number(item.impact.baseMetrics.costMicros) / 1e6
                      )
                  )
                }}
              </template>

              <TableHover :item="item" type="costPerConv" />
            </n-popover>
          </td>
          <td>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                +{{
                  formatCurrency(
                    (Number(item.impact.potentialMetrics.costMicros) -
                      Number(item.impact.baseMetrics.costMicros)) /
                      1e6
                  )
                }}</template
              >
              <TableHover :item="item" type="cost" />
            </n-popover>
          </td>
        </tr>

        <tr>
          <td>
            <div class="flex items-center gap-4">
              <n-radio
                :checked="rcmStore.isCustomBudget"
                @click="handleClickCustom()"
              >
              </n-radio>
              <n-input-number
                @click="handleClickCustom()"
                min="0"
                max="1000"
                :precision="2"
                v-model:value="budgetCustom"
                placeholder="Set custom budget"
                :on-update:value="changeDataRefCustom"
              >
                <template #prefix> $ </template></n-input-number
              >
            </div>
          </td>
        </tr>
      </tbody>
    </n-table>
  </div>
</template>
