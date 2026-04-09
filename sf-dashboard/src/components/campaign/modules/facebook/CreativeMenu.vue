<script setup lang="ts">
import ErrorIcon from '@/assets/icons/ErrorIcon.vue'
import MenuDots from '@/assets/icons/MenuDots.vue'
import Note from '@/assets/icons/Note.vue'
import { TS } from '@/enum/campaign'
import { useMenuCampaignStore } from '@/store/campaign/useMenuCampaign'
import {
  campaignTypeClass,
  creativeStruct,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { NDropdown, NIcon } from 'naive-ui'
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

  id: {
    type: String,
    required: false,
  },

  warning: {
    type: Object,
    required: false,
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

  source: {
    type: String,
    required: true,
  },
  modelValue: {
    type: Array as () => string[],
    default: () => [],
  },
})
const { adGroupIndex, creativeIndex } = toRefs(props.statusData)

const emit = defineEmits<{
  (e: 'selected', val: string[]): void
}>()

const isChecked = computed({
  get: () => {
    return props.modelValue.includes(props.keyActive)
  },
  set: (val: boolean) => {
    let newArr = [...props.modelValue]
    if (val) {
      if (!newArr.includes(props.keyActive)) {
        newArr.push(props.keyActive)
      }
    } else {
      newArr = newArr.filter((v) => v !== props.keyActive)
    }
    emit('selected', newArr)
  },
})

const isCompany = computed(() => window.arb.isCompany())
const isShowCheckbox = computed(
  () => props.campaign.traffic_source !== TS.GOOGLE
)
const isActiveClass = computed(() => {
  return props.keyActive === menuCampaignStore.activeKey
})

const currentAdGroup = computed(() => {
  if (
    !props.campaign?.ad_groups ||
    typeof adGroupIndex.value !== 'number' ||
    adGroupIndex.value < 0
  ) {
    return undefined
  }
  return props.campaign.ad_groups[adGroupIndex.value]
})

const menuOptions = computed(() => [
  {
    type: 'group',
    label: () =>
      h(
        'div',
        { class: 'font-bold text-black pb-1 pl-2' },
        'Actions for this ad'
      ),
    key: 'main',
    children: [
      {
        label: 'Duplicate',
        key: 'duplicate',
      },
      {
        label: 'Delete',
        key: 'delete',
        disabled: props.source === 'ad_creative',
      },
    ],
  },
])

const duplicateAdCreative = async () => {
  try {
    if (props.campaign?.IsMaxAdCreative?.()) {
      window.message.warning(
        'You have reached the maximum number of ad creatives'
      )
      return
    }

    if (
      typeof adGroupIndex.value !== 'number' ||
      typeof creativeIndex.value !== 'number' ||
      adGroupIndex.value < 0 ||
      creativeIndex.value < 0
    ) {
      console.error('Invalid index')
      return
    }

    const adGroup = currentAdGroup.value
    if (!adGroup) {
      console.error('Ad group not found')
      return
    }

    let creativeToDuplicate

    if (props.source === 'ad_creative') {
      creativeToDuplicate = adGroup.ad_creative?.[creativeIndex.value]
    } else {
      creativeToDuplicate = adGroup.creatives?.[creativeIndex.value] ?? null
    }

    if (!creativeToDuplicate) return

    const emptyCreative = helper.clone(creativeToDuplicate)

    emptyCreative.id = undefined
    emptyCreative.status = undefined

    // adGroup.creatives?.push(emptyCreative)
    changeNameDuplicate(emptyCreative)

    await helper.sleep(0)
  } catch {
    window.message.error('Failed to duplicate creative')
  }
}

const changeNameDuplicate = (adcreative: creativeStruct) => {
  const adGroup = currentAdGroup.value
  if (!adGroup) return

  if (!adGroup.creatives) adGroup.creatives = []

  const baseName = (adcreative.name ?? '').replace(/\s*\(Copy( \d+)?\)$/, '')

  let counter = 1
  let newName = `${baseName} (Copy)`

  while (adGroup.creatives.some((c) => c.name === newName)) {
    counter++
    newName = `${baseName} (Copy ${counter})`
  }

  adGroup.creatives.push({
    ...helper.clone(adcreative),
    name: newName,
  })
}

const handleDeleteCreative = () => {
  const index = creativeIndex.value as number
  if (index === -1) return

  const adGroup = currentAdGroup.value
  if (!adGroup) return

  if (props.source === 'creatives') {
    adGroup.creatives?.splice(index, 1)
    menuCampaignStore.selectedTabAdCreativePre()
  }
}

const handleSelect = async (key: string) => {
  if (key === 'duplicate') {
    duplicateAdCreative()
  }
  if (key === 'delete') {
    handleDeleteCreative()
  }
}
</script>

<template>
  <div
    class="flex justify-between items-center px-2"
    :class="[{ 'text-[#6b7280]': !isActiveClass }]"
  >
    <span
      class="flex grow items-center"
      :class="[
        isCompany && isShowCheckbox
          ? 'ml-3 max-w-[237px]'
          : 'ml-4 max-w-[233px]',
      ]"
    >
      <div class="flex items-center gap-2">
        <div class="w-4" v-if="isCompany && isShowCheckbox">
          <n-checkbox
            v-model:checked="isChecked"
            size="small"
            :disabled="props.source === 'ad_creative'"
          />
        </div>

        <div class="relative flex items-center justify-center group">
          <n-icon :component="Note" size="18" />
        </div>
        <n-ellipsis
          :style="{
            maxWidth: isCompany && isShowCheckbox ? '150px' : '210px',
          }"
        >
          <div v-if="props.id" class="flex gap-2 items-center">
            <span class="text-xs text-gray-500">{{ props.id }}</span>

            <span class="truncate">{{ label }}</span>
          </div>

          <span v-else class="truncate">{{ label }}</span>
        </n-ellipsis>
      </div>
    </span>
    <div class="flex items-center gap-1">
      <WarningCampaign :warning="warning" />

      <div class="h-5 w-5">
        <n-popover
          style="max-height: 140px"
          scrollable
          :show-arrow="false"
          trigger="hover"
          v-if="error"
        >
          <template #trigger>
            <div class="text-red-500 flex items-center gap-1">
              <n-icon :component="ErrorIcon" size="20" color="#EF4444" />
            </div>
          </template>
          <div class="whitespace-pre-line break-words max-w-xs">
            {{ error || '' }}
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
          v-if="campaign.traffic_source === TS.FACEBOOK"
        >
          <n-icon :component="MenuDots" class="ml-1" size="20" />
        </n-dropdown>
      </div>
    </div>
  </div>
</template>
