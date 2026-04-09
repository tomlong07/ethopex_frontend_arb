<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { useCreativeField } from '@/composables/useCreativeField'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import Close from '@/assets/icons/Close.vue'

import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})
const {
  updateField,
  validateField,
  copyToClipboard,
  addToArray,
  deleteFromArray,
} = useCreativeField()

const minMaxInfo = computed(() => {
  switch (true) {
    case props.cre.IsGoogleSearch():
      return {
        minTitle: 3,
        maxLengthTitle: 30,
        maxTitle: 15,
        minDescription: 2,
        maxLengthDescription: 90,
        maxDescription: 4,
      }

    case props.cre.IsDemandGenVideo():
      return {
        minTitle: 1,
        maxLengthTitle: 40,
        maxTitle: 5,
        minLongHeadline: 1,
        maxLengthLongHeadline: 90,
        maxLongHeadline: 5,
        minDescription: 1,
        maxLengthDescription: 90,
        maxDescription: 5,
      }

    case props.cre.IsDemandGen():
      return {
        minTitle: 1,
        maxLengthTitle: 40,
        maxTitle: 5,
        minDescription: 1,
        maxLengthDescription: 90,
        maxDescription: 5,
      }

    case props.cre.IsPMax():
      return {
        minTitle: 3,
        maxLengthTitle: 30,
        maxTitle: 15,
        minDescription: 1,
        maxLengthDescription: 90,
        maxDescription: 4,
        minLongHeadline: 1,
        maxLengthLongHeadline: 90,
        maxLongHeadline: 5,
      }
    case props.cre.IsGoogleDisplay():
      return {
        minTitle: 3,
        maxLengthTitle: 30,
        maxTitle: 5,
        minDescription: 1,
        maxLengthDescription: 90,
        maxDescription: 5,
        minLongHeadline: 1,
        maxLengthLongHeadline: 90,
        maxLongHeadline: 1,
      }
  }

  return {
    minTitle: 0,
    maxLengthTitle: 0,
    maxTitle: 0,
    minDescription: 0,
    maxLengthDescription: 0,
    maxDescription: 0,
  }
})

const countCharacters = (text: string) => {
  if (!text) text = ''
  return helper.countCharactersV2(text)
}

const titleShowName = computed(() => {
  return props.cre.IsPMax() || props.cre.IsGoogleDisplay()
    ? 'Headline'
    : 'Title'
})

const handleUpdateField = (
  index: number,
  fieldType: 'ttArray' | 'lhArray' | 'dArray'
) => {
  updateField(props.cre, index, fieldType, minMaxInfo.value)
}

