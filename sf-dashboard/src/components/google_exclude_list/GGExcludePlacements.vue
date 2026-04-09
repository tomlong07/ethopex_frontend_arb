<script lang="ts" setup>
import { useGoogleExcludeList } from '@/store/details/googleExcludeList'
import {
  NButton,
  NCheckbox,
  NEmpty,
  NTree,
  TransferRenderSourceList,
  TreeOption,
} from 'naive-ui'

import { AgGridVue } from 'ag-grid-vue3'
import {
  adGroups,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { themeAlpine } from 'ag-grid-community'

// !! Props
const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: false,
  },
  isAdGroup: {
    type: Boolean,
    required: false,
  },
  statusData: {
    type: Object as () => StatusCampManager,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: false,
  },
})

// const props = withDefaults(defineProps<{
//   adgroup: adGroups
//   isAdGroup?: boolean
// }>(), {
//   isAdGroup: false
// })

// !! State
const googleExcludeListStore = useGoogleExcludeList()

const typeToLabel: Record<string, string> = {
  website: 'Websites',
  youtube_video: 'Youtube Videos',
  youtube_channel: 'Youtube Channels',
  youtube_playlist: 'Youtube Playlist',
  youtube: 'YouTube Homepage',
  app_android: 'App Android',
  app_ios: 'App iOS',
  app_category: 'App Category',
}

// !! Lifecycle hook

const count = computed(
  () => flatOptions.value.filter((item) => !item.isNotShow).length
)

watch(
  () => googleExcludeListStore.selectedTranferPlacements,
  (newVal) => {
    if (props.adgroup) {
      props.adgroup.listPlacements = [...newVal]
    }
  },
  { deep: true }
)

const initPlacement = async () => {
  googleExcludeListStore.resetGoogleExcludeListData()
  syncAdgroupPlacements()
  await Promise.all(
    [
      googleExcludeListStore.fetchPlacements(),
      !props.isAdGroup && googleExcludeListStore.fetchCategorys(),
    ].filter(Boolean)
  )
}

onMounted(async () => {
  if (props.statusData?.IsTabAdGroup()) return
  initPlacement()
})

watch(
  () => props.statusData?.IsTabAdGroup(),
  async (v) => {
    if (v) {
      initPlacement()
    }
  }
)

// !! Func
const syncAdgroupPlacements = () => {
  if (props.FreezeData?.isAddPage()) return
  const list = props.adgroup?.listPlacements
  if (Array.isArray(list) && list.length) {
    googleExcludeListStore.selectedTranferPlacements = [...list]
    googleExcludeListStore.googleExcludeListData.placements = list.map(
      (placement: string) => ({
        name: placement,
        placement: placement,
        type: 'website',
        site: placement,
      })
    )
  }
}

const treeData = computed<TreeOption[]>(() => {
  const placements = [
    ...(googleExcludeListStore.googleExcludeListData.placements || []),
    ...(!props.isAdGroup ? googleExcludeListStore.listCategory || [] : []),
  ]

  const buildTreeNode = (item: any, parentLabel: string): TreeOption => {
    const node: TreeOption = {
      label: item.name,
      value: item.placement,
      store: item.site,
      parent_placement: parentLabel,
      placement: item.placement,
      disabled: existingPlacementValues.value.includes(item.placement),
    }

    if (Array.isArray(item.children)) {
      node.isNotShow = true
      node.children = item.children.map((child: any) =>
        buildTreeNode(child, item.name)
      )
    }

    return node
  }

  const grouped: Record<string, TreeOption> = {}

  for (const item of placements) {
    const groupName = typeToLabel[item.type] || 'Unknown'

    if (!grouped[groupName]) {
      grouped[groupName] = {
        label: groupName,
        value: groupName,
        isNotShow: true,
        children: [],
      }
    }

    grouped[groupName].children!.push(buildTreeNode(item, groupName))
  }

  return Object.values(grouped)
})

const existingPlacementValues = computed(() =>
  googleExcludeListStore.listPlacements.map((item) => item.placement)
)

const flatOptions = computed(() => {
  const result: TreeOption[] = []
  const flatten = (nodes: TreeOption[]) => {
    for (const node of nodes) {
      result.push(node)
      if (node.children) flatten(node.children)
    }
  }
  flatten(treeData.value)

  return result
})

