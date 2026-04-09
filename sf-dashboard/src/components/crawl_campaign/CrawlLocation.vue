<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
import { SelectOption } from 'naive-ui'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'

const props = defineProps({
  multiple: { type: Boolean, default: false },
  disabled: { type: Boolean, default: false },
  name: { type: String, default: 'Location' },
  traffic_source: { type: String, required: false },
  width: { type: String, default: 'w-48' },
  one: { type: Boolean, default: false },
  include: { type: Boolean, default: false },
})

// v-model:value
const value = defineModel<any>('value')
const type = defineModel<any>('type')

const loading = ref(false)
const options = ref<SelectOption[]>([])

const fetchLocations = async () => {
  if (!props.traffic_source) return
  loading.value = true
  try {
    const result = await ctr_traffic_source.GetCountries({
      traffic_source: props.traffic_source,
    })
    options.value = result?.data?.coutries || []
  } finally {
    loading.value = false
  }
}

onMounted(fetchLocations)

const filterHandle = (pattern: string, option: any) => {
  const q = (pattern || '').toLowerCase()
  return (
    String(option?.name || '')
      .toLowerCase()
      .includes(q) ||
    String(option?.code || '')
      .toLowerCase()
      .includes(q) ||
    String(option?.value || '')
      .toLowerCase()
      .includes(q)
  )
}

const countriesOptionsShow = computed<SelectOption[]>(() => {
  const val = value.value
  const isMultiple = !!props.multiple
  const isOne = !!props.one

  // giữ nguyên logic ALL / non-ALL khi props.one = false
  const hasAll = isMultiple
    ? Array.isArray(val) && val.includes('ALL')
    : val === 'ALL'

  const hasNonAll = isMultiple
    ? Array.isArray(val) && val.some((v: any) => v !== 'ALL')
    : val != null && val !== 'ALL' && val !== ''

  return options.value.map((opt) => {
    const o = { ...opt }

    if (isOne) {
      // chuẩn hoá selected thành mảng (an toàn cho cả string / array / null / '')
      const selectedArr = Array.isArray(val)
        ? val
        : val === undefined || val === null || val === ''
        ? []
        : [val]

      const selectedSet = new Set(selectedArr)

      // nếu chưa chọn gì -> không disable
      if (selectedSet.size === 0) {
        o.disabled = false
      } else {
        // nếu đã chọn (1 phần tử) -> chỉ enable phần tử được chọn, disable các phần còn lại
        o.disabled = !selectedSet.has(o.value)
      }
    } else {
      // logic ALL / non-ALL cũ
      o.disabled =
        (hasAll && o.value !== 'ALL') || (hasNonAll && o.value === 'ALL')
    }

    return o
  })
})

defineExpose({
  fetchLocations,
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0 flex gap-2 items-center">
      <FloatingWrapper :name="props.name" required>
        <n-select
          v-model:value="value"
          :multiple="props.multiple"
          :options="countriesOptionsShow"
          :loading="loading"
          placeholder=""
          filterable
          clearable
          value-field="value"
          label-field="name"
          :max-tag-count="5"
          :disabled="props.disabled || !props.traffic_source"
          :filter="filterHandle"
        />
      </FloatingWrapper>
      <CustomSwitch
        v-model="type"
        type="inex"
        true-label="Include"
        false-label="Exclude"
        size="small"
      />
    </div>
  </div>
</template>
