<script setup lang="ts">
import { NTree, NCheckbox } from 'naive-ui'
import type { TransferRenderSourceList, TreeOption } from 'naive-ui'

import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'

import {
  Option,
  flattenTree,
} from '@/components/campaign/modules/snapchat/helpers'

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
const CustomAudienceOptions = ref<TreeOption[]>([])
const itemsLength = ref(0)

const fetchCustomAudienceOptions = async () => {
  if (!props.campaign.account_supply_id) {
    return
  }
  isLoading.value = true
  const audienceResult = await api_v2.request({
    url: 'audience',
    data: {
      filter: {
        account_id: props.campaign.account_supply_id,
        traffic_source: 'snapchat',
      },
    },
  })

  await helper.sleep(5000)

  CustomAudienceOptions.value = []
  itemsLength.value = 0

  if (audienceResult?.status) {
    handleByGroup(audienceResult?.data?.items || [])
  }

  isLoading.value = false
}

const handleByGroup = (data: any[]) => {
  if (!data || !data.length) {
    return
  }
  itemsLength.value = data.length

  let foundType = new Map()

  data.forEach((element) => {
    if (!foundType.has(element.type)) {
      const node = {
        label:
          helper.capitalizeFirstLetter(element.type.toLowerCase()) +
          ' Audience',
        value: element.type,
        children: [],
      }
      foundType.set(element.type, node)
      RootAudience.value?.push(element.type)
      CustomAudienceOptions.value.push(node)
    }

    const parentNode = foundType.get(element.type)
    if (parentNode) {
      parentNode.children.push({
        label: element.name,
        value: element.id,
        id: element.id,
      })
    }
  })
}

onMounted(async () => {
  if (props.campaign.IsSnapNeedAudience()) {
    fetchCustomAudienceOptions()
  }
})

watch(
  () => props.campaign.IsSnapNeedAudience(),
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (newValue) {
      fetchCustomAudienceOptions()
    } else {
      if (props.campaign.snapchat_audience) {
        props.campaign.snapchat_audience.audience = []
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

    fetchCustomAudienceOptions()

    if (props.campaign.snapchat_audience) {
      props.campaign.snapchat_audience.audience = []
    }
  }
)

const RootAudience = ref<number[]>()

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
    data: CustomAudienceOptions.value,
    pattern,
    checkedKeys: props.campaign.snapchat_audience?.audience,
    renderLabel: ((option: TreeOption) => renderTreeLabel(option)) as any,

    onUpdateCheckedKeys: (checkedKeys: Array<string | number>, option: any) => {
      const newValues = checkedKeys.filter(
        (value) => !RootAudience.value?.includes(value as number)
      )
      onCheck(newValues)
    },
  })
}

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
        checked: props.campaign.snapchat_audience?.audience?.includes(
          option.value as number
        ),
      }),
      h('span', { class: 'cursor-pointer' }, option.label),
    ]
  )
}

const handleLabelClick = (e: MouseEvent, option: TreeOption) => {
  if (isDisabled.value) {
    return
  }

  if (
    props.campaign.snapchat_audience?.audience?.includes(option.value as number)
  ) {
    props.campaign.snapchat_audience?.audience.splice(
      props.campaign.snapchat_audience?.audience.indexOf(
        option.value as number
      ),
      1
    )
  } else {
    props.campaign.snapchat_audience?.audience?.push(option.value as number)
  }
}

const isDisabled = computed(() => {
  return (
    props.FreezeData.isClonePage(props.campaign) ||
    props.FreezeData.isEditPage() ||
    !props.campaign?.account_supply_id
  )
})

const name = 'Custom Audiences'
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
          v-model:value="props.campaign.snapchat_audience.audience"
          :options="flattenTree(CustomAudienceOptions as unknown as Option[])"
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
