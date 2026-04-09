<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import LivePreview from '@/components/landing_page/template/ShortCode/EditBlock/LivePreview.vue'
import GalleryCard from '@/components/gallery/GalleryCard.vue'
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { landingTypeClass } from '@/types/components/landing'
import { CB } from '@/enum/landing'
import Image from './EditBlock/Image.vue'
import CodeBlock1_2 from './EditTemplate/EditTemplateCodeBlock1_2.vue'
import ButtonBlock from './EditTemplate/EditTemplateButtonBlock.vue'
import AppDownloadCard from './EditTemplate/EditTemplateAppDownloadCard.vue'
import PromoCarouselCard from './EditTemplate/EditTemplatePromoCarouselCard.vue'
import QuestionAnswerBlock from './EditTemplate/EditTemplateQuestionAnswerBlock.vue'
import AdBlock from './EditTemplate/EditTemplateAdBlock.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const store = useShortCodeBlock()

const isTemplateType = (template: CB | CB[]) =>
  computed(() => {
    if (!store.editingForm || !store.editingForm.template) return false
    return Array.isArray(template)
      ? template.includes(store.editingForm.template as CB)
      : store.editingForm.template === template
  })

const isButtonBlock = isTemplateType(CB.BUTTON_BLOCK)
const isAppDownloadCard = isTemplateType(CB.APP_DOWNLOAD_CARD)
const isPromoCarouselCard = isTemplateType(CB.PROMO_CAROUSEL_CARD)
const isQuestionAnswerBlock = isTemplateType(CB.QUESTION_ANSWER_BLOCK)
const isAdBlock = isTemplateType(CB.AD_BLOCK)
const isCodeBlock1_2 = isTemplateType([
  CB.JOB_POSTING_CARD,
  CB.PRICE_OFFER_CARD,
])
</script>
<template>
  <div
    v-if="store.editingIndex !== undefined && store.editingForm"
    class="grid grid-cols-1 gap-8"
  >
    <div class="space-y-4">
      <div
        class="text-md cursor-pointer font-semibold"
        @click="store.handleCopyShortcode(store.editingForm.id)"
      >
        {{ store.convertName(store.editingForm.template) }}
        <span class="font-light text-xs">[{{ store.editingForm.id }}] </span>
        <n-tooltip trigger="hover" placement="top-end">
          <template #trigger>
            <n-icon size="10" class="cursor-pointer"><Copy /></n-icon>
          </template>
          Copy Block Code
        </n-tooltip>
      </div>
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <n-card class="flex-1 overflow-y-auto h-[575px] custom-scrollbar">
          <n-form :model="store.editingForm" label-placement="top">
            <div v-if="store.editingForm.template" class="space-y-4">
              <template
                v-if="store.editingForm.template === CB.JOB_POSTING_CARD"
              >
                <Image
                  @update:model-value="(val: string) => store.updateFormValue('imageUrl', val)"
                  :onBeforeUpload="store.onBeforeUpload"
                  :onSelectFromGallery="store.openModalGallery"
                />
              </template>

              <template v-if="isCodeBlock1_2">
                <CodeBlock1_2 />
              </template>

              <template v-if="isButtonBlock">
                <ButtonBlock :landing="props.landing" />
              </template>

              <template v-if="isAppDownloadCard">
                <AppDownloadCard />
              </template>

              <template v-if="isPromoCarouselCard">
                <PromoCarouselCard />
              </template>

              <template v-if="isQuestionAnswerBlock">
                <QuestionAnswerBlock />
              </template>

              <template v-if="isAdBlock">
                <AdBlock />
              </template>
            </div>
          </n-form>
        </n-card>

        <!-- Live Preview -->
        <n-card class="flex-1">
          <LivePreview
            :template="store.editingForm.template"
            :items="store.editingForm.items || {}"
            :block-data="store.getBlockData(store.editingForm)"
          />
        </n-card>
      </div>
    </div>
  </div>
  <!-- Gallery Modal -->
  <n-modal v-model:show="store.showModalGallery">
    <n-card
      style="width: 95%; height: 90vh"
      title="Select Single Image from Gallery"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
      class="card-flex-gap-4 overflow-auto relative"
    >
      <GalleryCard :modalInfo="store.dataModalGallery" />
      <div class="flex flex-row-reverse sticky bottom-0 p-4 gap-2">
        <n-button
          color="#f43f5e"
          size="medium"
          class="button-apply"
          @click="store.selectFromGallery"
        >
          Select This Image
        </n-button>
        <n-button
          class="!bg-[#fff] hover:bg-transparent"
          size="medium"
          @click="store.showModalGallery = false"
        >
          Cancel
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>
<style scoped>
/* Make upload button full width */
:deep(.n-upload .n-upload-trigger) {
  width: 100% !important;
  display: block !important;
}

:deep(.n-upload .n-upload-trigger .n-button) {
  width: 100% !important;
}
.custom-scrollbar {
  scrollbar-width: thin !important;
}
</style>
