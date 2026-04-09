<script setup lang="ts">
import { useAssetGroupDetail } from '@/store/assetGroupDetail'
import { debounceV2 } from '@/utils'
import BulkEntryModal from './BulkEntry/BulkEntryFanpages.vue'
import { SelectOption } from 'naive-ui'
import { renderTag } from '../campaign/modules/Creative'

const assetGroupStore = useAssetGroupDetail()
onMounted(() => {
  assetGroupStore.fetchFanpages()
})

const handleSearch = debounceV2(async (q: string = '') => {
  assetGroupStore.fetchFanpages(q)
}, 300)

const handleFanpagesChange = (values: string[]) => {
  assetGroupStore.updateAssetGroupByTrafficSource(
    assetGroupStore.currentTrafficSource,
    {
      fanpages: values,
    }
  )
}

const name = `Fanpages`

const renderLabel = (option: SelectOption) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'truncate' }, option.name as string),
    option.link
      ? h(
          'a',
          {
            href: option.link as string,
            target: '_blank',
            rel: 'noopener noreferrer',
            class:
              'text-blue-500 text-xs ml-2 hover:underline whitespace-nowrap',
            onClick: (e: MouseEvent) => e.stopPropagation(), // ngăn trigger select
          },
          option.link as string
        )
      : null,
  ])
}
</script>

<template>
  <div class="flex items-center">
    <div class="w-48 font-bold">{{ name }}</div>
    <div class="flex-1">
      <div class="flex items-center">
        <div class="flex-1">
          <n-select
            v-model:value="assetGroupStore.getCurrentAssetGroup.fanpages"
            :placeholder="`Select ${name}`"
            multiple
            clearable
            filterable
            remote
            value-field="post_id"
            label-field="name"
            :options="assetGroupStore.fanpageOptions"
            @search="handleSearch"
            @update:value="handleFanpagesChange"
            :render-label="renderLabel"
            :render-tag="(props: any)=>renderTag(props, true)"
          />
        </div>
        <BulkEntryModal type="fanpages" />
      </div>
    </div>
  </div>
</template>
