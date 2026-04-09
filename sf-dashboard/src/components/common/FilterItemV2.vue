<script setup lang="ts">
import VueDatePicker from '@vuepic/vue-datepicker'
import '@vuepic/vue-datepicker/dist/main.css'
import { filterItemType } from '@/types/components/filter'

const props = defineProps({
  value: {
    type: Object as () => filterItemType,
    required: true,
    default: () => {},
  },
  primaryKey: {
    type: String,
    required: false,
    default: '',
  },
  isMultiple: {
    type: Boolean,
    required: false,
    default: false,
  },
  isInput: {
    type: Boolean,
    required: false,
    default: false,
  },
  isMonthPicker: {
    type: Boolean,
    required: false,
    default: false,
  },
  clearable: {
    type: Boolean,
    required: false,
    default: false,
  },
  isLoading: {
    type: Boolean,
    required: false,
    default: false,
  },
})
const emit = defineEmits<{
  (e: 'update:filterItem', filterItem: any): void
  (e: 'search', query: any, key: filterItemType): void
  (e: 'onChange'): void
}>()

const filterItemRef = ref<filterItemType>(props.value)
const isMultiple = ref<boolean>(props.isMultiple)

const isLoadingProp = computed(() => props.isLoading)
const options = computed(() => props.value.options || [])
//Làm tạm chưa tối ưu
const originalTitle = document.title

const onChangeValue = () => {
  if (originalTitle !== document.title) {
    document.title = originalTitle
  }

  emit('update:filterItem', filterItemRef.value.value)
  emit('onChange')
}

const onChangeValueWithUpdate = () => {
  onChangeValue()
}

const handleSearch = async (query: string) => {
  if (query !== '') {
    emit('search', query, filterItemRef.value)
  }
}

const handleClear = () => {
  emit('search', '', filterItemRef.value)
}
</script>
<template>
  <div class="flex flex-col gap-1 w-40">
    <div class="font-bold text-xs text-gray-500">
      {{ filterItemRef.label }}
    </div>
    <div class="flex month-report-class">
      <VueDatePicker
        v-if="isMonthPicker && typeof filterItemRef.value === 'string'"
        v-model="filterItemRef.value"
        month-picker
        format="yyyy/MM"
        model-type="yyyy-MM"
        :clearable="false"
        @update:model-value="onChangeValue"
      />
      <n-input
        v-else-if="isInput"
        v-model:value="filterItemRef.value as any"
        size="small"
        clearable
        @update:value="onChangeValue"
      />
      <n-select
        v-else
        v-model:value="filterItemRef.value as any"
        remote
        filterable
        placeholder="All"
        max-tag-count="responsive"
        size="small"
        :loading="isLoadingProp"
        :multiple="isMultiple"
        :clearable="clearable"
        :options="options"
        :consistent-menu-width="false"
        @blur="onChangeValueWithUpdate"
        @search="handleSearch"
        @update:value="onChangeValue"
        @clear="handleClear"
      />
    </div>
  </div>
</template>
<style lang="scss">
@use '@/css/FilterItem.scss';
</style>
