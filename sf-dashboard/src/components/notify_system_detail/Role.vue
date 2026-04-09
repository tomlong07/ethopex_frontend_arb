<script setup lang="ts">
import { onMounted } from "vue";
import FloatingWrapper from "@/components/common/FloatingWrapper.vue";
import useNotifySystem from "@/store/details/useNotifySystem";
import { SelectOption } from "naive-ui";

const props = defineProps({
  isFloating: {
    type: Boolean,
    default: false,
  },
});

const notifySystemStore = useNotifySystem();

onMounted(async () => {
  notifySystemStore.getRoleOptions();
});

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex w-full' }, [
    h('div', { innerHTML: `${option.name}` }),
    h('div', {
      class: 'ml-auto mt-[2px] text-xs text-gray-500',
      innerHTML: `<span>${option.id}</span>`,
    }),
  ])
}

const renderTag = ({ option, handleClose }: { option: SelectOption, handleClose: () => void }) => {
  return h(resolveComponent('n-tag'), {
    type: 'default',
    closable: true,
    onClose: handleClose,
  }, { default: () => option.name })
}
</script>

<template>
  <component
    :is="props.isFloating ? FloatingWrapper : 'div'"
    v-bind="props.isFloating ? { name: 'Roles' } : {}"
  >
    <n-select
      v-model:value="notifySystemStore.payload.roles"
      :options="notifySystemStore.roleOptions"
      multiple
      clearable
      :placeholder="'All'"
      label-field="name"
      value-field="id"
      max-tag-count="responsive"
      filterable
      :render-label="renderLabel"
      :render-tag="renderTag"
    />
  </component>
</template>