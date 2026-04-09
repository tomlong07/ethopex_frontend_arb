<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import PlusLg from '@/assets/icons/PlusLg.vue'
import { UploadFileInfo } from 'naive-ui'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { CB } from '@/enum/landing'
import Image from '../EditBlock/Image.vue'
import Title from '../EditBlock/Title.vue'
import Description from '../EditBlock/Description.vue'

const store = useShortCodeBlock()
</script>

<template>
  <div v-if="store.editingIndex !== undefined && store.editingForm">
    <div
      class="sticky top-0 mb-3 z-10 bg-[#f0f9ff] custom-darkmode-button-block"
    >
      <n-button
        class="w-full"
        dashed
        @click="
          store.addArrayblockItemById(
            store.editingForm.id as string,
            CB.PROMO_CAROUSEL_CARD
          )
        "
      >
        <template #icon
          ><n-icon><PlusLg /></n-icon></template
        >Add Slide CodeBlock</n-button
      >
    </div>
    <div>
      <n-card
        class="mb-4 mt-2 shadow-lg relative"
        v-for="(block, index) in store.editingForm.template_promo_carousel_card"
        :key="index"
      >
        <div class="flex gap-2 absolute right-2 top-2">
          <n-tooltip trigger="hover" placement="top-end">
            <template #trigger>
              <n-button
                size="small"
                class="mr-4"
                @click.stop="
                  store.duplicateArrayblockItem(
                    index,
                    store.editingForm.id as string,
                    CB.PROMO_CAROUSEL_CARD
                  )
                "
              >
                <template #icon
                  ><n-icon size="medium"><DuplicateOutline /></n-icon
                ></template>
              </n-button>
            </template>
            Duplicate {{ CB.PROMO_CAROUSEL_CARD }}
          </n-tooltip>
        </div>

        <RemoveButton
          @onClick="
            () => store.deleteArrayblockValue(index, CB.PROMO_CAROUSEL_CARD)
          "
          placement="top-end"
          text="Remove Button"
        />
        <Image
          @update:model-value="
                      (val: string) => store.updateArrayblockValue(index, 'imageUrl', val)
                    "
          :onBeforeUpload="async (fileInfo: UploadFileInfo) => {
                      const file = (fileInfo.file as any)?.file
                      if (!file) {
                        store.showNotification('Invalid file', 'error')
                        return false
                      }
                      await store.handleImageUpload(file, index)
                      return false
                    }"
          :onSelectFromGallery="() => store.openModalGallery(index)"
        />
        <Title
          :model-value="block.title"
          @update:model-value="
            (val) => store.updateArrayblockValue(index, 'title', val)
          "
        />
        <Description
          :model-value="block.description"
          @update:model-value="
            (val) => store.updateArrayblockValue(index, 'description', val)
          "
        />
        <div class="flex justify-center">
          <span class="px-1 bg-[#77abcc] rounded-lg text-white">
            Slide {{ index + 1 }}
          </span>
        </div>
      </n-card>
    </div>
  </div>
</template>
