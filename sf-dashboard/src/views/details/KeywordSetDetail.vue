<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import MultipleCampaigns from '@/components/common/MultipleCampaigns.vue'

import { keywordSetType } from '@/types/components/keyword_set'
import { ModalState } from '@/types/components/modal'

import useCampaign2Store from '@/store/useCampaign2Store'

import BackPage from '@/components/common/BackPage.vue'

import { useKeywordSetStore } from '@/store/details/kwsetStore'
import { dataThumb, ModalGalleryInfo } from '@/types/components/gallery'
import ModalUpload from '@/components/keyword_set/ModalUpload.vue'
import GalleryCard from '@/components/gallery/GalleryCard.vue'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { ctr_keyword_set } from '@/services/ctr_keyword_set'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import GenerateKeyword from '@/components/kw_set/GenerateKeyword.vue'
import RevenuePerInteraction from '@/components/kw_set/RevenuePerInteraction.vue'
import DemandSoure from '@/components/kw_set/DemandSoure.vue'
import Macros from '@/components/kw_set/Macros.vue'
import KeywordABtest from '@/components/kw_set/KeywordABtest.vue'
import Keywords from '@/components/kw_set/Keywords.vue'
import Copy from '@/components/kw_set/Copy.vue'
import NavBarKeywordset from '@/components/kw_set/NavBarKeywordset.vue'
import { LIMIT_PAGE_VIEW } from '@/constants/limits'
import Country from '@/components/kw_set/Country.vue'
import AutoOptimize from '@/components/kw_set/AutoOptimize.vue'
const kwsetStore = useKeywordSetStore()

const campaignStore2 = useCampaign2Store()

const props = defineProps({
  dataModal: {
    type: Object as () => ModalState,
  },

  fromCategoySiteBuilder: {
    type: Boolean,
    default: false,
  },

  isInModal: {
    type: Boolean,
    default: false,
  },

  isInCateSiteBuilder: {
    type: Boolean,
    default: false,
  },
})

kwsetStore.setProps(props)

const feSettings = ref<FeSettings>()

if (kwsetStore.isNormal) {
  useFeSettings(feSettings, window.route?.meta?.url as string)
}

const dataModalGallery = ref<ModalGalleryInfo>(
  new ModalGalleryInfo({
    isModal: true,
    singleSelection: true,
  })
)

const titlePage = computed<string>(() => {
  if (props.fromCategoySiteBuilder)
    return helper.capitalizeFirstLetter(kwsetStore.name)
  return (
    `${kwsetStore.textShow} ${kwsetStore.name}` +
    (kwsetStore.isEditPage ? ` - ID: ${kwsetStore.dataConfig.id || 'N/A'}` : '')
  )
})

const payload = computed(() => {
  return buildPayload(kwsetStore.dataConfig)
})

const buildPayload = (data: keywordSetType) => {
  let cloneData = helper.clone(data)
  let newData: { [key: string]: any } = {
    name: cloneData.name,
    status: cloneData.status,
    limit_keyword: cloneData.limit_keyword,
    keyword_ab_test: cloneData.keyword_ab_test,
    rpi: cloneData.rpi,
    demand_source: cloneData.demand_source,
    country: cloneData.country,
    auto_optimize: cloneData.auto_optimize,
  }

  newData.keywords = cloneData.keywords

  if (newData.keyword_ab_test) {
    newData.limit_page_view =
      cloneData.limit_page_view == LIMIT_PAGE_VIEW
        ? 0
        : cloneData.limit_page_view
  }

  return newData
}

onMounted(async () => {
  kwsetStore.clearData()
  kwsetStore.isLoading = true

  if (kwsetStore.isEditPage) await kwsetStore.getOldData()

  kwsetStore.sortKeyword('status', 'desc')

  kwsetStore.isLoading = false
})

const addNewData = async () => {
  const result = await ctr_keyword_set.Add(payload.value)
  if (result?.status) {
    window.message.success(`Add ${kwsetStore.name} successfully`)

    if (kwsetStore.isNormal && feSettings.value?.page_list) {
      window.router.push({ path: feSettings.value.page_list })
    }

    if (kwsetStore.isModal) {
      campaignStore2.changeIdKeywordSet(result.data)
      campaignStore2.changeModalKeywordset(false)
    }
  }
}

watch(
  () => campaignStore2.showModalKeywordset,
  async (newValue, oldValue) => {
    if (newValue === false) return
  }
)

const submitForm = async () => {
  if (kwsetStore.messageManager) kwsetStore.messageManager?.destroy()

  if (kwsetStore.dataConfig.name == '') {
    kwsetStore.errorNotify(`Submit failed: Name is required`)
    return
  }
  if (
    kwsetStore.dataConfig.keyword_ab_test &&
    kwsetStore.dataConfig.limit_page_view === 0
  ) {
    kwsetStore.errorNotify(`Please enter limit page view!`)
    return
  }

  if (
    kwsetStore.dataConfig.keyword_ab_test &&
    kwsetStore.dataConfig.limit_keyword === 0
  ) {
    kwsetStore.errorNotify(`Please enter limit keyword!`)
    return
  }

  const stop = kwsetStore.validateKW(kwsetStore.dataConfig.keyword_ab_test)

  if (stop) return

  if (
    kwsetStore.dataConfig.keyword_ab_test &&
    kwsetStore.dataConfig.limit_keyword
  ) {
    if (
      kwsetStore.dataConfig.limit_keyword < 3 ||
      kwsetStore.dataConfig.limit_keyword > 8
    ) {
      kwsetStore.errorNotify(`Please enter Limit Keyword Min 3 And Max 8!`)
      return
    }
  }

  kwsetStore.isSubmitBtnLoading = true

  if (kwsetStore.isAddPage) await addNewData()
  if (kwsetStore.isEditPage) {
    await kwsetStore.updateData(kwsetStore.id, payload.value, true)
  }

  kwsetStore.isSubmitBtnLoading = false
}

