<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import TrashOutline from '@/assets/icons/TrashOutline.vue'

import PlusSmall from '@/assets/icons/PlusSmall.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { MAX_SEARCH_THEMES, MAX_SEARCH_THEMES_CHARACTERS } from '@/constants/limits'
const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const inputValue = ref('')

const handlePaste = (event: any) => {
  // Lấy giá trị được dán từ clipboard
  const pastedText = event.clipboardData.getData('text')

  addNewSearchThemes(pastedText)
}

const addNewSearchThemesInput = () => {
  addNewSearchThemes(inputValue.value)
}

const addNewSearchThemes = async (input: string) => {
  const processedText = input.trim()

  const newArray = helper.stringToArray(processedText)
  props.adgroup.search_themes = (props.adgroup.search_themes || []).concat(
    newArray
  )
  props.adgroup.search_themes = helper.removeDuplicate(
    props.adgroup.search_themes
  )
  await helper.sleep(1)
  inputValue.value = ''
}

const removeSearchTheme = (index: number) => {
  props.adgroup.search_themes?.splice(index, 1)
}

// Clear toàn bộ search themes
const clearAllSearchThemes = () => {
  if (props.adgroup.search_themes) {
    props.adgroup.search_themes = []
  }
}

const isMaxSearchThemes = computed(() => {
  return props.adgroup.search_themes?.length &&
    props.adgroup.search_themes?.length >= MAX_SEARCH_THEMES
    ? true
    : false
})

const isTooLong = (input: string): boolean => {
  return helper.countCharactersV2(input) > MAX_SEARCH_THEMES_CHARACTERS
}

const copySearchThemes = (input: string[]) => {
  const text = input?.join('\n')
  helper.copyText(text)
  window.message.success('Copied!')
}

const name = 'Search Themes'
</script>

<template>
  <div class="flex flex-col gap-2" v-if="props.campaign.IsPMax()">
    <FloatingWrapper :name="name" rounded>
      <div class="flex gap-2">
        <n-input
          type="textarea"
          v-model:value="inputValue"
          :autosize="{
            minRows: 1,
            maxRows: 1,
          }"
          :placeholder="`Add ${name}`"
          @paste="handlePaste"
          @keydown.enter="addNewSearchThemesInput"
          :disabled="isMaxSearchThemes"
        />
        <n-button
          @click="addNewSearchThemesInput"
          :disabled="isMaxSearchThemes || !inputValue"
        >
          <template #icon>
            <n-icon :component="PlusSmall" size="28" />
          </template>
        </n-button>
      </div>
      <template #extra>
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon :component="QuestionCircleRegular" />
          </template>
          <span
            ><b>Validation errors</b> <br />Validation errors may occur due to
            the following reasons:<br />

            Copying and pasting search themes that aren’t separated by either a
            comma or a line break<br />
            Pasting too many search themes (more than 50)<br />
            Adding search themes that are too long (limit 80 characters)<br />
            Adding duplicate search themes<br
          /></span>
        </n-popover>
      </template>
    </FloatingWrapper>

    <div v-if="props.adgroup.search_themes?.length" class="flex">
      <div class="flex gap-4 flex-wrap">
        <div
          class="flex flex-col relative"
          v-for="(item, index) in props.adgroup.search_themes"
          :key="index"
        >
          <span
            class="text-xxs text-red-300 absolute -top-4"
            :class="{ 'error-search-themes': isTooLong(item) }"
            >{{ isTooLong(item) ? 'too long' : '&nbsp;' }}</span
          >
          <n-tag
            type="info"
            closable
            :title="item"
            @close="removeSearchTheme(index)"
            @click="copySearchThemes([item])"
            class="tag-themes cursor-copy"
            >{{ item }}</n-tag
          >
        </div>
      </div>
      <div class="ml-auto flex gap-2">
        <n-button
          class="w-12 cursor-copy"
          title="Copy All"
          @click="copySearchThemes(props.adgroup.search_themes)"
          ><template #icon><n-icon :component="CopyOutline" /></template
        ></n-button>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              class="w-100"
              color="#f43f5e"
              type="default"
              @click="clearAllSearchThemes"
            >
              <n-icon size="20">
                <TrashOutline />
              </n-icon>
            </n-button>
          </template>
          Clear all
        </n-tooltip>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.tag-themes {
  .n-tag__content {
    overflow: hidden;
    text-overflow: ellipsis;
    max-width: 300px;
    height: 18px;
  }
}
</style>
