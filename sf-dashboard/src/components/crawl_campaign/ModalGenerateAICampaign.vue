<script setup lang="ts">
import { DS, ONOFF } from '@/enum/campaign'
import modalCrawlCamp from '@/store/modalCrawlCamp'
import { TS } from '@/enum/campaign'

import { useTemplateV2 } from '@/store/templateV2Store'
import LanguageSelector from '@/components/common/LanguageSelector.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { INPUT_SOURCE } from '@/enum/crawl_campaign'
import CrawlLocation from '@/components/crawl_campaign/CrawlLocation.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import {
  INPUT_SOURCE_FACEBOOK,
  INPUT_SOURCE_OTHERS,
  INPUT_SOURCE_TABOOLA,
} from '@/options/crawl_campaign'

const DrawerCrawl = defineAsyncComponent(
  () => import('@/components/crawl_campaign/DrawerCrawl.vue')
)

const templateV2Store = useTemplateV2(helper.truePath())()
const storeModalCrawl = modalCrawlCamp()

const isSubmitting = ref(false)
const crawlLocationRef = ref<InstanceType<typeof CrawlLocation>>()
const isAdm = window.arb.isAdmin()

// const trafficSourceOptions = [{ label: 'Google', value: TS.GOOGLE }]
const demandSourceOptions = [
  { label: 'Google', value: DS.ADSENSE },
  { label: 'Bing 01', value: DS.BING1 },
]
const LAST_TRAFFIC_SOURCE_KEY = 'lastSelectedTrafficSource'

const inputTypeOptions = computed(() => {
  if (storeModalCrawl.dataCrawlCamp.IsFacebookTS()) return INPUT_SOURCE_FACEBOOK
  if (storeModalCrawl.dataCrawlCamp.IsTaboolaTS()) return INPUT_SOURCE_TABOOLA
  return INPUT_SOURCE_OTHERS.map((item) => {
    if (item.value === INPUT_SOURCE.TARGET_AUDIENCE) {
      return {
        ...item,
        disabled:
          storeModalCrawl.dataCrawlCamp.IsGoogleTS() && !window.arb.isAdmin(),
      }
    }
    return item
  })
})

const trafficSourceOptions = computed(() => {
  if (window.arb.isDev()) {
    return [
      { label: 'Google', value: TS.GOOGLE },
      { label: 'Facebook', value: TS.FACEBOOK },
      { label: 'Taboola', value: TS.TABOOLA },
    ]
  }
  return [
    { label: 'Google', value: TS.GOOGLE },
    { label: 'Facebook', value: TS.FACEBOOK },
  ]
})
const getStorageKey = (trafficSource?: TS) => {
  if (!trafficSource) return
  return `dataCrawlCamp_${trafficSource}-v2`
}

// change traffic source
const handleTrafficSourceChange = async (value: TS) => {
  storeModalCrawl.dataCrawlCamp.config_default = undefined
  sessionStorage.setItem(LAST_TRAFFIC_SOURCE_KEY, value)
  const key = getStorageKey(value)
  let isHandle = false
  if (key) {
    const savedData = sessionStorage.getItem(key)
    if (savedData) {
      try {
        const oldData = JSON.parse(savedData)

        storeModalCrawl.setData(oldData)
      } catch {
        storeModalCrawl.dataCrawlCamp.SetDefaultLocation()
        storeModalCrawl.dataCrawlCamp.traffic_source = value
      }

      isHandle = true
    }
  }

  if (!isHandle) {
    storeModalCrawl.dataCrawlCamp.SetDefaultLocation()
    storeModalCrawl.dataCrawlCamp.traffic_source = value
    storeModalCrawl.dataCrawlCamp.config_default = null
  }

  storeModalCrawl.dataCrawlCamp.SetInputSourceTargetAudience()

  await nextTick()
  crawlLocationRef.value?.fetchLocations()
}

const getLastTrafficSource = (): TS | null => {
  const saved = sessionStorage.getItem(LAST_TRAFFIC_SOURCE_KEY)

  return saved ? (saved as TS) : null
}

// Khi mở modal fetch lấy dữ liệu location
watch(
  () => storeModalCrawl.showModal,
  (isVisible) => {
    if (isVisible) {
      const lastTrafficSource = getLastTrafficSource()
      const currentTrafficSource =
        lastTrafficSource || storeModalCrawl.dataCrawlCamp.traffic_source

      if (!currentTrafficSource) return
      const key = getStorageKey(currentTrafficSource)
      if (!key) return

      const sessionData = sessionStorage.getItem(key)

      if (sessionData) {
        try {
          const oldData = JSON.parse(sessionData)
          // oldData.keywords = '' // Reset keywords
          storeModalCrawl.setData(oldData)
        } catch (error) {
          console.error(error)
        }
      }
    }
  },
  { immediate: true }
)

