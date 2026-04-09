<script lang="ts" setup>
import { ctr_account_category } from '@/services/ctr_account_category'
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const blockAppCategoryStore = useBlockAppCategory()

const name = `Exclude List`

const isLoading = ref(false)

const options = ref<SelectOption[]>([])

const getExcludeList = async () => {
  isLoading.value = true
  const result = await ctr_account_category.ListExclude()
  options.value = result?.data || []

  isLoading.value = false
}

onMounted(() => {
  getExcludeList()
})
</script>

<template>
  <n-card title="Exclude List" class="card-flex-gap-4">
    <FloatingWrapper
      :name="name"
    > 
      <n-select
        v-model:value="blockAppCategoryStore.blockAppCategoryData.list_exclude"
        value-field="id"
        label-field="name"
        filterable
        multiple
        :loading="isLoading"
        placeholder=""
        :options="options"
        clearable
        :max-tag-count="10"
      />
    </FloatingWrapper>
  </n-card>
</template>
