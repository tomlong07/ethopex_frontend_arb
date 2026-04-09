<script setup lang="ts">
import { ctr_rule } from '@/services/ctr_rule'

import useRuleStoreV3, { RuleTypeV3 } from '@/store/details/ruleV3'
import RuleConditions from '@/components/rule3/RuleConditions.vue'
import RuleBid from '@/components/rule3/RuleBid.vue'
import RuleBudget from '@/components/rule3/RuleBudget.vue'
import RuleLogics from '@/components/rule3/RuleLogics.vue'
import { useDrafting } from '@/composables/useDrafting'
import useModalStore from '@/store/useModalStore'
import { RuleVersion } from '@/enum/rule'
import RuleDescription from '@/components/rule3/RuleDescription.vue'
import CollapseSection from '@/components/common/CollapseSection.vue'
import { useFeSettings } from '@/composables/feSettings'

import RuleType from '@/components/rule3/RuleType.vue'
import RuleVersions from '@/components/rule3/RuleVersion.vue'
import DataFrom from '@/components/rule3/DataFrom.vue'
import ConsideringDataFrom from '@/components/rule3/ConsideringDataFrom.vue'
import ExcludeDaysFromInterval from '@/components/rule3/ExcludeDaysFromInterval.vue'
import ScheduleV2 from '@/components/rule3/ScheduleV2.vue'
import EveryByDay from '@/components/rule3/EveryByDay.vue'
import ScheduleTime from '@/components/rule3/ScheduleTime.vue'
import LandingPageType from '@/components/rule3/LandingPageType.vue'
import DailyReset from '@/components/rule3/DailyReset.vue'
import BotID from '@/components/rule3/BotID.vue'
import ChatID from '@/components/rule3/ChatID.vue'
import TrafficSources from '@/components/rule3/TrafficSources.vue'
import DemandSources from '@/components/rule3/DemandSources.vue'
import LocationsGoogle from '@/components/rule3/LocationsGoogle.vue'
import LocationsFacebook from '@/components/rule3/LocationsFacebook.vue'
import Users from '@/components/rule3/Users.vue'
import RepeatMode from '@/components/rule3/RepeatMode.vue'
import Section from '@/components/rule3/Section.vue'
import Label from '@/components/rule3/Label.vue'
import PromotionStatus from '@/components/rule3/PromotionStatus.vue'
import OptionTarget from '@/components/rule3/OptionTarget.vue'
import ModalBulkEntry from '@/components/rule3/ModalBulkEntry.vue'
import AddCampaign from '@/components/rule3/add_campaign/AddCampaign.vue'
import TimeStart from '@/components/rule3/stop_campaign/TimeStart.vue'
import TimeEnd from '@/components/rule3/stop_campaign/TimeEnd.vue'
import CP from '@/components/rule3/CP.vue'
import ApplyPerformanceGoal from '@/components/rule3/ApplyPerformanceGoal.vue'
import CampaignTags from '@/components/rule3/CampaignTags.vue'
import { TITLE_DEFAULT } from '@/constants/app'
import TopicID from '@/components/rule3/TopicID.vue'
import AddDuplicate from '@/components/rule3/add_campaign/AddDuplicate.vue'
import { BiddingOptionsDuplicate } from '@/options/campaign'
import ApplyRule from '@/components/rule3/ApplyRule.vue'

const SkeletonDetailCenter = defineAsyncComponent(
  () => import('@/components/skeleton/SkeletonDetailCenter.vue')
)

const BackPage = defineAsyncComponent(
  () => import('@/components/common/BackPage.vue')
)

const NotifyTelegram = defineAsyncComponent(
  () => import('@/components/rule3/NotifyTelegram.vue')
)

const ruleStoreV3 = useRuleStoreV3()
const modalStore = useModalStore()

const name = 'rule'
const { draftingData } = useDrafting(name)
const feSettings = toRef(ruleStoreV3, 'feSettings')
useFeSettings(feSettings, window.route?.meta?.url as string)

ruleStoreV3.id = Number(window.route.params.id || 0)

ruleStoreV3.isClonePage =
  (window.route?.path?.includes('clone') as boolean) || false
const isLoadingDraft = computed(() => modalStore.isLoading || false)

onMounted(async () => {
  modalStore.title = name

  ruleStoreV3.fetchPermissionAsyncConfigs(window.route?.meta?.url as string)

  ruleStoreV3.isLoading = true
  let dataRaw

  if (ruleStoreV3.isEditPage) {
    const ruleResult = await ctr_rule.Get({ id: ruleStoreV3.id })
    if (!ruleResult?.status) return

    dataRaw = ruleResult?.data || {}

    if (ruleStoreV3.isClonePage) {
      dataRaw.id = 0
      dataRaw.name = `${dataRaw.name} (Clone)`
    }
  }

  ruleStoreV3.initData(dataRaw)

  ruleStoreV3.isLoading = false
  applyTitle(ruleStoreV3.ruleV3?.name || TITLE_DEFAULT)
})

