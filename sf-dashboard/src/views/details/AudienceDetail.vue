<script setup lang="ts">
import { DropdownOption, SelectOption } from 'naive-ui'

import { googleAudienceData } from '@/types/components/google-audience'
import { campaignTypeClass } from '@/types/components/campaign-v2'

import useAudienceStore from '@/store/useAudienceStore'
import useSegmentStore from '@/store/useSegmentModal'

import BackPage from '@/components/common/BackPage.vue'

import { loadingManager } from '@/types/components/audience-segment'
import { ModalState } from '@/types/components/modal'
import { AudienceStateManager } from '@/types/components/audience'
import Plus from '@/assets/icons/Plus.vue'
import { ModalSegment } from '@/components/campaign/async'
import PreAudience from '@/components/campaign/modules/google/PreAudience.vue'
import { renderIcon } from '@/utils/utils'
import AudienceName from '@/components/audience/AudienceName.vue'
import GoogleAccount from '@/components/audience/GoogleAccount.vue'
import CustomSegment from '@/components/audience/CustomSegment.vue'
import LookalikeSegment from '@/components/audience/LookalikeSegment.vue'
import YourDataSegment from '@/components/audience/YourDataSegment.vue'
import { ctr_audience } from '@/services/ctr_audience'
import WindowStack from '@/assets/icons/WindowStack.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import { TS } from '@/enum/campaign'

const audienceStore = useAudienceStore()
const segmentStore = useSegmentStore()

const feSettings = ref(new FeSettings())

useFeSettings(feSettings, window.route?.meta?.url as string)

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass | undefined,
    required: false,
  },

  dataModal: {
    type: Object as () => ModalState,
    required: false,
  },
})
const isSubmitBtnLoading = ref(false)
const audienceConfig = ref<googleAudienceData>({
  name: '',
  type: 'SEARCH',
  traffic_source: TS.GOOGLE,

  segment: 'custom',
  lookalike: [],
  customAudience: [],
  yourData: [],
  demographics: [],
})

watch(
  () => segmentStore.resultModal,
  async (newValue, oldValue) => {
    fetchAudienceSegmentOptions()

    if (newValue?.data) {
      audienceConfig.value.customAudience.push(newValue.data)
    }
  }
)

const stateManager = new AudienceStateManager({ dataModal: props.dataModal })

const customSegmentCache = ref<{ [key: number]: any }>({})

const lookalikeOptions = ref<SelectOption[]>([])
const yourDataOptions = ref<SelectOption[]>([])
const customSegmentOptions = ref<SelectOption[]>([])

const loadingStatus = new loadingManager()
const fetchLookALikeOptions = async () => {
  if (!accountId.value) return
  loadingStatus.loadingLookalike = true
  const result = await ctr_audience.GetAudienceSegment({
    filter: {
      account_id: accountId.value,
      traffic_source: TS.GOOGLE,
      type: 'lookalike',
    },
  })
  lookalikeOptions.value = result?.data?.items || []

  loadingStatus.loadingLookalike = false
}
const fetchAudienceSegmentOptions = async () => {
  if (!accountId.value) return
  loadingStatus.loadingCustom = true

  const audienceResult = await ctr_audience.GetAudienceSegment({
    filter: {
      account_id: accountId.value,
      traffic_source: TS.GOOGLE,
      type: 'custom',
    },
  })
  customSegmentOptions.value = audienceResult?.data?.items || []

  customSegmentOptions.value.forEach((element) => {
    if (!customSegmentCache.value[element.id as number]) {
      customSegmentCache.value[element.id as number] = element
    }
  })
  loadingStatus.loadingCustom = false
}
const fetchYourDataOptions = async () => {
  if (!accountId.value) return

  loadingStatus.loadingYourData = true
  const result = await ctr_audience.GetAudienceSegment({
    filter: {
      account_id: accountId.value,
      traffic_source: TS.GOOGLE,
      type: 'yourData',
    },
  })
  yourDataOptions.value = result?.data?.items || []
  loadingStatus.loadingYourData = false
}

const onChangeAccount = async (value: string) => {
  await Promise.all([
    fetchLookALikeOptions(),
    fetchAudienceSegmentOptions(),
    fetchYourDataOptions(),
  ])
}
watch(
  () => audienceConfig.value.account_id,
  async (newValue, oldValue) => {
    if (newValue !== oldValue && newValue) {
      await onChangeAccount(String(newValue))
    }
  }
)
const accountId = computed<number>(() => {
  if (props.campaign?.account_supply_id) {
    return props.campaign?.account_supply_id
  }
  return audienceConfig.value.account_id || 0
})

const payload = computed<any>(() => {
  return {
    id: stateManager.id(),
    name: audienceConfig.value.name,
    type: audienceConfig.value.type,
    account_id: audienceConfig.value.account_id,
    segment: audienceConfig.value.segment,
    lookalike: audienceConfig.value.lookalike,
    customAudience: audienceConfig.value.customAudience,
    yourData: audienceConfig.value.yourData,
    demographics: audienceConfig.value.demographics,
  }
})

