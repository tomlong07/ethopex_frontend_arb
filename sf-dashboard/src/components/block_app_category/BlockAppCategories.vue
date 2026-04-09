<script lang="ts" setup>
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
import {
  NButton,
  NCheckbox,
  NEmpty,
  NTree,
  TransferOption,
  TransferRenderSourceList,
  TreeOption,
} from 'naive-ui'
import { VNodeChild } from 'vue'

const blockAppCategoryStore = useBlockAppCategory()
const name = `Placement exclusions`

const handleLabelClick = (e: MouseEvent, option: TreeOption) => {
  //Loại trừ nút All
  if (
    !e.target ||
    (e.target as HTMLElement).classList.contains('button-all') ||
    (e.target as HTMLElement).closest('button-all')
  ) {
    return
  }

  if (option.isNotShow) {
    const target = e.target as HTMLElement
    target
      ?.closest('.n-tree-node')
      ?.querySelector('.n-tree-node-switcher')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))

    return
  }

  if (
    blockAppCategoryStore.blockAppCategoryData.categories?.includes(
      option.value as string
    )
  ) {
    blockAppCategoryStore.blockAppCategoryData.categories.splice(
      blockAppCategoryStore.blockAppCategoryData.categories.indexOf(
        option.value as string
      ),
      1
    )
  } else {
    blockAppCategoryStore.blockAppCategoryData.categories?.push(
      option.value as string
    )
  }
}

//Lấy tất cả children của node, nhiều cấp
const gatherChildrenValues = (node: TreeOption) => {
  let values: string[] = []
  if (node.children && node.children.length) {
    node.children.forEach((child) => {
      if (!child.isNotShow) {
        values.push(child.value as string)
      }

      values = values.concat(gatherChildrenValues(child))
    })
  }
  return values
}

const handleParentClick = (e: MouseEvent, option: TreeOption) => {
  if (!option.children?.length) {
    return
  }

  const childrenValues = gatherChildrenValues(option)

  if (childrenValues.length) {
    const notFound = childrenValues.filter(
      (value) =>
        !blockAppCategoryStore.blockAppCategoryData.categories?.includes(
          value as string
        )
    )

    if (notFound.length) {
      blockAppCategoryStore.blockAppCategoryData.categories?.push(...notFound)
    } else {
      if (blockAppCategoryStore.blockAppCategoryData.categories) {
        blockAppCategoryStore.blockAppCategoryData.categories =
          blockAppCategoryStore.blockAppCategoryData.categories?.filter(
            (value: any) => !childrenValues.includes(value)
          )
      }
    }
  }
}

const renderTreeLabel = (raw: TreeOption) => {
  const option = raw.option as TreeOption

  if (!option.value) {
    return option.label
  }

  return h(
    'div',
    {
      class: 'flex gap-2 items-center',
      onClick: (e: MouseEvent) => handleLabelClick(e, option),
    },
    [
      option.isNotShow
        ? null
        : h(NCheckbox, {
            checked:
              blockAppCategoryStore.blockAppCategoryData.categories?.includes(
                option.value as string
              ),
          }),
      h('span', { class: 'cursor-pointer' }, option.label),

      option.isNotShow
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
const renderSourceList: TransferRenderSourceList = function ({
  onCheck,
  pattern,
}) {
  return h(NTree, {
    style: 'margin: 0 4px;',
    keyField: 'value',
    // checkable: true,
    selectable: false,
    blockLine: true,
    checkOnClick: true,
    data: blockAppCategoryStore.categoryForShow as unknown as TreeOption[],
    pattern,
    renderLabel: ((option: TreeOption) => renderTreeLabel(option)) as any,
    checkedKeys: blockAppCategoryStore.blockAppCategoryData.categories,
    onUpdateCheckedKeys: (checkedKeys: Array<string | number>, option: any) => {
      onCheck(checkedKeys)
    },
  })
}
function flattenTree(list: undefined | any[]): any[] {
  const result: any[] = []
  function flatten(_list: any[] = []) {
    _list.forEach((item) => {
      result.push(item)
      flatten(item.children)
    })
  }
  flatten(list)
  return result
}
const count = ref(0)
const flatOptions = ref<TransferOption[]>([])

onMounted(async () => {
  await blockAppCategoryStore.fetchCategories()

  flatOptions.value = flattenTree(blockAppCategoryStore.categoryForShow)

  count.value = flatOptions.value.filter((item: any) => !item.isNotShow).length

  try {
    document
      .querySelector('.n-tree-node-switcher')
      ?.dispatchEvent(new MouseEvent('click', { bubbles: true }))
  } catch {}
})

const renderSourceTitle = () => {
  const text = blockAppCategoryStore.categoryLoading
    ? 'Loading...'
    : `Total ${count.value} items`

  return h('div', { class: 'text-xs text-gray-500' }, text)
}

// const renderTagetTitle = () => {
//   const text = blockAppCategoryStore.categoryLoading
//     ? 'Loading...'
//     : `${blockAppCategoryStore.blockAppCategoryData.categories?.length} items selected`

//   return h('div', { class: 'text-xs text-gray-500' }, text)
// }

const renderTargetList: TransferRenderSourceList = (props: {
  onCheck: (checkedValueList: Array<string | number>) => void
  checkedOptions: TransferOption[]
  pattern: string
}): VNodeChild => {
  const { checkedOptions, pattern } = props

  const filteredOptions = checkedOptions.filter((opt) =>
    opt.label.toString().toLowerCase().includes(pattern.toLowerCase())
  )

  if (!filteredOptions.length) {
    return h(NEmpty, { description: 'No Data' })
  }

  return h(
    'div',
    { class: 'p-2 space-y-2' },
    filteredOptions.map((option: any) =>
      h(
        'div',
        {
          class:
            'group flex items-center px-2 py-1 rounded hover:bg-gray-50 transition-colors flex',
        },
        [
          h('div', { class: 'flex flex-col' }, [
            h(
              'span',
              { class: 'text-xs text-gray-500' },
              option.store +
                (option.parent_category ? ` > ${option.parent_category}` : '')
            ),
            h('span', {}, option.label),
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
                blockAppCategoryStore.blockAppCategoryData.categories?.splice(
                  blockAppCategoryStore.blockAppCategoryData.categories.indexOf(
                    option.value as string
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
</script>

<template>
  <n-card class="card-flex-gap-4"
    ><template #header>
      <div class="text-sm font-bold">{{ name }}</div>
      <n-divider class="!mt-1" />

      <div class="text-xs text-gray-500">Exclude placements on App</div>
    </template>

    <n-transfer
      class="transfer-wrapper-list-categories"
      style="height: 500px"
      v-model:value="blockAppCategoryStore.blockAppCategoryData.categories"
      virtual-scroll
      :options="flatOptions"
      :render-source-list="renderSourceList"
      :render-target-list="renderTargetList"
      :source-title="renderSourceTitle"
    />
  </n-card>
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
</style>
