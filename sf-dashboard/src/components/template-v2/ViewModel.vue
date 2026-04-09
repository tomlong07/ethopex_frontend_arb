<script setup lang="ts">
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const viewModel = computed(() => {
  try {
    return (
      templateV2Store.baseConfigs.viewModel?.map((opts) => ({
        ...opts,
        class: 'text-xs',
      })) || []
    )
  } catch {
    return []
  }
})

const viewModelValue = ref<string | undefined>(templateV2Store.viewModelNow)

const changeViewModel = (value: string) => {
  templateV2Store.viewModelNow = value
  templateV2Store.reInitTable()
}

watch(
  () => templateV2Store.viewModelNow,
  () => {
    viewModelValue.value = templateV2Store.viewModelNow
  }
)
</script>
<template>
  <div v-if="viewModel?.length" class="flex items-center">
    <div class="flex items-center mr-2 font-bold text-xs text-gray-500">
      View Model
    </div>
    <div class="w-44">
      <div class="font-bold text-xs text-gray-500"></div>

      <n-select
        size="small"
        class="w-40 special small-select-dropdown"
        :menu-props="{ class: 'small-select-dropdown' }"
        v-model:value="viewModelValue"
        :options="viewModel"
        value-field="key"
        label-field="name"
        :on-update:value="changeViewModel"
      />
    </div>
  </div>
</template>
