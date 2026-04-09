<script setup lang="ts">
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import { ICellRendererParams } from 'ag-grid-community'
const ActivityFb = defineAsyncComponent(
  () => import('../../modules/facebook/ActivityFb.vue')
)
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
let fullData: Record<string, any> = {}
const scrollY = ref(0)
const EVENT_TYPE = 'update_ad_set_target_spec'
const eventTypeSpec = computed(() => {
  return props.params.data.event_type === EVENT_TYPE
})

const dropdownHeight = 250
try {
  if (props.params.data?.extra_data_handle) {
    try {
      fullData = props.params.data?.extra_data_handle[0]
    } catch {
      fullData = JSON.parse(props.params.data?.extra_data || '{}')
    }
  } else {
    fullData = JSON.parse(props.params.data?.extra_data || '{}')
  }
} catch {
  fullData = {}
}

function formatInfoCell(value: any) {
  if (!value || !value.length) return ''

  // Nếu có eventTypeSpec
  if (eventTypeSpec.value && Array.isArray(value)) {
    return JSON.stringify(value)
  }

  // Kiểu payment_amount
  if (value.type === 'payment_amount') {
    const amount = value.new_value?.toLocaleString?.() ?? value.new_value
    const currency = value.currency || ''
    const per = value.additional_value ? `(${value.additional_value})` : ''
    return `Payment Amount: ${amount} ${currency} ${per}`
  }

  if (value && !['<nil>', 'null'].includes(value)) {
    return value
  }

  if (Array.isArray(value)) {
    return value
      .map((item: any) => {
        const label = item.content
        const children = Array.isArray(item.children) ? item.children : []
        const val = children.join(', ')

        if (val.length > 100) {
          const chunked: string[] = []
          let current = ''

          val.split(', ').forEach((word: string) => {
            const next = current ? `${current}, ${word}` : word
            if (next.length > 65) {
              if (current) chunked.push(current)
              current = word
            } else {
              current = next
            }
          })

          if (current) chunked.push(current)

          return `${label} ${chunked.join('<br/>')}`
        }

        return `${label} ${val}`
      })
      .join('<br/>')
  }

  return ''
}

function getDisplayValue(value: any): { show: string; isComplex: boolean } {
  let isComplex = false
  let show = ''
  if (
    Array.isArray(value) ||
    helper.isObject(value) ||
    helper.IsString(value)
  ) {
    isComplex = true
    show = formatInfoCell(value)
  }

  return { show, isComplex }
}

const htmlNow = () => {
  const { show: oldShow, isComplex: oldIsComplex } = getDisplayValue(
    fullData?.old_value
  )
  const { show: newShow, isComplex: newIsComplex } = getDisplayValue(
    fullData?.new_value
  )

  const BR = oldIsComplex || newIsComplex

  if (
    fullData.type === 'composite_data' &&
    oldShow.trim() === '$0' &&
    newShow.trim() === '$0'
  ) {
    return ''
  }

  return {
    oldShow,
    newShow,
    BR,
  }
}

const cutAtFirstBrKeep = () => {
  const type = props.params.data?.translated_event_type
  if (['Campaign created', 'Ad created'].includes(type)) return type

  const { oldShow, newShow } = htmlNow() as { oldShow: string; newShow: string }
  let text = ''

  if (oldShow && newShow) {
    text = `From ${oldShow} to ${newShow}`
  } else if (!oldShow && newShow) {
    text = `New: ${newShow}`
  } else if (oldShow && !newShow) {
    text = `${oldShow}`
  } else {
    text = '-'
  }
  return text.split(/<br\s*\/?>/i)[0] + '<br>'
}

const renderOption = ({ option }: any) => {
  const { old, new: newVal } = option.value
  const vnode = h(ActivityFb, {
    oldValue: old,
    newValue: newVal,
    params: props.params,
  })

  return vnode
}

const formattedOptions = computed(() => {
  const { oldShow, newShow } = htmlNow() as { oldShow: string; newShow: string }

  return [
    {
      key: 'diff',
      value: {
        old: oldShow,
        new: newShow,
      },
    },
  ]
})

const optimalPlacement = computed(() => {
  const viewportHeight = window.innerHeight
  const spaceBelow = viewportHeight - scrollY.value

  if (spaceBelow < dropdownHeight + 100) {
    return 'top-start'
  }
  return 'bottom-start'
})
</script>
<template>
  <div class="flex items-center gap-4">
    <template v-if="eventTypeSpec">
      <div>Audience change</div>
      <n-dropdown
        trigger="hover"
        :placement="optimalPlacement"
        :options="formattedOptions"
        class="overflow-y-auto !p-3 max-w-[35vw] max-h-[50dvh] cursor-pointer"
        :renderOption="renderOption"
      >
        <n-icon :component="InformationCircleOutline" size="19" />
      </n-dropdown>
    </template>
    <template v-else>
      <div v-html="cutAtFirstBrKeep()" />
    </template>
  </div>
</template>
 
