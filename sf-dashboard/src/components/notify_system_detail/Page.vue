<script setup lang="ts">
import { computed } from 'vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import useNotifySystem from '@/store/details/useNotifySystem'
import useGeneralStore from '@/store/useGeneralStore'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  isFloating: {
    type: Boolean,
    default: false,
  },
})

const notifySystemStore = useNotifySystem()
const generalStore = useGeneralStore()

onMounted(() => {
  notifySystemStore.setPageOptions(generalStore.menuRouter || [])
})

const pageOptions = computed(() => notifySystemStore.pageOptions)

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex w-full' }, [
    h('div', { innerHTML: `${option.name}` }),
    h('div', {
      class: 'ml-auto mt-[2px] text-xs text-gray-500',
      innerHTML: `<span>${option.url}</span>`,
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
    v-bind="props.isFloating ? { name: 'Pages' } : {}"
  >
    <n-select
      v-model:value="notifySystemStore.payload.pages"
      :options="pageOptions"
      multiple
      clearable
      label-field="name"
      value-field="url"
      :placeholder="'All'"
      max-tag-count="responsive"
      filterable
      :render-label="renderLabel"
      :render-tag="renderTag"
    />
  </component>
</template>
