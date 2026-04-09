<script lang="ts" setup>
import useShortCodeBlock from '@/store/useShortCodeBlock'
import PlusLg from '@/assets/icons/PlusLg.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import { CB } from '@/enum/landing'
import Question from '../EditBlock/Question.vue'
import Answer from '../EditBlock/Answer.vue'

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
            CB.QUESTION_ANSWER_BLOCK
          )
        "
      >
        <template #icon
          ><n-icon><PlusLg /></n-icon></template
        >Add Text CodeBlock</n-button
      >
    </div>
    <div>
      <n-card
        class="mb-4 mt-2 shadow-lg relative"
        v-for="(block, index) in store.editingForm
          .template_question_answer_block"
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
                    CB.QUESTION_ANSWER_BLOCK
                  )
                "
              >
                <template #icon
                  ><n-icon size="medium"><DuplicateOutline /></n-icon
                ></template>
              </n-button>
            </template>
            Duplicate {{ CB.QUESTION_ANSWER_BLOCK }}
          </n-tooltip>
        </div>

        <RemoveButton
          @onClick="
            () => store.deleteArrayblockValue(index, CB.QUESTION_ANSWER_BLOCK)
          "
          placement="top-end"
          text="Remove Button"
        />

        <Question
          :model-value="block.question"
          @update:model-value="
            (val) => store.updateArrayblockValue(index, 'question', val)
          "
        />
        <Answer
          :model-value="block.answer"
          @update:model-value="
            (val) => store.updateArrayblockValue(index, 'answer', val)
          "
        />
      </n-card>
    </div>
  </div>
</template>
