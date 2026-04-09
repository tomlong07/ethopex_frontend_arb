<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import Image from '../EditBlock/Image.vue'
import ConfigReward from '../EditBlock/ConfigReward.vue'
import Heading from '../EditBlock/Heading.vue'
import SubHeading from '../EditBlock/SubHeading.vue'
import TextRating from '../EditBlock/TextRating.vue'
import TextDownload from '../EditBlock/TextDownload.vue'
import TextUse from '../EditBlock/TextUse.vue'
import ButtonText from '../EditBlock/ButtonText.vue'
import ButtonUrl from '../EditBlock/ButtonUrl.vue'
import ButtonColor from '../EditBlock/ButtonColor.vue'

const store = useShortCodeBlock()
</script>

<template>
  <div
    v-if="
      store.editingIndex !== undefined &&
      store.editingForm &&
      store.editingForm.template_app_download_card
    "
  >
    <Image
      @update:model-value="(val: string) => store.updateFormValue('imageUrl', val)"
      :onBeforeUpload="store.onBeforeUpload"
      :onSelectFromGallery="store.openModalGallery"
    />
    <n-grid :cols="2" :x-gap="12">
      <n-grid-item>
        <ConfigReward
          :model-value="
            store.editingForm.template_app_download_card.configReward
          "
          @update:model-value="
            (val) => store.updateFormValue('configReward', val)
          "
        />
      </n-grid-item>
      <n-grid-item>
        <Heading
          :model-value="store.editingForm.template_app_download_card.heading"
          @update:model-value="(val) => store.updateFormValue('heading', val)"
        />
      </n-grid-item>
    </n-grid>

    <SubHeading
      :model-value="store.editingForm.template_app_download_card.subHeading"
      @update:model-value="(val) => store.updateFormValue('subHeading', val)"
    />

    <n-grid :cols="3" :x-gap="12">
      <n-grid-item>
        <TextRating
          :model-value="store.editingForm.template_app_download_card.textRating"
          @update:model-value="
            (val) => store.updateFormValue('textRating', val)
          "
        />
      </n-grid-item>
      <n-grid-item>
        <TextDownload
          :model-value="
            store.editingForm.template_app_download_card.textDownload
          "
          @update:model-value="
            (val) => store.updateFormValue('textDownload', val)
          "
        />
      </n-grid-item>
      <n-grid-item>
        <TextUse
          :model-value="store.editingForm.template_app_download_card.textUse"
          @update:model-value="(val) => store.updateFormValue('textUse', val)"
        />
      </n-grid-item>
    </n-grid>
    <n-grid :cols="2" :x-gap="12">
      <n-grid-item>
        <ButtonText
          :model-value="store.editingForm.template_app_download_card.buttonText"
          @update:model-value="
            (val) => store.updateFormValue('buttonText', val)
          "
        />
      </n-grid-item>
      <n-grid-item>
        <ButtonUrl
          :model-value="store.editingForm.template_app_download_card.buttonUrl"
          @update:model-value="(val) => store.updateFormValue('buttonUrl', val)"
        />
      </n-grid-item>
    </n-grid>
    <ButtonColor
      :model-value="store.editingForm.template_app_download_card.buttonColor"
      @update:model-value="(val) => store.updateFormValue('buttonColor', val)"
    />
  </div>
</template>
