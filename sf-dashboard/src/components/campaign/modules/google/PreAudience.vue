<script setup lang="ts">
import type { TransferRenderSourceList, TreeOption } from 'naive-ui'
import { NTree, NCheckbox } from 'naive-ui'

import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { googleAudienceData } from '@/types/components/google-audience'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  audienceConfig: {
    type: Object as () => googleAudienceData,
    required: true,
  },
})

const isLoading = ref(false)

const PreAudienceOptions = ref<TreeOption[]>([])

const RootAudience = [
  'Affinity',
  'Detailed demographics',
  'Life events',
  'In-market',
]

const renderTreeLabel = (raw: TreeOption) => {
  const option = raw.option as TreeOption
  if (RootAudience.includes(option.label as string)) {
    return option.label
  }
  return h(
    'div',
    {
      class: 'flex gap-2 items-center',
      onClick: (e: MouseEvent) => handleLabelClick(e, option),
    },
    [
      h(NCheckbox, {
        checked: props.audienceConfig.demographics?.includes(
          option.value as string
        ),
      }),
      h('span', { class: 'cursor-pointer' }, option.label),

      option.children && option.children.length
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

//Lấy tất cả children của node, nhiều cấp
const gatherChildrenValues = (node: TreeOption) => {
  let values: string[] = []
  if (node.children && node.children.length) {
    node.children.forEach((child) => {
      values.push(child.value as string)
      values = values.concat(gatherChildrenValues(child))
    })
  }
  return values
}

const handleParentClick = (e: MouseEvent, option: TreeOption) => {
  if (!option.children || !option.children.length) {
    return
  }

  if (isDisabled.value) {
    return
  }

  const childrenValues = gatherChildrenValues(option)

  if (childrenValues.length) {
    const notFound = childrenValues.filter(
      (value) => !props.audienceConfig.demographics?.includes(value as string)
    )

    if (notFound.length) {
      props.audienceConfig.demographics?.push(...notFound)
    } else {
      if (props.audienceConfig.demographics) {
        props.audienceConfig.demographics =
          props.audienceConfig.demographics?.filter(
            (value) => !childrenValues.includes(value)
          )
      }
    }
  }
}

const handleLabelClick = (e: MouseEvent, option: TreeOption) => {
  //Loại trừ nút All
  if (
    !e.target ||
    (e.target as HTMLElement).classList.contains('button-all') ||
    (e.target as HTMLElement).closest('button-all')
  ) {
    return
  }

  if (isDisabled.value) {
    return
  }
  if (props.audienceConfig.demographics?.includes(option.value as string)) {
    props.audienceConfig.demographics.splice(
      props.audienceConfig.demographics.indexOf(option.value as string),
      1
    )
  } else {
    props.audienceConfig.demographics?.push(option.value as string)
  }
}

interface Option {
  label: string
  value: string
  children?: Option[]
}
function flattenTree(list: undefined | Option[]): Option[] {
  const result: Option[] = []
  function flatten(_list: Option[] = []) {
    _list.forEach((item) => {
      result.push(item)
      flatten(item.children)
    })
  }
  flatten(list)
  return result
}

// const treeData = ref()
const renderSourceList: TransferRenderSourceList = function ({
  onCheck,
  pattern,
}) {
  return h(NTree, {
    style: 'margin: 0 4px;',
    keyField: 'value',
    class: 'transfer-wrapper-list',
    // checkable: true,
    selectable: false,
    blockLine: true,
    checkOnClick: true,
    data: PreAudienceOptions.value,
    pattern,
    checkedKeys: props.audienceConfig.demographics,
    renderLabel: ((option: TreeOption) => renderTreeLabel(option)) as any,

    onUpdateCheckedKeys: (checkedKeys: Array<string | number>) => {
      const newValues = checkedKeys.filter(
        (value) => !RootAudience.includes(value as string)
      )
      onCheck(newValues)
    },
  })
}

const fetchPreAudienceOptions = async () => {
  isLoading.value = true
  await ctr_traffic_source.GetAllDemographics()

  isLoading.value = false
}

const cookdata = (data: any) => {
  const result = {
    affinity: [] as any[],
    detailed: [] as any[],
    in_market: [] as any[],
    life_event: [] as any[],
  }

  data.forEach((item: any) => {
    if (item.type === 'affinity') {
      result.affinity.push(item)
    } else if (item.type === 'detailed') {
      result.detailed.push(item)
    } else if (item.type === 'in_market') {
      result.in_market.push(item)
    } else if (item.type === 'life_event') {
      result.life_event.push(item)
    }
  })
  return result
}

onMounted(async () => {
  handlePreAudienceOptions(await ctr_traffic_source.GetAllDemographics())
})

const handlePreAudienceOptions = (audienceResult: any) => {
  PreAudienceOptions.value = []
  //sclss: LifeStyles
  //shps: Shoppers
  //vacs: Visitor
  if (!audienceResult?.status || !audienceResult?.data) {
    return
  }

  audienceResult = cookdata(audienceResult.data)

  miniHandle(audienceResult, {
    keyResult: 'affinity',
    keyPre: 'affinity',
    keyData: 'affinity',
    keyParent: 'Affinity',
  })

  miniHandle(audienceResult, {
    keyResult: 'detailed',
    keyPre: 'detailed',
    keyData: 'detailed',
    keyParent: 'Detailed demographics',
  })

  miniHandle(audienceResult, {
    keyResult: 'life_event',
    keyPre: 'VAlife_eventC',
    keyData: 'life_event',
    keyParent: 'Life events',
  })
  miniHandle(audienceResult, {
    keyResult: 'in_market',
    keyPre: 'in_market',
    keyData: 'in_market',
    keyParent: 'In-market',
  })
}

const miniHandle = (
  audienceResult: any,
  opts: {
    keyResult: string
    keyPre: string
    keyData: string
    keyParent: string
  }
) => {
  if (
    !opts.keyResult ||
    !opts.keyPre ||
    !opts.keyData ||
    !opts.keyParent ||
    !audienceResult?.[opts.keyResult]
  ) {
    return
  }

  PreAudienceOptions.value.push({
    label: opts.keyParent,
    value: opts.keyParent,
    children: [],
  })

  const indexInOption = findIndexOptionByKey(
    PreAudienceOptions.value,
    opts.keyParent
  )
  if (indexInOption === -1) {
    console.error("Please check again keyParent doesn't exist")

    return
  }

  PreAudienceOptions.value[indexInOption].children = convertToTree(
    audienceResult?.[opts.keyResult],
    opts.keyPre,
    opts.keyData
  )
}

const convertToTree = (data: any, keyPre: string, keyData: string) => {
  if (!data || !keyPre || !keyData) {
    return []
  }

  const map: any = {}

  // Chuyển đổi rawData thành map để dễ dàng truy cập các node
  data.forEach((row: any) => {
    map[row.segment_id] = {
      value: Number(row.id),
      label: row.name,
      type: row.type,
      children: [],
    }
  })

  // Mảng để lưu trữ các node gốc (root nodes)
  const rootNodes: any = []

  // Duyệt qua dữ liệu để xây dựng cây
  data.forEach((row: any) => {
    const currentData = map[row.segment_id]
    if (!row.parent) {
      // Nếu parent_id là null, là node gốc
      rootNodes.push(currentData)
    } else {
      // Nếu có parent_id, thêm vào children của parent
      const parentData = map[row.parent]
      if (parentData) {
        parentData.children.push(currentData)
      }
    }
  })

  // Hàm đệ quy loại bỏ thuộc tính children nếu nó rỗng
  const removeEmptyChildren = (node: any) => {
    if (node.children.length === 0) {
      node.children = undefined
    } else {
      node.children.forEach(removeEmptyChildren)
    }
  }

  rootNodes.forEach(removeEmptyChildren)

  return rootNodes
}

const findIndexOptionByKey = (option: TreeOption[], value: string) => {
  return option.findIndex((element) => element.value === value)
}

defineExpose({
  fetchPreAudienceOptions,
})

const isDisabled = computed(() => {
  return false
})

const name = 'Interests & detailed demographics'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-spin :show="isLoading">
      <n-transfer
        v-model:value="props.audienceConfig.demographics"
        :options="flattenTree(PreAudienceOptions as unknown as Option[])"
        virtual-scroll
        :render-source-list="renderSourceList"
        style="height: 450px"
        :disabled="isDisabled"
        class="transfer-parent-audience"
      />
    </n-spin>
  </FloatingWrapper>
</template>