const handleCopyToClipboard = (type: 'ttArray' | 'lhArray' | 'dArray') => {
  copyToClipboard(props.cre, type)
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
</script>

<template>
  <div class="flex flex-col gap-4" v-if="props.cre.IsTitleDesType2()">
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex flex-col"
    >
      <!-- Title Section -->
      <FloatingWrapper small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">{{
          titleShowName
        }}</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <div>
            {{ Creative.minimum }}: {{ minMaxInfo.minTitle }}
            {{ titleShowName }}.<br />
            {{ Creative.maximum }}: {{ minMaxInfo.maxTitle }}
            {{ titleShowName }}.<br />
            {{
              Creative.maximum_charac.replace(
                '{maxLengthTitle}',
                minMaxInfo.maxLengthTitle.toString()
              )
            }}
          </div>
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              size="tiny"
              text
              class="p-0 ml-1"
              @click="handleCopyToClipboard('ttArray')"
            >
              <n-icon size="14"><Copy /></n-icon>
            </n-button>
          </template>
          Copy
        </n-tooltip>
        <div class="relative">
          <div class="flex gap-4 flex-col">
            <div
              v-for="(item, i) in t.ttArray"
              :key="i"
              class="relative flex gap-4"
            >
              <div class="relative flex-1">
                <n-input
                  v-model:value="t.ttArray[i]"
                  type="textarea"
                  :placeholder="`Enter the ${titleShowName} ${index + 1}${
                    i > 0 ? '.' + (i + 1) : ''
                  }`"
                  :count-graphemes="countCharacters"
                  :on-change="validateField"
                  :on-input="() => handleUpdateField(i, 'ttArray')"
                  :status="
                    countCharacters(t.ttArray[i]) > minMaxInfo.maxLengthTitle ||
                    props.cre.ai_verify?.isInvalid(item)
                      ? 'error'
                      : undefined
                  "
                >
                  <template #suffix>
                    <span
                      >{{ countCharacters(t.ttArray[i]) }}/{{
                        minMaxInfo.maxLengthTitle
                      }}</span
                    >
                  </template>
                </n-input>
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

              <span
                v-if="countCharacters(t.ttArray[i]) > minMaxInfo.maxLengthTitle"
                class="text-red-500 text-xs font-medium absolute left-0 -bottom-4"
              >
                Value too long
              </span>
            </div>

            <n-button
              ghost
              size="small"
              class="dynamic-button self-start"
              @click="handleAddToArray(index, 'ttArray')"
              :disabled="t.ttArray.length >= minMaxInfo.maxTitle"
              :title="'Max: ' + minMaxInfo.maxTitle"
            >
              Add {{ titleShowName }}
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

      <n-divider />

      <!-- Long Headline Section -->
      <FloatingWrapper
        v-if="
          props.cre.IsDemandGenVideo() ||
          props.cre.IsPMax() ||
          props.cre.IsGoogleDisplay()
        "
        small
        rounded
      >
        <span class="font-medium ml-1 mr-1 text-gray-500">Long Headline</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12"><QuestionCircleRegular /></n-icon>
          </template>
          <div>
            {{ Creative.minimum }}:
            {{ minMaxInfo.minLongHeadline }} titles.<br />
            {{ Creative.maximum }}:
            {{ minMaxInfo.maxLongHeadline }} titles.<br />
            {{
              Creative.maximum_charac.replace(
                '{maxLengthTitle}',
                minMaxInfo.maxLengthLongHeadline != null
                  ? minMaxInfo.maxLengthLongHeadline.toString()
                  : 'N/A'
              )
            }}
          </div>
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              size="tiny"
              text
              class="p-0 ml-1"
              @click="handleCopyToClipboard('lhArray')"
            >
              <n-icon size="14"><Copy /></n-icon>
            </n-button>
          </template>
          Copy
        </n-tooltip>
        <div class="relative">
          <div class="flex gap-4 flex-col">
            <div
              v-for="(item, i) in t.lhArray"
              :key="i"
              class="relative flex gap-4"
            >
              <div class="relative flex-1">
                <n-input
                  v-model:value="t.lhArray[i]"
                  type="textarea"
                  :placeholder="`Enter the long headline ${index + 1}${
                    i > 0 ? '.' + (i + 1) : ''
                  }`"
                  :count-graphemes="countCharacters"
                  :on-change="validateField"
                  :on-input="() => handleUpdateField(i, 'lhArray')"
                  :status="
                    countCharacters(t.lhArray[i]) >
                      (minMaxInfo.maxLengthLongHeadline || 0) ||
                    props.cre.ai_verify?.isInvalid(item)
                      ? 'error'
                      : undefined
                  "
                >
                  <template #suffix>
                    <span
                      >{{ countCharacters(t.lhArray[i]) }}/{{
                        minMaxInfo.maxLengthLongHeadline || 0
                      }}</span
                    >
                  </template>
                </n-input>
                <n-button
                  quaternary
                  class="absolute -top-2 -right-2 z-10 !p-1 !min-w-0 !w-5 !h-5 rounded-full bg-gray-300 shadow-sm hover:!bg-red-500 hover:!text-white transition-colors"
                  @click="handleDeleteFromArray(index, i, 'lhArray')"
                  v-if="t.lhArray.length > 1"
                >
                  <template #icon
                    ><n-icon size="14"><Close /></n-icon
                  ></template>
                </n-button>
              </div>

              <span
                v-if="
                  countCharacters(t.lhArray[i]) >
                  (minMaxInfo.maxLengthLongHeadline || 0)
                "
                class="text-red-500 text-xs font-medium absolute left-0 -bottom-4"
              >
                Value too long
              </span>
            </div>
            <n-button
              v-if="(minMaxInfo?.maxLongHeadline ?? 0) > 1"
              ghost
              size="small"
              class="dynamic-button self-start"
              @click="handleAddToArray(index, 'lhArray')"
              :disabled="t.lhArray.length >= (minMaxInfo.maxLongHeadline || 0)"
              :title="'Max: ' + (minMaxInfo.maxLongHeadline || 0)"
            >
              Add Long Headline
            </n-button>
          </div>
          <span class="absolute top-0 right-4 -mt-6 font-medium text-gray-500">
            {{
              (minMaxInfo?.maxLongHeadline ?? 0) > 1
                ? (t.lhArray?.filter((item) => item?.trim()).length || 0) +
                  ' of ' +
                  (minMaxInfo.maxLongHeadline || 0)
                : ''
            }}
          </span>
        </div>
      </FloatingWrapper>

      <n-divider v-if="props.cre.IsDemandGenVideo() || props.cre.IsPMax()" />

      <!-- Short Description Section -->
      <FloatingWrapper v-if="props.cre.IsPMax()" small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500"
          >Short Description</span
        >
        <n-tooltip trigger="hover">
          <template #trigger
            ><n-icon size="12"><QuestionCircleRegular /></n-icon
          ></template>
          <div>
            {{ Creative.maximum_charac.replace('{maxLengthTitle}', '90') }}
          </div>
        </n-tooltip>
        <div class="relative">
          <n-input
            v-model:value="t.short_description"
            placeholder="Enter the short description"
            :count-graphemes="countCharacters"
            :on-change="validateField"
            :status="
              countCharacters(t.short_description || '') > 90 ||
              props.cre.ai_verify?.isInvalid(t.short_description)
                ? 'error'
                : undefined
            "
          >
            <template #suffix>
              <span>{{ countCharacters(t.short_description || '') }}/90</span>
            </template>
          </n-input>

          <span
            v-if="countCharacters(t.short_description || '') > 90"
            class="text-red-500 text-xs font-medium absolute left-0 -bottom-4"
          >
            Value too long
          </span>
        </div>
      </FloatingWrapper>

      <n-divider v-if="props.cre.IsPMax() || props.cre.IsGoogleDisplay()" />

      <!-- Description Section -->
      <FloatingWrapper small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">Description</span>
        <n-tooltip trigger="hover">
          <template #trigger
            ><n-icon size="12"><QuestionCircleRegular /></n-icon
          ></template>
          <div>
            {{ Creative.minimum }}:
            {{ minMaxInfo.minDescription }} descriptions.<br />
            {{ Creative.maximum }}:
            {{ minMaxInfo.maxDescription }} descriptions.<br />
            {{
              Creative.maximum_charac.replace(
                '{maxLengthTitle}',
                minMaxInfo.maxLengthDescription != null
                  ? minMaxInfo.maxLengthDescription.toString()
                  : 'N/A'
              )
            }}
          </div>
        </n-tooltip>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-button
              size="tiny"
              text
              class="p-0 ml-1"
              @click="handleCopyToClipboard('dArray')"
            >
              <n-icon size="14"><Copy /></n-icon>
            </n-button>
          </template>
          Copy
        </n-tooltip>
        <div class="relative">
          <div class="flex gap-4 flex-col relative">
            <div
              v-for="(item, i) in t.dArray"
              :key="i"
              class="relative flex gap-4"
            >
              <div class="relative flex-1">
                <n-input
                  v-model:value="t.dArray[i]"
                  type="textarea"
                  :placeholder="`Enter the description ${index + 1}${
                    i > 0 ? '.' + (i + 1) : ''
                  }`"
                  class=""
                  :count-graphemes="countCharacters"
                  :on-change="validateField"
                  :on-input="() => handleUpdateField(i, 'dArray')"
                  :status="
                    countCharacters(t.dArray[i]) >
                      minMaxInfo.maxLengthDescription ||
                    props.cre.ai_verify?.isInvalid(item)
                      ? 'error'
                      : undefined
                  "
                >
                  <template #suffix>
                    <span
                      >{{ countCharacters(t.dArray[i]) }}/{{
                        minMaxInfo.maxLengthDescription
                      }}</span
                    >
                  </template>
                </n-input>
                <n-button
                  quaternary
                  class="absolute -top-2 -right-2 z-10 !p-1 !min-w-0 !w-5 !h-5 rounded-full bg-gray-300 shadow-sm hover:!bg-red-500 hover:!text-white transition-colors"
                  @click="handleDeleteFromArray(index, i, 'dArray')"
                  v-if="t.dArray.length > 1"
                >
                  <template #icon
                    ><n-icon size="14"><Close /></n-icon
                  ></template>
                </n-button>
              </div>

              <span
                v-if="
                  countCharacters(t.dArray[i]) > minMaxInfo.maxLengthDescription
                "
                class="text-red-500 text-xs font-medium absolute left-0 -bottom-4"
              >
                Value too long
              </span>
            </div>
            <n-button
              ghost
              size="small"
              class="dynamic-button self-start"
              @click="handleAddToArray(index, 'dArray')"
              :disabled="t.dArray.length >= minMaxInfo.maxDescription"
              :title="'Max: ' + minMaxInfo.maxDescription"
            >
              Add Description
            </n-button>
          </div>

          <span class="absolute top-0 right-4 -mt-6 font-medium text-gray-500">
            {{
              (t.dArray || []).filter((item) => item && item.trim() !== '')
                .length
            }}
            of {{ minMaxInfo.maxDescription }}
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
</style>