const getDataKwSet = () => {
  return kwsetStore.dataConfig
}

// Hàm xử lý khi apply image từ ModalUpload
const handleApplyImage = (imagePath: string) => {
  if (kwsetStore.selectedKeywordIndex >= 0) {
    if (kwsetStore.selectedKeywordType === 'keywords') {
      kwsetStore.dataConfig.keywords[kwsetStore.selectedKeywordIndex].image =
        imagePath
    }
  }
  kwsetStore.showModalUpload = false
}

// Hàm xử lý khi mở gallery từ ModalUpload
const handleOpenGalleryFromUpload = () => {
  openModalGallery()
}

const openModalGallery = () => {
  kwsetStore.showModalGallery = true
  dataModalGallery.value.selectedMedia = []
}

const AddImageToKeywordSet = () => {
  const itemsToAdd = dataModalGallery.value.selectedMedia

  if (itemsToAdd.length > 0 && kwsetStore.selectedKeywordIndex >= 0) {
    const newImage = new dataThumb({ path: itemsToAdd[0] })

    if (kwsetStore.selectedKeywordType === 'keywords') {
      kwsetStore.dataConfig.keywords[kwsetStore.selectedKeywordIndex].image =
        newImage.path
    }
  }

  kwsetStore.showModalGallery = false
  kwsetStore.showModalUpload = false
}

defineExpose({
  getDataKwSet,
})
</script>
<template>
  <div class="flex bg-white min-h-screen" v-bind="$attrs">
    <div
      class="flex w-[64px] lg:w-[280px] flex-none relative"
      v-if="
        (kwsetStore.isEditPage && !dataModal?.id) ||
        (kwsetStore.isEditPage && !isInCateSiteBuilder)
      "
      :class="{ 'in-modal': isInModal }"
    >
      <NavBarKeywordset :isInModal="isInModal" />
    </div>

    <n-card class="flex-1 min-w-0">
      <div
        :class="{
          'mx-auto 2xl:max-w-[65%]': !dataModal?.id,
          '2xl:max-w-[72%]': dataModal?.id && !isInCateSiteBuilder,
          '2xl:max-w-[90%]': dataModal?.id && isInModal,
        }"
      >
        <BackPage
          :url="feSettings?.page_list"
          :name="'Keyword Set'"
          v-if="feSettings?.page_list && kwsetStore.isNormal"
          class="mb-6"
        />

        <div v-show="kwsetStore.isLoading">
          <Skeleton />
        </div>

        <div v-show="!kwsetStore.isLoading">
          <n-spin
            v-show="kwsetStore.isKeywordSetTab"
            :show="kwsetStore.isGenerating"
            content-class="w-full"
            class="w-full"
          >
            <n-card :title="titlePage" class="card-flex-gap-4">
              <template
                #header-extra
                v-if="kwsetStore.isAddPage && kwsetStore.isShowFull"
              >
                <GenerateKeyword />
              </template>
              <!-- <Country /> -->
              <div v-if="kwsetStore.isShowFull">
                <KWName />
              </div>
              <RevenuePerInteraction />

              <DemandSoure />

              <div v-if="!props.fromCategoySiteBuilder">
                <Macros />
              </div>

              <KeywordABtest />
              <AutoOptimize />

              <Keywords :isInModal="isInModal" />
            </n-card>
          </n-spin>

          <div v-show="kwsetStore.activeKey === 'campaigns'">
            <MultipleCampaigns
              v-if="kwsetStore.isEditPage && kwsetStore.isShowFull"
              @updateTable="kwsetStore.updateTable"
              :id="kwsetStore.id"
            />

            <Copy />
          </div>
        </div>
      </div>
      <div
        class="sticky bottom-2 mt-4 justify-end flex"
        v-if="kwsetStore.isShowFull"
      >
        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          :disabled="kwsetStore.isDisable"
          :loading="kwsetStore.isSubmitBtnLoading"
          @click="submitForm"
        >
          Submit
        </n-button>
      </div>
    </n-card>
  </div>

  <!-- Modal Upload/Gallery  -->
  <n-modal v-model:show="kwsetStore.showModalGallery">
    <n-card
      style="width: 95%; height: 90vh"
      title="Gallery"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      class="card-flex-gap-4 overflow-auto relative"
    >
      <GalleryCard :modalInfo="dataModalGallery" />
      <div class="flex justify-end sticky bottom-0 p-4">
        <n-button
          class="button-apply"
          color="#f43f5e"
          size="small"
          @click="AddImageToKeywordSet()"
        >
          Add To Keyword Set
        </n-button>
      </div>
    </n-card>
  </n-modal>

  <ModalUpload
    v-model:show="kwsetStore.showModalUpload"
    :edit-image-path="kwsetStore.currentEditImagePath"
    @apply-image="handleApplyImage"
    @open-gallery="handleOpenGalleryFromUpload"
  />
</template>
<style lang="scss">
@use '@/css/KeywordSetDetail.scss';
.in-modal {
  position: sticky;
  top: 0;
  height: 100%;
  width: 280px;
  overflow-y: auto;
}

.custom-scrollbar {
  scrollbar-width: thin;
}
</style>
