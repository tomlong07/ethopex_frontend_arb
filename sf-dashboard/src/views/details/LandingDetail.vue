<script setup lang="ts">
import {
  defaultPrelanderConfigs,
  landingTypeClass,
  newLanding,
  PermissionLandingManage,
  StatusState,
} from '@/types/components/landing'

import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import LandingPageInput from '@/components/landing_page/LandingPageInput.vue'
import FixedAdTitle from '@/components/landing_page/FixedAdTitle.vue'
import ContentType from '@/components/landing_page/ContentType.vue'
import Tonic from '@/components/landing_page/Tonic.vue'
import ToolContentModal from '@/components/landing_page/ToolContentModal.vue'
import Thumbnails from '@/components/landing_page/Thumbnails.vue'
import KeywordSearchJob from '@/components/landing_page/KeywordSearchJob.vue'
import CategoryTier from '@/components/landing_page/CategoryTier.vue'

import CKEditor from '@/components/common/CKEditor.vue'

import { addTargetBlankToLinks, convertFigureToImage } from '@/utils/utils'

import BackPage from '@/components/common/BackPage.vue'

import { ModeClassString } from '@/types/components/base'
import { dataThumb } from '@/types/components/gallery'

import storage from '@/plugins/storage'
import useLandingStore from '@/store/details/landingNewStore'
import ShortCode from '@/components/landing_page/ShortCode.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import { ctr_landing_page } from '@/services/ctr_landing_page'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import NavBarLanding from '@/components/landing_page/NavBarLanding.vue'
import SponsoredTitle from '@/components/landing_page/jobs/SponsoredTitle.vue'
import Layout from '@/components/landing_page/jobs/Layout.vue'
import JobConfigsLayout from '@/components/landing_page/jobs/JobConfigsLayout.vue'
import { KEY_STORAGE } from '@/constants/app'
import { L } from '@/enum/landing'

import { useLocale } from '@/lang/messages'

import { useCkeditorLoader } from '@/composables/useCkeditorLoader'

const JobConfigs = defineAsyncComponent(
  () => import('@/components/landing_page/jobs/JobConfigs.vue')
)

const LanguageLanding = useLocale(
  () => import('@/lang/vi/landing'),
  () => import('@/lang/en/landing')
)

const landingNewStore = useLandingStore()

const statusData = ref(new StatusState())

// Async components
const LandingPreviewPubpowerWrapper = defineAsyncComponent(
  () => import('@/components/landing_page/LandingPreviewPubpowerWrapper.vue')
)

const CardMetaImage = defineAsyncComponent(
  () => import('@/components/landing_page/CardMetaImage.vue')
)

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

//Freeze lại tránh thay đổi các data này
const modeData = helper.deepFreeze(
  new ModeClassString(window.route)
) as ModeClassString

const isLoadingEditor = ref<boolean>(false)

const slugPreview = ref<string>('')

const descriptionEditorComp = ref<InstanceType<typeof CKEditor>>()
const contentEditorComp = ref<InstanceType<typeof CKEditor>>()

const { loadCkeditorScript, ensureNextPagePlugin, initEditor } =
  useCkeditorLoader()

const isSubmitBtnLoading = ref<boolean>(false)
const isSubmitBtnDisabled = ref<boolean>(false)
const isDuplicatePage = computed<boolean>(() => {
  return window.location.href.includes('?duplicate/')
})
const landing = ref<landingTypeClass>(
  modeData.isAddPage() && !isDuplicatePage.value
    ? newLanding()
    : new landingTypeClass({})
)

const statusState = ref<StatusState>(new StatusState())

watch(
  () => statusState.value.updateCK,
  async (newValue, oldValue) => {
    if (newValue) {
      try {
        await safeSetDataWithRetry(
          descriptionEditorComp,
          landing.value.description
        )
      } catch (error) {
        console.error('descriptionEditorComp Editor setData error:', error)
      }

      try {
        await safeSetDataWithRetry(contentEditorComp, landing.value.content)
      } catch (error) {
        console.error('contentEditorComp Editor setData error:', error)
      }

      handleInput(landing.value.title)
    }
  }
)

