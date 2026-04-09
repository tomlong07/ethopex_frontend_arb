<script setup lang="ts">
import {
  creativeTypeClass,
  CreativeStateManager,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

import { DrawerPlacement } from 'naive-ui'
import Type from './Type.vue'
import AdType from './AdType.vue'
import SiteName from './SiteName.vue'
import BannerSize from './BannerSize.vue'
import DisplayPath from './DisplayPath.vue'
import ToolAIGeneratedSuggest from './ToolAIGeneratedSuggest.vue'
import HeaderTool from './HeaderTool.vue'
import SiteLink from './SiteLink.vue'
import ImageTransform from './ImageTransform.vue'
import HeaderExtraTool from './HeaderExtraTool.vue'
import SnapchatTool from './SnapchatTool.vue'
import MediaSummary from './MediaSummary.vue'
import ImageEditor2 from './ImageEditor2.vue'
import TitleDescriptionGoogle from './TitleDescriptionGoogle.vue'
import TitleDescriptionV1 from './TitleDescriptionV1.vue'
import TitleDescriptionFB from './facebook/TitleDescriptionFB.vue'
import LinkYoutube from './LinkYoutube.vue'
import MediaHeader from './MediaHeader.vue'
import PocpocBanner from './PocpocBanner.vue'
import Headline from './Headline.vue'
import Preview from './Preview.vue'
import Media from './Media.vue'
import TitleDescriptionNative from './TitleDescriptionNative.vue'
import FinalURL from './FinalURL.vue'
import ImageEditorNewsbreak from './ImageEditorNewsbreak.vue'

import useUploadMediaCreativeStore from '@/store/useUploadMediaCreativeStore'

const useMediaStore = useUploadMediaCreativeStore()

const placement = ref<DrawerPlacement>('right')
const isLoading = ref(false)
const typeComponent = ref<InstanceType<typeof Type> | null>(null)
const activeTab = ref('content') // Tab hiện tại

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
  currentTab: {
    type: String,
    default: 'content',
  },
})

const emit = defineEmits<{
  (e: 'tab-change', tab: string): void
}>()

const showModal = ref(false)

const suggestions = ref<{ PrimaryText: string[]; Headline: string[] }>({
  PrimaryText: [],
  Headline: [],
})

// Mở/đóng drawer
const activate = (place: DrawerPlacement) => {
  showModal.value = true
  placement.value = place
}

const handleGenerateSuggestions = async () => {
  if (typeComponent.value) {
    try {
      isLoading.value = true
      await typeComponent.value.handleGenerateSuggestions()
    } catch {
      suggestions.value = { PrimaryText: [], Headline: [] }
    }
    isLoading.value = false
  }
}

const handleGenerateAndOpen = async () => {
  activate('right') // mở drawer
  await handleGenerateSuggestions()
}

const closeModal = () => {
  showModal.value = false
}

// Cập nhật suggestions từ Type.vue
const updateSuggestions = (newSuggestions: {
  PrimaryText: string[]
  Headline: string[]
}) => {
  suggestions.value = {
    PrimaryText:
      newSuggestions.PrimaryText && newSuggestions.PrimaryText.length > 0
        ? newSuggestions.PrimaryText
        : [],
    Headline:
      newSuggestions.Headline && newSuggestions.Headline.length > 0
        ? newSuggestions.Headline
        : [],
  }
}

watch(
  () => props.currentTab,
  (newTab) => {
    if (activeTab.value !== newTab) {
      activeTab.value = newTab
    }
  }
)

const isShowEditor = computed(() => {
  if (props.cre.IsNewsbreak()) {
    return false
  }
  return (
    !props.cre.IsPocpocBanner() &&
    !props.cre.IsResponsive() &&
    props.cre.images?.length > 0
  )
})

onMounted(() => {
  useMediaStore.resetAllState()
})
</script>

