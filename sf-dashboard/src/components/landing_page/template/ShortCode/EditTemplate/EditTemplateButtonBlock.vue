<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import { landingTypeClass } from '@/types/components/landing'
import PlusLg from '@/assets/icons/PlusLg.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { CB } from '@/enum/landing'
import ButtonText from '../EditBlock/ButtonText.vue'
import ButtonColor from '../EditBlock/ButtonColor.vue'
import ButtonUrl from '../EditBlock/ButtonUrl.vue'
import ButtonTextColor from '../EditBlock/ButtonTextColor.vue'
import ConfigReward from '../EditBlock/ConfigReward.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const store = useShortCodeBlock()
</script>

<template>
  <div v-if="store.editingForm">
    <div
      class="sticky top-0 mb-3 z-10 bg-[#f0f9ff] custom-darkmode-button-block"
    >
      <n-button
        class="w-full"
        dashed
        @click="
          store.addArrayblockItemById(
            store.editingForm.id as string,
            CB.BUTTON_BLOCK
          )
        "
      >
        <template #icon
          ><n-icon><PlusLg /></n-icon></template
        >Add Button CodeBlock</n-button
      >
    </div>
    <div>
      <div class="z-100"></div>

      <n-card
        class="mb-4 shadow-lg relative"
        v-for="(block, index) in store.editingForm.template_button_block"
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
                    CB.BUTTON_BLOCK
                  )
                "
              >
                <template #icon
                  ><n-icon size="medium"><DuplicateOutline /></n-icon
                ></template>
              </n-button>
            </template>
            Duplicate {{ CB.BUTTON_BLOCK }}
          </n-tooltip>
        </div>
        <RemoveButton
          @onClick="() => store.deleteArrayblockValue(index, CB.BUTTON_BLOCK)"
          placement="top-end"
          text="Remove Button"
        />
        <n-grid :cols="3" :x-gap="12">
          <n-grid-item>
            <ButtonText
              :model-value="block.buttonText"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'buttonText', val)
              "
            />
          </n-grid-item>
          <n-grid-item>
            <ButtonColor
              :model-value="block.buttonColor"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'buttonColor', val)
              "
            />
          </n-grid-item>
          <n-grid-item>
            <ButtonUrl
              :model-value="block.buttonUrl"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'buttonUrl', val)
              "
            />
          </n-grid-item>
        </n-grid>

        <n-grid :cols="1" :x-gap="12">
          <n-grid-item>
            <ButtonTextColor
              :model-value="block.buttonTextColor"
              @update:model-value="
                (val) =>
                  store.updateArrayblockValue(index, 'buttonTextColor', val)
              "
            />
          </n-grid-item>
        </n-grid>
        <n-grid
          :cols="1"
          :x-gap="12"
          v-if="props.landing.prelander_configs?.IsLayout100()"
        >
          <n-grid-item>
            <ConfigReward
              :model-value="block.configReward"
              @update:model-value="
                (val) => store.updateArrayblockValue(index, 'configReward', val)
              "
            />
          </n-grid-item>
        </n-grid>
      </n-card>
    </div>
  </div>
</template>