async function safeSetDataWithRetry(
  editor: any,
  data: any,
  retries = 3,
  delay = 200
) {
  for (let i = 0; i < retries; i++) {
    try {
      editor?.value?.setData(data)
      return // thành công thì thoát luôn
    } catch (e) {
      if (i === retries - 1) throw e // lần cuối vẫn fail thì quăng lỗi
      await new Promise((resolve) => setTimeout(resolve, delay))
    }
  }
}
const permissionLanding = ref<PermissionLandingManage>(
  new PermissionLandingManage()
)

const isNotEdit = computed<boolean>(() => {
  return modeData.isEditPage() && permissionLanding.value.notAcceptUpdate()
})

const submitForm = async () => {
  if (permissionLanding.value.isStop()) {
    return
  }

  if (isNotEdit.value) {
    window.message.warning('Not Allow.')
    return
  }

  const payloadNow = landing.value.Payload(modeData.isAddPage())

  isSubmitBtnLoading.value = true

  if (modeData.isAddPage()) {
    const result = await ctr_landing_page.Add(payloadNow)
    if (result.status === true) {
      window.message.success(`Submit success!`)
      localStorage.removeItem(`${KEY_STORAGE}_/landing_page/add`)
      isSubmitBtnDisabled.value = true
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    } else {
      isSubmitBtnDisabled.value = true
    }
  } else {
    if (payloadNow.status == 'off') {
      const confirm = window.confirm(LanguageLanding.value.confirm)

      if (!confirm) {
        setTimeout(() => {
          isSubmitBtnDisabled.value = false
        }, 3000)
        isSubmitBtnLoading.value = false
        return
      }
    }
    const result = await ctr_landing_page.Edit(payloadNow)
    if (result.status === true) {
      slugPreview.value = payloadNow.slug
      window.message.success(`Submit success!`)
    }
  }
  setTimeout(() => {
    isSubmitBtnDisabled.value = false
  }, 3000)
  isSubmitBtnLoading.value = false
}

const handleInput = (v?: string) => {
  if (modeData.isEditPage() || !v) {
    return
  }
  landing.value.slug = helper.generateSlug(v)
}

watch(
  () => landing.value.IsShowContentDescription(),
  (newValue, oldValue) => {
    if (newValue) {
      loadCkEditor()
    } else {
      landing.value.shortcutWidget = undefined
    }
  }
)

watch(
  () => statusData.value.showModalSaveForm,
  (newValue, oldValue) => {
    if (!newValue) {
      loadCkEditor()
    }
  }
)

const loadCkEditor = async () => {
  if (!landing.value.IsShowContentDescription()) return

  isLoadingEditor.value = true

  try {
    await loadCkeditorScript()
    //Add nút next-page
    try {
      ensureNextPagePlugin()

      initEditor(descriptionEditorComp)
      initEditor(contentEditorComp)
    } catch (error) {
      window.message.error('Failed to load CKEditor')
      console.error(error)
    }
  } catch (error) {
    console.error('Failed to load script:', error)
  } finally {
    await helper.sleep(10)
    isLoadingEditor.value = false
  }
}

const getPermission = async () => {
  const result = await ctr_landing_page.GetPermission()

  permissionLanding.value.changePermission(result?.data || [])
}

const getPermissionByPath = async () => {
  if (window.route?.meta?.url) {
    const result = await ctr_landing_page.LandingConfigs()

    landingNewStore.setPermissions(result?.data || {})
  }

  if (modeData.isAddPage() && !isDuplicatePage.value) {
    landing.value.status = landingNewStore.permissions.fullStatus
      ? 'on'
      : 'pending'

    storage.initWatchV2(landing, statusData) // Khởi tạo watcher ở đây
  }
}

const getDuplicateId = () => {
  const url = window.location.href
  const match = url.match(/\?duplicate\/(\d+)/)
  return match ? match[1] : ''
}

