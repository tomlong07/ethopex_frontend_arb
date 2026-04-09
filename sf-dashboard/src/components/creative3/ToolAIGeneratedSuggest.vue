<script setup lang="ts">
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import Plus from '@/assets/icons/Plus.vue'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { DrawerPlacement } from 'naive-ui'
import Type from './Type.vue'
import CheckAll from '@/assets/icons/CheckAll.vue'
import Skeleton from '../skeleton/Skeleton.vue'
import Close from '@/assets/icons/Close.vue'

import { useLocale } from '@/lang/messages'

const creativeAdd = useLocale(
  () => import('@/lang/vi/creative_add'),
  () => import('@/lang/en/creative_add')
)

// const isLoading = ref(false)
const isUpdatingFromCheckbox = ref(false)
const widthModal = ref(window.innerWidth / 2)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
  suggestions: {
    type: Object as () => { PrimaryText: string[]; Headline: string[] },
    required: true,
  },
  showModal: {
    type: Boolean,
    required: true,
  },
  placement: {
    type: String as () => DrawerPlacement,
    required: true,
  },
  typeComponent: {
    type: Object as () => InstanceType<typeof Type> | null,
    required: false,
  },
  isLoading: {
    type: Boolean,
    required: true,
  },
})

onMounted(() => {
  window.addEventListener('resize', updateWidthModal)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateWidthModal)
})

// Cập nhật kích thước modal khi thay đổi kích thước cửa sổ
const updateWidthModal = () => {
  widthModal.value = window.innerWidth / 2
}

const cleanArray = (array: string[]): string[] => {
  return array.filter((item) => item && item.trim() !== '')
}

// Select All/Deselect All cho PrimaryText
const selectAllPrimary = () => {
  props.cre.titles[0].lhArray = cleanArray(props.cre.titles[0].lhArray)

  const maxItems = 5
  const currentLhArrayLength = (props.cre.titles[0]?.lhArray || []).filter(
    (item) => item && item.trim() !== ''
  ).length
  if (currentLhArrayLength == 5) {
    window.message.warning(creativeAdd.value.valid_primary)
  }

  isUpdatingFromCheckbox.value = true
  const remainingSlots = maxItems - currentLhArrayLength
  const suggestionsToAdd = props.suggestions.PrimaryText.filter(
    (item) => item && item.trim() !== ''
  ) // Loại bỏ chuỗi rỗng
    .slice(0, remainingSlots)
  props.cre.titles[0].lhArray = [
    ...props.cre.titles[0].lhArray,
    ...suggestionsToAdd,
  ]
  isUpdatingFromCheckbox.value = false
}

const togglePrimary = (index: number) => {
  const maxItems = 5
  const currentLhArray = props.cre.titles[0]?.lhArray || []
  const validItems = currentLhArray.filter((item) => item && item.trim() !== '')
  const selectedItem = props.suggestions.PrimaryText[index]

  if (validItems.length >= maxItems) {
    window.message.warning(creativeAdd.value.valid_primary)
    return
  }

  if (selectedItem && selectedItem.trim() !== '') {
    isUpdatingFromCheckbox.value = true
    if (currentLhArray.length < maxItems) {
      props.cre.titles[0].lhArray.push(selectedItem)
    } else {
      const emptyIndex = currentLhArray.findIndex(
        (item) => !item || item.trim() === ''
      )
      if (emptyIndex !== -1)
        props.cre.titles[0].lhArray[emptyIndex] = selectedItem
    }
    isUpdatingFromCheckbox.value = false
  }
}

// Copy text
const copyText = (val: string) => {
  navigator.clipboard.writeText(val).then(() => {
    window.message.success('Copy Success')
  })
}

const selectAllHeadline = () => {
  props.cre.titles[0].ttArray = cleanArray(props.cre.titles[0].ttArray)

  const maxItems = 5
  const currentTtArrayLength = (props.cre.titles[0]?.ttArray || []).filter(
    (item) => item && item.trim() !== ''
  ).length
  if (currentTtArrayLength == 5) {
    window.message.warning(creativeAdd.value.valid_headline)
  }

  isUpdatingFromCheckbox.value = true
  const remainingSlots = maxItems - currentTtArrayLength
  const suggestionsToAdd = props.suggestions.Headline.filter(
    (item) => item && item.trim() !== ''
  ) // Loại bỏ chuỗi rỗng
    .slice(0, remainingSlots)
  props.cre.titles[0].ttArray = [
    ...props.cre.titles[0].ttArray,
    ...suggestionsToAdd,
  ]
  isUpdatingFromCheckbox.value = false
}