// !! Func
const gatherChildrenValues = (node: TreeOption): string[] => {
  let result: string[] = []
  node.children?.forEach((child) => {
    if (!child.isNotShow && !child.disabled) {
      result.push(child.value as string)
    }
    result = result.concat(gatherChildrenValues(child))
  })
  return result
}

const handleLabelClick = (e: MouseEvent, option: TreeOption) => {
  if (option.disabled) return
  const target = e.target as HTMLElement
  if (!target || target.closest('.button-all')) return

  if (option.children?.length) {
    target
      ?.closest('.n-tree-node')
      ?.querySelector('.n-tree-node-switcher')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
    return
  }

  if (option.isNotShow) return

  const val = option.value as string
  const idx = googleExcludeListStore.selectedTranferPlacements.indexOf(val)
  if (idx >= 0) googleExcludeListStore.selectedTranferPlacements.splice(idx, 1)
  else googleExcludeListStore.selectedTranferPlacements.push(val)
}

const handleParentClick = (e: MouseEvent, option: TreeOption) => {
  if (!option.children?.length) return
  const childrenValues = gatherChildrenValues(option)
  const notFound = childrenValues.filter(
    (val) => !googleExcludeListStore.selectedTranferPlacements.includes(val)
  )

  if (notFound.length)
    googleExcludeListStore.selectedTranferPlacements.push(...notFound)
  else
    googleExcludeListStore.selectedTranferPlacements =
      googleExcludeListStore.selectedTranferPlacements.filter(
        (val: any) => !childrenValues.includes(val)
      )
}

// !! Render
const renderTreeLabel = (info: { option: TreeOption }) => {
  const option = info.option

  return h(
    'div',
    {
      class: 'flex gap-2 items-center',
      onClick: (e: MouseEvent) => handleLabelClick(e, option),
    },
    [
      !option.isNotShow
        ? h(NCheckbox, {
            checked: googleExcludeListStore.selectedTranferPlacements.includes(
              option.value as string
            ),
            disabled: option.disabled,
          })
        : null,
      h('span', { class: 'cursor-pointer' }, option.label),
      option.children
        ? h(
            'span',
            {
              class:
                'button-all ml-auto mr-4 text-blue-500 hover:text-blue-700 cursor-pointer',
              onClick: (e: MouseEvent) => handleParentClick(e, option),
            },
            'All'
          )
        : null,
    ]
  )
}

const renderSourceList: TransferRenderSourceList = ({ onCheck, pattern }) => {
  return h(NTree, {
    style: 'margin: 0 4px;',
    keyField: 'value',
    selectable: false,
    blockLine: true,
    checkOnClick: true,
    data: treeData.value,
    pattern,
    renderLabel: renderTreeLabel,
    checkedKeys: googleExcludeListStore.selectedTranferPlacements,
    onUpdateCheckedKeys: (keys: Array<string | number>) => {
      onCheck(keys)
    },
  })
}

const renderTargetList: TransferRenderSourceList = ({
  checkedOptions,
  pattern,
}) => {
  const filtered = checkedOptions.filter((opt) =>
    opt.label.toLowerCase().includes(pattern.toLowerCase())
  )

  if (!filtered.length) return h(NEmpty, { description: 'No Data' })

  return h(
    'div',
    { class: 'p-2 space-y-2' },
    filtered.map((opt: any) =>
      h(
        'div',
        {
          class:
            'group flex items-center px-2 py-1 rounded hover:bg-gray-50 transition-colors',
        },
        [
          h('div', { class: 'flex flex-col' }, [
            h('span', { class: 'text-xs text-gray-500' }, opt.parent_placement),
            h('span', {}, opt.label),
          ]),
          h(
            NButton,
            {
              size: 'large',
              class:
                'ml-auto !px-1.5 !text-red-500 opacity-0 group-hover:opacity-100 transition-opacity',
              text: true,
              round: true,
              title: 'Remove',
              onClick: () =>
                googleExcludeListStore.selectedTranferPlacements.splice(
                  googleExcludeListStore.selectedTranferPlacements.indexOf(
                    opt.value as string
                  ),
                  1
                ),
            },
            { default: () => '✕' }
          ),
        ]
      )
    )
  )
}

