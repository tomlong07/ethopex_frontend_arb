<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { useTemplateV2 } from '@/store/templateV2Store'
import { FilterItem } from '@/types/state/template'
import { AI_STATUS } from '@/enum/campaign'

const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  item: {
    type: Object as () => FilterItem,
    required: true,
  },

  classPlus: {
    type: String,
    default: 'py-2 w-40',
  },
})
const filterListNowStringF = computed<string>(() => {
  if (Array.isArray(templateV2Store.filterList[props.item.key])) {
    return templateV2Store.filterList[props.item.key].join(',')
  }

  return String(templateV2Store.filterList[props.item.key])
})

const isLoading = ref<boolean>(false)

const onChangeValue = (valueNow: any) => {
  try {
    //Xóa bỏ params query trên url khi đổi query đó ở select
    if (
      window.route.query &&
      props.item.key &&
      window.route.query[props.item.key]
    ) {
      const newQuery = helper.clone(window.route.query)
      newQuery.status = undefined
      window.router.push({
        path: window.route.path,
        query: newQuery,
      })
    }
  } catch {}

  templateV2Store.filterList[props.item.key] = valueNow
}

const onBlur = () => {
  if (props.item.clientFilter) {
    templateV2Store.filterOptions[props.item.key] = helper.clone(
      templateV2Store.baseOptions[props.item.key]
    )
  }
}
const searchTimeout = ref<ReturnType<typeof setTimeout> | null>(null)

const handleSearch = async (query: string) => {
  if (props.item.clientFilter) {
    isLoading.value = true

    const temp = [] as SelectOption[]

    templateV2Store.baseOptions[props.item.key]?.forEach((source: any) => {
      try {
        if (
          source.label.toLowerCase().includes(query.toLowerCase()) ||
          String(source.value).toLowerCase().includes(query.toLowerCase())
        ) {
          temp.push(helper.clone(source))
        }
      } catch {}
    })
    templateV2Store.filterOptions[props.item.key] = temp
    isLoading.value = false
    return
  }

  if (query !== '') {
    isLoading.value = true
    // Hủy bỏ timeout hiện tại nếu có
    if (searchTimeout.value) {
      clearTimeout(searchTimeout.value)
    }
    // Đặt một timeout mới để chạy đoạn mã sau 3 giây
    searchTimeout.value = setTimeout(() => {
      templateV2Store.getFilterOptions(props.item, {
        f: filterListNowStringF.value,
        q: query,
      })

      isLoading.value = false
    }, 500)
  }
}

const filterOptionsShow = computed(() => {
  const options = templateV2Store.filterOptions[props.item.key]
  const selectedValues = templateV2Store.filterList[props.item.key] || []

  if (props.item.oneValue) {
    // Nếu chưa chọn gì, mở toàn bộ (không disable)
    if (selectedValues.length === 0) {
      return options
    }

    // Nếu đã chọn, chỉ enable những item đang chọn
    return options.map((item) =>
      selectedValues.includes(item.value) ? item : { ...item, disabled: true }
    )
  }

  if (props.item.alone && selectedValues.includes(props.item.alone)) {
    return options.map((item) =>
      item.value === props.item.alone ? item : { ...item, disabled: true }
    )
  }

  return options
})
const statusColorMap: Record<AI_STATUS, string> = {
  [AI_STATUS.REJECTED]: 'text-red-500',
  [AI_STATUS.SUCCESS]: 'text-green-500',
  [AI_STATUS.PENDING]: 'text-yellow-500',
  [AI_STATUS.AUTO_REVIEW]: 'text-blue-500',
  [AI_STATUS.MANUAL_REVIEW]: 'text-purple-500',
  [AI_STATUS.BOT_REVIEW]: 'text-blue-500',
} as Record<AI_STATUS, string>
const renderLabel = (option: {
  label: string
  value: AI_STATUS
  disabled: boolean
  note: string
}) => {
  return h(
    'div',
    {
      class: [
        'flex',
        statusColorMap[option.value] ?? '', // nếu không có mapping cũng không lỗi
        option.disabled ? 'opacity-50' : '',
      ],
    },
    [
      h('span', {}, option.label),
      h('span', { class: 'ml-auto text-xs' }, option.note),
    ]
  )
}

const renderLabelConditional = computed(() => {
  return props.item.filterColor ? renderLabel : undefined
})
</script>
<template>
  <div :class="props.classPlus">
    <div class="pb-2 font-bold text-xs text-gray-500">
      {{ props.item.label }}
    </div>
    <div class="flex month-report-class text-xs">
      <n-input
        v-if="props.item.input"
        v-model:value="templateV2Store.filterList[props.item.key]"
        size="small"
        clearable
        @update:value="onChangeValue"
      />

      <n-select
        v-else
        v-model:value="templateV2Store.filterList[props.item.key]"
        :remote="!props.item.clientFilter"
        :tag="props.item.clientFilter && props.item.custom"
        filterable
        :filter="props.item.clientFilter ? () => true : undefined"
        :placeholder="props.item.custom ? 'Please Input' : 'All'"
        max-tag-count="responsive"
        size="small"
        class="small-select-dropdown"
        :menu-props="{ class: 'small-select-dropdown' }"
        :loading="isLoading"
        :multiple="props.item.multiple"
        :options="filterOptionsShow"
        :consistent-menu-width="false"
        :clearable="true"
        :on-update:value="onChangeValue"
        :on-blur="onBlur"
        @search="handleSearch"
        :render-label="renderLabelConditional"
      />
    </div>
  </div>
</template>
<style lang="scss">
@use '@/css/FilterItem.scss';
</style>