const toggleHeadline = (index: number) => {
  const maxItems = 5
  const currentTtArray = props.cre.titles[0]?.ttArray || []
  const currentTtArrayLength = (props.cre.titles[0]?.ttArray || []).filter(
    (item) => item && item.trim() !== ''
  ).length
  const selectedItem = props.suggestions.Headline[index]

  // Chỉ thêm nếu chưa đạt giới hạn 5 và selectedItem không rỗng
  if (
    currentTtArrayLength < maxItems &&
    selectedItem &&
    selectedItem.trim() !== ''
  ) {
    isUpdatingFromCheckbox.value = true
    const emptyIndex = currentTtArray.findIndex(
      (item) => !item || item.trim() === ''
    )
    if (emptyIndex !== -1) {
      props.cre.titles[0].ttArray[emptyIndex] = selectedItem
    } else {
      props.cre.titles[0].ttArray.push(selectedItem)
    }
    isUpdatingFromCheckbox.value = false
  } else {
    window.message.warning(creativeAdd.value.valid_headline)
  }
}
const emit = defineEmits<{
  (e: 'close-modal'): void
  (e: 'handleBtn'): void
}>()
const closeModal = () => {
  emit('close-modal')
}
const handleGenerateSuggestions = () => {
  emit('handleBtn')
}
</script>

<template>
  <n-drawer
    v-if="props.cre.IsFacebook()"
    :show-mask="false"
    :show="props.showModal"
    :width="widthModal"
    :placement="props.placement"
    :block-scroll="false"
    class="custom-drawer"
  >
    <n-drawer-content>
      <template #header>
        <n-icon
          size="40"
          class="me-[5px] mt-[1px] cursor-pointer bg-blend-color-burn custom-icon-close-drawer"
          @click="closeModal"
        >
          <Close />
        </n-icon>
      </template>

      <n-card class="mt-4">
        <template #header>
          <div class="flex justify-between items-center">
            <span class="text-lg font-bold">Tool AI Generated Suggest</span>
            <n-button
              type="primary"
              :loading="props.isLoading"
              @click="handleGenerateSuggestions"
            >
              Generate Suggest AI
            </n-button>
          </div>
        </template>

        <!-- Primary Text Section -->
        <div
          v-if="
            !suggestions.PrimaryText || suggestions.PrimaryText.length !== 0
          "
          class="mt-[30px] font-bold flex justify-between items-center gap-2 mb-[5px]"
        >
          <span>Primary text</span>

          <div class="flex gap-2">
            <n-button @click="selectAllPrimary">
              <n-icon size="20" class="me-[5px] mt-[1px]">
                <CheckAll />
              </n-icon>
              Select All
            </n-button>
          </div>
        </div>
        <div v-if="props.isLoading">
          <Skeleton />
        </div>
        <div
          v-else-if="
            !suggestions.PrimaryText || suggestions.PrimaryText.length === 0
          "
        >
          <div
            class="border rounded-lg p-4 bg-gray-50 w-full flex items-center gap-2 mb-5 mt-10"
          >
            No primary text suggestions available.
          </div>
        </div>
        <n-space v-else class="mt-[30px] flex flex-col gap-4 w-full">
          <div
            v-for="(primary, index) in suggestions.PrimaryText"
            :key="index"
            class="border rounded-lg p-4 bg-gray-50 flex items-center gap-2"
          >
            <div class="w-19 mr-2">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    class="w-100"
                    type="default"
                    @click="togglePrimary(index)"
                  >
                    <n-icon size="15">
                      <Plus />
                    </n-icon>
                  </n-button>
                </template>
                Add Primary Text
              </n-tooltip>
            </div>
            <div class="flex-1">
              <div class="text-sm">{{ primary }}</div>
            </div>
            <n-icon
              size="20"
              class="me-[5px] mt-[1px] cursor-pointer"
              @click="copyText(primary)"
            >
              <CopyOutline />
            </n-icon>
          </div>
        </n-space>

        <!-- Headline Section -->
        <div
          v-if="!suggestions.Headline || suggestions.Headline.length !== 0"
          class="mt-[60px] font-bold flex justify-between items-center gap-2 mb-[30px]"
        >
          <span>Headline</span>
          <div class="flex gap-2">
            <n-button @click="selectAllHeadline">
              <n-icon size="20" class="me-[5px] mt-[1px]">
                <CheckAll />
              </n-icon>
              Select All
            </n-button>
          </div>
        </div>
        <div v-if="props.isLoading">
          <Skeleton />
        </div>
        <div
          v-else-if="!suggestions.Headline || suggestions.Headline.length === 0"
        >
          <div
            class="border rounded-lg p-4 bg-gray-50 w-full flex items-center gap-2"
          >
            No headline suggestions available.
          </div>
        </div>
        <n-space v-else class="mt-[10px] flex flex-col gap-4 w-full">
          <div
            v-for="(headline, index) in suggestions.Headline"
            :key="index"
            class="border rounded-lg p-4 bg-gray-50 w-full flex items-center gap-2"
          >
            <div class="w-19 mr-2">
              <n-tooltip trigger="hover">
                <template #trigger>
                  <n-button
                    class="w-100"
                    type="default"
                    @click="toggleHeadline(index)"
                  >
                    <n-icon size="15">
                      <Plus />
                    </n-icon>
                  </n-button>
                </template>
                Add Headline
              </n-tooltip>
            </div>
            <div class="flex-1">
              <div class="text-sm">{{ headline }}</div>
            </div>
            <n-icon
              size="20"
              class="me-[5px] mt-[1px] cursor-pointer"
              @click="copyText(headline)"
            >
              <CopyOutline />
            </n-icon>
          </div>
        </n-space>
      </n-card>
    </n-drawer-content>
  </n-drawer>
</template>
