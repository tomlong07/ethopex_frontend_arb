<script setup lang="ts">
import FloatingWrapper from "@/components/common/FloatingWrapper.vue";
import useNotifySystem from "@/store/details/useNotifySystem";

const props = defineProps({
  isFloating: {
    type: Boolean,
    default: false,
  },
});

const notifySystemStore = useNotifySystem();
const renderLabel = (option: any) => {
  return h("span", { class: option.colorClass }, option.name);
};
</script>

<template>
  <component
    :is="props.isFloating ? FloatingWrapper : 'div'"
    v-bind="props.isFloating ? { name: 'Level' } : {}"
  >
    <n-select
      v-model:value="notifySystemStore.payload.level"
      :options="notifySystemStore.levelOptions"
      clearable
      :placeholder="isFloating ? '' : ''"
      label-field="name"
      value-field="value"
      max-tag-count="responsive"
      filterable
      :render-label="renderLabel"
    />
  </component>
</template>
