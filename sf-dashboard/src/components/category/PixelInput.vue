<script setup lang="ts">
import { ctr_pixel } from '@/services/ctr_pixel'

import { accountCategoryConfigType } from '@/types/components/accountcategory'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const isLoading = ref(false)
const pixelOptions = ref<SelectOption[]>([])

const props = defineProps({
  accountcategoryConfig: {
    type: Object as () => accountCategoryConfigType,
    required: true,
  },
})

onMounted(async () => {
  isLoading.value = true
  const result = await ctr_pixel.GetAll()
  pixelOptions.value = pixelOptions.value.concat(result?.data || [])
  isLoading.value = false
})
const name = 'Pixels'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.accountcategoryConfig.pixels as any"
      multiple
      clearable
      filterable
      placeholder=""
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :options="pixelOptions"
    />
  </FloatingWrapper>
</template>