onMounted(async () => {
  statusData.value.isLoadPermission = true

  await Promise.all([getPermission(), getPermissionByPath()])
  statusData.value.isLoadPermission = true

  if (modeData.isAddPage() && !isDuplicatePage.value) {
    if (storage.getData()) {
      statusData.value.showModalSaveForm = true
    } else {
      statusData.value.isLoading = false
    }
  }

  if (modeData.isEditPage() || isDuplicatePage.value) {
    let result
    let idLanding = ''

    if (isDuplicatePage.value) {
      idLanding = getDuplicateId()
      result = await ctr_landing_page.DuplicateLanding(idLanding)
    } else {
      idLanding = modeData.id
      result = await ctr_landing_page.GetByID(idLanding)
    }

    if (result.status === true) {
      landing.value = new landingTypeClass(result?.data || {})
      landing.value.description = convertFigureToImage(
        String(landing.value.description)
      )
      landing.value.content = convertFigureToImage(
        String(landing.value.content)
      )
      try {
        landing.value.thumbnails = []
        result?.data.thumbnails?.forEach((element: string) => {
          const newImage = new dataThumb({ path: element })

          newImage.SetSuccess()
          landing.value.thumbnails?.push(newImage)
        })
      } catch (error) {
        console.error(error)
      }
      // gán giá trị
      slugPreview.value = result.data.slug
      if (!result.data.prelander) landing.value.SetPrelanderOFF()
      if (!result.data.direct_link) landing.value.SetDirectLinkON()

      landing.value.SetDefaultForShortCutWidget()
      statusData.value.isLoading = false
    }
  }

  if (permissionLanding.value.isStop()) {
    return
  }

  if (permissionLanding.value.isOnlyAcceptAICreate()) {
    landing.value.SetDemandAdsense()

    if (modeData.isAddPage()) {
      statusState.value.changeShowModal(true)
    }
  }

  if (!statusData.value.showModalSaveForm) {
    await loadCkEditor()
  }
})

const changeEditorContent = (content: string) => {
  landing.value.content = addTargetBlankToLinks(content)
}

const changeEditorDescription = (content: string) => {
  landing.value.description = addTargetBlankToLinks(content)
}

const openModalTool = () => {
  statusState.value.changeShowModal(true)
}

watch(
  () => landing.value.IsShowPrelanderConfigs(),
  async (newValue, oldValue) => {
    if (newValue) {
      if (!landing.value.prelander_configs) {
        landing.value.prelander_configs = defaultPrelanderConfigs()
      }
    } else {
      landing.value.prelander_configs = undefined
    }
  }
)

const isPub = window.arb.isPub()
const isComp = window.arb.isCompany()

const isHasSubmit = computed(() => {
  //Ko pải demand google thì mở lên - Thu - 04/12/25
  if (!landing.value.IsDemandAdsense()) return true
  if (window.arb.isLead()) return true

  if (landingNewStore.permissions.has_add) {
    if (modeData.isEditPage()) {
      if (landing.value.IsCreateByGPT() || landing.value.IsCreateByManual())
        return true

      return false
    }

    return true
  }
  if (
    landing.value.IsShowPrelanderConfigs() &&
    (isComp || landingNewStore.permissions.landingSpecial)
  )
    return true
  return false
})

//2 cái content description chưa tối ưu để v-show do permission bất đồng bộ, để v-if sẽ ko load đc ckeditor, tối ưu sau

