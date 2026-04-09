<script setup lang="ts">
import {
  FreezeClass,
  adGroups,
  campaignTypeClass,
} from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { SelectOption } from 'naive-ui'
import { ATTRIBUTION_SETTING } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import {
  AttributionOptions,
  ClickThroughOptions,
  DayOptions,
} from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const show = ref<boolean>(false)

const attrOptions = computed<SelectOption[]>(() => {
  return AttributionOptions.map((opt) => ({
    ...opt,
    disabled:
      opt.value === ATTRIBUTION_SETTING.INCREMENTAL &&
      props.campaign.IsOnAdvantageCampaignBudget() &&
      !props.campaign.IsFBHighestBid(),
  }))
})

const name = 'Click-through'
const name2 = 'Engaged-view (For video only)'
const name3 = 'View-through'
const nameAtt = 'Attribution setting'

const text = computed<string>(() => {
  if (show.value) return 'Hide options'

  return 'Show more options'
})

watch(
  () => props.adgroup.attribution,
  (newValue) => {
    if (newValue === ATTRIBUTION_SETTING.INCREMENTAL) {
      props.adgroup.cost_per_result = null
    }
  }
)

const isShow = computed(() => {
  return !(props.adgroup.attribution === ATTRIBUTION_SETTING.INCREMENTAL)
})
</script>

<template>
  <div class="flex gap-4 flex-col">
    <div class="flex items-center gap-2">
      <div class="w-30">
        <n-button @click="show = !show" class="w-full text-xs" size="small">{{
          text
        }}</n-button>
      </div>
    </div>

    <div v-show="show" class="flex gap-4 flex-col">
      <FloatingWrapper :name="nameAtt" rounded>
        <n-radio-group
          v-model:value="props.adgroup.attribution"
          class="border rounded-md p-2"
        >
          <n-space>
            <n-radio
              v-for="conv in attrOptions"
              :key="conv.value"
              :value="conv.value"
              :label="(conv.label as string)"
              :disabled="props.FreezeData.isEditPage() || conv.disabled"
            />
          </n-space>
        </n-radio-group>
      </FloatingWrapper>

      <FloatingWrapper :name="name" rounded v-show="isShow">
        <n-select
          v-model:value="props.adgroup.click_through"
          :placeholder="name"
          :disabled="props.FreezeData.isEditPage() && !!props.adgroup.id"
          :options="ClickThroughOptions"
        />
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            Click-through is when someone clicks your ad and converts within the
            period of time you select.<br />
            We’ll learn your click-through conversions, and show your ads to
            people likely to click-through within the same period of time.
          </n-popover>
        </template>
      </FloatingWrapper>

      <FloatingWrapper :name="name2" rounded v-show="isShow">
        <n-select
          v-model:value="props.adgroup.engaged_view"
          :placeholder="name2"
          :disabled="props.FreezeData.isEditPage() && !!props.adgroup.id"
          :options="DayOptions"
        />
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            Engaged-view conversions are counted when a video ad is played for
            at least 10 seconds, or for 97% of its total length if it’s shorter
            than 10 seconds, and someone takes an action within 1 day.<br />
            For example, with 1-day engaged-view, our system will learn from
            conversions that happen within 1 day and show ads to people most
            likely to convert in a day. <br />
            Engaged-view is available for all placements except Facebook
            in-stream video ads, which can’t be skipped.
          </n-popover>
        </template>
      </FloatingWrapper>

      <FloatingWrapper :name="name3" rounded v-show="isShow">
        <n-select
          v-model:value="props.adgroup.view_through"
          :placeholder="name3"
          :disabled="props.FreezeData.isEditPage() && !!props.adgroup.id"
          :options="DayOptions"
        />
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            View-through is when someone sees your ad, doesn't click it, but
            still takes an action within the period of time you select.
            <br />We’ll learn from your view-through conversions and show your
            ads to people likely to convert within the same period of time.
          </n-popover>
        </template>
      </FloatingWrapper>
    </div>
  </div>
</template>
