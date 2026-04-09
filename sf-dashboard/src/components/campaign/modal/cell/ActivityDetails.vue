<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
let fullData: Record<string, any> = {}

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
  if (!value) return ''
  if (Array.isArray(value) && value.length === 0) return 'Unset'

  // Nếu là object kiểu payment_amount
  if (value.type === 'payment_amount') {
    const amount = value.new_value?.toLocaleString?.() ?? value.new_value
    const currency = value.currency || ''
    const per = value.additional_value ? `(${value.additional_value})` : ''
    return `Payment Amount: ${amount} ${currency} ${per}`
  }

  // Nếu là array dạng thông tin tổng hợp
  if (Array.isArray(value)) {
    return value
      .map((item) => {
        const label = item.content
        const children = Array.isArray(item.children) ? item.children : []
        const val = children.join(', ') // Dù là 1 phần tử dài vẫn gộp để xử lý

        // Nếu chuỗi quá dài → tự chia nhỏ dòng
        if (val.length > 100) {
          const chunked: string[] = []
          let current = ''

          val.split(', ').forEach((word: string) => {
            const next = current ? `${current}, ${word}` : word
            if (next.length > 100) {
              chunked.push(current)
              current = word
            } else {
              current = next
            }
          })

          if (current) chunked.push(current)

          return `${label} ${chunked.join('<br/>')}`
        } else {
          return `${label} ${val}`
        }
      })
      .join('<br/>')
  }

  return ''
}

const htmlNow = () => {
  let BR = false

  let oldShow = ''
  let newShow = ''
  if (
    Array.isArray(fullData?.old_value) ||
    helper.isObject(fullData?.old_value)
  ) {
    BR = true
    oldShow = formatInfoCell(fullData?.old_value)
  } else {
    oldShow = fullData?.old_value || 'Unset'

    if (['<nil>', 'null'].includes(oldShow)) {
      oldShow = 'Unset'
    }
  }

  if (
    Array.isArray(fullData?.new_value) ||
    helper.isObject(fullData?.new_value)
  ) {
    BR = true

    newShow = formatInfoCell(fullData?.new_value)
  } else {
    newShow = fullData?.new_value || 'Unset'
    if (['<nil>', 'null'].includes(newShow)) {
      newShow = 'Unset'
    }
  }

  if (
    fullData.type === 'composite_data' &&
    oldShow.trim() === '$0' &&
    newShow.trim() === '$0'
  )
    return ''

  return `From ${oldShow} ${BR ? '<br/>' : ''} to ${newShow}`
}
</script>
<template>
  <div class="flex">
    <div
      class="overflow-hidden text-ellipsis"
      v-if="!fullData?.old_value && !fullData?.new_value"
    >
      New: {{ fullData?.campaign_id?.new }}
    </div>

    <div class="overflow-hidden text-ellipsis" v-else v-html="htmlNow()"></div>
  </div>
</template>
