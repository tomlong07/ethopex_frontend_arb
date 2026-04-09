<script setup lang="ts">
import BarCharLine from '@/assets/icons/BarCharLine.vue'
import { ID_STORAGE_PROFILE } from '@/constants/storage'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ICellRendererParams } from 'ag-grid-community'
import { SelectOption } from 'naive-ui'

const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

// const options = (props.params as any).options as ColumnItem
const data = props.params.data

let endDate = data.interval_end_date

if (data?.include_today) {
  try {
    const date = new Date(endDate)
    date.setDate(date.getDate() + 1)
    endDate = date.toISOString().slice(0, 10) // giữ lại định dạng yyyy-mm-dd
  } catch {}
}
const profileId = localStorage.getItem(ID_STORAGE_PROFILE) // lấy id profile ở localStorage
const urlReport = (profileId?: string) => {
  const queryParams = new URLSearchParams({
    start_date: data.interval_start_date,
    end_date: endDate,
    campaigns: data.campaign_id,
  })

  if (profileId) {
    queryParams.set('profile_id', profileId)
  }
  queryParams.set('groupPlus', 'date')
  return `/?${queryParams.toString()}`
}

const handleClick = (value: any) => {
  const href = urlReport(value)
  window.open(href, '_blank')
  localStorage.setItem(ID_STORAGE_PROFILE, value)
}

const renderLabel = (option: SelectOption) => {
  return h(
    'div',
    {
      class: 'flex items-center justify-between w-full gap-4',
    },
    [
      h(
        'span',
        {
          class: 'truncate max-w-[200px] overflow-hidden text-ellipsis',
        },
        option.label as string
      ),
      h(
        'span',
        {
          class: 'ml-auto text-xs text-gray-400',
        },
        option.value != -2 ? String(option.value) : ''
      ),
    ]
  )
}
</script>
<template>
  <div class="flex items-center w-full">
    <!-- Bọc phần text trong 1 div riêng có w-0 grow để co dãn -->
    <div class="overflow-hidden text-ellipsis whitespace-nowrap w-0 flex-grow">
      <n-tooltip trigger="hover">
        <template #trigger>
          <a
            :href="urlReport(profileId || '')"
            target="_blank"
            class="text-blue-500"
          >
            {{ props.params.value }}
          </a>
        </template>
        {{ props.params.value }}
      </n-tooltip>
    </div>

    <!-- Phần icon luôn nằm bên phải -->
    <div class="flex items-center ml-2 gap-2 flex-shrink-0">
      <n-popselect
        :options="templateV2Store.profileShow"
        :on-update:value="handleClick"
        scrollable
        :render-label="renderLabel"
        v-if="templateV2Store.profileShow?.length"
      >
        <n-icon
          :component="BarCharLine"
          size="16"
          color="green"
          class="cursor-pointer"
        />
      </n-popselect>

      <a
        target="_blank"
        v-else
        :href="`/?plk=${props.params.data.plk}`"
        title="Open report in new tab"
      >
        <n-icon :component="BarCharLine" size="16" color="green" />
      </a>
    </div>
  </div>
</template>
