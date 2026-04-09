<template>
  <div
    class="relative w-full my-1 fw"
    :class="[`fw-${variant}`, { 'hide-placeholder': !props.placeholder }]"
  >
    <n-tooltip trigger="hover" placement="top-end" :disabled="!hasError">
      <template #trigger>
        <div :class="{ 'has-error': hasError }">
          <slot />
        </div>
      </template>
      <span v-if="hasError" class="max-w-sm text-xs">{{ error }}</span>
    </n-tooltip>

    <label
      class="fw-label truncate font-medium absolute z-10 text-gray-400 top-[-0.5rem] px-1 left-2 transition-all flex gap-1 items-center pointer-events-none bg-white"
      :class="className"
    >
      <span>
        {{ props.name }}<RedDot v-if="props.required" class="ml-1" />
      </span>
      <div class="pointer-events-auto flex items-center" v-if="$slots.extra">
        <slot name="extra" />
      </div>
    </label>
  </div>
</template>

<script setup lang="ts">
import RedDot from './RedDot.vue'

const props = defineProps({
  name: {
    type: String,
  },

  small: {
    type: Boolean,
    default: false,
  },

  rounded: {
    type: Boolean,
    default: false,
  },

  required: {
    type: Boolean,
    default: false,
  },

  error: {
    type: String,
    default: '',
  },
  variant: {
    type: String as () => 'default' | 'textarea',
    default: 'default',
  },

  placeholder: {
    type: Boolean,
    default: false,
  },
})

const className = computed(() => {
  let arr = []
  if (props.small) {
    arr.push('text-xxs')
  } else {
    arr.push('text-xs')
  }

  if (props.rounded) arr.push('rounded')
  return arr.join(' ')
})

const hasError = computed(() => !!props.error)
</script>

<style lang="css" scoped>
:deep(.n-base-selection:hover .n-base-selection__border),
:deep(.n-input:hover .n-input__border) {
  border-color: #b2b8bf !important;
}

:deep(.n-base-selection .n-base-selection__state-border),
:deep(.n-input .n-input__state-border) {
  display: none !important;
}

.hide-placeholder :deep(.n-input .n-input__placeholder),
.hide-placeholder :deep(.n-base-selection__placeholder) {
  display: none !important;
}

:deep(.n-base-selection.n-base-selection--focus .n-base-selection__border),
:deep(.n-base-selection.n-base-selection--active .n-base-selection__border),
:deep(.n-input.n-input--focus .n-input__border),
:deep(.n-input.n-input--active .n-input__border) {
  border-color: #86b7fe !important;
  box-shadow: 0 0 0 4px #0d6efd40 !important;
}

.has-error :deep(.n-input__border),
.has-error :deep(.n-base-selection__border),
.has-error :deep(.n-base-selection:hover .n-base-selection__border),
.has-error :deep(.n-input:hover .n-input__border),
:deep(.n-input.n-input--error-status.n-input--textarea .n-input__border) {
  border-color: #d03050 !important;
}

.has-error :deep(.n-input.n-input--focus .n-input__border),
.has-error :deep(.n-input.n-input--active .n-input__border),
.has-error
  :deep(.n-base-selection.n-base-selection--focus .n-base-selection__border),
.has-error
  :deep(.n-base-selection.n-base-selection--active .n-base-selection__border),
:deep(
    .n-input.n-input--error-status.n-input--textarea.n-input--focus
      .n-input__border
  ),
:deep(
    .n-input.n-input--error-status.n-input--textarea.n-input--active
      .n-input__border
  ) {
  border-color: #d03050 !important;
  box-shadow: 0 0 0 4px rgba(208, 48, 80, 0.2) !important;
}

:deep(.n-input),
:deep(.n-base-selection) {
  border-radius: 0.375rem !important;
}

/* :deep(.n-base-icon svg) {
  color: black;
} */
:deep(.n-base-selection .n-base-suffix .n-base-suffix__arrow),
:deep(.n-base-clear > .n-base-clear__clear) {
  color: black;
}
.fw-textarea .fw-label {
  top: -0.3rem;
  background-color: #fff;
  padding: 0.25rem;
}
</style>
