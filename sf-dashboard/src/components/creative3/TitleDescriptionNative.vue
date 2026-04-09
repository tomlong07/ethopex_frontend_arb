<script setup lang="ts">
import {
  creativeTypeClass,
  StatusCreativeManager,
  titlesStruct,
} from '@/types/components/creative-v2'

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

const isShowStatus = computed<boolean>(() => {
  return props.status.permissionCreative?.approvedCreative || false
})

const addTitle = () => {
  if (props.cre.titles.length >= maxTitles) return
  const newTitle: titlesStruct = {
    id: undefined,
    creative_id: props.cre.id || undefined,
    title: '',
    status: undefined,
    description: '',
    short_description: '',
    ttArray: [],
    lhArray: [],
    dArray: [],
  }
  props.cre.titles.push(newTitle)
}
const minTitles = 1
const maxTitles = 5

const deleteTitle = (index: number) => {
  if (props.cre.titles.length <= minTitles) return

  props.cre.titles.splice(index, 1)
}

const isAddDisabled = computed(() => props.cre.titles.length >= maxTitles)
const titleOptions = TitleStatus

const parseField = (value: string | undefined): string[] => {
  if (!value || value === 'null') return ['']

  if (value.startsWith('[') && value.endsWith(']')) {
    try {
      const json = JSON.parse(value)
      return Array.isArray(json) ? json : ['']
    } catch {
      return ['']
    }
  }
  return [value]
}

onMounted(() => {
  props.cre.titles.forEach((titleItem) => {
    if (!titleItem.ttArray) {
      titleItem.ttArray = parseField(titleItem.title)
    }

    if (!titleItem.dArray || titleItem.dArray.length === 0) {
      titleItem.dArray = parseField(titleItem.description)
    }

    titleItem.lhArray = titleItem.lhArray || ['']
  })
})
</script>

<template>
  <div v-if="props.cre.IsTitleDesType1()" class="flex flex-col gap-2">
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex gap-4 items-start"
    >
      <div class="flex flex-col gap-2 w-full">
        <FloatingWrapper
          :name="props.cre.IsNative() ? 'Title' : 'Text'"
          small
          rounded
        >
          <div class="flex gap-2">
            <n-button
              quaternary
              class="absolute -top-2 -right-2 z-10 !p-1 !min-w-0 !w-5 !h-5 rounded-full bg-gray-300 shadow-sm hover:!bg-red-500 hover:!text-white transition-colors"
              v-if="index !== 0"
              @click="deleteTitle(index)"
            >
              <template #icon>
                <n-icon size="14"><Close /></n-icon>
              </template>
            </n-button>
            <n-input-group>
              <n-input
                v-model:value="t.title"
                :placeholder="'Enter the title' + ' ' + (index + 1)"
                :maxlength="props.cre.IsNewsbreak() ? 90 : 100"
                show-count
              >
              </n-input>
              <n-select
                v-show="isShowStatus"
                v-model:value="t.status"
                class="w-28 ml-3 items-center"
                :disabled="!t.status"
                :options="titleOptions"
              />
            </n-input-group></div
        ></FloatingWrapper>
        <div class="flex">
          <FloatingWrapper name="Description" small rounded>
            <n-input
              v-model:value="t.description"
              type="textarea"
              :placeholder="'Enter the description' + ' ' + (index + 1)"
              :maxlength="props.cre.IsNewsbreak() ? 90 : 250"
              show-count
          /></FloatingWrapper>
        </div>
      </div>
    </div>
    <div class="flex items-center">
      <!-- Add button -->
      <n-button
        ghost
        size="small"
        :disabled="isAddDisabled"
        class="dynamic-button"
        @click="addTitle"
      >
        Add Title & Description
      </n-button>
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