const name = 'landing page'
</script>
<template>
  <div class="flex flex-col bg-base pr-8 flex-1 main_head">
    <LadingDraftConfirm :landing="landing" :statusData="statusData" />

    <div class="h-scree flex flex-col bg-base mt-4 flex-1 gap-4">
      <Skeleton v-if="statusData.isLoading" />

      <div class="flex gap-4" v-else>
        <div class="flex w-[74px] lg:w-[280px] flex-none relative">
          <NavBarLanding :landing="landing" />
        </div>
        <div class="flex-1 content w-full max-w-screen-2xl mb-[60px] mx-auto">
          <div class="flex justify-between items-center mb-3">
            <BackPage
              :url="feSettings?.page_list"
              :name="name"
              v-if="feSettings?.page_list"
              class="mt-6"
            />
          </div>

          <div
            :class="
              landing.IsShowPrelanderConfigs()
                ? 'grid gap-3 grid-cols-1 2xl:grid-cols-[65%_35%]'
                : 'grid gap-3 grid-cols-1 2xl:grid-cols-[80%_20%]'
            "
            v-if="!statusData.isLoading"
          >
            <div class="p-0 xl:w-full flex flex-col">
              <div class="flex flex-col flex-1 2xl:mb-20">
                <div class="campaign">
                  <n-card
                    v-show="landingNewStore.isStep(L.BASIC)"
                    class="card-flex-gap-4 rounded-[5px] !border-gray2 mb-4"
                  >
                    <template #header>
                      <span
                        class="overflow-hidden text-ellipsis max-w-24 capitalize"
                      >
                        {{
                          modeData.isAddPage()
                            ? isDuplicatePage
                              ? `Duplicate ${name}`
                              : `Add ${name}`
                            : `${name} detail`
                        }}
                      </span>
                    </template>
                    <template
                      #header-extra
                      v-if="
                        landing.IsShowContentDescription() &&
                        permissionLanding.isAcceptAICreate() &&
                        isComp
                      "
                    >
                      <n-button
                        size="small"
                        @click="openModalTool"
                        :disabled="modeData.isEditPage()"
                        type="primary"
                        >Generate Content</n-button
                      >
                    </template>

                    <LandingDemandSource
                      :landing="landing"
                      :modeData="modeData"
                      :permissionLanding="permissionLanding"
                    />
                    <LandingPageStatus
                      :landing="landing"
                      :permissionLanding="permissionLanding"
                    />

                    <CategoryTier
                      :landing="landing"
                      :statusState="statusState"
                    />
                    <LandingDirectLink
                      :landing="landing"
                      :modeData="modeData"
                    />
                    <LandingPrelander
                      :landing="landing"
                      :permissionLanding="permissionLanding"
                    />

                    <LandingName :landing="landing" />
                    <LandingPageInput :landing="landing" />

                    <!-- <LandingPage :landing="landing" /> -->
                    <FixedAdTitle
                      :landing="landing"
                      :permissionLanding="permissionLanding"
                    />

                    <Thumbnails :landing="landing" :modeData="modeData" />
                    <LandingMacros
                      v-if="
                        !landing.IsDemandPubPower() &&
                        !landing.IsDemandArbCore() &&
                        !landing.IsDemandCJ()
                      "
                    />
                    <KeywordSearchJob :landing="landing" />
                  </n-card>

                  <n-card
                    class="relative card-flex-gap-4 rounded-[5px] !border-gray2 mb-4"
                    v-show="
                      landing.IsShowContentBox() &&
                      landingNewStore.isStep(L.CONTENT)
                    "
                  >
                    <template #header>
                      <div class="flex justify-between">
                        <div class="flex">Content</div>
                      </div>
                    </template>

                    <div
                      @click="landing.t = 0"
                      class="absolute top-1/2 cursor-pointer right-2 -translate-y-1/2 bg-gray-700 text-white text-xs px-2 py-1 rounded opacity-0 pointer-events-none transition-all duration-200 group-hover:opacity-100 group-hover:pointer-events-auto"
                    >
                      Click to Edit1
                    </div>
                    <LandingTitle
                      :landing="landing"
                      :modeData="modeData"
                      :permissionLanding="permissionLanding"
                    />
                    <LandingSlug
                      :landing="landing"
                      :modeData="modeData"
                      :permissionLanding="permissionLanding"
                    />
                    <!-- <SubTitle :landing="landing" /> -->

                    <SponsoredTitle
                      :landing="landing"
                      v-if="!landingNewStore.permissions.landingSpecial"
                    />
                    <Layout
                      :landing="landing"
                      v-if="!landingNewStore.permissions.landingSpecial"
                    />

                    <div v-show="landing.IsShowContentDescription()">
                      <div>
                        <div class="text-xs mt-2 font-bold">
                          Description <span class="text-red-500">*</span>
                        </div>
                        <div class="mt-1 mb-1">
                          <CKEditor
                            id="descriptionEditor"
                            ref="descriptionEditorComp"
                            :height="337"
                            :initData="landing.description"
                            :loading="isLoadingEditor"
                            :disabled="isNotEdit"
                            :overlay="
                              landing.IsDisabledEdit() &&
                              landingNewStore.permissions.landingLite
                            "
                            :autoInit="false"
                            @changeEditor="changeEditorDescription"
                            title="Description"
                            editor-type="description"
                            @emitEdit="landing.t = 0"
                          />
                        </div>
                      </div>
                    </div>

                    <ContentType :landing="landing" />
                    <LandingLanguage
                      :landing="landing"
                      :permissionLanding="permissionLanding"
                    />

                    <LandingKeywords
                      :landing="landing"
                      :permissionLanding="permissionLanding"
                    />
                    <div v-show="landing.IsShowContentDescription()">
                      <div>
                        <div
                          class="w-150-px font-bold flex items-center text-xs gap-2"
                        >
                          Content <span class="text-red-500">*</span>

                          <n-popover trigger="hover" placement="right">
                            <template #trigger>
                              <n-icon
                                size="15"
                                :component="InformationCircleOutline"
                              />
                            </template>
                            <span
                              >Use params &lt;—next—&gt; to split content to new
                              page</span
                            >
                          </n-popover>
                        </div>
                        <div class="mt-1">
                          <CKEditor
                            id="contentEditor"
                            ref="contentEditorComp"
                            :height="580"
                            :initData="landing.content"
                            :loading="isLoadingEditor"
                            :disabled="isNotEdit"
                            :overlay="
                              landing.IsDisabledEdit() &&
                              landingNewStore.permissions.landingLite
                            "
                            @changeEditor="changeEditorContent"
                            title="Content"
                            editor-type="content"
                            @emitEdit="landing.t = 0"
                          />
                        </div>
                      </div>
                    </div>
                  </n-card>

                  <div v-show="landingNewStore.isStep(L.CONTENT)">
                    <JobConfigsLayout
                      :landing="landing"
                      v-if="!landingNewStore.permissions.landingSpecial"
                    />

                    <n-card
                      class="relative card-flex-gap-4 rounded-[5px] !border-gray2"
                      v-if="
                        landing.demand_source === 'codefuel' ||
                        (landing.demand_source === 'adsense' &&
                          landing.prelander === 'on')
                      "
                      :title="`${
                        landing.demand_source === 'adsense'
                          ? 'Google'
                          : 'Bing/Yahoo 01'
                      }`"
                    >
                      <CardMetaImage :landing="landing" :modeData="modeData" />
                    </n-card>
                  </div>
                </div>
                <Tonic :landing="landing" />
                <LandingMainKeyword :landing="landing" />
              </div>
            </div>

            <div class="xl:w-full xs:max-w-xs flex flex-col">
              <JobConfigs
                v-if="
                  landingNewStore.isStep(L.CONTENT) &&
                  !landingNewStore.permissions.landingSpecial
                "
                :landing="landing"
              />
            </div>
          </div>
        </div>
      </div>
    </div>

    <ToolContentModal :statusState="statusState" :landing="landing" />
    <div class="fixed bottom-0 left-0 right-0 z-[11] bg-white border-t p-2">
      <div class="flex gap-2 justify-end w-full">
        <div class="flex gap-2">
          <div class="flex" v-if="!statusData.isLoading && isComp">
            <ShortCode :landing="landing" />
          </div>

          <LandingPreview
            :landing="landing"
            v-if="!landingNewStore.permissions.landingSpecial"
          />

          <LandingPreviewPubpowerWrapper
            :landing="landing"
            v-if="
              landing.preview &&
              landing.demand_source === 'pubpower' &&
              !landingNewStore.permissions.landingSpecial
            "
          />
          <n-button
            v-if="landingNewStore.canNavigate(-1, landing.demand_source)"
            @click="landingNewStore.navigate(-1, landing.demand_source)"
          >
            Back
          </n-button>

          <n-button
            v-if="landingNewStore.canNavigate(1, landing.demand_source)"
            size="medium"
            type="success"
            @click="landingNewStore.navigate(1, landing.demand_source)"
          >
            Next
          </n-button>
        </div>
        <div class="flex items-center gap-3">
          <n-button
            v-if="isHasSubmit"
            color="#f43f5e"
            size="medium"
            type="success"
            :title="isNotEdit ? 'Only pending landing can edit.' : ''"
            :loading="isSubmitBtnLoading"
            :disabled="
              isSubmitBtnDisabled ||
              isNotEdit ||
              permissionLanding.isStop() ||
              isPub
            "
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss">
@use '@/css/LandingDetailV2.scss';
</style>
