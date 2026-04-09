<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import { ReportColumn } from '@/types/state/report'

const reportStoreV2 = useReportV2(helper.truePath())()
const showGroupBy = ref(true)
const toggleGroupBy = (
  _value: (string | number)[],
  meta: { actionType: 'check' | 'uncheck'; value: string | number }
) => {
  const colSetting = reportStoreV2.ReportCols.find((x) => x.key === meta.value)
  if (meta.actionType === 'check') {
    reportStoreV2.group_by.push(meta.value as string)

    if (!reportStoreV2.listColAccepted.includes(meta.value as string)) {
      reportStoreV2.listColAccepted.push(meta.value as string)
    }

    if (colSetting?.zombies) {
      for (const element of colSetting.zombies) {
        if (colSetting.key === 'campaign' || colSetting.key === 'section') {
          const colZomSetting = reportStoreV2.ReportCols.find(
            (x) => x.key === element
          )

          if (colZomSetting?.IsConditionMustGoogleTaboolaCampaign?.()) {
            if (reportStoreV2.IsConditionMustGoogleTaboolaCampaign) continue
          }

          if (colZomSetting?.IsConditionMustTaboolaSection?.()) {
            if (reportStoreV2.IsConditionMustTaboolaSection) continue
          }
        }

        if (!reportStoreV2.listColAccepted.includes(element)) {
          reportStoreV2.listColAccepted.push(element)
        }
      }
    }

    if (reportStoreV2.isDefaultSortDate) {
      reportStoreV2.sort = [{ field: 'date', dir: 'desc' }]
    }

    if (reportStoreV2.reportSettingsNew.IsSortRevenue()) {
      if (colSetting?.key === 'date') {
        reportStoreV2.sort = [{ field: 'date', dir: 'desc' }]
      } else {
        reportStoreV2.sort = [{ field: 'net_revenue', dir: 'desc' }]
      }
    }
    return
  }

  // Uncheck
  reportStoreV2.group_by = reportStoreV2.group_by.filter(
    (x) => x !== meta.value
  )

  if (reportStoreV2.listColAccepted.includes(meta.value as string)) {
    let remove = true

    if (colSetting?.active) {
      for (const element of colSetting.active) {
        if (reportStoreV2.group_by.includes(element)) {
          remove = false
          break
        }
      }
    }

    if (remove) {
      reportStoreV2.listColAccepted.splice(
        reportStoreV2.listColAccepted.indexOf(meta.value as string),
        1
      )
    }
  }

  // Xóa liên quan
  let removeCols: string[] = []

  if (colSetting?.aOff) {
    for (const element of colSetting.aOff) {
      if (!reportStoreV2.group_by.includes(element)) {
        removeCols.push(element)
      }
    }
  }

  removeCols = removeCols.concat(colSetting?.zombies || [])

  for (const element of removeCols) {
    if (reportStoreV2.listColAccepted.includes(element)) {
      reportStoreV2.listColAccepted.splice(
        reportStoreV2.listColAccepted.indexOf(element),
        1
      )
    }
  }

  if (reportStoreV2.reportSettingsNew.IsSortRevenue()) {
    reportStoreV2.sort = [{ field: 'net_revenue', dir: 'desc' }]
  }
}

const isDisabled = (colOption: ReportColumn) => {
  if (!colOption.condition) return false

  if (colOption.IsConditionMustGoogleTaboola()) {
    if (reportStoreV2.IsConditionMustGoogleTaboola) return true
  }

  return false
}
</script>
<template>
  <div class="flex flex-col">
    <div class="flex font-bold text-xs text-gray-500 items-center">
      Dimensions:
      <n-switch
        v-model:value="showGroupBy"
        :disabled="reportStoreV2.isFetchingReport"
        class="mx-2"
        size="small"
      />
    </div>
    <n-collapse-transition :show="showGroupBy">
      <div class="flex mt-3">
        <n-checkbox-group
          v-model:value="reportStoreV2.group_by"
          :on-update:value="toggleGroupBy"
        >
          <div class="flex flex-row flex-wrap gap-1">
            <div
              v-for="(o, i) in reportStoreV2.GroupByReport"
              :key="i"
              class="w-32"
            >
              <n-popover
                trigger="hover"
                :disabled="!o.headerTooltip"
                :show-arrow="false"
              >
                <template #trigger>
                  <n-checkbox
                    :disabled="isDisabled(o)"
                    size="small"
                    :value="o.key"
                    :label="o.title"
                    class="text-xs group-wrapper-checkbox"
                  />
                </template>

                <span
                  v-html="o.headerTooltip"
                  class="text-xs text-gray-500"
                ></span>
              </n-popover>
            </div>
          </div>
        </n-checkbox-group>
      </div>
    </n-collapse-transition>
  </div>
</template>

<style lang="scss">
.group-wrapper-checkbox {
  .n-checkbox__label {
    max-width: calc(128px - 14px); /* Giới hạn chiều rộng */
    white-space: nowrap; /* Không xuống dòng */
    overflow: hidden; /* Ẩn phần nội dung bị tràn */
    text-overflow: ellipsis; /* Hiển thị dấu '...' khi bị tràn */
  }
}
</style>
