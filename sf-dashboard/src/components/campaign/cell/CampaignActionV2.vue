<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Clone from '@/assets/icons/Clone.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import TrashOutline from '@/assets/icons/TrashOutline.vue'

import campaignIs from '@/composables/campaign-action'

import useCopyCampaignStore from '@/store/useCopyCampaignStore'
import { ActionInfo, ColumnItem } from '@/types/state/general'

import { useTemplateV2 } from '@/store/templateV2Store'
import duplicateChangeCampaignType from '@/store/campaign/duplicateChangeCampaignType'
import { computed, h } from 'vue'
import { NDropdown, NIcon, SelectOption } from 'naive-ui'
import BarChart from '@/assets/icons/BarChart.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import CC_Circle from '@/assets/icons/CC_Circle.vue'
import Journals from '@/assets/icons/Journals.vue'
import Ellipsis from '@/assets/icons/Ellipsis.vue'
import { ONOFF, TS } from '@/enum/campaign'
const templateV2Store = useTemplateV2(helper.truePath())()

const copyCampaignStore = useCopyCampaignStore()
const duplicateChangeCampaignTypeStore = duplicateChangeCampaignType()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams | any,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const actionInfo = options?.actionInfo || []

const actionInfoInThisRow = computed(() => {
  const res: ActionInfo[] = []
  const traffic = props.params.data?.traffic_source
  const campaignType = props.params.data?.campaign_type

  for (const act of actionInfo ?? []) {
    if (act.condition === 'traffic_source') {
      if (!templateV2Store.trafficOptionAccept.includes(traffic)) continue
    }

    if (act.accepts && !act.accepts.includes(traffic)) continue

    if (act.condition === 'campaign_type') {
      if (!act.campaign_type_accepts?.includes(campaignType)) continue
    }

    res.push(act)
  }

  return res
})

const onDelete = async (deleteUrl: string) => {
  if (!deleteUrl) return
  const text = `Are you sure you want to delete campaign ${props.params.data?.name}?`
  const confirm = window.confirm(text)
  if (confirm) {
    const payload = {
      id: props.params.data.id,
    }
    const result = await ctr_campaign.RemoveCampaignV2(deleteUrl, payload)
    if (result?.status) {
      let selectedNode = props.params.node
      let selectedData = selectedNode.data
      ;(props.params.api as any).applyTransaction({ remove: [selectedData] })
      window.message.success('Delete campaign successfully')
    }
    return
  }
  window.message.info('Action delete campaign is canceled')
}
const onClone = async (url: string) => {
  if (!props.params.data.id || !url) return

  campaignIs.cloneActionV2(
    props.params.data.id as number,
    window.message,
    props.params.data?.traffic_source,
    '',
    url
  )
}

const onCopy = () => {
  copyCampaignStore.changeModalCopyCampaignV2(true, props.params.data)
}

const urlNow = (item: ActionInfo) => {
  if (!item.url || !props.params.data) return undefined

  const thisTS = templateV2Store.trafficOptions?.find(
    (x) => x.value === props.params.data?.traffic_source
  )

  // const isGeneral = thisTS?.is_general === ONOFF.ON || false
  //Tạm xong làm cơ chế sau
  const isGeneral =
    [TS.PINTEREST, TS.ARB_TRAFFIC, TS.TWITTER, TS.REDDIT].includes(
      thisTS?.value as TS
    ) || false
  let res = item.url
  if (isGeneral) res = res.replace(`{traffic_source}`, 'general')

  res = res.replace(
    /{(\w+)}/g,
    (_, key) => props.params.data[key] ?? `{${key}}`
  )

  if (item.plusCondition && item.plusQuery) {
    const traffic = props.params.data?.traffic_source
    if (item.plusCondition.includes(traffic)) {
      res += res.includes('?') ? '&' : '?'
      res += item.plusQuery
    }
  }

  if (res.includes(TS.PINTEREST)) {
    res = res.replaceAll(TS.PINTEREST, 'general')
  }

  return res
}

