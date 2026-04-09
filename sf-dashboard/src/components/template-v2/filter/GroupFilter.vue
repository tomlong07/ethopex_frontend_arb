<script setup lang="ts">
import SkeletonFilter from '@/components/template-v2/skeleton/SkeletonFilter.vue'

import FilterItem from '@/components/template-v2/filter/FilterItem.vue'
import SearchInput from '@/components/template-v2/filter/SearchInput.vue'

import { useTemplateV2 } from '@/store/templateV2Store'
const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  loadingFilters: {
    type: Boolean,
    required: true,
  },
})

const onUpdate = () => {
  emit('handleRefresh')
}

onMounted(async () => {})

const emit = defineEmits<{
  (e: 'handleRefresh'): void
}>()
</script>
<template>
  <SkeletonFilter v-show="props.loadingFilters" />
  <div
    v-show="!props.loadingFilters"
    class="flex flex-wrap justify-between bg-gray-100 main-group-child"
  >
    <div
      class="pb-2 px-4 py-2 font-medium text-xs flex-wrap w-5/6 flex flex-row gap-2"
    >
      <template
        v-for="(item, index) in templateV2Store.filterConfigs.filters"
        :key="item.key + index"
      >
        <FilterItem :item="item" />
      </template>
    </div>
    <div class="flex justify-end items-center pb-2 py-2 w-1/6 gap-2">
      <SearchInput />

      <n-button
        v-if="templateV2Store.baseConfigs.HasUpdateButton()"
        class="mr-4"
        color="#f43f5e"
        size="small"
        @click="onUpdate"
      >
        Update
      </n-button>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@use '@/css/RuleFilter.scss';
</style>
