<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import {
  PLACEMENT_TYPE,
  PLACEMENT_PLATFORM,
  PLACEMENT_FB_POSITION,
  PLACEMENT_INS_POSITION,
  PLACEMENT_FB_TAG,
  PLACEMENT_MESSENGER_POSITION,
  PLACEMENT_THREAD,
  DEVICE,
} from '@/enum/campaign'
import { SelectOption } from 'naive-ui'
import ToggleList from '@/assets/icons/ToggleList.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { deviceOptions } from '@/options/campaign'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { storeToRefs } from 'pinia'
import { FACEBOOK_PLACEMENTS } from '@/constants/campaign'

const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const { crawlFBTemplate } = storeToRefs(crawlFacebookTemplateStore)

const descriptionByTag = (tag: PLACEMENT_FB_TAG) => {
  switch (tag) {
    case PLACEMENT_FB_TAG.FEEDS:
      return 'Get high visibility for your business with ads in feeds'
    case PLACEMENT_FB_TAG.STORY_REELS:
      return 'Tell a rich, visual story with immersive, fullscreen vertical ads'
    case PLACEMENT_FB_TAG.INSTREAM:
      return 'Reach people before, during or after they watch a video or reel'
    case PLACEMENT_FB_TAG.SEARCH:
      return 'Get visibility for your business as people search'
    case PLACEMENT_FB_TAG.APPS_SITES:
      return 'Expand your reach with ads in external apps and websites'
  }

  return ''
}

const labelByPlatform = (tag: PLACEMENT_PLATFORM) => {
  switch (tag) {
    case PLACEMENT_PLATFORM.FACEBOOK:
      return 'Facebook'
    case PLACEMENT_PLATFORM.INSTAGRAM:
      return 'Instagram'
    case PLACEMENT_PLATFORM.NETWORK:
      return 'Audience Network'
    case PLACEMENT_PLATFORM.MESSENGER:
      return 'Messenger'
    case PLACEMENT_PLATFORM.THREADS:
      return 'Threads'
  }

  return ''
}

const facebookPlacements = computed<SelectOption[]>(() => FACEBOOK_PLACEMENTS)

const allowedForDesktop: any[] = [
  PLACEMENT_FB_POSITION.FEED,
  PLACEMENT_FB_POSITION.RIGHT_COLUMN,
  PLACEMENT_FB_POSITION.MARKET_PLACE,
  PLACEMENT_FB_POSITION.INSTREAM_VIDEO,
  PLACEMENT_FB_POSITION.SEARCH,
]

const disallowedOnDesktop: any[] = [
  PLACEMENT_FB_POSITION.RIGHT_COLUMN,
  PLACEMENT_FB_POSITION.BUSINESS_EXPLORE,
]

const optionsByTags = (tag: PLACEMENT_FB_TAG) => {
  return facebookPlacements.value.filter((option) => option.tag === tag)
}

const tags = computed(() => {
  const tags = new Set<PLACEMENT_FB_TAG>()
  facebookPlacements.value.forEach((placement) => {
    tags.add(placement.tag as PLACEMENT_FB_TAG)
  })

  return Array.from(tags)
})

const platforms = computed(() => {
  const platforms = new Set<PLACEMENT_PLATFORM>()
  facebookPlacements.value.forEach((placement) => {
    platforms.add(placement.platform as PLACEMENT_PLATFORM)
  })

  const usedPlatforms = Array.from(platforms)
  const orderPlatforms = Object.values(PLACEMENT_PLATFORM)

  return usedPlatforms.sort(
    (a, b) => orderPlatforms.indexOf(a) - orderPlatforms.indexOf(b)
  )
})

const isDisableTag = (tag: PLACEMENT_FB_TAG) => {
  if (crawlFBTemplate.value.placement_platform?.length === 1) {
    if (isCheckTag(tag) || indeterminateThisTag(tag)) return true
  }

  const itemsInTag = facebookPlacements.value.filter(
    (option) => option.tag === tag
  )

  if (itemsInTag.length === 0) return true
  for (let index = 0; index < itemsInTag.length; index++) {
    if (!isDisabledOption(itemsInTag[index])) return false
  }

  return true
}

const tagStatus = ref<{ [key: string]: boolean }>({})

