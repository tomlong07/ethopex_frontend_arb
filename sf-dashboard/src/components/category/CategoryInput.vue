<script setup lang="ts">
import { ctr_category } from '@/services/ctr_category'
import { accountCategoryConfigType } from '@/types/components/accountcategory'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const isLoading = ref(false)
const pixelOptionsCategory = ref<SelectOption[]>([])

const props = defineProps({
  accountcategoryConfig: {
    type: Object as () => accountCategoryConfigType,
    required: true,
  },
})

onMounted(async () => {
  isLoading.value = true
  const result = await ctr_category.getCategoryIAB()
  pixelOptionsCategory.value = pixelOptionsCategory.value.concat(
    result?.data || []
  )
  isLoading.value = false
})

const name = 'Categories'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.accountcategoryConfig.categories as any"
      filterable
      multiple
      placeholder=""
      value-field="id"
      label-field="name"
      :loading="isLoading"
      :options="pixelOptionsCategory"
    />
  </FloatingWrapper>
</template>
