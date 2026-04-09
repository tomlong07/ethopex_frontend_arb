<script setup lang="ts">
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import { useCreativeField } from '@/composables/useCreativeField'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import Close from '@/assets/icons/Close.vue'
import { TitleStatus } from '@/options/creative'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})
const { updateField, validateField, addToArray, deleteFromArray } =
  useCreativeField()

const minMaxInfo = computed(() => {
  return {
    minTitle: 1,
    maxLengthTitle: 100,
    maxTitle: 5,
    minDescription: 2,
    maxLengthDescription: 90,
    maxDescription: 4,
  }
})

const isShowStatus = computed<boolean>(() => {
  return props.status.permissionCreative?.approvedCreative || false
})
const content = window.route?.query.content ?? null

const isHighlightTitle = (titleText: string): boolean => {
  if (!content || !titleText) return false
  return content.toString().toLowerCase() === titleText.toLowerCase()
}

const titleOptions = TitleStatus
const countCharacters = (text: string) => {
  if (!text) text = ''
  return helper.countCharactersV2(text)
}

const handleUpdateField = (
  index: number,
  fieldType: 'ttArray' | 'lhArray' | 'dArray'
) => {
  updateField(props.cre, index, fieldType, minMaxInfo.value)
}
const handleAddToArray = (
  index: number,
  fieldType: 'ttArray' | 'lhArray' | 'dArray'
) => {
  addToArray(props.cre, index, fieldType)
}
const handleDeleteFromArray = (
  index: number,
  itemIndex: number,
  fieldType: 'ttArray' | 'lhArray' | 'dArray'
) => {
  deleteFromArray(props.cre, index, itemIndex, fieldType)
}

onMounted(() => {
  props.cre.titles.forEach((titleItem) => {
    if (!titleItem.ttArray) {
      let parsed: any = ['']

      const t = titleItem.title
      if (t && t !== 'null') {
        if (t.startsWith('[') && t.endsWith(']')) {
          try {
            const json = JSON.parse(t)
            parsed = Array.isArray(json) ? json : ['']
          } catch {
            parsed = ['']
          }
        } else {
          parsed = [t]
        }
      }

      titleItem.ttArray = parsed
      titleItem.lhArray = titleItem.lhArray || ['']
      titleItem.dArray = titleItem.dArray || ['']
    }
  })
})
</script>

<template>
  <div v-if="props.cre.IsTikTok()" class="flex flex-col gap-4">
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex flex-col gap-4"
    >
      <!-- Title / Text -->
      <FloatingWrapper small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">{{
          props.cre.IsNative() ? 'Title' : 'Text'
        }}</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <div>Limit: {{ minMaxInfo.maxLengthTitle }}</div>
        </n-tooltip>
        <div class="relative">
          <!-- Nội dung input -->
          <div class="flex gap-4 flex-col">
            <div v-for="(item, i) in t.ttArray" :key="i" class="relative">
              <div class="flex gap-4">
                <div class="relative flex-1">
                  <n-input
                    v-model:value="t.ttArray[i]"
                    :placeholder="`Enter the title ${index + 1}${
                      i > 0 ? '.' + (i + 1) : ''
                    }`"
                    type="textarea"
                    :count-graphemes="countCharacters"
                    :on-change="validateField"
                    :status="
                      countCharacters(t.ttArray[i]) > minMaxInfo.maxLengthTitle
                        ? 'error'
                        : undefined
                    "
                    :on-input="() => handleUpdateField(i, 'ttArray')"
                    :class="{
                      'highlight-input': isHighlightTitle(t.ttArray[i]),
                    }"
                  >
                    <template #suffix>
                      <span>
                        {{ countCharacters(t.ttArray[i]) }}/{{
                          minMaxInfo.maxLengthTitle
                        }}
                      </span>
                    </template>
                  </n-input>
                  <!-- Delete -->
                  <n-button
                    quaternary
                    class="absolute -top-2 -right-2 z-10 !p-1 !min-w-0 !w-5 !h-5 rounded-full bg-gray-300 shadow-sm hover:!bg-red-500 hover:!text-white transition-colors"
                    @click="handleDeleteFromArray(index, i, 'ttArray')"
                    v-if="t.ttArray.length > 1"
                  >
                    <template #icon
                      ><n-icon size="14"><Close /></n-icon
                    ></template>
                  </n-button>
                </div>
                <!-- Status select -->
                <n-select
                  v-show="isShowStatus"
                  v-model:value="t.status"
                  class="w-28 ml-3 items-center"
                  :disabled="!t.status"
                  :options="titleOptions"
                />
              </div>

              <span
                v-if="countCharacters(t.ttArray[i]) > minMaxInfo.maxLengthTitle"
                class="text-red-500 ml-4 text-xs font-medium text-error-noti absolute"
              >
                Value too long
              </span>
            </div>
            <!-- Add -->
            <n-button
              ghost
              size="small"
              class="dynamic-button self-start"
              @click="handleAddToArray(index, 'ttArray')"
              :disabled="
                t.ttArray ? t.ttArray.length >= minMaxInfo.maxTitle : false
              "
              :title="'Max: ' + minMaxInfo.maxTitle"
            >
              Add Text
            </n-button>
          </div>
          <span class="absolute top-0 right-4 -mt-6 font-medium text-gray-500">
            {{
              (t.ttArray || []).filter((item) => item && item.trim() !== '')
                .length
            }}
            of {{ minMaxInfo.maxTitle }}
          </span>
        </div>
      </FloatingWrapper>
    </div>
  </div>
</template>
<style scoped>
.n-button[disabled] {
  opacity: 0.5; /* Làm mờ nút khi disabled */
  background-color: #e4e9ee; /* Màu xám nhạt để phân biệt */
  cursor: not-allowed; /* Thay đổi con trỏ chuột thành dấu cấm */
  border: 0.5px solid #9ca3af; /* Thêm viền để dễ nhận diện */
}

.n-button[disabled]:hover {
  background-color: #d1d5db; /* Ngăn hover effect khi disabled */
  color: #4b5563; /* Màu chữ xám khi disabled */
  border: none;
}

:deep(.highlight-input) {
  background-color: #ebeefa !important;
  border-color: #ebeefa !important;
}

:deep(.highlight-input .n-input__textarea-el) {
  background-color: #ebeefa !important;
}
</style>