const indeterminateThisTag = (tag: PLACEMENT_FB_TAG) => {
  const itemsInTag = facebookPlacements.value.filter(
    (option) => option.tag === tag
  )

  if (itemsInTag.length === 0) return false

  if (isCheckTag(tag)) return false

  for (let index = 0; index < itemsInTag.length; index++) {
    const it = itemsInTag[index]
    if (isCheck(it)) return true
  }

  return false
}

const indeterminateThisPlatform = (plat: PLACEMENT_PLATFORM) => {
  const itemsInPlat = facebookPlacements.value.filter(
    (option) => option.platform === plat
  )

  if (itemsInPlat.length === 0) return false

  if (isCheckPlat(plat)) return false

  for (let index = 0; index < itemsInPlat.length; index++) {
    const it = itemsInPlat[index]
    if (isCheck(it)) return true
  }

  return false
}

const toggleCheckTag = (tag: PLACEMENT_FB_TAG) => {
  const itemsInTag = facebookPlacements.value.filter(
    (option) => option.tag === tag
  )

  if (itemsInTag.length === 0) return

  if (isCheckTag(tag)) {
    for (let index = 0; index < itemsInTag.length; index++) {
      const it = itemsInTag[index]
      if (isDisabledOption(it)) continue
      toggleCheck(it, false, true)
    }
    return
  }

  for (let index = 0; index < itemsInTag.length; index++) {
    const it = itemsInTag[index]
    if (isDisabledOption(it)) continue

    toggleCheck(it, true, false)
  }
}

const toggleCheckPlatform = (plat: PLACEMENT_PLATFORM) => {
  const itemsInPlatform = facebookPlacements.value.filter(
    (option) => option.platform === plat
  )

  if (itemsInPlatform.length === 0) return

  const shouldCheck = !isCheckPlat(plat)

  itemsInPlatform.forEach((placement) => {
    if (!isDisabledOption(placement)) {
      toggleCheck(placement, shouldCheck, true)
    }
  })

  if (!crawlFBTemplate.value.placement_platform) {
    crawlFBTemplate.value.placement_platform = []
  }

  if (shouldCheck) {
    if (!crawlFBTemplate.value.placement_platform?.includes(plat)) {
      crawlFBTemplate.value.placement_platform?.push(plat)
    }
  } else {
    crawlFBTemplate.value.placement_platform =
      crawlFBTemplate.value.placement_platform?.filter((item) => item !== plat)
  }
}

type PlacementArrayKey =
  | 'facebook_positions'
  | 'instagram_positions'
  | 'audience_network_positions'
  | 'messenger_positions'
  | 'threads_positions'

const platformPositionMap: Record<PLACEMENT_PLATFORM, PlacementArrayKey> = {
  [PLACEMENT_PLATFORM.FACEBOOK]: 'facebook_positions',
  [PLACEMENT_PLATFORM.INSTAGRAM]: 'instagram_positions',
  [PLACEMENT_PLATFORM.NETWORK]: 'audience_network_positions',
  [PLACEMENT_PLATFORM.MESSENGER]: 'messenger_positions',
  [PLACEMENT_PLATFORM.THREADS]: 'threads_positions',
}

const verifyPlatform = () => {
  const adGroup = crawlFBTemplate.value

  if (!adGroup.placement_platform?.length) return

  adGroup.placement_platform = adGroup.placement_platform.filter((platform) => {
    const key = platformPositionMap[platform]
    const positions = adGroup[key]

    return Array.isArray(positions) && positions.length > 0
  })
}

const isCheckPlat = (plat: PLACEMENT_PLATFORM) => {
  const itemsInPlat = facebookPlacements.value.filter(
    (option) => option.platform === plat
  )

  if (itemsInPlat.length === 0) return false

  let check = false //Dùng tránh trường hợp không có option nào được chọn, mà chỉ có option disabled

  for (let index = 0; index < itemsInPlat.length; index++) {
    const it = itemsInPlat[index]
    if (isDisabledOption(it)) continue
    if (!isCheck(it)) return false
    if (!check && isCheck(it)) check = true
  }

  return check
}

const isCheckTag = (tag: PLACEMENT_FB_TAG) => {
  const itemsInTag = facebookPlacements.value.filter(
    (option) => option.tag === tag
  )

  if (itemsInTag.length === 0) return false

  let check = false //Dùng tránh trường hợp không có option nào được chọn, mà chỉ có option disabled
  for (let index = 0; index < itemsInTag.length; index++) {
    const it = itemsInTag[index]
    if (isDisabledOption(it)) continue
    if (!isCheck(it)) return false

    if (!check && isCheck(it)) check = true
  }

  return check
}

