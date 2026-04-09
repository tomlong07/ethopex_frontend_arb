<script setup lang="ts">
import Grid4 from '@/assets/icons/Grid4.vue'
import MenuDots from '@/assets/icons/MenuDots.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import { CAMP_TYPE, TS } from '@/enum/campaign'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import useCampaignAddMultiple from '@/store/useCampaignAddMultiple'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { ModalAddMultipleAd } from '../../async'
import WarningCampaign from './WarningCampaign.vue'
const addMultipleStore = useCampaignAddMultiple()
const menuCampaignStore = useMenuCampaignStore()

const props = defineProps({
  keyActive: {
    type: String,
    required: true,
  },
  label: {
    type: String,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
  error: {
    type: String,
    required: true,
  },
  warning: {
    type: Object,
    required: false,
  },
})
const selectedAdGroup = computed(() => {
  const index = props.statusData.adGroupIndex

  if (!props.campaign.ad_groups) return null
  if (typeof index !== 'number' || index < 0) return null
  return props.campaign.ad_groups[index] || null
})

const isActiveClass = computed(() => {
  return props.keyActive === menuCampaignStore.activeKey
})
const isDisabled = computed(() => {
  const adGroups = props.campaign.ad_groups || []
  const hasSelected = !!selectedAdGroup.value?.id

  return adGroups.length === 1 || hasSelected
})

const disabledDuplicate = computed(() => {
  if (
    props.campaign.traffic_source === TS.GOOGLE &&
    props.campaign.campaign_type === CAMP_TYPE.PERFORMANCEMAX &&
    props.campaign.ad_groups &&
    props.campaign.ad_groups?.length > 0
  )
    return true

  return false
})

const menuOptions = computed(() => {
  switch (props.campaign.traffic_source) {
    case TS.GOOGLE:
      return [
        {
          type: 'group',
          label: () =>
            h(
              'div',
              { class: 'font-bold text-black pb-1 pl-2' },
              'Action for this ad set'
            ),
          key: 'main',
          children: [
            {
              label: 'Duplicate',
              key: 'duplicate',
              disabled: disabledDuplicate.value,
            },
            {
              label: 'Delete',
              key: 'delete',
              disabled: isDisabled.value,
            },
          ],
        },
      ]

    case TS.NEWSBREAK:
    case TS.TIKTOK:
      return [
        {
          type: 'group',
          label: () =>
            h(
              'div',
              { class: 'font-bold text-black pb-1 pl-2' },
              'Action for this ad set'
            ),
          key: 'main',
          children: [
            {
              label: 'Duplicate',
              key: 'duplicate',
              disabled: disabledDuplicate.value,
            },
            {
              label: 'Delete',
              key: 'delete',
              disabled: isDisabled.value,
            },
          ],
        },
      ]
    case TS.SNAPCHAT:
      return [
        {
          type: 'group',
          label: () =>
            h(
              'div',
              { class: 'font-bold text-black pb-1 pl-2' },
              'Action for this ad set'
            ),
          key: 'main',
          children: [
            {
              label: 'Duplicate',
              key: 'duplicate',
              disabled: disabledDuplicate.value,
            },
            {
              label: 'Delete',
              key: 'delete',
              disabled: isDisabled.value,
            },
          ],
        },
      ]

    default:
      return [
        {
          type: 'group',
          label: () =>
            h(
              'div',
              { class: 'font-bold text-black pb-1 pl-2' },
              'Action for this ad set'
            ),
          key: 'main',
          children: [
            {
              label: 'Duplicate',
              key: 'duplicate',
            },
            {
              label: 'Create Ad',
              key: 'create_ad',
            },
            {
              label: 'Create Multiple Ad',
              key: 'create_multiple_ad',
            },
            {
              label: 'Delete',
              key: 'delete',
              disabled: isDisabled.value,
            },
          ],
        },
      ]
  }
})

const handleDuplicateAdGroup = () => {
  if (props.campaign.IsMaxAdGroup()) {
    return window.message.warning('Maximum number of ad sets reached')
  }
  if (!selectedAdGroup.value) {
    return window.message.warning('Please select an ad group first')
  }
  if (props.campaign.IsTrafficTiktok() && props.campaign.IsSmart()) {
    window.message.warning('Only one adgroup when in smart mode')
    return
  }

  return props.campaign.DuplicateAdgroup2(selectedAdGroup.value)
}

const handleDeleteAdGroup = () => {
  const index = props.statusData.adGroupIndex as number
  if (selectedAdGroup.value?.id) {
    window.message.warning('Created ad sets cannot be deleted.')
    return
  }
  if (index === -1) return
  const adGroup = props.campaign.ad_groups

  if (adGroup) {
    adGroup?.splice(index, 1)
    props.statusData.adGroupIndex = undefined
    menuCampaignStore.updatePositionSelectedCreatives()
  }
}

const handleCreateAd = () => {
  const index = props.statusData.adGroupIndex as number
  if (index === -1) return
  if (selectedAdGroup.value)
    props.campaign.AddDefaultCreativeFB(selectedAdGroup.value)
}

const handleCreateMultipleAd = () => {
  addMultipleStore.changeShowModal(true)
  if (selectedAdGroup.value) {
    addMultipleStore.changeAdGroup(selectedAdGroup.value)
  }
  // addMultipleStore.changeOptionManager(fetchCreatives)
}

const handleSelect = (key: string) => {
  if (key === 'duplicate') {
    handleDuplicateAdGroup()
  }
  if (key === 'delete') {
    handleDeleteAdGroup()
  }
  if (key === 'create_ad') {
    handleCreateAd()
  }
  if (key === 'create_multiple_ad') {
    handleCreateMultipleAd()
  }
}
</script>
<template>
  <div
    class="flex justify-between items-center px-2"
    :class="[isActiveClass ? 'menu-highlight' : 'text-[#6b7280]']"
  >
    <span
      class="flex items-center gap-2 grow select-none max-w-[250px] ml-2 truncate"
      ><n-icon :component="Grid4" size="18" />
      <n-ellipsis style="max-width: 307px">
        {{ label }}
      </n-ellipsis>
      {{ selectedAdGroup?.error }}</span
    >

    <div class="flex items-center gap-1">
      <WarningCampaign :warning="warning" />
      <n-popover
        style="max-height: 240px"
        scrollable
        :show-arrow="false"
        trigger="hover"
        v-if="error"
      >
        <template #trigger>
          <div class="text-red-500 flex items-center gap-1">
            <n-icon :component="ReportGmailerrorredFilled" size="20" />
          </div>
        </template>
        <div class="whitespace-pre-line break-words max-w-xs">
          {{ error }}
        </div>
      </n-popover>
    </div>
    <div class="flex items-center justify-end">
      <div class="flex gap-2">
        <n-dropdown
          trigger="click"
          :options="menuOptions"
          @select="handleSelect"
        >
          <n-icon :component="MenuDots" class="ml-1" size="20" />
        </n-dropdown>
      </div>
    </div>
    <ModalAddMultipleAd v-if="campaign.IsTrafficFacebook()" />
  </div>
</template>

<style src="@/css/NavMenuFaceBook.scss" scoped></style>
