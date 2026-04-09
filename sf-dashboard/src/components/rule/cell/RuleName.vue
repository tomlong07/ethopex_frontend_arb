<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { DropdownOption } from 'naive-ui'
import { ColumnItem } from '@/types/state/general'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const urlAction2 = options?.action2 || ''

const linkOptions = [
  {
    label: 'Edit',
    key: 'edit',
    disabled: !urlAction || !props.params.data.id,
  },

  {
    label: 'Satisfy',
    key: 'satisfy',
    disabled: !props.params.data.id,
  },
]

const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''

  return urlAction?.replace(':id', props.params.data.id)
})

const satisfyUrl = computed(() => {
  if (!urlAction2 || !props.params?.data?.id) return ''
  const urlSatisfy = urlAction2?.replace(':id', props.params.data.id)
  if (window.arb.isAnt()) return urlSatisfy //Ant xem today
  return urlSatisfy + '&time=all'
})

const renderLabel = (option: DropdownOption) => {
  switch (option.key) {
    case 'edit':
      if (!editUrl.value) return ''
      return h(
        'a',
        {
          href: editUrl.value,
          target: '_blank',
        },
        { default: () => option.label }
      )
    case 'satisfy':
      if (!satisfyUrl.value) return ''
      return h(
        'a',
        {
          href: satisfyUrl.value,
          target: '_blank',
        },
        { default: () => option.label }
      )
  }

  return ''
}
const expanded = ref(false)
const descEl = ref<HTMLElement | null>(null)

const showButton = computed(() => {
  const text = props.params.data?.description || ''
  return text.length > 80 || text.includes('\n')
})

const wrapperStyle = computed(() => {
  if (!descEl.value) return {}

  return expanded.value
    ? { maxHeight: descEl.value.scrollHeight + 'px' }
    : { maxHeight: '15px' } // 1 dòng ~ 20px
})

const clickMoreLess = (e: any) => {
  e.stopPropagation()
  expanded.value = !expanded.value
}
</script>
<template>
  <div class="flex justify-between items-center">
    <n-dropdown
      trigger="click"
      :options="linkOptions"
      :render-label="renderLabel"
      placement="bottom-start"
    >
      <div class="flex flex-col w-full py-2">
        <div
          class="text-xs cursor-pointer text-blue-500 font-medium overflow-hidden text-ellipsis"
        >
          {{ props.params?.data?.name || 'N/A' }}
        </div>

        <div class="text-xs text-gray-400">
          {{ props.params.data.publisher }}
        </div>

        <div
          class="text-xs text-gray-400 flex items-start gap-2"
          v-if="props.params.data?.description"
          @click.stop
        >
          <div
            ref="descEl"
            :style="wrapperStyle"
            class="overflow-hidden whitespace-pre-line transition-all duration-300"
          >
            {{ props.params.data?.description }}
          </div>

          <button
            v-if="showButton"
            @click="clickMoreLess"
            class="text-blue-500 text-xs ml-2 shrink-0"
          >
            {{ expanded ? 'Read less' : 'Read more' }}
          </button>
        </div>
      </div>
    </n-dropdown>
  </div>
</template>