onMounted(() => {
  tags.value.forEach((element) => {
    tagStatus.value[element] = true
  })
})

const isCheck = (it: SelectOption) => {
  switch (it.platform) {
    case PLACEMENT_PLATFORM.FACEBOOK:
      if (crawlFBTemplate.value.facebook_positions) {
        if (crawlFBTemplate.value.facebook_positions?.includes(it.value as any))
          return true
      }
      break

    case PLACEMENT_PLATFORM.INSTAGRAM:
      if (crawlFBTemplate.value.instagram_positions) {
        if (
          crawlFBTemplate.value.instagram_positions?.includes(it.value as any)
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.MESSENGER:
      if (crawlFBTemplate.value.messenger_positions) {
        if (
          crawlFBTemplate.value.messenger_positions?.includes(it.value as any)
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.NETWORK:
      if (crawlFBTemplate.value.audience_network_positions) {
        if (
          crawlFBTemplate.value.audience_network_positions?.includes(
            it.value as any
          )
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.THREADS:
      if (crawlFBTemplate.value.threads_positions) {
        if (crawlFBTemplate.value.threads_positions?.includes(it.value as any))
          return true
      }
      break

    default:
      break
  }

  return false
}

const isDisabledOption = (option: SelectOption) => {
  const adGroup = crawlFBTemplate.value
  const locations = crawlFBTemplate.value.location?.value ?? []
  const devicePlatforms = crawlFBTemplate.value?.device || ''

  if (devicePlatforms && devicePlatforms[0] === DEVICE.DESKTOP) {
    return !allowedForDesktop.includes(option.value as PLACEMENT_FB_POSITION)
  }

  if (devicePlatforms && devicePlatforms[0] === DEVICE.MOBILE) {
    return disallowedOnDesktop.includes(option.value as PLACEMENT_FB_POSITION)
  }

  if (
    option.value === PLACEMENT_FB_POSITION.BUSINESS_EXPLORE &&
    locations.length === 1 &&
    locations.includes('VN')
  ) {
    return true
  }

  if (
    option.value === PLACEMENT_MESSENGER_POSITION.INBOX &&
    locations.length === 1 &&
    locations.includes('US')
  ) {
    return true
  }

  if (
    option.value === PLACEMENT_THREAD.FEED &&
    adGroup?.instagram_positions?.length &&
    !adGroup.instagram_positions.includes(PLACEMENT_INS_POSITION.FEED)
  ) {
    return true
  }

  return false
}
//Xóa bỏ nếu đã chọn option đó khi điều kiện không cho phép
watch(
  () => crawlFBTemplate.value.location?.value,
  (newValue, oldValue) => {
    if (!newValue || newValue.length !== 1) return

    switch (newValue[0]) {
      case 'US': {
        if (
          crawlFBTemplate.value.messenger_positions?.includes(
            PLACEMENT_MESSENGER_POSITION.INBOX
          )
        ) {
          crawlFBTemplate.value.messenger_positions =
            crawlFBTemplate.value.messenger_positions.filter(
              (item) => item !== PLACEMENT_MESSENGER_POSITION.INBOX
            )

          verifyPlatform()
        }
        break
      }

      case 'VN': {
        if (
          crawlFBTemplate.value.facebook_positions?.includes(
            PLACEMENT_FB_POSITION.BUSINESS_EXPLORE
          )
        ) {
          crawlFBTemplate.value.facebook_positions =
            crawlFBTemplate.value.facebook_positions.filter(
              (item) => item !== PLACEMENT_FB_POSITION.BUSINESS_EXPLORE
            )

          verifyPlatform()
        }
        break
      }
    }
  },
  { deep: true }
)

const toggleCheck = (
  it: SelectOption,
  add: boolean = true,
  remove: boolean = true
) => {
  const platform = it?.platform as string
  if (!platform) return
  switch (platform) {
    case PLACEMENT_PLATFORM.FACEBOOK:
      if (!crawlFBTemplate.value.facebook_positions) {
        crawlFBTemplate.value.facebook_positions = []
      }

      if (crawlFBTemplate.value.facebook_positions?.includes(it.value as any)) {
        if (remove) {
          crawlFBTemplate.value.facebook_positions =
            crawlFBTemplate.value.facebook_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          crawlFBTemplate.value.facebook_positions?.push(it.value as any)
        }
      }
      break

    case PLACEMENT_PLATFORM.INSTAGRAM:
      if (!crawlFBTemplate.value.instagram_positions) {
        crawlFBTemplate.value.instagram_positions = []
      }

      if (
        crawlFBTemplate.value.instagram_positions?.includes(it.value as any)
      ) {
        if (remove) {
          crawlFBTemplate.value.instagram_positions =
            crawlFBTemplate.value.instagram_positions?.filter(
              (item) => item !== it.value
            )

          if (it.value === PLACEMENT_INS_POSITION.FEED) {
            try {
              // Nếu bỏ chọn Instagram Feed thì cũng bỏ chọn Threads Feed
              crawlFBTemplate.value.threads_positions =
                crawlFBTemplate.value.threads_positions?.filter(
                  (item) => item !== PLACEMENT_THREAD.FEED
                )
            } catch {}
          }
        }
      } else {
        if (add) {
          crawlFBTemplate.value.instagram_positions?.push(it.value as any)
        }
      }
      break

    case PLACEMENT_PLATFORM.MESSENGER:
      if (!crawlFBTemplate.value.messenger_positions) {
        crawlFBTemplate.value.messenger_positions = []
      }

      if (
        crawlFBTemplate.value.messenger_positions?.includes(it.value as any)
      ) {
        if (remove) {
          crawlFBTemplate.value.messenger_positions =
            crawlFBTemplate.value.messenger_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          crawlFBTemplate.value.messenger_positions?.push(it.value as any)
        }
      }
      break

    case PLACEMENT_PLATFORM.NETWORK:
      if (!crawlFBTemplate.value.audience_network_positions) {
        crawlFBTemplate.value.audience_network_positions = []
      }

      if (
        crawlFBTemplate.value.audience_network_positions?.includes(
          it.value as any
        )
      ) {
        if (remove) {
          crawlFBTemplate.value.audience_network_positions =
            crawlFBTemplate.value.audience_network_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          crawlFBTemplate.value.audience_network_positions?.push(
            it.value as any
          )
        }
      }
      break

    case PLACEMENT_PLATFORM.THREADS:
      if (!crawlFBTemplate.value.threads_positions) {
        crawlFBTemplate.value.threads_positions = []
      }

      if (crawlFBTemplate.value.threads_positions?.includes(it.value as any)) {
        if (remove) {
          crawlFBTemplate.value.threads_positions =
            crawlFBTemplate.value.threads_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          crawlFBTemplate.value.threads_positions?.push(it.value as any)
        }
      }
      break

    default:
      break
  }

  verifyPlatform()
}

const checkAll = (value: PLACEMENT_TYPE) => {
  if (crawlFBTemplate.value) {
    crawlFBTemplate.value.placement_type = value

    if (value === PLACEMENT_TYPE.ADVANTAGE) {
      crawlFBTemplate.value.placement_platform = []
      crawlFBTemplate.value.facebook_positions = []
      crawlFBTemplate.value.instagram_positions = []
      crawlFBTemplate.value.messenger_positions = []
      crawlFBTemplate.value.audience_network_positions = []
      crawlFBTemplate.value.threads_positions = []
      return
    }

    if (value === PLACEMENT_TYPE.MANUAL) {
      for (let index = 0; index < platforms.value.length; index++) {
        const element = platforms.value[index]

        toggleCheckPlatform(element)
      }
    }
  }
}

const isDisablePlat = (plat: PLACEMENT_PLATFORM) => {
  if (!crawlFBTemplate.value) return false
  const devicePlatforms = crawlFBTemplate.value.device || []
  if (
    devicePlatforms &&
    devicePlatforms[0] === DEVICE.DESKTOP &&
    plat !== PLACEMENT_PLATFORM.FACEBOOK
  ) {
    return true
  }
  if (plat === PLACEMENT_PLATFORM.THREADS) {
    if (
      crawlFBTemplate.value.instagram_positions?.length &&
      !crawlFBTemplate.value.instagram_positions?.includes(
        PLACEMENT_INS_POSITION.FEED
      )
    ) {
      return true
    }
  }

  return false
}

const handleDevice = (selectedValues: string[]) => {
  const normalizedValues = Array.isArray(selectedValues)
    ? selectedValues
    : [selectedValues]

  const lastSelected =
    normalizedValues.length > 0
      ? [normalizedValues[normalizedValues.length - 1]]
      : [DEVICE.ALL]

  if (crawlFBTemplate.value.device) {
    crawlFBTemplate.value.device = lastSelected
  }

  switch (lastSelected[0]) {
    case DEVICE.DESKTOP:
      handleDesktopSelection()
      break
    case DEVICE.MOBILE:
      handleMobileSelection()
      break
    case DEVICE.ALL:
    default:
      resetToAllPlatforms()
      break
  }
}

// xử lý khi chỉ chọn Desktop
const handleDesktopSelection = () => {
  if (!isCheckPlat(PLACEMENT_PLATFORM.FACEBOOK)) {
    toggleCheckPlatform(PLACEMENT_PLATFORM.FACEBOOK)
  }

  facebookPlacements.value.forEach((placement) => {
    if (
      !allowedForDesktop.includes(placement.value as PLACEMENT_FB_POSITION) &&
      isCheck(placement)
    ) {
      resetToAllPlatforms()
      toggleCheck(placement, false, true)
    }
  })

  const platformsToKeep = new Set<PLACEMENT_PLATFORM>()
  facebookPlacements.value.forEach((placement) => {
    if (allowedForDesktop.includes(placement.value as PLACEMENT_FB_POSITION)) {
      platformsToKeep.add(placement.platform as PLACEMENT_PLATFORM)
    }
  })

  if (crawlFBTemplate.value.placement_platform) {
    crawlFBTemplate.value.placement_platform =
      crawlFBTemplate.value.placement_platform?.filter((platform) =>
        platformsToKeep.has(platform)
      )
  }
}
// xử lý khi chỉ chọn Mobile
const handleMobileSelection = () => {
  facebookPlacements.value.forEach((placement) => {
    if (
      disallowedOnDesktop.includes(placement.value as PLACEMENT_FB_POSITION) &&
      isCheck(placement)
    ) {
      resetToAllPlatforms()
      toggleCheck(placement, false, true)
    }
  })

  const platformsToRemove = new Set<PLACEMENT_PLATFORM>()

  platforms.value.forEach((platform) => {
    const platformPlacements = facebookPlacements.value.filter(
      (p) => p.platform === platform
    )

    const allPlacementsInAllowed = platformPlacements.every((p) =>
      disallowedOnDesktop.includes(p.value as PLACEMENT_FB_POSITION)
    )

    if (allPlacementsInAllowed) {
      platformsToRemove.add(platform)
    }
  })

  if (crawlFBTemplate.value.placement_platform) {
    crawlFBTemplate.value.placement_platform =
      crawlFBTemplate.value.placement_platform?.filter(
        (platform) => !platformsToRemove.has(platform)
      )
  }
}

const resetToAllPlatforms = () => {
  if (crawlFBTemplate.value) {
    crawlFBTemplate.value.placement_platform = []
    crawlFBTemplate.value.facebook_positions = []
    crawlFBTemplate.value.instagram_positions = []
    crawlFBTemplate.value.messenger_positions = []
    crawlFBTemplate.value.audience_network_positions = []
    crawlFBTemplate.value.threads_positions = []
  }

  platforms.value.forEach((plat) => {
    toggleCheckPlatform(plat)
  })
}

watch(
  () => crawlFBTemplate.value?.placement_type,
  (v) => {
    if (v === PLACEMENT_TYPE.MANUAL && crawlFBTemplate.value) {
      if (!crawlFBTemplate.value.device) {
        if (crawlFBTemplate.value) {
          crawlFBTemplate.value.device = [DEVICE.ALL]
        }
      }
    }
  },
  { immediate: true }
)
const customRenderTag = (custom: any) => {
  const { option } = custom

  return h(
    'span',
    {
      class: ' px-2 py-1 text-sm',
    },
    option.label
  )
}
const name = 'Type'

watch(
  () =>
    platforms.value?.map((plat) => ({
      plat,
      checked: isCheckPlat(plat),
      indeterminate: indeterminateThisPlatform(plat),
    })),
  (newVal) => {
    const hasUncheckedOrIndeterminate = newVal.some(
      (item) => !item.checked || item.indeterminate
    )

    const adGroup = crawlFBTemplate.value
    if (!adGroup) return

    // if (hasUncheckedOrIndeterminate) {
    //   props.campaign.SetCampSetUpManual()
    // } else {
    //   props.campaign.SetCampSetUpAdvantage()
    // }
  },
  { deep: true }
)
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <FloatingWrapper :name="name" rounded>
        <n-radio-group
          class="pt-3 border rounded-md p-2"
          v-model:value="crawlFBTemplate.placement_type"
          :on-update:value="checkAll"
        >
          <div class="flex flex-col">
            <n-radio :value="PLACEMENT_TYPE.ADVANTAGE" class="flex mb-2">
              <div class="text-gray-600">
                Advantage+ placements (recommended)
              </div>
              <div class="text-xs text-gray-400">
                Use Advantage+ placements to maximize your budget and help show
                your ads to more people. Facebook's delivery system will
                allocate your ad set's budget across multiple placements based
                on where they're likely to perform best.
              </div>
            </n-radio>
            <n-radio :value="PLACEMENT_TYPE.MANUAL" class="flex">
              <div class="text-gray-600">Manual placements</div>
              <div class="text-xs text-gray-400">
                Manually choose the places to show your ad. The more placements
                you select, the more opportunities you'll have to reach your
                target audience and achieve your business goals.
              </div>
            </n-radio>
          </div>
        </n-radio-group>
        <template #extra>
          <n-popover trigger="hover">
            <template #trigger>
              <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
            </template>
            Choose where your ad appears across Meta technologies.
          </n-popover>
        </template>
      </FloatingWrapper>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="crawlFBTemplate.placement_type === PLACEMENT_TYPE.MANUAL"
    >
      <FloatingWrapper name="Devices and operating systems" rounded>
        <n-select
          v-model:value="crawlFBTemplate.device"
          :options="deviceOptions"
          multiple
          @update:value="handleDevice"
          :render-tag="customRenderTag"
        />
      </FloatingWrapper>
    </div>
    <div
      class="flex items-center gap-2"
      v-if="crawlFBTemplate.placement_type === PLACEMENT_TYPE.MANUAL"
    >
      <FloatingWrapper name="Platforms" rounded>
        <div class="flex gap-2 flex-wrap p-2 border rounded-md">
          <n-checkbox
            v-for="(plat, index) in platforms"
            :key="index"
            :value="plat"
            :checked="isCheckPlat(plat)"
            :indeterminate="indeterminateThisPlatform(plat)"
            :label="labelByPlatform(plat)"
            @update:checked="toggleCheckPlatform(plat)"
            :disabled="
              (crawlFBTemplate.placement_platform?.length === 1 &&
                (isCheckPlat(plat) || indeterminateThisPlatform(plat))) ||
              isDisablePlat(plat)
            "
          />
        </div>
      </FloatingWrapper>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="crawlFBTemplate.placement_type === PLACEMENT_TYPE.MANUAL"
    >
      <FloatingWrapper name="Placements" rounded>
        <div class="flex flex-col gap-2 border last:pb-6">
          <div v-for="(tag, index) in tags" :key="index" class="flex flex-col">
            <n-divider v-if="index !== 0" class="list-placement-divider" />
            <div class="flex gap-2 m-2 items-center">
              <span class="w-4">
                <n-icon
                  :component="ToggleList"
                  :class="{ 'rotate-90': tagStatus[tag] }"
                  @click="tagStatus[tag] = !tagStatus[tag]"
                />
              </span>
              <div class="flex flex-col">
                <div class="flex items-center">
                  {{ tag }}
                </div>
              </div>

              <n-checkbox
                :disabled="isDisableTag(tag)"
                :checked="isCheckTag(tag)"
                :indeterminate="indeterminateThisTag(tag)"
                @update:checked="toggleCheckTag(tag)"
                class="ml-auto"
              />
            </div>

            <div class="pl-8 pr-2 flex flex-col gap-2">
              <span class="text-xs text-gray-500 pb-2">{{
                descriptionByTag(tag)
              }}</span>

              <div
                v-for="(option, ind) in optionsByTags(tag)"
                :key="ind"
                class="flex"
              >
                <span class="text-xs text-gray-500">{{ option.label }}</span>
                <n-checkbox
                  class="ml-auto"
                  :checked="isCheck(option)"
                  :disabled="isDisabledOption(option)"
                  @update:checked="toggleCheck(option)"
                ></n-checkbox>
              </div>
            </div>
          </div>
        </div>
      </FloatingWrapper>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.list-placement-divider {
  margin-bottom: 0px !important;
}
</style>
