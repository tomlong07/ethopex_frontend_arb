<script setup lang="ts">
import TopBar from '@/components/report-v3/TopBar.vue'
import SettingConfig from '@/components/report-v3/SettingConfig.vue'
import ReportChart from '@/components/report-v3/ReportChart.vue'
import ReportGroupBy from '@/components/report-v3/ReportGroupBy.vue'
import ReportOrderBy from '@/components/report-v3/ReportOrderBy.vue'
import ReportProfile from '@/components/report-v3/ReportProfile.vue'
import ReportColDisplay from '@/components/report-v3/ReportColDisplay.vue'
import ReportTableV2 from '@/components/report-v3/ReportTableV2.vue'

const ActivityModal = defineAsyncComponent(
  () => import('@/components/modal/ActivityModal.vue')
)

const ModalRecommendation = defineAsyncComponent(
  () => import('@/components/report-v3/modal/ModalRecommendation.vue')
)

const NoteModal = defineAsyncComponent(
  () => import('@/components/report-v3/modal/NoteModal.vue')
)

const RuleSatisfyWrapper = defineAsyncComponent(
  () => import('@/components/report-v3/modal/RuleSatisfyWrapper.vue')
)

import useGeneralStore from '@/store/useGeneralStore'
import { useReportV2 } from '@/store/report/report-v2'
import { ReportV2 } from '@/constants/report-v2'
import ReportFilter2 from '@/components/report-v3/ReportFilter2.vue'
import { ID_STORAGE_PROFILE } from '@/constants/storage'
import { ctr_report } from '@/services/ctr_report'

const reportStoreV2 = useReportV2(helper.truePath())()
const generalStore = useGeneralStore()

const isLoading = ref<boolean>(false)

const reportTableCompV2 = ref<InstanceType<typeof ReportTableV2>>()

onBeforeMount(() => {
  reportStoreV2.fetchPrefetch()
})

const getSetting = async () => {
  const result = await ctr_report.MoreSettingOverview(helper.truePath())

  if (result?.data?.settings) {
    const newData = JSON.parse(result?.data?.settings)
    reportStoreV2.changeReportSettings(newData)
  }
}

const handleProfile = async () => {
  const profileID = Number(window.route?.query['profile_id'])

  if (!profileID) return

  const found = await reportStoreV2.profileChangeHandle(profileID, true)
  if (!found) return
  return true
}

const getListFilters = async () => {
  if (!reportStoreV2.reportOptions.filter) return
  await reportStoreV2.fetchFilterOpts(reportStoreV2.reportOptions.filter, {
    path_url: helper.truePath(),
  })
}

const setDefaultSort = () => {
  if (!reportStoreV2.isDefaultSortDate) return
  reportStoreV2.sort = [{ field: 'date', dir: 'desc' }]
}

const initCharts = async () => {
  if (!reportStoreV2.isShowChart) return
  await reportStoreV2.callReportChart()
  reportStoreV2.renderChartV2()
}

const handlePlkData = async () => {
  if (!window.route.query?.plk) {
    reportStoreV2.size = reportStoreV2.reportSettingsNew.pageSize ?? 10
    return
  }
  const dataPlk = await reportStoreV2.fetchFilterByPlk(
    window.route.query?.plk as string
  )

  if (!dataPlk) return

  //Ko dùng plk của router khác

  if (dataPlk.path !== reportStoreV2.reportOptions.table) return

  reportStoreV2.setDataByPlk(dataPlk)

  return true
}

onMounted(async () => {
  const notifyNow = generalStore.notifyNow(window.route?.meta?.url as string)

  if (notifyNow) {
    window.message.info(notifyNow, {
      duration: 0,
      closable: true,
    })
  }

  //Chưa tối ưu đoạn này bất đồng bộ hay gì đó cho nhanh hơn
  await reportStoreV2.fetchOpts({
    path_url: helper.truePath(),
  })

  //chưa tối ưu đoạn này cho fecth col và fetch table bất đồng bộ, chỉ để render table cần await thôi

  await Promise.all([
    reportStoreV2.fetchCols(reportStoreV2.reportOptions.col),
    reportStoreV2.prepareProfileOption(),
    getSetting(),
    reportStoreV2.fetchPermission(),
    reportStoreV2.fetchChartSettings(),
    reportStoreV2.fetchCampaignSettings(),
  ])

  await getListFilters()

  const isPlk = await handlePlkData()

  const isProfile = await handleProfile()

  if (!isPlk && !isProfile) {
    let isDefaultProfile = false

    if (!reportStoreV2.reportSettingsNew.saveLastView) {
      isDefaultProfile = true
    }

    if (!isDefaultProfile) {
      const dataStorage = localStorage.getItem(
        ReportV2.KEY_STORAGE_SAVE_REPORT + helper.truePath()
      )

      if (reportStoreV2.reportSettingsNew.saveLastView && dataStorage) {
        try {
          reportStoreV2.setDataByPlk(JSON.parse(dataStorage))
        } catch (error) {
          console.error(error)

          isDefaultProfile = true
        }
      }
    }
    if (isDefaultProfile) {
      await reportStoreV2.profileChangeHandle(-2, true)
      reportStoreV2.isShowChart = false
    }
  }

  reportStoreV2.handleURLQueries(window.route?.query)

  setDefaultSort()

  localStorage.setItem(
    ID_STORAGE_PROFILE,
    reportStoreV2.profileSelectedId.toString()
  )

  reportStoreV2.reportFilterOpts.loading = false

  reportStoreV2.isReady = true

  initCharts()

  await reportTableCompV2.value?.replaceTableData()
  fmt.Println('onMounted')

  isLoading.value = false
})

const isShowRuleTest = window.arb.isDev() || window.arb.isAnt()
</script>

<template>
  <div class="flex flex-col px-3 flex-1 custom-bg-main-dark-mode">
    <div
      class="flex flex-col mt-3 justify-between relative bg-gray-100 border report-container-wrapper mb-3 rounded-[6px] custom-border-report"
    >
      <TopBar />
      <SettingConfig />
      <ReportFilter2 v-if="reportStoreV2.reportOptions.hasFilter()" />
      <ReportChart v-if="!isLoading" />
      <div class="flex p-2 report-child-wrapper px-4 py-2">
        <ReportGroupBy />
        <ReportOrderBy v-if="reportStoreV2.reportOptions.orderBy?.length" />
        <ReportProfile v-if="reportStoreV2.reportOptions.profile" />
      </div>

      <ReportColDisplay />
    </div>

    <ReportTableV2 v-if="!isLoading" ref="reportTableCompV2" />

    <!-- chưa tối ưu cho modal lazy load -->
    <ActivityModal />
    <ModalRecommendation />
    <NoteModal v-if="reportStoreV2.hasPermissionNote" />
    <RuleSatisfyWrapper v-if="isShowRuleTest" />
  </div>
</template>

<style lang="scss">
@use '@/css/DialogLandingReport.scss';

.report-container-wrapper {
  .report-child-wrapper:first-child {
    border-top: none; /* Xóa border trên cùng của div đầu tiên */
  }

  .report-child-wrapper:last-child {
    border-bottom: none; /* Border dưới cùng của div cuối */
  }
}
</style>
