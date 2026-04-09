<script setup lang="ts">
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
const { validateField, addToArray, deleteFromArray } = useCreativeField()
const minMaxInfo = computed(() => {
  switch (true) {
    case props.cre.IsFacebook():
      return {
        minTitle: 1,
        maxLengthTitle: 255,
        maxTitle: 5,
        minLongHeadline: 1,
        maxLengthLongHeadline: 1000,
        maxLongHeadline: 5,
        minDescription: 1,
        maxLengthDescription: 1000,
        maxDescription: 5,
      }
  }

  return {
    minTitle: 0,
    maxLengthTitle: 0,
    maxTitle: 0,
    minLongHeadline: 0,
    maxLengthLongHeadline: 0,
    maxLongHeadline: 0,
    minDescription: 0,
    maxLengthDescription: 0,
    maxDescription: 0,
  }
})

const countCharacters = (text: string) => {
  return helper.countCharacters(text)
}

const pri = 'Primary text'
const head = 'Headline'

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
  <div class="flex flex-col gap-6">
    <!-- Display link -->
    <FloatingWrapper small rounded>
      <div class="flex-col items-start">
        <span class="font-medium ml-1 mr-1 text-gray-500">Display link</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
          See more display link
        </n-tooltip>
        <n-input
          v-model:value="props.cre.display_link"
          placeholder="Enter link to show on last carousel card"
          :max="2000"
        />
      </div>
    </FloatingWrapper>

    <!-- Titles -->
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex flex-col gap-4"
    >
      <!-- Long headline -->
      <FloatingWrapper small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">{{ pri }}</span>

        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
          <div>
            {{ Creative.minimum }}: {{ minMaxInfo.minLongHeadline }} {{ pri }}.
            <br />
            {{ Creative.maximum }}: {{ minMaxInfo.maxLongHeadline }}
            {{ pri }}.<br />
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
        <div class="relative">
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, i) in t.lhArray"
              :key="i"
              class="flex flex-col gap-1"
            >
              <div class="flex gap-4 relative">
                <div class="relative flex-1">
                  <n-input
                    type="textarea"
                    v-model:value="t.lhArray[i]"
                    :placeholder="`Enter the ${pri} ${index + 1}${
                      i > 0 ? '.' + (i + 1) : ''
                    }`"
                    :count-graphemes="countCharacters"
                    :on-change="validateField"
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
                    v-if="t.lhArray.length > 1"
                    @click="handleDeleteFromArray(index, i, 'lhArray')"
                  >
                    <template #icon>
                      <n-icon size="14"><Close /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>

              <span
                v-if="
                  countCharacters(t.lhArray[i]) >
                  (minMaxInfo.maxLengthLongHeadline || 0)
                "
                class="text-red-500 text-xs font-medium ml-0"
              >
                Value too long
              </span>
            </div>
            <n-button
              ghost
              size="small"
              class="dynamic-button self-start"
              @click="handleAddToArray(index, 'lhArray')"
              :disabled="t.lhArray.length >= (minMaxInfo.maxLongHeadline || 0)"
              :title="'Max: ' + (minMaxInfo.maxLongHeadline || 0)"
            >
              Add Primary Text
            </n-button>
          </div>
          <span class="absolute top-0 right-4 -mt-6 font-medium text-gray-500">
            {{
              (props.cre.titles[0]?.lhArray || []).filter(
                (item) => item && item.trim() !== ''
              ).length
            }}
            of 5
          </span>
        </div>
      </FloatingWrapper>

      <!-- Short headline -->
      <FloatingWrapper v-if="props.cre.ad_type != 'carousel'" small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">{{ head }}</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
          <div>
            {{ Creative.minimum }}: {{ minMaxInfo.minTitle }} {{ head }}.
            <br />
            {{ Creative.maximum }}: {{ minMaxInfo.maxTitle }} {{ head }}.<br />
            {{
              Creative.maximum_charac.replace(
                '{maxLengthTitle}',
                minMaxInfo.maxLengthTitle.toString()
              )
            }}
          </div>
        </n-tooltip>

        <div class="relative">
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, i) in t.ttArray"
              :key="i"
              class="flex flex-col gap-1"
            >
              <div class="flex gap-4 relative">
                <div class="relative flex-1">
                  <n-input
                    type="textarea"
                    v-model:value="t.ttArray[i]"
                    :placeholder="`Enter the ${head} ${index + 1}${
                      i > 0 ? '.' + (i + 1) : ''
                    }`"
                    :count-graphemes="countCharacters"
                    :on-change="validateField"
                    :status="
                      countCharacters(t.ttArray[i]) >
                        minMaxInfo.maxLengthTitle ||
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
                    <template #icon>
                      <n-icon size="14"><Close /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>

              <!-- Error message moved outside -->
              <span
                v-if="countCharacters(t.ttArray[i]) > minMaxInfo.maxLengthTitle"
                class="text-red-500 text-xs font-medium ml-0"
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
              Add Headline
            </n-button>
          </div>
          <span class="absolute top-0 right-4 -mt-6 font-medium text-gray-500">
            {{
              (props.cre.titles[0]?.ttArray || []).filter(
                (item) => item && item.trim() !== ''
              ).length
            }}
            of 5
          </span>
        </div>
      </FloatingWrapper>

      <!-- Description -->
      <FloatingWrapper v-if="props.cre.ad_type != 'carousel'" small rounded>
        <span class="font-medium ml-1 mr-1 text-gray-500">Description</span>
        <n-tooltip trigger="hover">
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
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
        <div class="relative">
          <div class="flex flex-col gap-4">
            <div
              v-for="(item, i) in t.dArray"
              :key="i"
              class="flex flex-col gap-1"
            >
              <div class="flex gap-4 relative">
                <div class="relative flex-1">
                  <n-input
                    type="textarea"
                    v-model:value="t.dArray[i]"
                    :placeholder="`Enter the description ${index + 1}${
                      i > 0 ? '.' + (i + 1) : ''
                    }`"
                    :count-graphemes="countCharacters"
                    :on-change="validateField"
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
                    <template #icon>
                      <n-icon size="14"><Close /></n-icon>
                    </template>
                  </n-button>
                </div>
              </div>

              <span
                v-if="
                  countCharacters(t.dArray[i]) > minMaxInfo.maxLengthDescription
                "
                class="text-red-500 text-xs font-medium ml-0"
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
              (props.cre.titles[0]?.dArray || []).filter(
                (item) => item && item.trim() !== ''
              ).length
            }}
            of 5
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