<template>
  <div
    :class="[
      'flex justify-center min-h-[70vh]',
      { 'p-8': !props.stateManager.isModalAd },
    ]"
  >
    <div
      :class="[
        'w-full flex flex-col gap-4',
        { 'max-w-7xl': !props.stateManager.isModalAd },
      ]"
    >
      <n-card
        :class="[
          'card-flex-gap-4',
          { 'rounded-[5px] !border-gray2': !props.stateManager.isModalAd },
        ]"
      >
        <template #header>
          <n-tabs v-model:value="activeTab" type="line" size="small">
            <n-tab-pane name="content" tab="Content" />
            <n-tab-pane name="media" tab="Media" />
          </n-tabs>
        </template>

        <template #default>
          <div v-show="activeTab === 'content'" class="flex flex-col gap-4">
            <n-card
              title="Content"
              class="card-flex-gap-4 rounded-[5px] !border-gray2"
            >
              <template #header-extra>
                <Creative3HeaderExtra :cre="props.cre" />
              </template>

              <Creative3Name
                :cre="props.cre"
                :stateManager="props.stateManager"
              />
              <Creative3Status
                :cre="props.cre"
                :stateManager="props.stateManager"
                v-if="
                  props.status.permissionCreative?.approvedCreative &&
                  props.stateManager.isNormalMode() &&
                  props.stateManager.isEditPage()
                "
              />
              <Type
                ref="typeComponent"
                :cre="props.cre"
                :stateManager="props.stateManager"
                @update-suggestions="updateSuggestions"
                @open-ai-suggest="activate('right')"
                @generate-and-open="handleGenerateAndOpen"
              />

              <Headline :cre="props.cre" />
              <AdType
                :cre="props.cre"
                :stateManager="props.stateManager"
                :status="props.status"
              />
              <SiteName
                :cre="props.cre"
                :status="props.status"
                :stateManager="props.stateManager"
              />
              <BannerSize
                :cre="props.cre"
                :stateManager="props.stateManager"
                :status="props.status"
              />
              <DisplayPath
                :cre="props.cre"
                :stateManager="props.stateManager"
              />
            </n-card>

            <ToolAIGeneratedSuggest
              :cre="props.cre"
              :show-modal="showModal"
              :placement="placement"
              :suggestions="suggestions"
              :typeComponent="typeComponent"
              :is-loading="isLoading"
              @close-modal="closeModal"
              @handleBtn="handleGenerateSuggestions"
            />

            <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
              <template #header>
                <HeaderTool :cre="props.cre" />
              </template>
              <template #header-extra>
                <HeaderExtraTool :cre="props.cre" :status="props.status" />
              </template>
              <TitleDescriptionNative :cre="props.cre" :status="props.status" />
              <TitleDescriptionV1 :cre="props.cre" :status="props.status" />
              <TitleDescriptionGoogle
                :cre="props.cre"
                v-if="!props.cre.IsResponsive()"
              />
              <FinalURL :cre="props.cre" />
              <TitleDescriptionFB
                :cre="props.cre"
                v-if="props.cre.IsFacebook()"
              />
              <!-- <CallToAction
                :cre="props.cre"
                v-if="
                  props.cre.IsFacebook() ||
                  props.cre.IsTikTok() ||
                  props.cre.IsNewsbreak()
                "
              /> -->
              <SnapchatTool :cre="props.cre" />
              <PocpocBanner :cre="props.cre" />
            </n-card>

            <SiteLink :cre="props.cre" :stateManager="props.stateManager" />
          </div>

          <!-- Media Tab -->
          <div v-show="activeTab === 'media'" class="flex flex-col gap-4">
            <n-card class="card-flex-gap-4 rounded-[5px] !border-gray2">
              <template #header>
                <MediaHeader
                  :cre="props.cre"
                  :stateManager="props.stateManager"
                />
              </template>

              <template
                #header-extra
                v-if="
                  props.cre.IsAcceptMultipleCreatives() &&
                  props.stateManager.isNormalMode() &&
                  props.stateManager.isAddPage()
                "
              >
                <n-checkbox
                  v-model:checked="props.status.uploadMultipleCreative"
                >
                  Add Multiple Creatives
                </n-checkbox>
              </template>

              <LinkYoutube
                :cre="props.cre"
                :status="props.status"
                :label="props.cre.IsPMax() ? 'Youtube Video' : ''"
                v-if="
                  props.cre.IsDemandGenVideo() ||
                  props.cre.IsPMax() ||
                  (props.cre.IsGoogleDisplay() && !props.cre.IsResponsive())
                "
              />
              <!-- <UploadMedia
                :cre="props.cre"
                :status="props.status"
                v-if="!props.cre.IsDemandGenVideo() && !props.cre.IsPMax()"
              />

              <UploadMedia
                :cre="props.cre"
                :status="props.status"
                label="Images"
                v-if="props.cre.IsPMax()"
              /> -->

              <UploadMediaV2
                :cre="props.cre"
                :status="props.status"
                v-if="!props.cre.IsDemandGenVideo() && !props.cre.IsPMax()"
              />

              <UploadMediaV2
                :cre="props.cre"
                :status="props.status"
                label="Images"
                v-if="props.cre.IsPMax()"
              />

              <Media
                :cre="props.cre"
                :status="props.status"
                :stateManager="props.stateManager"
              />
              <ImageEditor2
                :cre="props.cre"
                :status="props.status"
                :stateManager="props.stateManager"
                v-if="isShowEditor"
              />

              <ImageEditorNewsbreak
                :cre="props.cre"
                :status="props.status"
                :stateManager="props.stateManager"
                v-if="!isShowEditor"
              />
              <MediaSummary :cre="props.cre" :status="props.status" />
            </n-card>

            <Preview
              :cre="props.cre"
              :status="props.status"
              :stateManager="props.stateManager"
            />

            <ImageTransform :cre="props.cre" :status="props.status" />
          </div>
        </template>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
:deep(.n-drawer-container) {
  position: static !important;
  overflow: visible !important;
}

:deep(.n-drawer) {
  position: fixed !important;
  z-index: 1000;
}

body {
  overflow: auto !important;
}

:deep(.n-drawer-content) {
  overflow-y: auto !important;
}

:deep(.n-input .n-input__input-el + .n-input__placeholder),
:deep(.n-input__textarea .n-input__placeholder) {
  font-size: 11px;
}

/* Responsive cho mobile */
@media (max-width: 768px) {
  .tab-content {
    max-width: 100%;
    padding: 0 16px;
  }
}
</style>
