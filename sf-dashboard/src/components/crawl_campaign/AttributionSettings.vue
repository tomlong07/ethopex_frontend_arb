<script setup lang="ts">
import { ClickThroughOptions, DayOptions } from '@/options/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import modalCrawlCamp from '@/store/modalCrawlCamp'
const storeModalCrawl = modalCrawlCamp()

const name = 'Click-through'
const name2 = 'Engaged-view (For video only)'
const name3 = 'View-through'

const click_through = defineModel<number>('click_through')
const engaged_view = defineModel<number>('engaged_view')
const view_through = defineModel<number>('view_through')
</script>

<template>
  <div
    class="flex"
    :class="[
      storeModalCrawl.isInsideDrawer
        ? 'flex-col items-start gap-4'
        : 'flex-row items-center gap-2',
    ]"
  >
    <FloatingWrapper :name="name" rounded>
      <n-select
        v-model:value="click_through"
        :placeholder="name"
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

    <FloatingWrapper :name="name2" rounded>
      <n-select
        v-model:value="engaged_view"
        :placeholder="name2"
        :options="DayOptions"
      />
      <template #extra>
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
          </template>
          Engaged-view conversions are counted when a video ad is played for at
          least 10 seconds, or for 97% of its total length if it’s shorter than
          10 seconds, and someone takes an action within 1 day.<br />
          For example, with 1-day engaged-view, our system will learn from
          conversions that happen within 1 day and show ads to people most
          likely to convert in a day. <br />
          Engaged-view is available for all placements except Facebook in-stream
          video ads, which can’t be skipped.
        </n-popover>
      </template>
    </FloatingWrapper>

    <FloatingWrapper :name="name3" rounded>
      <n-select
        v-model:value="view_through"
        :placeholder="name3"
        :options="DayOptions"
      />
      <template #extra>
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
          </template>
          View-through is when someone sees your ad, doesn't click it, but still
          takes an action within the period of time you select.
          <br />We’ll learn from your view-through conversions and show your ads
          to people likely to convert within the same period of time.
        </n-popover>
      </template>
    </FloatingWrapper>
  </div>
</template>
