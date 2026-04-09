<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { ctr_campaign } from '@/services/ctr_campaign'

import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const value = defineModel<any>('value')

const name = `Tags`

const tagOptions = ref<SelectOption[]>([])
const isLoading = ref<boolean>(false)

const fetchTag = async (value: string = '') => {
  isLoading.value = true

  const result = await ctr_campaign.SearchTag({ search: value })

  tagOptions.value = (result.data || []).map((item: any) => ({
    label: item,
    value: item,
  }))

  isLoading.value = false
}

const handleUpdateTags = (val: string[]) => {
  value.value = val.map((tag) => tag.trim())
}
onMounted(() => {
  fetchTag()
})

const handleSearch = debounceV2((value: any) => {
  fetchTag(value)
}, 300)
</script>

<template>
  <FloatingWrapper :name="name">
    <template #extra>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="12">
            <QuestionCircleRegular />
          </n-icon>
        </template>
        <div>
          The tags will be used for report aggregation and classification in
          rules
        </div>
      </n-tooltip>
    </template>
    <n-select
      v-model:value="value"
      filterable
      clearable
      multiple
      tag
      :loading="isLoading"
      :placeholder="''"
      :options="tagOptions"
      @search="(q:string)=>handleSearch(q)"
      @update:value="handleUpdateTags"
    >
      <template #empty>Enter text to add new tags</template>
    </n-select>
  </FloatingWrapper>
</template>
