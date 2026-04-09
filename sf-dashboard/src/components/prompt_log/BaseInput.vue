<script setup lang="ts">
import { Size } from 'naive-ui/es/input/src/interface'

const FloatingWrapper = defineAsyncComponent(
  () => import('../common/FloatingWrapper.vue')
)

type InputType = 'text' | 'textarea' | 'password' | undefined | any

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  className: {
    type: String,
  },

  readonly: {
    type: Boolean,
    default: false,
  },

  size: {
    type: String,
    default: 'small',
  },

  type: {
    type: String as PropType<InputType>,
    default: 'text',
  },

  float: {
    type: Boolean,
    default: false,
  },
})
const value = defineModel<string>('value')

const classNow = computed(() => {
  const classList = props.size === 'small' ? 'text-xs' : ''

  return [props.className || 'w-28', classList].join(' ')
})
</script>

<template>
  <component
    :is="props.float ? FloatingWrapper : 'div'"
    :class="props.float ? '' : 'flex items-center gap-2'"
    :name="props.float ? props.name : undefined"
    :small="props.size === 'small'"
  >
    <template v-if="!props.float">
      <div class="font-bold" :class="classNow">{{ props.name }}</div>
    </template>
    <n-input
      class="flex-1 min-w-0"
      v-model:value="value"
      :size="props.size as Size"
      :placeholder="props.name"
      :readonly="props.readonly"
      :type="props.type"
      clearable
    />
  </component>
</template>
