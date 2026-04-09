<script setup lang="ts">
import type { TransferRenderSourceList, TreeOption } from 'naive-ui'
import { NTree, NCheckbox } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'

import {
  Option,
  flattenTree,
} from '@/components/campaign/modules/snapchat/helpers'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isLoading = ref(false)

const PreAudienceOptions = ref<TreeOption[]>([])

const RootAudience = ['Lifestyles', 'Shoppers', 'Visitor']

const renderTreeLabel = (raw: TreeOption) => {
  const option = raw.option as TreeOption
  if (!option.id) {
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
        checked: props.campaign.snapchat_audience?.pre_audience?.includes(
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
      (value) =>
        !props.campaign.snapchat_audience?.pre_audience?.includes(
          value as string
        )
    )

    if (notFound.length) {
      props.campaign.snapchat_audience?.pre_audience?.push(...notFound)
    } else {
      if (props.campaign.snapchat_audience?.pre_audience) {
        props.campaign.snapchat_audience.pre_audience =
          props.campaign.snapchat_audience?.pre_audience?.filter(
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
  if (
    props.campaign.snapchat_audience?.pre_audience?.includes(
      option.value as string
    )
  ) {
    props.campaign.snapchat_audience?.pre_audience.splice(
      props.campaign.snapchat_audience?.pre_audience.indexOf(
        option.value as string
      ),
      1
    )
  } else {
    props.campaign.snapchat_audience?.pre_audience?.push(option.value as string)
  }
}

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
    checkedKeys: props.campaign.snapchat_audience?.pre_audience,
    renderLabel: ((option: TreeOption) => renderTreeLabel(option)) as any,

    onUpdateCheckedKeys: (checkedKeys: Array<string | number>, option: any) => {
      const newValues = checkedKeys.filter(
        (value) => !RootAudience.includes(value as string)
      )
      onCheck(newValues)
    },
  })
}

const fetchPreAudienceOptions = async () => {
  if (
    !props.campaign.account_supply_id ||
    !props.campaign.location?.value ||
    !props.campaign.location?.value.length
  ) {
    return
  }
  return // a Quyết bảo tạm thời bỏ

  isLoading.value = true
  const audienceResult = await ctr_traffic_source.GetInfoAudience({
    account_id: props.campaign.account_supply_id,
    traffic_source: 'snapchat',
    countries: props.campaign.location?.value,
  })

  handlePreAudienceOptions(audienceResult)

  isLoading.value = false
}

const handlePreAudienceOptions = (audienceResult: any) => {
  PreAudienceOptions.value = []
  //sclss: LifeStyles
  //shps: Shoppers
  //vacs: Visitor
  if (!audienceResult?.status || !audienceResult?.data) {
    return
  }

  miniHandle(audienceResult, {
    keyResult: 'sclss',
    keyPre: 'SLC',
    keyData: 'scls',
    keyParent: 'Lifestyles',
  })

  miniHandle(audienceResult, {
    keyResult: 'shps',
    keyPre: 'SHP',
    keyData: 'shp',
    keyParent: 'Shoppers',
  })

  miniHandle(audienceResult, {
    keyResult: 'vacs',
    keyPre: 'VAC',
    keyData: 'vac',
    keyParent: 'Visitor',
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
    !audienceResult?.data[opts.keyResult]
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
    audienceResult?.data[opts.keyResult],
    opts.keyPre,
    opts.keyData
  )
}

const convertToTree = (data: any, keyPre: string, keyData: string) => {
  if (!data || !keyPre || !keyData) {
    return []
  }

  const idToNodeMap = new Map()
  const rootNodes: any[] = []
  const keyZero = `${keyPre}_0`

  // Tạo các node từ dữ liệu
  data.forEach((item: any) => {
    const node = Object.assign(item[keyData], {
      label: item[keyData].name,
      value: item[keyData].id,
      children: [],
    })
    idToNodeMap.set(item[keyData].id, node)

    if (item[keyData].parentId === keyZero) {
      rootNodes.push(node)
    } else {
      const parentNode = idToNodeMap.get(item[keyData].parentId)
      if (parentNode) {
        parentNode.children.push(node)
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

onMounted(async () => {
  if (props.campaign.IsSnapNeedAudience()) {
    fetchPreAudienceOptions()
  }
})

watch(
  () => props.campaign.IsSnapNeedAudience(),
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (props.campaign.snapchat_audience) {
      if (!props.campaign.snapchat_audience?.pre_audience) {
        props.campaign.snapchat_audience.pre_audience = []
      }
    }

    if (newValue) {
      // fetchPreAudienceOptions()
    } else {
      if (props.campaign.snapchat_audience) {
        props.campaign.snapchat_audience.pre_audience = []
      }
    }
  }
)

watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (props.campaign.IsSnapNeedAudience()) {
      if (props.campaign.snapchat_audience) {
        props.campaign.snapchat_audience.pre_audience = []
      }

      fetchPreAudienceOptions()
    }
  }
)

watch(
  () => props.campaign.location?.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (props.campaign.IsSnapNeedAudience()) {
      if (props.campaign.snapchat_audience) {
        props.campaign.snapchat_audience.pre_audience = []
      }

      fetchPreAudienceOptions()
    }
  }
)

defineExpose({
  fetchPreAudienceOptions,
})

const isDisabled = computed(() => {
  return (
    props.FreezeData.isClonePage(props.campaign) ||
    props.FreezeData.isEditPage() ||
    !props.campaign?.account_supply_id ||
    !props.campaign?.location?.value
  )
})

const name = 'Predefined Audiences'
</script>

<template>
  <div
    class="flex items-center"
    v-if="
      props.campaign.IsSnapNeedAudience() && props.campaign.snapchat_audience
    "
  >
    <div class="w-1/6 font-bold">{{ name }}</div>
    <div class="w-5/6">
      <n-spin :show="isLoading">
        <n-transfer
          v-model:value="props.campaign.snapchat_audience.pre_audience"
          :options="flattenTree(PreAudienceOptions as unknown as Option[])"
          virtual-scroll
          :render-source-list="renderSourceList"
          style="height: 450px"
          :disabled="isDisabled"
          class="transfer-parent-audience"
        />
      </n-spin>
    </div>
  </div>
</template>