const submit = async () => {
  isSubmitting.value = true
  storeModalCrawl.isCallapi = true
  if (storeModalCrawl.dataCrawlCamp.keywords === undefined) {
    storeModalCrawl.dataCrawlCamp.keywords = ''
  }

  const result = await ctr_crawl_campaign.AddCrawlCampaignKeyword(
    storeModalCrawl.dataCrawlCamp.Payload()
  )

  if (result?.status) {
    window.message.success('Crawl Campaign Keyword added successfully')
    storeModalCrawl.showModal = false
    templateV2Store.reInitTable()
  }

  isSubmitting.value = false
}

//lưu lại theo session
watch(
  () => storeModalCrawl.dataCrawlCamp,
  (newValue) => {
    if (newValue && newValue.traffic_source) {
      const key = getStorageKey(newValue.traffic_source)
      if (!key) return
      sessionStorage.setItem(key, JSON.stringify(newValue))
    }
  },
  { deep: true }
)

watch(
  () => storeModalCrawl.dataCrawlCamp.IsInputSourceTargetAudience(),
  (newValue) => {
    if (newValue) {
      storeModalCrawl.dataCrawlCamp.campaign_by_device = ONOFF.ON
    } else {
      storeModalCrawl.dataCrawlCamp.target_audience_content = null
      storeModalCrawl.dataCrawlCamp.campaign_by_device = null
    }
  }
)

const limitCampaignLines = 1000

function splitLines(text: string): string[] {
  if (!text) return []
  return text
    .split(/\r\n|\r|\n/) // cắt theo xuống dòng
    .filter((line) => line.trim() !== '') // loại bỏ dòng rỗng hoặc toàn khoảng trắng
}

const countGraphemes = (value: string) => {
  return `${splitLines(value).length}/${limitCampaignLines}`
}

const isPub = window.arb.isPub()
const placeholder = `Targeting audience, Ad headline, or Keywords (each line corresponds to one campaign)
Example:
- Users in the United States interested in tree trimming services
- Learn about scholarships in Japan for international students
- Dental implant`
</script>

