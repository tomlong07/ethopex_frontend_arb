<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'

function defineAsyncWithRetry<T extends Component>(
  loader: () => Promise<T>,
  options?: {
    delay?: number
    maxRetries?: number
    retryDelay?: number
    onFail?: (error: unknown) => void
  }
) {
  const {
    delay = 0, // thời gian chờ trước khi mount
    maxRetries = 2, // số lần retry
    retryDelay = 2000, // delay giữa các lần retry
    onFail = (err: any) =>
      console.error('❌ Failed to load async component:', err),
  } = options || {}

  return defineAsyncComponent({
    loader: async () => {
      if (delay) await new Promise((r) => setTimeout(r, delay))
      return loader()
    },
    onError: async (error, retry, fail, attempts) => {
      console.warn(`⚠️ Load failed (attempt ${attempts})`, error)

      if (attempts <= maxRetries) {
        await new Promise((r) => setTimeout(r, retryDelay))
        retry()
      } else {
        onFail(error)
        fail()
      }
    },
  })
}

const templateV2Store = useTemplateV2(helper.truePath())()

const columnComponent = computed(() => {
  switch (templateV2Store.baseConfigs.colV2) {
    case 'account_x83':
      return defineAsyncWithRetry(
        () => import('@/components/account/LinkedAccountColumns.vue')
      )

    case 'campaign_j46':
      return defineAsyncWithRetry(
        () => import('@/components/campaign/CampaignColumns.vue')
      )

    case 'creative_hj1':
      return defineAsyncWithRetry(() => import('./columns/CreativeColumns.vue'))

    case 'creative_title_rm4':
      return defineAsyncWithRetry(
        () => import('./columns/CreativeTitleColumns.vue')
      )

    case 'creative_image_gg0':
      return defineAsyncWithRetry(
        () => import('./columns/CreativeImageColumns.vue')
      )

    case 'creative_site_name_ftz':
      return defineAsyncWithRetry(
        () => import('./columns/CreativeSitenameColumns.vue')
      )

    case 'landing-page_q13':
      return defineAsyncWithRetry(
        () => import('./columns/LandingPageColumns.vue')
      )

    case 'keyword-set_zn5':
      return defineAsyncWithRetry(
        () => import('./columns/KeywordSetColumns.vue')
      )

    case 'crawl-campaign_l09':
      return defineAsyncWithRetry(
        () => import('./columns/CrawlCampaignColumn.vue')
      )

    case 'default-account_nz3':
      return defineAsyncWithRetry(
        () => import('./columns/DefaultAccountColumn.vue')
      )

    case 'global-config_uxs':
      return defineAsyncWithRetry(
        () => import('./columns/ConfigByGGColumn.vue')
      )

    case 'crawl-facebook_x19':
      return defineAsyncWithRetry(
        () => import('./columns/ConfigByFBColumn.vue')
      )

    case 'crawl-taboola_q2s':
      return defineAsyncWithRetry(
        () => import('./columns/ConfigByTaboolaColumn.vue')
      )

    case 'creative-request_dmi':
      return defineAsyncWithRetry(
        () => import('./columns/CreativeRequestColumn.vue')
      )

    case 'audience_zx0':
      return defineAsyncWithRetry(
        () => import('./columns/AudienceListColumn.vue')
      )

    case 'segment_ni1':
      return defineAsyncWithRetry(
        () => import('./columns/AudienceSegmentColumn.vue')
      )

    case 'demand-account_xa0':
      return defineAsyncWithRetry(
        () => import('./columns/DemandAccountColumn.vue')
      )

    case 'account-category_iu6':
      return defineAsyncWithRetry(
        () => import('./columns/AccountCategoryColumn.vue')
      )

    case 'account-ad_r23':
      return defineAsyncWithRetry(
        () => import('./columns/ManagerAccountColumn.vue')
      )

    case 'manager-facebook-business_s09':
      return defineAsyncWithRetry(
        () => import('./columns/ManagerBusinessColumn.vue')
      )
    case 'manager-facebook-via_d28':
      return defineAsyncWithRetry(
        () => import('./columns/ManagerViaColumn.vue')
      )

    case 'manager-facebook-fanpage_c11':
      return defineAsyncWithRetry(
        () => import('./columns/ManagerFanpageColumn.vue')
      )

    case 'asset-group_qw5':
      return defineAsyncWithRetry(
        () => import('./columns/AssetGroupColumn.vue')
      )

    case 'google-appeal-question_p15':
      return defineAsyncWithRetry(
        () => import('./columns/GGAppealQuestionColumn.vue')
      )

    case 'category-site-builder_1gt':
      return defineAsyncWithRetry(
        () => import('./columns/CategorySiteBuilderColumn.vue')
      )

    case 'pixel_sl9':
      return defineAsyncWithRetry(() => import('./columns/PixelColumn.vue'))

    case 'ping-pixel_qw1':
      return defineAsyncWithRetry(() => import('./columns/PingPixelColumn.vue'))

    case 'pixel_triggers_113':
      return defineAsyncWithRetry(
        () => import('./columns/PixelTriggerColumn.vue')
      )

    case 'label-manager_098':
      return defineAsyncWithRetry(
        () => import('./columns/LabelManagerColumn.vue')
      )

    case 'domain-config_st8':
      return defineAsyncWithRetry(
        () => import('./columns/DomainConfigColumn.vue')
      )

    case 'domain-manager_cp4':
      return defineAsyncWithRetry(
        () => import('./columns/DomainManagerColumn.vue')
      )

    case 'traffic_dda':
      return defineAsyncWithRetry(
        () => import('./columns/TrafficConfigColumn.vue')
      )

    case 'demand_lol':
      return defineAsyncWithRetry(
        () => import('./columns/DemandConfigColumn.vue')
      )

    case 'role_d22':
      return defineAsyncWithRetry(() => import('./columns/RoleColumn.vue'))

    case 'user_s1s':
      return defineAsyncWithRetry(() => import('./columns/UserColumn.vue'))

    case 'layout_at7':
      return defineAsyncWithRetry(() => import('./columns/LayoutColumn.vue'))

    case 'prompt_m11':
      return defineAsyncWithRetry(() => import('./columns/PromptColumn.vue'))

    case 'campaign-keywords-manager_nnz':
      return defineAsyncWithRetry(
        () => import('./columns/CampaignKeywordManagerColumn.vue')
      )

    case 'payments_fd3':
      return defineAsyncWithRetry(() => import('./columns/InvoiceColumn.vue'))

    case 'final-report_ht7':
      return defineAsyncWithRetry(
        () => import('./columns/FinalReportColumn.vue')
      )

    case 'funds_ko2':
      return defineAsyncWithRetry(() => import('./columns/FundsColumn.vue'))

    case 'invalid_ojt':
      return defineAsyncWithRetry(() => import('./columns/InvalidColumn.vue'))

    case 'test-budget_mq1':
      return defineAsyncWithRetry(
        () => import('./columns/TestBudgetColumn.vue')
      )

    case 'email-list_sc1':
      return defineAsyncWithRetry(() => import('./columns/EmailListColumn.vue'))

    case 'top-keyword_23o':
      return defineAsyncWithRetry(
        () => import('./columns/TopSearchKeywordColumn.vue')
      )

    case 'rule_qq2':
      return defineAsyncWithRetry(() => import('./columns/RuleColumn.vue'))

    case 'satisfy_uya':
      return defineAsyncWithRetry(() => import('./columns/SatisfyColumn.vue'))

    case 'google-performance_d13':
      return defineAsyncWithRetry(
        () => import('./columns/GGPerformanceColumn.vue')
      )

    case 'block-app-category_d13':
      return defineAsyncWithRetry(
        () => import('./columns/BlockAppCategoryColumn.vue')
      )

    case 'google-exclude-list_yr1':
      return defineAsyncWithRetry(
        () => import('./columns/GGExcludeListColumn.vue')
      )

    case 'google-targeting_pl0':
      return defineAsyncWithRetry(
        () => import('./columns/GGTargetingColumn.vue')
      )

    case 'google-performance-rule_xs4':
      return defineAsyncWithRetry(
        () => import('./columns/GGPerformanceRuleColumn.vue')
      )

    case 'block_section_pio':
      return defineAsyncWithRetry(
        () => import('./columns/BlockSectionColumn.vue')
      )

    case 'ab-test-logs_75a':
      return defineAsyncWithRetry(
        () => import('@/components/ab_test/ABTestLogColumn.vue')
      )

    case 'cronjob_hyu':
      return defineAsyncWithRetry(() => import('./columns/CronjobColumn.vue'))

    case 'crawl-google_ox0':
      return defineAsyncWithRetry(
        () => import('./columns/CrawlGoogleColumn.vue')
      )

    case 'prompt-log-j35':
      return defineAsyncWithRetry(
        () => import('./columns/PromptLogColumns.vue')
      )

    case 'prompt-rule_ajy':
      return defineAsyncWithRetry(
        () => import('./columns/PromptRuleColumns.vue')
      )

    case 'form-registration_sop':
      return defineAsyncWithRetry(
        () => import('./columns/InfoContactColumns.vue')
      )

    case 'telegram-bot_t22':
      return defineAsyncWithRetry(
        () => import('./columns/TelegramBotColumns.vue')
      )

    case 'telegram-chat_qs8':
      return defineAsyncWithRetry(
        () => import('./columns/TelegramChatColumns.vue')
      )

    case 'telegram-topic_mr2':
      return defineAsyncWithRetry(
        () => import('./columns/TelegramTopicColumns.vue')
      )

    case 'postback_mq1':
      return defineAsyncWithRetry(
        () => import('./columns/PostBackColumns.vue')
      )
    
    case 'brand_1sk':
      return defineAsyncWithRetry(
        () => import('./columns/BrandColumn.vue')
      )

    case 'notify_qpx':
      return defineAsyncWithRetry(
        () => import('./columns/NotifyColumn.vue')
      )

    default:
      return null
  }
})

//Xử lí case columns load chậm mà table render ra trước gây lỗi render component column ở aggrid
const loaded = () => {
  templateV2Store.reAssignColumns = Date.now()
}
</script>

<template>
  <Suspense @resolve="loaded">
    <template #default>
      <component :is="columnComponent" v-if="columnComponent" />
    </template>
  </Suspense>
</template>
