<template>
  <div
    class="custom-switch-dark-mode"
    :class="wrapperClass"
    @click="handleToggle"
  >
    <div
      :class="[
        sliderClass,
        disabled,
        internalValue === 'on' ? 'translate-x-[calc(100%)]' : 'translate-x-0',
      ]"
      class="bg-button"
      style="width: calc(50% - 0.25rem)"
    ></div>
    <n-spin :show="loading && internalValue === 'off'" size="small">
      <button
        @click="updateValue('off')"
        :class="[
          buttonBaseClass,
          disabled,
          internalValue === 'off' ? activeTextClass : inactiveTextClass,
        ]"
      >
        {{ falseLabel }}
      </button>
    </n-spin>
    <n-spin
      :show="loading && internalValue === 'on'"
      size="small"
      class="text-gray-400"
    >
      <button
        @click="updateValue('on')"
        :class="[
          buttonBaseClass,
          disabled,
          internalValue === 'on' ? activeTextClass : inactiveTextClass,
        ]"
      >
        {{ trueLabel }}
      </button>
    </n-spin>
  </div>
</template>

<script setup lang="ts">
import { INEX } from '@/enum/campaign'
import { ENROLL_STATUS } from '@/enum/creative'
import { computed } from 'vue'

const props = defineProps<{
  modelValue?: boolean | string | INEX | null
  type?: 'onoff' | 'boolean' | 'inex' | 'enroll'
  trueLabel?: string
  falseLabel?: string
  size?: 'small' | 'medium' | 'large'
  disabled?: boolean
  loading?: boolean
}>()

const disabled = computed(() => (props.disabled ? 'cursor-not-allowed' : ''))

const classNow = computed(() => {
  if (props.size === 'small') return 'text-xxs p-0.5 font-normal'
  if (props.size === 'medium') return 'text-xs p-1 font-semibold'
  if (props.size === 'large') return 'text-sm p-1 font-semibold'
  return 'text-xs p-1 font-semibold'
})

const emit = defineEmits<{
  (
    e: 'update:modelValue',
    value: boolean | 'on' | 'off' | INEX | ENROLL_STATUS
  ): void

  (e: 'change'): void
}>()

const type = props.type ?? 'onoff'

const wrapperClass = `inline-flex items-center rounded-full bg-[#414141] ${classNow.value} font-semibold relative`

const sliderClass =
  'absolute top-1 bottom-1 left-1 bg-white rounded-full transition-all duration-300'

const buttonBaseClass =
  'relative z-10 px-3 py-0.5 rounded-full transition-all duration-300 whitespace-nowrap'

const activeTextClass = 'text-gray-800'

const inactiveTextClass = 'text-white'

const internalValue = computed<'on' | 'off'>({
  get: () =>
    ({
      boolean: props.modelValue === true ? 'on' : 'off',
      onoff: props.modelValue === 'on' ? 'on' : 'off',
      inex: props.modelValue === INEX.INCLUDE ? 'on' : 'off',
      enroll: props.modelValue === ENROLL_STATUS.OPT_IN ? 'on' : 'off',
    }[type] as 'on' | 'off'),

  set: (val: 'on' | 'off') => (
    {
      boolean: () => emit('update:modelValue', val === 'on'),
      onoff: () => emit('update:modelValue', val),
      inex: () =>
        emit('update:modelValue', val === 'on' ? INEX.INCLUDE : INEX.EXCLUDE),
      enroll: () =>
        emit(
          'update:modelValue',
          val === 'on' ? ENROLL_STATUS.OPT_IN : ENROLL_STATUS.OPT_OUT
        ),
    }[type](),
    emit('change')
  ),
})

const trueLabel = props.trueLabel ?? 'Include'
const falseLabel = props.falseLabel ?? 'Exclude'

const isDefaultLabel = computed(
  () => trueLabel === 'Include' && falseLabel === 'Exclude'
)

const updateValue = (val: 'on' | 'off') => {
  if (props.disabled) return
  if (isDefaultLabel.value) {
    internalValue.value = val
  }
}

const handleToggle = () => {
  if (props.disabled) return
  if (!isDefaultLabel.value) {
    internalValue.value = internalValue.value === 'on' ? 'off' : 'on'
  }
}
</script>
