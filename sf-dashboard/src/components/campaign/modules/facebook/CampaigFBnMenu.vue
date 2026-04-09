<script setup lang="ts">
import Folder from '@/assets/icons/Folder.vue'
import MenuDots from '@/assets/icons/MenuDots.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import { CAMP_TYPE, TS } from '@/enum/campaign'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import {
  adGroups,
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import WarningCampaign from './WarningCampaign.vue'
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
// const isDisabled = computed(() => props.campaign.ad_groups?.length === 1)
const isActiveClass = computed(() => {
  return props.keyActive === menuCampaignStore.activeKey
})

const disabledCreateAdSet = computed(() => {
  if (
    props.campaign.traffic_source === TS.GOOGLE &&
    props.campaign.campaign_type === CAMP_TYPE.PERFORMANCEMAX &&
    props.campaign.ad_groups &&
    props.campaign.ad_groups?.length > 0
  )
    return true

  return false
})

const menuOptions = computed(() => [
  {
    type: 'group',
    label: () =>
      h(
        'div',
        { class: 'font-bold text-black pb-1 pl-2' },
        'Actions for this campaign'
      ),
    key: 'main',
    children: [
      {
        label: 'Create ad set',
        key: 'createAdSet',
        disabled: disabledCreateAdSet.value,
      },
    ],
  },
])

const generateUniqueName = (
  baseName: string,
  adGroups: adGroups[],
  counter = 1
): string => {
  let newName = counter > 1 ? `${baseName} ${counter}` : baseName

  const isExist = adGroups.some((adgroup) => adgroup.name === newName)

  if (isExist) {
    return generateUniqueName(baseName, adGroups, counter + 1)
  }
  return newName
}

const handleAddAdGroup = () => {
  if (props.campaign.IsPMax()) return

  props.campaign.ad_groups ||= []

  const { traffic_source, ad_groups } = props.campaign
  let baseName = traffic_source === TS.FACEBOOK ? 'Ad set' : 'Ad Group'
  let uniqueName = generateUniqueName(baseName, ad_groups, ad_groups.length + 1)
  console.log(traffic_source)

  switch (traffic_source) {
    case TS.FACEBOOK:
      props.campaign.AddDefaultAdgroupFB(uniqueName)
      break

    case TS.GOOGLE:
      props.campaign.AddDefaultAdgroup(uniqueName)
      break

    case TS.TIKTOK:
      if (props.campaign.IsSmart() && props.campaign.IsTrafficTiktok()) {
        if (ad_groups.length > 0) {
          ad_groups.splice(1) // Xóa từ index 1 đến hết
          window.message.warning('Only one adgroup when in smart mode')
          return
        }
      }
      props.campaign.AddDefaultAdgroupTT(uniqueName)
      break

    case TS.NEWSBREAK:
      if (props.campaign.IsAPI()) {
        props.campaign.AddDefaultAdgroupNewsbreak(uniqueName)
      }
      break
    case TS.SNAPCHAT:
      console.log('Snapchat add adgroup')
      props.campaign.AddDefaultAdgroupSnapChat(uniqueName)
      break
  }
}

const handleSelect = (key: string) => {
  if (key === 'createAdSet') {
    handleAddAdGroup()
  }
}
</script>

<template>
  <div
    class="flex justify-between items-center m-0 px-2"
    :class="[isActiveClass ? 'menu-highlight ' : 'text-[#6b7280]']"
  >
    <span
      class="flex items-center gap-2 grow select-none max-w-[250px] truncate"
      ><n-icon :component="Folder" size="18" />
      <n-ellipsis style="max-width: 320px">{{ label }}</n-ellipsis>
    </span>

    <div class="flex items-center" v-if="!props.campaign.IsRareTrafficSource()">
      <div class="flex gap-1">
        <WarningCampaign :warning="warning" />
        <n-popover
          style="max-height: 240px"
          scrollable
          trigger="hover"
          :show-arrow="false"
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
  </div>
</template>

<style src="@/css/NavMenuFaceBook.scss" scoped></style>
