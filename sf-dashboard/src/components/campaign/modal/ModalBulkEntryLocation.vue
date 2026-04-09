<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { usePresetLocations } from '@/store/campaign/usePresetLocations'

const store = usePresetLocations()

const props = defineProps({
  options: {
    type: Array as () => SelectOption[],
    required: true,
  },
  selectedVal: {
    type: Array as () => string[],
    required: true,
  },
})

const emit = defineEmits<{
  'update:selectedValues': [values: string[]]
}>()

const bulkEntryText = ref<string>('')

const parseBulkInputs = (text: string): string[] => {
  return text
    .split(/[,\n]/)
    .map((item) => item.trim())
    .filter(Boolean)
}

// find code/name không phân biệt hoa/thường
const findOptionByInput = (input: string) => {
  const upper = input.toUpperCase()
  const lower = input.toLowerCase()

  return props.options.find(
    (opt) =>
      opt.code?.toString().toUpperCase() === upper ||
      opt.name?.toString().toLowerCase() === lower
  )
}

// danh sách hợp lệ và không hợp lệ
const resolveBulkInputs = (inputs: string[]) => {
  const matched: string[] = []
  const notFound: string[] = []

  inputs.forEach((input) => {
    const option = findOptionByInput(input)

    if (option) {
      const value = option.value as string
      if (!props.selectedVal.includes(value)) matched.push(value) // tránh trùng
    } else {
      notFound.push(input)
    }
  })

  return { matched, notFound }
}

const closeModal = () => {
  store.isModal = false
  bulkEntryText.value = ''
}

const saveBulkEntry = () => {
  const raw = bulkEntryText.value.trim()
  if (!raw) {
    window.message.warning('Please enter country codes or names')
    return
  }

  const inputs = parseBulkInputs(raw)

  if (!inputs.length) {
    window.message.warning('No valid entries found')
    return
  }

  const { matched, notFound } = resolveBulkInputs(inputs)

  if (matched.length) {
    emit('update:selectedValues', [...props.selectedVal, ...matched])
    window.message.success(`Added ${matched.length} country(ies)`)
  }

  if (notFound.length) {
    window.message.warning(`Not found: ${notFound.join(', ')}`)
  }

  closeModal()
}

watch(
  () => store.isModal,
  (val) => {
    if (!val) return

    if (props.selectedVal.length) {
      const codes = props.selectedVal
        .map((value) => props.options.find((opt) => opt.value === value)?.code)
        .filter(Boolean)
        .join(', ')

      bulkEntryText.value = codes
    } else {
      bulkEntryText.value = ''
    }
  }
)
</script>

<template>
  <n-modal
    v-model:show="store.isModal"
    preset="dialog"
    :closable="false"
    type="success"
    :show-icon="false"
    style="width: 60vw"
  >
    <template #header>
      <div class="flex flex-col gap-1">
        <div class="text-lg font-semibold">Countries bulk entry</div>
        <span class="text-sm font-normal text-gray-500"
          >Enter country codes or names, separated by commas or lines.</span
        >
      </div>
    </template>
    <div>
      <n-input
        v-model:value="bulkEntryText"
        type="textarea"
        placeholder="Ex. US, VN, Japan&#10;United Kingdom&#10;France, Germany&#10;"
        rows="10"
      />
    </div>
    <template #action>
      <n-button @click="closeModal"> Cancel </n-button>
      <n-button type="primary" @click="saveBulkEntry"> Save </n-button>
    </template>
  </n-modal>
</template>
