<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_label } from '@/services/ctr_label'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const localValue = defineModel<string | undefined | null>()
const isLoading = ref(false)
const options = ref<SelectOption[]>([])

const fetchOptions = async () => {
  isLoading.value = true
  try {
    const result = await ctr_label.GetAll()
    options.value =
      result?.data?.map((item: any) => ({
        ...item,
        id: String(item.id),
      })) || []
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchOptions()
})
</script>

<template>
  <FloatingWrapper name="Label">
    <n-select
      v-model:value="localValue"
      filterable
      clearable
      value-field="id"
      label-field="name"
      :loading="isLoading"
      placeholder=""
      :options="options"
    />
  </FloatingWrapper>
</template>
