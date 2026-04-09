<script setup lang="ts">
import SkeletonSelect from '@/components/common/SkeletonSelect.vue'
import { Size } from 'naive-ui/es/select/src/interface'
import { PropType } from 'vue'

const props = defineProps({
  defaultValue: {
    type: [String, Number, Array],
    required: true,
  },

  valueOptions: {
    type: Array as PropType<any[]>,
    required: true,
  },
  title: {
    type: String,
    required: false,
  },

  name: {
    type: String,
    required: false,
  },

  labelField: {
    type: String,
    required: false,
    default: 'label',
  },

  valueField: {
    type: String,
    required: false,
    default: 'value',
  },
  class: {
    type: String,
    required: false,
    default: 'w-60',
  },

  size: {
    type: String,
    required: false,
    default: 'medium',
  },

  isAjax: {
    type: Boolean,
    default: false,
  },

  remote: {
    type: Boolean,
    default: false,
  },
  multiple: {
    type: Boolean,
    default: false,
  },
  rawKey: {
    type: String,
    default: '',
  },

  clearable: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  isSmall: {
    type: Boolean,
    default: false,
  },
})

const loading = ref<boolean>(props.isAjax ? true : false)
const loadingSearch = ref<boolean>(false)

const valueNow = ref<any>(props.defaultValue ? props.defaultValue : null)

const updateValue = (value: any) => {
  valueNow.value = value
  emit('updateValue', value)
}

const emit = defineEmits<{
  (e: 'updateValue', value: any): void
  (e: 'handleSearch', q: string): void
}>()

const handleSearch = (query: string) => {
  if (!props.remote) {
    return
  }
  emit('handleSearch', query)
}

const changeLoading = (status: boolean) => {
  loading.value = status
}

const changeLoadingSearch = (status: boolean) => {
  loadingSearch.value = status
}

const changeValueNow = (value: any) => {
  valueNow.value = value
}

const getRawKey = () => {
  return props.rawKey
}

defineExpose({
  changeLoading,
  changeLoadingSearch,
  changeValueNow,
  getRawKey,
})
</script>

<template>
  <SkeletonSelect v-if="loading" :class="props.class" :size="props.size" />

  <div class="flex flex-col gap-1" :class="props.class" v-else>
    <div
      class="text-xs font-bold h-6"
      :class="[props.disabled ? 'text-gray-300' : 'text-gray-500']"
      v-if="props.name || props.title"
    >
      {{ props.name || props.title }}
    </div>
    <div class="text-xs text-gray-500 font-bold" v-else>&nbsp;</div>
    <n-select
      :class="{ 'small-select-dropdown': props.isSmall }"
      :menu-props="{ class: props.isSmall ? 'small-select-dropdown' : '' }"
      v-model:value="valueNow"
      :placeholder="props.title"
      :remote="props.remote"
      :multiple="props.multiple"
      filterable
      :label-field="props.labelField"
      :value-field="props.valueField"
      :options="props.valueOptions"
      :on-update:value="updateValue"
      :consistent-menu-width="false"
      :size="props.size as Size"
      :virtual-scroll="true"
      :disabled="props.disabled"
      :clearable="props.clearable"
      :loading="loadingSearch"
      max-tag-count="responsive"
      @search="handleSearch"
    />
  </div>
</template>

<style scoped>
.n-base-selection-label {
  height: 38px;
}
</style>