const onDuplicateChangeCampaignType = () => {
  if (!props.params.data.id) return

  duplicateChangeCampaignTypeStore.showModal = true
  duplicateChangeCampaignTypeStore.campaignOriginal = props.params.data.id
}
const editActions = computed(() => {
  return actionInfoInThisRow.value.filter((item) => item.icon === 'edit')
})
const otherActions = computed(() => {
  return actionInfoInThisRow.value.filter((item) => item.icon !== 'edit')
})

const handleAction = (item: ActionInfo) => {
  if (item.url || !item.action) return

  switch (true) {
    case item.delete:
      onDelete(item.action)
      break
    case item.clone:
      onClone(item.action)
      break

    case item.copy:
      onCopy()
      break

    case item.campaign_type:
      onDuplicateChangeCampaignType()
      break
  }
}

const dropdownOptions = computed(() =>
  (otherActions.value ?? []).map((item) => ({
    key: item.title,
    label: () =>
      h('div', { class: 'flex items-center gap-2' }, [
        h(NIcon, { size: 16 }, { default: () => getIcon(item.icon) }),
        h('span', item.title),
      ]),
  }))
)

const getIcon = (iconName: string) => {
  const iconMap = {
    duplicate: DuplicateOutline,
    duplicateV2: Journals,
    delete: TrashOutline,
    clone: Clone,
    copy: CC_Circle,
    campaign_type: CC_Circle,
  } as const

  return iconName in iconMap
    ? h(iconMap[iconName as keyof typeof iconMap])
    : null
}

const handleDropdownSelect = (key: string) => {
  const item = otherActions.value.find((action) => action.title === key)
  if (!item) return

  if (item.url) {
    window.open(urlNow(item), '_blank')
  } else {
    handleAction(item)
  }
}

const handleClick = (value: any) => {
  window.open(
    `/?profile_id=${value}&campaigns=${props.params.data?.id}`,
    '_blank'
  )
}

const renderLabel = (option: SelectOption) => {
  return h(
    'div',
    {
      class: 'flex items-center justify-between w-full gap-4',
    },
    [
      h(
        'span',
        {
          class: 'truncate max-w-[200px] overflow-hidden text-ellipsis',
        },
        option.label as string
      ),
      h(
        'span',
        {
          class: 'ml-auto text-xs text-gray-400',
        },
        option.value != -2 ? String(option.value) : ''
      ),
    ]
  )
}

const handleSingleAction = (item: any) => {
  if (item.url) {
    window.open(urlNow(item), '_blank')
  } else {
    handleAction(item)
  }
}
</script>

<template>
  <div class="flex w-full h-full items-center">
    <template v-for="(item, index) in editActions" :key="index">
      <component
        :is="item.url ? 'router-link' : 'div'"
        :to="urlNow(item)"
        :href="urlNow(item)"
        @click="handleAction(item)"
      >
        <n-icon
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 !mt-0"
          :title="item.title"
          size="35"
        >
          <Settings20Regular />
        </n-icon>
      </component>
    </template>

    <n-popselect
      :options="templateV2Store.profileShow"
      :on-update:value="handleClick"
      scrollable
      :render-label="renderLabel"
      v-if="templateV2Store.profileShow?.length > 1"
    >
      <n-icon
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 !mt-0"
        :component="BarChart"
        size="35"
      ></n-icon>
    </n-popselect>

    <a
      target="_blank"
      v-else
      :href="`/?plk=${props.params.data.plk}`"
      title="Open report in new tab"
    >
      <n-icon
        :component="BarChart"
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 !mt-0"
      ></n-icon>
    </a>

    <n-dropdown
      v-if="otherActions?.length > 1"
      trigger="click"
      :options="dropdownOptions"
      @select="handleDropdownSelect"
    >
      <n-icon
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 !mt-0"
        size="35"
        :title="'More actions'"
      >
        <Ellipsis />
      </n-icon>
    </n-dropdown>

    <n-popover trigger="hover" v-else-if="otherActions?.length === 1">
      <template #trigger>
        <n-button
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 !mt-0"
          quaternary
          @click="handleSingleAction(otherActions[0])"
        >
          <n-icon size="20">
            <component :is="getIcon(otherActions[0].icon)" />
          </n-icon>
        </n-button>
      </template>
      {{ otherActions[0].title }}
    </n-popover>
  </div>
</template>
