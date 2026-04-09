<script setup lang="ts">
import TrashOutline from '@/assets/icons/TrashOutline.vue'
import PlusSmall from '@/assets/icons/PlusSmall.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue';
import { MAX_SEARCH_THEMES, MAX_SEARCH_THEMES_CHARACTERS } from '@/constants/limits';

const props = defineProps<{
  name: string
  maxItems?: number
  aiText?: string
}>()

// reactive model truyền từ bên ngoài
const model = defineModel<string[]>({ default: [] })

const inputValue = ref('')

const handlePaste = (event: ClipboardEvent) => {
  const pastedText = event.clipboardData?.getData('text') ?? ''
  removeAIProcess()
  addNew(pastedText)
}

const removeAIProcess = () => {
  if (!model.value) model.value = []
  const i = model.value.indexOf(props.aiText || '')
  if (i > -1) model.value.splice(i, 1)
}

const addAI = () => {
  inputValue.value = ''
  model.value = [props.aiText || '']
}

const addNewInput = () => {
  removeAIProcess()
  addNew(inputValue.value)
}

const addNew = async (text: string) => {
  const items = helper.stringToArray(text.trim())
  model.value = helper.removeDuplicate((model.value ?? []).concat(items))
  await helper.sleep(1)
  inputValue.value = ''
}

const clearAll = () => {
  model.value = []
}

const isTooLong = (s: string) =>
  helper.countCharactersV2(s) > MAX_SEARCH_THEMES_CHARACTERS

const removeItem = (i: number) => {
  model.value.splice(i, 1)
}

const copyItems = (arr: string[]) => {
  helper.copyText(arr.join('\n'))
  window.message.success('Copied!')
}

const isMax = computed(
  () => model.value?.length >= (props.maxItems ?? MAX_SEARCH_THEMES)
)
</script>

<template>
  <div class="flex items-center gap-2">
    <!-- <div class="w-48 font-bold">{{ name }}</div> -->

    <div class="flex-1 min-w-0 flex gap-4 flex-col">
      <div class="flex gap-2 items-center">
        <FloatingWrapper :name="name" :placeholder="true">
          <n-input
            v-model:value="inputValue"
            type="textarea"
            :autosize="{ minRows: 1, maxRows: 1 }"
            :placeholder="`Add ${name}`"
            :disabled="isMax"
            @paste="handlePaste"
            @keydown.enter.prevent="addNewInput"
          />
        </FloatingWrapper>
        <n-button @click="addNewInput" :disabled="isMax || !inputValue">
          <template #icon><n-icon :component="PlusSmall" size="28" /></template>
        </n-button>

        <n-button v-if="aiText" class="w-40" @click="addAI">{{
          aiText
        }}</n-button>
      </div>

      <div v-if="model?.length" class="flex">
        <div class="flex gap-4 flex-wrap flex-1 min-w-0">
          <div
            v-for="(item, i) in model"
            :key="i"
            class="flex flex-col relative"
          >
            <span
              class="text-xxs text-red-300 absolute -top-4"
              :class="{ 'error-search-themes': isTooLong(item) }"
            >
              {{ isTooLong(item) ? 'too long' : '\u00A0' }}
            </span>

            <n-tag
              :type="isTooLong(item) ? 'error' : 'info'"
              closable
              @close="removeItem(i)"
              @click="copyItems([item])"
              class="cursor-copy"
            >
              <div class="flex items-center max-w-lg">
                <span class="truncate flex-1 min-w-0">{{ item }}</span>
              </div>
            </n-tag>
          </div>
        </div>

        <div class="ml-auto flex gap-2">
          <n-button
            size="small"
            class="w-12 cursor-copy"
            title="Copy All"
            @click="copyItems(model)"
          >
            <template #icon><n-icon :component="CopyOutline" /></template>
          </n-button>

          <n-tooltip trigger="hover">
            <template #trigger>
              <n-button
                size="small"
                color="#f43f5e"
                type="default"
                @click="clearAll"
              >
                <n-icon size="20"><TrashOutline /></n-icon>
              </n-button>
            </template>
            Clear all
          </n-tooltip>
        </div>
      </div>
    </div>
  </div>
</template>