<template>
  <n-modal v-model:show="storeModalCrawl.showModal">
    <n-card
      style="width: 1000px"
      title="Generate AI Campaign"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      class="select-float"
      content-class="overflow-y-auto max-h-[80vh] crawl-campaign-keyword-scroll"
    >
      <div class="flex flex-col gap-4">
        <div class="flex flex-col gap-4 shadow border p-4 rounded">
          <FloatingWrapper name="Traffic Source" :required="true">
            <n-select
              v-model:value="storeModalCrawl.dataCrawlCamp.traffic_source"
              :options="trafficSourceOptions"
              :on-update:value="handleTrafficSourceChange"
              placeholder=""
            />
          </FloatingWrapper>

          <FloatingWrapper name="Demand Source" :required="true">
            <n-select
              v-model:value="storeModalCrawl.dataCrawlCamp.demand_source"
              :options="demandSourceOptions"
              placeholder=""
            />
          </FloatingWrapper>
          <AccountPreset />
          <CampaignPreset />

          <ModalCampaignKeywordSet
            v-if="!storeModalCrawl.dataCrawlCamp.IsCloneAd()"
          />

          <FloatingWrapper name="Input Source" :required="true">
            <n-select
              v-model:value="storeModalCrawl.dataCrawlCamp.input_source"
              :options="inputTypeOptions"
              placeholder=""
              :disabled="isPub"
            />
          </FloatingWrapper>

          <FloatingWrapper
            name="Keywords"
            :required="true"
            v-if="storeModalCrawl.dataCrawlCamp.IsInputSourceKeywords()"
          >
            <n-input
              v-model:value="storeModalCrawl.dataCrawlCamp.keywords"
              type="textarea"
              placeholder=""
            />
          </FloatingWrapper>

          <FloatingWrapper name="Custom Name" v-if="isAdm">
            <n-input
              v-model:value="storeModalCrawl.dataCrawlCamp.custom_name"
            />
            <template #extra>
              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon :component="QuestionCircleRegular"></n-icon>
                </template>
                <span
                  >This field will be appended to the end of the campaign
                  name.</span
                >
              </n-popover>
            </template>
          </FloatingWrapper>
        </div>

        <FloatingWrapper
          :placeholder="true"
          name="Target Audience Content"
          :required="true"
          v-if="storeModalCrawl.dataCrawlCamp.IsInputSourceTargetAudience()"
        >
          <n-input
            v-model:value="
              storeModalCrawl.dataCrawlCamp.target_audience_content
            "
            type="textarea"
            :placeholder="placeholder"
            show-count
            :count-graphemes="countGraphemes as any"
            :status="
              splitLines(
                storeModalCrawl.dataCrawlCamp.target_audience_content || ''
              ).length > limitCampaignLines
                ? 'error'
                : undefined
            "
            :autosize="{
              minRows: 5,
              maxRows: 5,
            }"
          />
        </FloatingWrapper>

        <div
          class="flex flex-col gap-4 shadow border p-4 rounded"
          v-if="
            (storeModalCrawl.dataCrawlCamp.IsInputSourceTargetAudience() &&
              storeModalCrawl.dataCrawlCamp.IsTaboolaTS()) ||
            storeModalCrawl.dataCrawlCamp.IsInputSourceKeywords() ||
            storeModalCrawl.dataCrawlCamp.IsCloneAd()
          "
        >
          <FloatingWrapper
            :placeholder="true"
            name="Link Ad"
            :required="true"
            v-if="storeModalCrawl.dataCrawlCamp.IsCloneAd()"
          >
            <n-input
              v-model:value="storeModalCrawl.dataCrawlCamp.link_ad"
              type="textarea"
              placeholder="Link Ad"
            />
          </FloatingWrapper>

          <div
            class="flex items-center gap-2"
            v-if="
              storeModalCrawl.dataCrawlCamp.IsInputSourceTargetAudience() &&
              storeModalCrawl.dataCrawlCamp.IsTaboolaTS()
            "
          >
            <div class="w-48 text-xs font-bold flex items-center gap-2">
              Create Separate Campaigns by Device
              <n-popover trigger="hover">
                <template #trigger>
                  <n-icon :component="QuestionCircleRegular"></n-icon>
                </template>
                <span
                  >Enable this option to create separate campaigns for Mobile,
                  Tablet, and Desktop devices. Disable to target all devices in
                  a single campaign.</span
                >
              </n-popover>
            </div>
            <div class="flex-1 min-w-0">
              <CustomSwitch
                v-model="storeModalCrawl.dataCrawlCamp.campaign_by_device"
                type="onoff"
                true-label="On"
                false-label="Off"
                size="small"
              />
            </div>
          </div>
          <div
            class="flex items-center gap-2"
            v-if="storeModalCrawl.dataCrawlCamp.IsInputSourceKeywords()"
          >
            <LanguageSelector
              v-model="storeModalCrawl.dataCrawlCamp.landing_language"
              label="Landing Language"
              width="w-48"
            />
          </div>

          <!-- <CrawlLocation
            v-if="!storeModalCrawl.dataCrawlCamp.IsCloneAd()"
            ref="crawlLocationRef"
            v-model:value="storeModalCrawl.dataCrawlCamp.location.value"
            multiple
            :one="storeModalCrawl.dataCrawlCamp.IsFacebookTS()"
            :traffic_source="storeModalCrawl.dataCrawlCamp.traffic_source"
          /> -->

          <!-- <Tags
            v-model:value="storeModalCrawl.dataCrawlCamp.tags"
            v-if="!storeModalCrawl.dataCrawlCamp.IsCloneAd()"
          /> -->
        </div>

        <TargetAudienceConfig />
      </div>
      <template #footer>
        <div class="flex justify-end">
          <n-button class="button-apply" color="#f43f5e" @click="submit()">
            Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>

  <DrawerCrawl />
</template>

<style scoped lang="scss">
/* Deep selector để pseudo-element hoạt động trong scoped style */
::v-deep(.crawl-campaign-keyword-scroll::-webkit-scrollbar) {
  width: 6px;
}

::v-deep(.crawl-campaign-keyword-scroll::-webkit-scrollbar-track) {
  background: transparent;
}

::v-deep(.crawl-campaign-keyword-scroll::-webkit-scrollbar-thumb) {
  background-color: #a0aec0;
  border-radius: 4px;
}

::v-deep(.crawl-campaign-keyword-scroll) {
  scrollbar-width: thin;
  scrollbar-color: #a0aec0 transparent;
}
</style>
