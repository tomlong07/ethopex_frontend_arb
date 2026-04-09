<script lang="ts" setup>
import {
  AddCreativeCarousel,
  AddCreativeSingleImage,
  AddCreativeSingleVideo,
  campaignTypeClass,
  CreativeFeaturesSpec,
  creativeStruct,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import CardPreviewWrapper from '../advanced_preview/CardPreviewWrapper.vue'
import { ctr_creative } from '@/services/ctr_creative'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { CRE_TYPE, CreativeMediaType, ENROLL_STATUS } from '@/enum/creative'
import {
  CreativeFeatureCard,
  CreativeFeatureCards,
} from './CreativeFeatureCards'
import Close from '@/assets/icons/Close.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import {
  RemoveKeySingleImage,
  RemoveKeySingleVideo,
} from '@/constants/campaign'
const menuCampaignStore = useMenuCampaignStore()

const props = defineProps({
  adcreative: {
    type: Object as () => creativeStruct,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const creativeOrigin = ref(new creativeTypeClass({}))
const creativeFeatures = ref<CreativeFeaturesSpec>(AddCreativeSingleImage())
const featuresCards = ref<CreativeFeatureCard[]>([])

const isLoading = ref(false)
const active = ref()
const showModal = ref(false)

const isShowEditAd = computed(() => {
  // Chỉ áp dụng cho Traffic Facebook
  if (!props.campaign.IsTrafficFacebook()) {
    return false
  }

  if (!props.adcreative.creative_id) {
    return false
  }

  const isFlexible = creativeOrigin.value.IsFacebookFlexible()
  if (isFlexible) {
    return false
  }

  return true
})

const setDefaultAdvancedPreview = () => {
  const creative = creativeOrigin.value
  featuresCards.value = CreativeFeatureCards.filter(
    (item) => item.type === creative.ad_type
  )
  let removeKeys: any[] = []

  switch (true) {
    case creative.IsFacebookSingleImage():
      creativeFeatures.value = AddCreativeSingleImage(
        props.adcreative.creative_features_spec,
        props.FreezeData.isEditPage()
      )
      // removeKeys = RemoveKeySingleImage
      break

    case creative.IsFacebookSingleVideo():
      creativeFeatures.value = AddCreativeSingleVideo(
        props.adcreative.creative_features_spec,
        props.FreezeData.isEditPage()
      )
      // removeKeys = RemoveKeySingleVideo
      break

    case creative.IsFacebookCarousel():
      creativeFeatures.value = AddCreativeCarousel(
        props.adcreative.creative_features_spec,
        props.FreezeData.isEditPage()
      )
      break

    default:
      // set default là single image nếu không xác định được ad_type
      creativeFeatures.value = AddCreativeSingleImage(
        props.adcreative.creative_features_spec,
        props.FreezeData.isEditPage()
      )

      featuresCards.value = CreativeFeatureCards.filter(
        (item) => item.type === CreativeMediaType.SINGLE_IMAGE
      )

      break
  }

  if (removeKeys.length > 0) {
    featuresCards.value = featuresCards.value.filter(
      (item) => !removeKeys.includes(item.key)
    )
  }
  props.adcreative.creative_features_spec = creativeFeatures.value
}

const getFeature = (key: keyof CreativeFeaturesSpec) => {
  if (!creativeFeatures.value[key]) {
    creativeFeatures.value[key] = { enroll_status: ENROLL_STATUS.OPT_IN } as any
  }
  return creativeFeatures.value[key] as { enroll_status: ENROLL_STATUS }
}

const toggleModal = async () => {
  showModal.value = !showModal.value
}

const submit = () => {
  props.adcreative.creative_features_spec = creativeFeatures.value
  showModal.value = false
}

const checkValue = () => {
  const hasFalse = featuresCards.value.some(
    (item) => getFeature(item.key).enroll_status === ENROLL_STATUS.OPT_OUT
  )
  active.value = hasFalse ? ENROLL_STATUS.OPT_OUT : ENROLL_STATUS.OPT_IN
}

const handleUpdateValue = () => {
  for (const item of featuresCards.value) {
    getFeature(item.key).enroll_status = active.value
  }
}

const message = computed(() => {
  const onItems = featuresCards.value
    .filter((i) => getFeature(i.key).enroll_status === ENROLL_STATUS.OPT_IN)
    .map((i) => i.label)

  const offItems = featuresCards.value
    .filter((i) => getFeature(i.key).enroll_status === ENROLL_STATUS.OPT_OUT)
    .map((i) => i.label)

  const formatList = (arr: string[]) => {
    // Nếu là trang edit thì hiển thị đầy đủ
    if (props.FreezeData.isEditPage()) return arr.join(', ')
    // Ngược lại thì rút gọn khi có hơn 3 item
    return arr.length > 3
      ? `${arr.slice(0, 2).join(', ')} and ${arr.length - 2} more`
      : arr.join(', ')
  }

  return {
    messageOn: onItems.length ? formatList(onItems) : undefined,
    messageOff: offItems.length ? formatList(offItems) : undefined,
    total: onItems.length,
  }
})

const fetchCreativeById = async (creativeId: number) => {
  isLoading.value = true

  const result = await ctr_creative.GetAdTypeByIDs(creativeId)
  if (result.data && result.data[0]) {
    try {
      creativeOrigin.value = new creativeTypeClass(result.data[0])
      if (creativeOrigin.value.ad_type === 'default') {
        creativeOrigin.value.ad_type = CreativeMediaType.SINGLE_IMAGE
      }

      creativeOrigin.value.type = CRE_TYPE.FACEBOOK
      setDefaultAdvancedPreview()
      checkValue()
    } catch {}
  }
  isLoading.value = false
}

const index = computed(() => menuCampaignStore.tabActive.creativeKey)

watch(
  [() => index.value, () => props.adcreative.creative_id],
  async ([index, creativeId]) => {
    if (index || creativeId) {
      await fetchCreativeById(Number(props.adcreative.creative_id))
    }
  },
  { deep: true, immediate: true }
)
</script>

<template>
  <div v-if="isShowEditAd" class="mb-1">
    <div class="flex gap-2 border p-3 rounded-md !border-gray2 items-center">
      <div class="flex flex-col w-full gap-2">
        <div class="title font-bold">
          Advantage+ creative enhancements
          {{
            isLoading
              ? ' '
              : `(${message.total ?? 0}/${featuresCards.length ?? 0})`
          }}
        </div>

        <n-skeleton v-if="isLoading" round style="width: 40%" />
        <div class="status" v-else>
          <div class="text-[13px] font-semibold" v-if="message.messageOff">
            &#8226; Turned off:
            <span class="font-normal"> {{ message.messageOff }} </span>
          </div>
          <div class="text-[13px] font-semibold" v-if="message.messageOn">
            &#8226; Turned on:
            <span class="font-normal"> {{ message.messageOn }} </span>
          </div>
        </div>
      </div>

      <n-button @click="toggleModal" class="ml-auto">{{
        props.FreezeData.isEditPage() ? 'View' : 'Edit'
      }}</n-button>
    </div>

    <n-modal v-model:show="showModal">
      <n-card
        style="
          height: 90dvh;
          width: 100dvw;
          margin: 15px;
          display: flex;
          flex-direction: column;
        "
        class="custom-advanced-dark-mode"
      >
        <!-- Header -->
        <template #header>
          <div class="flex justify-between items-start">
            <div class="title">
              <h1>Advanced preview</h1>
              <span class="text-xs text-slate-700">
                You can review how your ad will show up on different placements
                as well as how it might be adapted with Advantage+ creative.
              </span>
            </div>
            <n-icon
              size="26"
              class="ml-auto button-editor-image cursor-pointer"
              @click="toggleModal"
              ><Close
            /></n-icon>
          </div>
        </template>

        <!-- Body -->
        <div>
          <div class="my-3 flex gap-3 items-center">
            <CustomSwitch
              v-model="active"
              type="enroll"
              true-label="On"
              false-label="Off"
              size="small"
              @change="handleUpdateValue"
              :disabled="
                props.FreezeData.isEditPage() &&
                props.adcreative.id != null &&
                props.adcreative.id > 0
              "
            />
            <span>All optimizations</span>
          </div>

          <div
            class="grid grid-cols-[repeat(auto-fill,_260px)] gap-4 p-3 !bg-gray-100 custom-bg overflow-y-auto max-h-[calc(90dvh-230px)]"
            style="scrollbar-width: thin"
          >
            <CardPreviewWrapper
              v-for="card in featuresCards"
              :key="card.key"
              :title="card.label"
              :card="card"
              :adcreative="props.adcreative"
              :FreezeData="props.FreezeData"
              v-model="getFeature(card.key).enroll_status"
              @change="checkValue"
            />
          </div>
        </div>

        <!-- Footer -->
        <template #footer>
          <div class="flex justify-end gap-2">
            <n-button type="tertiary" @click="submit">Close</n-button>
            <n-button
              class="button-apply"
              color="#f43f5e"
              @click="submit"
              v-if="
                !props.FreezeData.isEditPage() ||
                (props.FreezeData.isEditPage() && props.adcreative.id == null)
              "
              >Submit</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
