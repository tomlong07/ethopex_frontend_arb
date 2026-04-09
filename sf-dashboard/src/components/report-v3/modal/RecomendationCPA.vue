<script lang="ts" setup>
import { useRecommendation } from '@/store/campaignRecommendation'
import TableHoverCPA from './TableHoverCPA.vue'
const rcmStore = useRecommendation()

const formatCurrency = (value: number) => {
  return helper.currencyFormatterAuto3(value)
}

const CPACustom = ref<number | null>(null)

const handleClickCustom = () => {
  rcmStore.isCustomCPA = true
  rcmStore.dataRef = CPACustom.value || 0
}

const changeDataRefCustom = (value: number | null) => {
  CPACustom.value = value ?? 0
  rcmStore.dataRef = value ?? 0
  rcmStore.isCustomCPA = true
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
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <n-table>
        <thead>
          <tr>
            <th>Average target CPA</th>
            <th>Weekly conv.</th>
            <th>Cost / conv.</th>
            <th>Weekly cost</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>
              <n-radio
                :checked="!rcmStore.isCustomCPA"
                :value="rcmStore.recommendCPA"
                @change="rcmStore.setRecommendationCPA()"
              >
                {{ formatCurrency(rcmStore.recommendCPA) }}

                <n-tag
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
                      (rcmStore.dataRawCPA?.impact.potentialMetrics
                        .conversions || 0) -
                        (rcmStore.dataRawCPA?.impact.baseMetrics.conversions ||
                          0)
                    )
                  }}
                </template>
                <TableHoverCPA
                  :item="(rcmStore.dataRawCPA?.impact as any)"
                  type="conversion"
                />
              </n-popover>
            </td>
            <td>
              <n-popover trigger="hover" :show-arrow="false">
                <template #trigger>
                  +${{
                    formatK(
                      costPerConversionNow2(
                        rcmStore.dataRawCPA?.impact.potentialMetrics
                          .conversions ?? 0,
                        (Number(
                          rcmStore.dataRawCPA?.impact.potentialMetrics
                            .costMicros || ''
                        ) ?? 0) / 1e6
                      ) -
                        costPerConversionNow2(
                          rcmStore.dataRawCPA?.impact.baseMetrics.conversions ||
                            0,
                          (Number(
                            rcmStore.dataRawCPA?.impact.baseMetrics
                              .costMicros || ''
                          ) || 0) / 1e6
                        )
                    )
                  }}
                </template>

                <TableHoverCPA
                  :item="(rcmStore.dataRawCPA?.impact as any)"
                  type="costPerConv"
                />
              </n-popover>
            </td>
            <td>
              <n-popover trigger="hover" :show-arrow="false">
                <template #trigger>
                  +{{
                    formatCurrency(
                      ((Number(
                        rcmStore.dataRawCPA?.impact.potentialMetrics
                          .costMicros || ''
                      ) || 0) -
                        (Number(
                          rcmStore.dataRawCPA?.impact.baseMetrics.costMicros ||
                            ''
                        ) || 0)) /
                        1e6
                    )
                  }}
                </template>
                <TableHoverCPA
                  :item="(rcmStore.dataRawCPA?.impact as any)"
                  type="cost"
                />
              </n-popover>
            </td>
          </tr>

          <tr>
            <td class="flex gap-2">
              <n-radio
                :checked="rcmStore.isCustomCPA"
                @click="handleClickCustom()"
              >
              </n-radio>
              <n-input-number
                @click="handleClickCustom()"
                min="0"
                max="1000"
                :precision="2"
                v-model:value="CPACustom"
                placeholder="Set custom target"
                :on-update:value="changeDataRefCustom"
              >
                <template #prefix> $ </template></n-input-number
              >
            </td>
            <td></td>
            <td></td>
            <td></td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>