const submitForm = async (saveNew: boolean) => {
  isSubmitBtnLoading.value = true

  try {
    if (window.confirm('Are you sure you want to submit this form?')) {
      if (stateManager.id() && !saveNew) {
        const result = await ctr_audience.Edit(payload.value)
        if (result?.status) {
          window.message.success(`Edit ${name} successfully!`)
        }
        return
      }

      const result = await ctr_audience.Add(payload.value)
      if (result?.status) {
        window.message.success(`Submit success!`)
        if (stateManager.isModalMode() || saveNew) {
          audienceStore.changeShowModal(false)
          audienceStore.changeResult(result)
        } else {
          if (feSettings.value.page_list) {
            window.router.push({ path: feSettings.value.page_list })
          }
        }
      }
    } else {
      window.message.info('Submit cancel!')
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}

onMounted(async () => {
  audienceConfig.value.account_id =
    props.campaign?.account_supply_id || undefined

  if (stateManager.isEditPage()) {
    const result = await ctr_audience.GetByID(stateManager.id())
    if (result?.status) {
      let tempData = result.data
      try {
        tempData.yourData = JSON.parse(result.data.yourData)
      } catch {
        tempData.yourData = []
      }

      try {
        tempData.lookalike = JSON.parse(result.data.lookalike)
      } catch {
        tempData.lookalike = []
      }

      try {
        tempData.demographics = JSON.parse(result.data.demographics)
      } catch {
        tempData.demographics = []
      }

      try {
        tempData.customAudience = JSON.parse(result.data.customAudience)
      } catch {
        tempData.customAudience = []
      }

      audienceConfig.value = tempData
    }
  }

  await Promise.all([
    fetchLookALikeOptions(),
    fetchAudienceSegmentOptions(),
    fetchYourDataOptions(),
  ])
})

const menuOptions = computed<DropdownOption[]>(() => {
  let options: DropdownOption[] = [
    {
      label: 'Create New Segment',
      key: 'create',
      icon: renderIcon(Plus),
      disabled: !accountId.value || stateManager.isEditPage(),
    },
  ]

  if (audienceConfig.value.customAudience.length) {
    options.push({
      type: 'divider',
      key: 'd1',
    })
    audienceConfig.value.customAudience.forEach((element) => {
      options.push({
        label:
          customSegmentCache.value[element as unknown as number]?.name ||
          element,
        key: element,
        icon: renderIcon(WindowStack),
      })
    })
  }

  return options
})

const handleMenu = (key: string) => {
  switch (key) {
    case 'create':
      segmentStore.changeDataModal({
        supply_account_id: audienceConfig.value.account_id,
      })
      break
    default:
      segmentStore.changeDataModal({
        supply_account_id: audienceConfig.value.account_id,
        id: Number(key),
      })

      break
  }

  segmentStore.changeShowModal(true)
}

const name = `Google Audience`
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4 mt-3">
      <BackPage
        :url="feSettings.page_list"
        :name="name"
        v-if="feSettings.page_list && stateManager.isNormalMode()"
      />

      <div
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card :title="name" class="card-flex-gap-4">
          <AudienceName :audienceConfig="audienceConfig" />
          <GoogleAccount
            :stateManager="stateManager"
            :audienceConfig="audienceConfig"
          />

          <CustomSegment
            :accountId="accountId"
            :audienceConfig="audienceConfig"
            :customSegmentOptions="customSegmentOptions"
            :loadingStatus="loadingStatus"
            :menuOptions="menuOptions"
            :handleMenu="handleMenu"
          />

          <LookalikeSegment
            :audienceConfig="audienceConfig"
            :accountId="accountId"
            :loadingStatus="loadingStatus"
            :lookalikeOptions="lookalikeOptions"
          />

          <YourDataSegment
            :audienceConfig="audienceConfig"
            :accountId="accountId"
            :loadingStatus="loadingStatus"
            :yourDataOptions="yourDataOptions"
          />
          <PreAudience :audienceConfig="audienceConfig" />

          <div class="flex flex-row-reverse sticky bottom-0 pt-4 gap-2">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              :loading="isSubmitBtnLoading"
              @click="submitForm(false)"
            >
              Submit
            </n-button>

            <n-button
              size="medium"
              :loading="isSubmitBtnLoading"
              v-if="stateManager.isModalMode()"
              @click="submitForm(true)"
            >
              Save New
            </n-button>
          </div>
        </n-card>
        <ModalSegment />
      </div>
    </div>
  </div>
</template>
<style lang="scss">
// Ẩn nút select all vì không hoạt động đúng nó sẽ select thừa cả parent node ko cần select và nút đó cũng không cần thiết lắm
.transfer-parent-audience.n-transfer .n-transfer-list .n-transfer-list-header {
  display: none;
}

.transfer-parent-audience.n-transfer
  .n-transfer-list
  .n-transfer-list-body
  .n-transfer-list-flex-container {
  margin-top: 1rem;
}
</style>
