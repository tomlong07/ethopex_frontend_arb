<script setup lang="ts">
import { creativeType } from '@/types/components/creative'

import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeType,
    required: true,
  },

  maxInfo: {
    type: Object,
    required: false,
    default: () => ({
      minTitle: 3,
      MaxLengthTitle: 30,
      MaxTitle: 15,
      minDescription: 2,
      MaxLengthDescription: 90,
      MaxDescription: 4,
    }),
  },
})

const countCharacters = (text: string) => {
  return helper.countCharactersV2(text)
}

const validateInput = (input: string) => {
  const invalidText = findInvalidSubstrings(input)
  if (invalidText.length > 0) {
    window.message.error(Creative.value.invalid_chain + invalidText.join(', '))
  }
}

const findInvalidSubstrings = (input: string) => {
  const pattern = /\{[^}]*\}/g

  // Tìm tất cả các chuỗi con khớp với pattern
  const matches = input.match(pattern) || []

  // Lọc các chuỗi không hợp lệ
  const invalidMatches = matches.filter((match) => {
    // Loại bỏ dấu ngoặc đầu và cuối
    const content = match.substring(1, match.length - 1).trim()

    // Kiểm tra nếu không có dấu hai chấm hoặc bất kỳ phần nào rỗng
    if (!content.includes(':')) {
      return true
    }

    const parts = content.split(':')
    return parts[0].trim() === '' || parts[1].trim() === ''
  })

  return invalidMatches
}

const deleteTitleGG = (index: number, i: number) => {
  props.cre.titles[index].ttArray.splice(i, 1)
}

const addTitleGG = (index: number) => {
  props.cre.titles[index].ttArray.push('')
}

const addDescriptionGG = (index: number) => {
  props.cre.titles[index].dArray.push('')
}

const deleteDescriptionGG = (index: number, i: number) => {
  props.cre.titles[index].dArray.splice(i, 1)
}

const deleteTitle = (index: number) => {
  props.cre.titles.splice(index, 1)
}
</script>

<template>
  <div class="flex my-4 flex-col">
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex flex-col gap-6"
    >
      <!-- title -->
      <div class="flex">
        <div class="w-1/6 font-bold flex items-center gap-2">
          Title
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="12">
                <QuestionCircleRegular />
              </n-icon>
            </template>
            <div>
              {{ Creative.minimum }}: {{ props.maxInfo.minTitle }} titles.
              <br />
              {{ Creative.maximum }}: {{ props.maxInfo.MaxTitle }} titles.<br />
              {{
                Creative.maximum_charac.replace(
                  '{maxLengthTitle}',
                  props.maxInfo.MaxLengthTitle.toString()
                )
              }}
            </div>
          </n-tooltip>
        </div>
        <div class="w-5/6 flex gap-6 flex-col relative">
          <div :key="i" v-for="(item, i) in t.ttArray">
            <div class="flex gap-2">
              <n-input
                v-model:value="t.ttArray[i]"
                :placeholder="
                  'Enter the title' +
                  ' ' +
                  (index + 1) +
                  (i > 0 ? '.' + (i + 1) : '')
                "
                :count-graphemes="countCharacters"
                :on-change="validateInput"
                :status="
                  countCharacters(t.ttArray[i]) > props.maxInfo.MaxLengthTitle
                    ? 'error'
                    : undefined
                "
              >
                <template #suffix
                  ><span
                    >{{ countCharacters(t.ttArray[i]) }}/{{
                      props.maxInfo.MaxLengthTitle
                    }}</span
                  >
                </template>
              </n-input>

              <n-button
                ghost
                class="dynamic-button"
                @click="deleteTitleGG(index, i)"
                :disabled="t.ttArray.length <= 1"
              >
                <template #icon>
                  <n-icon size="12" :component="Minus" />
                </template>
              </n-button>
              <n-button
                ghost
                class="dynamic-button"
                @click="addTitleGG(index)"
                :disabled="t.ttArray.length >= props.maxInfo.MaxTitle"
                :title="'Max: ' + props.maxInfo.MaxTitle"
              >
                <template #icon>
                  <n-icon size="12" :component="Plus" />
                </template>
              </n-button>
            </div>
            <span
              class="text-red-500 ml-4 text-xs font-medium text-error-noti absolute"
              >{{
                countCharacters(t.ttArray[i]) > props.maxInfo.MaxLengthTitle
                  ? 'Value too long'
                  : ''
              }}</span
            >
          </div>
          <!-- bỏ qua duyệt ở google search -->
        </div>
      </div>
      <!-- description -->
      <div class="flex">
        <div class="w-1/6 font-bold flex items-center gap-2">
          Description
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="12">
                <QuestionCircleRegular />
              </n-icon>
            </template>
            <div>
              {{ Creative.minimum }}:
              {{ props.maxInfo.minDescription }} descriptions.
              <br />
              {{ Creative.maximum }}:
              {{ props.maxInfo.MaxDescription }} descriptions.<br />
              {{
                Creative.maximum_charac.replace(
                  '{maxLengthTitle}',
                  props.maxInfo.MaxLengthDescription.toString()
                )
              }}
            </div>
          </n-tooltip>
        </div>
        <div class="w-5/6 flex gap-6 flex-col relative">
          <div :key="i" v-for="(item, i) in t.dArray">
            <div class="flex flex-row gap-2">
              <n-input
                v-model:value="t.dArray[i]"
                type="textarea"
                :placeholder="
                  'Enter the description' +
                  ' ' +
                  (index + 1) +
                  (i > 0 ? '.' + (i + 1) : '')
                "
                class="w-5/6"
                :count-graphemes="countCharacters"
                :on-change="validateInput"
                :status="
                  countCharacters(t.dArray[i]) >
                  props.maxInfo.MaxLengthDescription
                    ? 'error'
                    : undefined
                "
              >
                <template #suffix
                  ><span
                    >{{ countCharacters(t.dArray[i]) }}/{{
                      props.maxInfo.MaxLengthDescription
                    }}</span
                  >
                </template>
              </n-input>
              <n-button
                ghost
                class="dynamic-button"
                @click="deleteDescriptionGG(index, i)"
                :disabled="t.dArray.length <= 1"
              >
                <template #icon>
                  <n-icon size="12" :component="Minus" />
                </template>
              </n-button>

              <n-button
                ghost
                class="dynamic-button"
                @click="addDescriptionGG(index)"
                :disabled="t.dArray.length >= props.maxInfo.MaxDescription"
                :title="'Max: ' + props.maxInfo.MaxDescription"
              >
                <template #icon>
                  <n-icon size="12" :component="Plus" />
                </template>
              </n-button>
            </div>
            <span
              class="text-red-500 ml-4 text-xs font-medium text-error-noti absolute"
              >{{
                countCharacters(t.dArray[i]) >
                props.maxInfo.MaxLengthDescription
                  ? 'Value too long'
                  : ''
              }}</span
            >
          </div>
        </div>
      </div>
      <div class="flex justify-end mt-4">
        <n-button
          v-show="cre.titles.length > 1"
          class="flex justify-items-end"
          color="#f43f5e"
          size="medium"
          type="success"
          @click="deleteTitle(index)"
        >
          Delete
        </n-button>
      </div>
    </div>
  </div>
</template>
