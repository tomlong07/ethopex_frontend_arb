<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { LandingPageOptionManager } from '@/class/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'Landing Page',
  },

  class: {
    type: String,
    default: 'w-28',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  manager: {
    type: Object as () => LandingPageOptionManager,
    required: true,
  },
})
const value = defineModel<number>('value')

const renderLandingLabel = (option: SelectOption) => {
  let landingItem = props.manager.options?.find(
    (item: SelectOption) => item.value === option.value
  )

  if (!landingItem) landingItem = option
  return h('div', { class: 'flex justify-between w-full' }, [
    h('div', {
      innerHTML: `${
        (option.label as any).match(/^\d/)
          ? option.label
          : `${landingItem.value}: ${option.label}`
      }`,
      style:
        'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
    }),
    h('div', {
      innerHTML: `${
        landingItem?.cvr ? (landingItem.cvr as number).toFixed(2) : 0
      }%`,
    }),
  ])
}
</script>

<template>
  <FloatingWrapper :name="props.name" rounded>
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <n-select
        v-model:value="value"
        filterable
        remote
        clearable
        :loading="props.manager.loading"
        :placeholder="props.name"
        :render-label="renderLandingLabel"
        :options="props.manager.options"
        :disabled="props.disabled"
      />

      <a
        :href="`/landing_page/${value}`"
        target="_blank"
        v-if="value"
        class="always-on"
      >
        <n-button color="#f43f5e" type="default" size="small">Open</n-button></a
      >
    </div>
  </FloatingWrapper>
</template>
