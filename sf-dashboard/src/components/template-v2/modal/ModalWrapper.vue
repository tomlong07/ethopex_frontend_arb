<script setup lang="ts">
import ModalPayments from '@/components/payment/ModalPayments.vue'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const RoleAddAccountDemand = defineAsyncComponent(
  () => import('@/components/user/RoleAddAccountDemand.vue')
)

const AccountAdModal = defineAsyncComponent(
  () => import('@/components/account/modal/AccountAdModal.vue')
)

const BulkAccountsModal = defineAsyncComponent(
  () => import('@/components/account/modal/BulkAccountsModal.vue')
)

const ManagerFbBusinessModal = defineAsyncComponent(
  () => import('@/components/facebookvia/ManagerFbBusinessModal.vue')
)

const AddBonusModalV2 = defineAsyncComponent(
  () => import('@/components/payment/AddBonusModal.vue')
)

const DomainManagerLabelsModal = defineAsyncComponent(
  () => import('@/components/domain_manager/DomainManagerLabelsModal.vue')
)

const ModalRecommendation = defineAsyncComponent(
  () => import('@/components/report-v3/modal/ModalRecommendation.vue')
)

const ModalSatify = defineAsyncComponent(
  () =>
    import('@/components/google_performance_rule/GGPerformanceModalSatify.vue')
)

const ModalGenerateAICampaign = defineAsyncComponent(
  () => import('@/components/crawl_campaign/ModalGenerateAICampaign.vue')
)

const ModalLandingLink = defineAsyncComponent(
  () => import('@/components/landing_page/modal/ModalLandingLink.vue')
)

const ModalAdAccount = defineAsyncComponent(
  () => import('@/components/account/modal/ModalAdAccount.vue')
)

const ModalUserLabel = defineAsyncComponent(
  () => import('@/components/user/ModalUserLabel.vue')
)
const ModalRuleSatisfy = defineAsyncComponent(
  () => import('@/components/rule3/satisfy/ModalRuleSatisfy.vue')
)

const ModalPromptLog = defineAsyncComponent(
  () => import('@/components/prompt_log/ModalPromptLog.vue')
)

const ExampleDrawerPromptLog = defineAsyncComponent(
  () => import('@/components/prompt_log/ExampleDrawerPromptLog.vue')
)

const ModalSocialName = defineAsyncComponent(
  () => import('@/components/user/ModalSocialName.vue')
)
</script>

<template>
  <RoleAddAccountDemand v-if="templateV2Store.baseConfigs.IsModalRole()" />
  <ModalPayments v-if="templateV2Store.baseConfigs.IsModalPayment()" />
  <AccountAdModal v-if="templateV2Store.baseConfigs.IsModalAccountAd()" />
  <BulkAccountsModal
    v-if="templateV2Store.baseConfigs.IsModalAccountAdBulk()"
  />
  <ManagerFbBusinessModal
    v-if="templateV2Store.baseConfigs.IsModalManagerFbBusiness()"
  />
  <AddBonusModalV2 v-if="templateV2Store.baseConfigs.IsModalAddBonus()" />
  <DomainManagerLabelsModal
    v-if="templateV2Store.baseConfigs.IsModalDomainManager()"
  />
  <ModalRecommendation
    v-if="templateV2Store.baseConfigs.IsModalRecommendation()"
  />

  <ModalSatify v-if="templateV2Store.baseConfigs.IsModalSatifyPerformance()" />
  <ModalGenerateAICampaign
    v-if="templateV2Store.baseConfigs.IsModalCrawlKeyword()"
  />
  <ModalLandingLink v-if="templateV2Store.baseConfigs.IsModalLandingLink()" />
  <ModalAdAccount v-if="templateV2Store.baseConfigs.IsModalAssetGroup()" />
  <ModalUserLabel v-if="templateV2Store.baseConfigs.IsModalUserMd12()" />
  <ModalRuleSatisfy v-if="templateV2Store.baseConfigs.IsModalSatisfy()" />
  <ModalPromptLog v-if="templateV2Store.baseConfigs.IsModalPromptLog()" />
  <ExampleDrawerPromptLog
    v-if="templateV2Store.baseConfigs.IsModalPromptLog()"
  />
  <ModalSocialName v-if="templateV2Store.baseConfigs.IsModalSocialName()" />
</template>