const renderSourceTitle = () =>
  h('div', { class: 'text-xs text-gray-500' }, `Total ${count.value} items`)
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <n-divider v-if="!isAdGroup" />

  <div class="flex flex-col gap-4 w-full">
    <div
      v-if="props.FreezeData?.isAddorDuplicate()"
      :class="'w-full flex flex-col gap-2'"
    >
      <div v-if="isAdGroup" class="w-40 font-bold text-xs">
        Generate Placements
      </div>
      <div class="w-full flex items-center gap-2">
        <n-input
          placeholder="Please Input Generate Placements"
          v-model:value="googleExcludeListStore.textareaValueUrl"
          type="textarea"
          :rows="isAdGroup ? 3 : 5"
          class="fixed-textarea"
          @input="googleExcludeListStore.onUrlInput"
        />
        <n-button
          :type="isAdGroup ? 'error' : 'primary'"
          @click="googleExcludeListStore.generatePlacements"
          :loading="googleExcludeListStore.isGeneratePlacementsLoading"
          :disabled="googleExcludeListStore.textareaValueUrl === ''"
          class="whitespace-nowrap"
        >
          {{ isAdGroup ? 'Add' : 'Generate Placements' }}
        </n-button>
      </div>
    </div>

    <div class="w-full flex flex-col name-affect-comp gap-2">
      <div class="w-40 font-bold text-xs" v-if="isAdGroup">Placement</div>
      <div class="w-full flex items-center gap-2">
        <n-transfer
          class="transfer-wrapper-list-categories"
          v-model:value="googleExcludeListStore.selectedTranferPlacements"
          virtual-scroll
          :options="flatOptions as any "
          :render-source-list="renderSourceList"
          :render-target-list="renderTargetList"
          :source-title="renderSourceTitle"
        />
      </div>

      <div
        class="flex justify-end mt-3"
        v-if="googleExcludeListStore.isUpdatePage"
      >
        <n-button
          type="primary"
          :loading="googleExcludeListStore.isPlacementsLoading"
          @click="googleExcludeListStore.createPlacements"
          :disabled="
            googleExcludeListStore.selectedTranferPlacements.length === 0
          "
        >
          Create Placements
        </n-button>
      </div>
    </div>
  </div>

  <n-divider v-if="!isAdGroup" />

  <div v-if="googleExcludeListStore.isUpdatePage">
    <n-space class="mb-4">
      <n-button
        type="error"
        :disabled="googleExcludeListStore.checkedRowKeys.length === 0"
        @click="googleExcludeListStore.deletePlacements"
      >
        Delete Placements
      </n-button>
    </n-space>

    <ag-grid-vue
      :theme="customTheme"
      dom-layout="autoHeight"
      rowSelection="multiple"
      :column-defs="googleExcludeListStore.columns"
      :row-data="googleExcludeListStore.listPlacements"
      :row-key="googleExcludeListStore.rowKey"
      @selection-changed="googleExcludeListStore.onSelectionChanged"
      :default-col-def="googleExcludeListStore.defaultColDef"
      @sort-changed="googleExcludeListStore.onSortChanged"
    />

    <n-pagination
      v-model:page="googleExcludeListStore.paginationPlacements.page"
      v-model:page-size="googleExcludeListStore.paginationPlacements.size"
      show-size-picker
      class="bg-card py-3 justify-end items-center"
      :page-count="googleExcludeListStore.pageCount"
      :simple="false"
      :page-sizes="[10, 20, 30, 50, 100, 500]"
      :on-update:page="googleExcludeListStore.handlePageChange"
      :on-update:page-size="googleExcludeListStore.handlePageSizeChange"
    />
  </div>
</template>
<style lang="scss">
.transfer-wrapper-list-categories {
  .n-transfer-list--source {
    .n-transfer-list-header__extra,
    .n-transfer-list-header__button {
      display: none;
    }
  }
}

.ag-theme-alpine {
  --ag-icon-size: 12px;
}

.ag-checkbox-input-wrapper input,
.ag-checkbox-input-wrapper input {
  cursor: pointer;
}
span.ag-icon.ag-icon-desc,
span.ag-icon.ag-icon-asc {
  font-size: 16px;
}
.fixed-textarea :deep(textarea) {
  height: auto;
  max-height: calc(6 * 24px);
  overflow-y: auto;
  resize: none;
  line-height: 24px;
}
</style>
