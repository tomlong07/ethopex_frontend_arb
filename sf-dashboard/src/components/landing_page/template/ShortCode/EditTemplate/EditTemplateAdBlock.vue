<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import PlusLg from '@/assets/icons/PlusLg.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { CB } from '@/enum/landing'

const store = useShortCodeBlock()
</script>

<template>
  <div v-if="store.editingIndex !== undefined && store.editingForm">
    <div class="sticky top-0 mb-3 z-10 bg-[#f0f9ff]">
      <n-button
        class="w-full"
        dashed
        @click="
          store.addArrayblockItemById(
            store.editingForm.id as string,
            CB.AD_BLOCK
          )
        "
      >
        <template #icon
          ><n-icon><PlusLg /></n-icon
        ></template>
        AdBlock CodeBlock</n-button
      >
    </div>
    <div>
      <n-card
        class="mb-4 mt-2 shadow-lg relative"
        v-for="(block, index) in store.editingForm.template_ad_block"
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
                    CB.AD_BLOCK
                  )
                "
              >
                <template #icon
                  ><n-icon size="medium"><DuplicateOutline /></n-icon
                ></template>
              </n-button>
            </template>
            Duplicate {{ CB.AD_BLOCK }}
          </n-tooltip>
        </div>

        <RemoveButton
          @onClick="() => store.deleteArrayblockValue(index, CB.AD_BLOCK)"
          placement="top-end"
          text="Remove Button"
        />

        <n-grid :cols="1" :x-gap="12">
          <n-grid-item>
            <EditBlockAdMode
              :index="index"
              :model-value="block.adMode"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'adMode', val)
              "
            />
            <EditBlockAdType
              v-if="block.adMode === 'gam'"
              :model-value="block.adType"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'adType', val)
              "
            />
          </n-grid-item>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>
