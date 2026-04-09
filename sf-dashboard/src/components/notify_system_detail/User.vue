<script setup lang="ts">
import FloatingWrapper from "@/components/common/FloatingWrapper.vue";
import useNotifySystem from "@/store/details/useNotifySystem";
import { debounceV2 } from "@/utils";
import { SelectOption } from "naive-ui";

const props = defineProps({
  isFloating: {
    type: Boolean,
    default: false,
  },
});

const notifySystemStore = useNotifySystem();

const handleSearch = debounceV2(async (q: string = '') => {
  notifySystemStore.getUserOptions(q, notifySystemStore.payload.users)
}, 600)

onMounted(async () => {
  const id = Number(window.route?.params?.id || 0);
  if (id === 0) {
    notifySystemStore.getUserOptions();
  }
});

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex w-full' }, [
    h('div', { innerHTML: `${option.label}` }),
    h('div', {
      class: 'ml-auto mt-[2px] text-xs text-gray-500',
      innerHTML: `<span>${option.value}</span>`,
    }),
  ])
}

const renderTag = ({ option, handleClose }: { option: SelectOption, handleClose: () => void }) => {
  return h(resolveComponent('n-tag'), {
    type: 'default',
    closable: true,
    onClose: handleClose,
  }, { default: () => option.label })
}
</script>

<template>
  <component
    :is="props.isFloating ? FloatingWrapper : 'div'"
    v-bind="props.isFloating ? { name: 'Users' } : {}"
  >
    <n-select
      v-model:value="notifySystemStore.payload.users"
      :options="notifySystemStore.userOptions"
      multiple
      clearable
      label-field="label"
      value-field="value"
      :placeholder="'All'"
      max-tag-count="responsive"
      filterable
      @search="handleSearch"
      remote
      :render-label="renderLabel"
      :render-tag="renderTag"
    />
  </component>
</template>