const applyTitle = (suffix: string) => {
  const rx = /\s\|\|\s.*$/

  if (rx.test(document.title)) {
    document.title = document.title.replace(rx, ` || ${suffix}`)
  } else {
    document.title = `${document.title} || ${suffix}`
  }
}

watch(
  () => modalStore.result,
  (v) => {
    if (v && !ruleStoreV3.isEditPage) {
      ruleStoreV3.ruleV3 = new RuleTypeV3(v, true)
      ruleStoreV3.ruleV3.version = RuleVersion.V2
    }
  }
)

watch(
  () => ruleStoreV3.ruleV3,
  (v) => {
    if (v && !ruleStoreV3.isEditPage) {
      draftingData(toRef(v))
    }
  }
)

const isComp = window.arb.isCompany()
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <n-tabs
        type="line"
        animated
        default-value="ruleid"
        v-if="ruleStoreV3.isEditPage && !ruleStoreV3.isClonePage"
      >
        <n-tab-pane name="ruleid">
          <template #tab>
            <a
              :href="`/rule/edit/${ruleStoreV3.id}`"
              class="no-underline text-inherit"
              @click.stop
            >
              Rule Edit
            </a>
          </template>
        </n-tab-pane>

        <n-tab-pane name="satisfy">
          <template #tab>
            <a
              :href="`/satisfy?rule_id=${ruleStoreV3.id}&time=all`"
              class="no-underline text-inherit"
              @click.stop
            >
              Satisfy
            </a>
          </template>
        </n-tab-pane>
      </n-tabs>

      <BackPage
        v-if="feSettings?.page_list"
        :url="feSettings?.page_list"
        :name="name"
        class="mt-4"
      />
      <SkeletonDetailCenter
        v-if="
          ruleStoreV3.isLoading || (isLoadingDraft && ruleStoreV3.isAddPage)
        "
      />
      <div
        v-else
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <ModalBulkEntry />

        <CollapseSection name="info" header="Info">
          <Rule3Name />
          <RuleDescription />
        </CollapseSection>

        <CollapseSection name="setup" header="Setup">
          <Rule3Status />

          <RuleType />
          <RuleVersions v-if="false" />
          <DataFrom />
          <ConsideringDataFrom />
          <ExcludeDaysFromInterval />
          <ScheduleV2 />
          <Rule3Schedule />
          <EveryByDay />

          <ScheduleTime />

          <TimeStart />
          <TimeEnd />

          <RepeatMode />

          <LandingPageType />
          <Rule3Global v-if="ruleStoreV3.asyncConfigs.setGlobal" />
          <Rule3Preview />
          <DailyReset />

          <NotifyTelegram v-if="isComp" />
          <BotID />
          <ChatID />
          <TopicID />
        </CollapseSection>

        <CollapseSection
          v-show="ruleStoreV3.ruleV3.isNotDataFromLink()"
          name="apply_rule"
          header="Apply Rule"
          popover="Set conditions to determine when the rule applies (e.g., by
              traffic source, demand source, campaign, etc.)."
        >
          <TrafficSources />
          <ApplyPerformanceGoal />
          <DemandSources />
          <CP />
          <Users />
          <LocationsGoogle />
          <LocationsFacebook />
          <OptionTarget />
          <Rule3Campaigns />
          <Rule3KeywordSet />

          <Section />
          <RuleBidding />
          <RuleDeliveryStatus />
          <Label />
          <PromotionStatus />
          <CampaignTags />
          <Rule3AdAccount />
          <ApplyRule />
          <FloatingWrapper
            name="Bidding Strategy"
            v-if="ruleStoreV3.ruleV3.IsHasTSFacebook()"
          >
            <n-select
              v-model:value="ruleStoreV3.ruleV3.apply_bidding_strategy"
              clearable
              :placeholder="''"
              :options="BiddingOptionsDuplicate"
            />
          </FloatingWrapper>
        </CollapseSection>

        <Rule3ListLink />

        <Rule3Limit />

        <AddCampaign v-show="ruleStoreV3.ruleV3.isAddCampaignRule()" />

        <RuleConditions />

        <RuleLogics />
        <AddDuplicate v-show="ruleStoreV3.ruleV3.isAddDuplicateRule()" />
        <RuleBid />

        <RuleBudget />

        <Rule3Submit />
      </div>
    </div>
  </div>
</template>
