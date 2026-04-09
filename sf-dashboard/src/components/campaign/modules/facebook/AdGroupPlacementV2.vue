<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { campaignTypeClass, FreezeClass } from '@/types/components/campaign-v2'
import {
  PLACEMENT_TYPE,
  PLACEMENT_PLATFORM,
  PLACEMENT_FB_POSITION,
  PLACEMENT_INS_POSITION,
  PLACEMENT_FB_TAG,
  PLACEMENT_MESSENGER_POSITION,
  PLACEMENT_NETWORK_POSITION,
  PLACEMENT_THREAD,
  DEVICE,
} from '@/enum/campaign'
import { SelectOption } from 'naive-ui'
import ToggleList from '@/assets/icons/ToggleList.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { deviceOptions } from '@/options/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
})

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

const facebookPlacements = computed<SelectOption[]>(() => {
  return [
    {
      value: PLACEMENT_FB_POSITION.FEED,
      label: 'Facebook feed',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.PROFILE_FEED,
      label: 'Facebook profile feed',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },

    {
      value: PLACEMENT_INS_POSITION.FEED,
      label: 'Instagram feed',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_INS_POSITION.PROFILE_FEED,
      label: 'Instagram profile feed',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_FB_POSITION.MARKET_PLACE,
      label: 'Facebook Marketplace',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.VIDEO_FEED,
      label: 'Facebook video feeds',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.RIGHT_COLUMN,
      label: 'Facebook right column',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },

    {
      value: PLACEMENT_INS_POSITION.EXPLORE,
      label: 'Instagram Explore',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_INS_POSITION.EXPLORE_HOME,
      label: 'Instagram Explore home',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_MESSENGER_POSITION.INBOX,
      label: 'Messenger inbox',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.MESSENGER,
    },

    {
      value: PLACEMENT_FB_POSITION.BUSINESS_EXPLORE,
      label: 'Facebook Business Explore',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },

    {
      value: PLACEMENT_THREAD.FEED,
      label: 'Threads feed',
      tag: PLACEMENT_FB_TAG.FEEDS,
      platform: PLACEMENT_PLATFORM.THREADS,
    },

    {
      value: PLACEMENT_INS_POSITION.STORY,
      label: 'Instagram Stories',
      tag: PLACEMENT_FB_TAG.STORY_REELS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_FB_POSITION.STORY,
      label: 'Facebook Stories',
      tag: PLACEMENT_FB_TAG.STORY_REELS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },

    {
      value: PLACEMENT_MESSENGER_POSITION.STORY,
      label: 'Messenger Stories',
      tag: PLACEMENT_FB_TAG.STORY_REELS,
      platform: PLACEMENT_PLATFORM.MESSENGER,
    },

    {
      value: PLACEMENT_INS_POSITION.REELS,
      label: 'Instagram Reels',
      tag: PLACEMENT_FB_TAG.STORY_REELS,
      platform: PLACEMENT_PLATFORM.INSTAGRAM,
    },

    {
      value: PLACEMENT_FB_POSITION.REELS,
      label: 'Facebook Reels',
      tag: PLACEMENT_FB_TAG.STORY_REELS,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.INSTREAM_VIDEO,
      label: 'Facebook in-stream videos',
      tag: PLACEMENT_FB_TAG.INSTREAM,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.REELS_OVERLAY,
      label: 'Ads on Facebook Reels',
      tag: PLACEMENT_FB_TAG.INSTREAM,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },
    {
      value: PLACEMENT_FB_POSITION.SEARCH,
      label: 'Facebook search results',
      tag: PLACEMENT_FB_TAG.SEARCH,
      platform: PLACEMENT_PLATFORM.FACEBOOK,
    },

    {
      value: PLACEMENT_NETWORK_POSITION.CLASSIC,
      label: 'Audience Network native, banner and interstitial',
      tag: PLACEMENT_FB_TAG.APPS_SITES,
      platform: PLACEMENT_PLATFORM.NETWORK,
    },
    {
      value: PLACEMENT_NETWORK_POSITION.REWARDED,
      label: 'Audience Network rewarded videos',
      tag: PLACEMENT_FB_TAG.APPS_SITES,
      platform: PLACEMENT_PLATFORM.NETWORK,
    },
  ]
})

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
  if (
    props.campaign.ad_groups &&
    props.campaign.ad_groups[props.index].placement_platform?.length === 1
  ) {
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
  if (!props.campaign.ad_groups) return false

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
  if (!props.campaign.ad_groups) return false

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
  if (!props.campaign.ad_groups) return

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
  if (!props.campaign.ad_groups) return

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

  if (!props.campaign.ad_groups[props.index].placement_platform) {
    props.campaign.ad_groups[props.index].placement_platform = []
  }

  if (shouldCheck) {
    if (
      !props.campaign.ad_groups[props.index].placement_platform?.includes(plat)
    ) {
      props.campaign.ad_groups[props.index].placement_platform?.push(plat)
    }
  } else {
    props.campaign.ad_groups[props.index].placement_platform =
      props.campaign.ad_groups[props.index].placement_platform?.filter(
        (item) => item !== plat
      )
  }
}

const verifyPlatform = () => {
  if (!props.campaign.ad_groups) return

  const adGroup = props.campaign.ad_groups[props.index]

  if (adGroup.placement_platform?.length) {
    const platformPositionMap = {
      [PLACEMENT_PLATFORM.FACEBOOK]: 'facebook_positions',
      [PLACEMENT_PLATFORM.INSTAGRAM]: 'instagram_positions',
      [PLACEMENT_PLATFORM.NETWORK]: 'audience_network_positions',
      [PLACEMENT_PLATFORM.MESSENGER]: 'messenger_positions',
      [PLACEMENT_PLATFORM.THREADS]: 'threads_positions',
    }

    adGroup.placement_platform = adGroup.placement_platform.filter(
      (platform) => {
        const positionField = platformPositionMap[platform]
        return adGroup[positionField as keyof typeof adGroup]?.length
      }
    )
  }
}

const isCheckPlat = (plat: PLACEMENT_PLATFORM) => {
  if (!props.campaign.ad_groups) return false

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
  if (!props.campaign.ad_groups) return false

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
  if (!props.campaign.ad_groups) return false

  switch (it.platform) {
    case PLACEMENT_PLATFORM.FACEBOOK:
      if (props.campaign.ad_groups[props.index].facebook_positions) {
        if (
          props.campaign.ad_groups[props.index].facebook_positions?.includes(
            it.value as any
          )
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.INSTAGRAM:
      if (props.campaign.ad_groups[props.index].instagram_positions) {
        if (
          props.campaign.ad_groups[props.index].instagram_positions?.includes(
            it.value as any
          )
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.MESSENGER:
      if (props.campaign.ad_groups[props.index].messenger_positions) {
        if (
          props.campaign.ad_groups[props.index].messenger_positions?.includes(
            it.value as any
          )
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.NETWORK:
      if (props.campaign.ad_groups[props.index].audience_network_positions) {
        if (
          props.campaign.ad_groups[
            props.index
          ].audience_network_positions?.includes(it.value as any)
        )
          return true
      }
      break

    case PLACEMENT_PLATFORM.THREADS:
      if (props.campaign.ad_groups[props.index].threads_positions) {
        if (
          props.campaign.ad_groups[props.index].threads_positions?.includes(
            it.value as any
          )
        )
          return true
      }
      break

    default:
      break
  }

  return false
}

const isDisabledOption = (option: SelectOption) => {
  const adGroup = props.campaign.ad_groups?.[props.index]
  const locations = adGroup?.location?.value ?? []
  const devicePlatforms = props.campaign.ad_groups?.[props.index]?.device || ''

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
  () =>
    props.campaign.ad_groups &&
    props.campaign.ad_groups[props.index].location?.value,
  async (newValue, oldValue) => {
    if (newValue && newValue.length === 1 && props.campaign.ad_groups) {
      switch (newValue[0]) {
        case 'US':
          if (
            props.campaign.ad_groups[props.index].messenger_positions?.includes(
              PLACEMENT_MESSENGER_POSITION.INBOX
            )
          ) {
            props.campaign.ad_groups[props.index].messenger_positions =
              props.campaign.ad_groups[props.index].messenger_positions?.filter(
                (item) => item !== PLACEMENT_MESSENGER_POSITION.INBOX
              )
          }
          break

        case 'VN':
          if (
            props.campaign.ad_groups[props.index].facebook_positions?.includes(
              PLACEMENT_FB_POSITION.BUSINESS_EXPLORE
            )
          ) {
            props.campaign.ad_groups[props.index].facebook_positions =
              props.campaign.ad_groups[props.index].facebook_positions?.filter(
                (item) => item !== PLACEMENT_FB_POSITION.BUSINESS_EXPLORE
              )
          }
          break
      }
    }
  }
)

const toggleCheck = (
  it: SelectOption,
  add: boolean = true,
  remove: boolean = true
) => {
  if (!props.campaign.ad_groups) return

  const platform = it?.platform as string
  if (!platform) return
  switch (platform) {
    case PLACEMENT_PLATFORM.FACEBOOK:
      if (!props.campaign.ad_groups[props.index].facebook_positions) {
        props.campaign.ad_groups[props.index].facebook_positions = []
      }

      if (
        props.campaign.ad_groups[props.index].facebook_positions?.includes(
          it.value as any
        )
      ) {
        if (remove) {
          props.campaign.ad_groups[props.index].facebook_positions =
            props.campaign.ad_groups[props.index].facebook_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          props.campaign.ad_groups[props.index].facebook_positions?.push(
            it.value as any
          )
        }
      }
      break

    case PLACEMENT_PLATFORM.INSTAGRAM:
      if (!props.campaign.ad_groups[props.index].instagram_positions) {
        props.campaign.ad_groups[props.index].instagram_positions = []
      }

      if (
        props.campaign.ad_groups[props.index].instagram_positions?.includes(
          it.value as any
        )
      ) {
        if (remove) {
          props.campaign.ad_groups[props.index].instagram_positions =
            props.campaign.ad_groups[props.index].instagram_positions?.filter(
              (item) => item !== it.value
            )

          if (it.value === PLACEMENT_INS_POSITION.FEED) {
            try {
              // Nếu bỏ chọn Instagram Feed thì cũng bỏ chọn Threads Feed
              props.campaign.ad_groups[props.index].threads_positions =
                props.campaign.ad_groups[props.index].threads_positions?.filter(
                  (item) => item !== PLACEMENT_THREAD.FEED
                )
            } catch {}
          }
        }
      } else {
        if (add) {
          props.campaign.ad_groups[props.index].instagram_positions?.push(
            it.value as any
          )
        }
      }
      break

    case PLACEMENT_PLATFORM.MESSENGER:
      if (!props.campaign.ad_groups[props.index].messenger_positions) {
        props.campaign.ad_groups[props.index].messenger_positions = []
      }

      if (
        props.campaign.ad_groups[props.index].messenger_positions?.includes(
          it.value as any
        )
      ) {
        if (remove) {
          props.campaign.ad_groups[props.index].messenger_positions =
            props.campaign.ad_groups[props.index].messenger_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          props.campaign.ad_groups[props.index].messenger_positions?.push(
            it.value as any
          )
        }
      }
      break

    case PLACEMENT_PLATFORM.NETWORK:
      if (!props.campaign.ad_groups[props.index].audience_network_positions) {
        props.campaign.ad_groups[props.index].audience_network_positions = []
      }

      if (
        props.campaign.ad_groups[
          props.index
        ].audience_network_positions?.includes(it.value as any)
      ) {
        if (remove) {
          props.campaign.ad_groups[props.index].audience_network_positions =
            props.campaign.ad_groups[
              props.index
            ].audience_network_positions?.filter((item) => item !== it.value)
        }
      } else {
        if (add) {
          props.campaign.ad_groups[
            props.index
          ].audience_network_positions?.push(it.value as any)
        }
      }
      break

    case PLACEMENT_PLATFORM.THREADS:
      if (!props.campaign.ad_groups[props.index].threads_positions) {
        props.campaign.ad_groups[props.index].threads_positions = []
      }

      if (
        props.campaign.ad_groups[props.index].threads_positions?.includes(
          it.value as any
        )
      ) {
        if (remove) {
          props.campaign.ad_groups[props.index].threads_positions =
            props.campaign.ad_groups[props.index].threads_positions?.filter(
              (item) => item !== it.value
            )
        }
      } else {
        if (add) {
          props.campaign.ad_groups[props.index].threads_positions?.push(
            it.value as any
          )
        }
      }
      break

    default:
      break
  }

  verifyPlatform()
}

const checkAll = (value: PLACEMENT_TYPE) => {
  if (props.campaign.ad_groups) {
    props.campaign.ad_groups[props.index].placement_type = value

    if (value === PLACEMENT_TYPE.ADVANTAGE) {
      props.campaign.ad_groups[props.index].placement_platform = []
      props.campaign.ad_groups[props.index].facebook_positions = []
      props.campaign.ad_groups[props.index].instagram_positions = []
      props.campaign.ad_groups[props.index].messenger_positions = []
      props.campaign.ad_groups[props.index].audience_network_positions = []
      props.campaign.ad_groups[props.index].threads_positions = []
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

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

const isDisablePlat = (plat: PLACEMENT_PLATFORM) => {
  if (!props.campaign.ad_groups) return false
  const devicePlatforms = props.campaign.ad_groups?.[props.index]?.device || []
  if (
    devicePlatforms &&
    devicePlatforms[0] === DEVICE.DESKTOP &&
    plat !== PLACEMENT_PLATFORM.FACEBOOK
  ) {
    return true
  }
  if (plat === PLACEMENT_PLATFORM.THREADS) {
    if (
      props.campaign.ad_groups[props.index].instagram_positions?.length &&
      !props.campaign.ad_groups[props.index].instagram_positions?.includes(
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

  if (props.campaign.ad_groups?.[props.index]) {
    props.campaign.ad_groups[props.index].device = lastSelected
  }

  switch (lastSelected[0]) {
    case DEVICE.DESKTOP:
      props.campaign.SetCampSetUpManual()
      handleDesktopSelection()
      break
    case DEVICE.MOBILE:
      props.campaign.SetCampSetUpManual()
      handleMobileSelection()
      break
    case DEVICE.ALL:
    default:
      props.campaign.SetCampSetUpAdvantage()
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

  if (props.campaign.ad_groups?.[props.index].placement_platform) {
    props.campaign.ad_groups[props.index].placement_platform =
      props.campaign.ad_groups[props.index].placement_platform?.filter(
        (platform) => platformsToKeep.has(platform)
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

  if (props.campaign.ad_groups?.[props.index].placement_platform) {
    props.campaign.ad_groups[props.index].placement_platform =
      props.campaign.ad_groups[props.index].placement_platform?.filter(
        (platform) => !platformsToRemove.has(platform)
      )
  }
}

const resetToAllPlatforms = () => {
  if (props.campaign.ad_groups?.[props.index]) {
    props.campaign.ad_groups[props.index].placement_platform = []
    props.campaign.ad_groups[props.index].facebook_positions = []
    props.campaign.ad_groups[props.index].instagram_positions = []
    props.campaign.ad_groups[props.index].messenger_positions = []
    props.campaign.ad_groups[props.index].audience_network_positions = []
    props.campaign.ad_groups[props.index].threads_positions = []
  }

  platforms.value.forEach((plat) => {
    toggleCheckPlatform(plat)
  })
}

watch(
  () => props.campaign.ad_groups?.[props.index]?.placement_type,
  (v) => {
    if (
      v === PLACEMENT_TYPE.MANUAL &&
      props.campaign.ad_groups?.[props.index]
    ) {
      if (!props.campaign.ad_groups[props.index].device) {
        if (props.campaign.ad_groups && props.campaign.ad_groups[props.index]) {
          props.campaign.ad_groups[props.index].device = [DEVICE.ALL]
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

    const adGroup = props.campaign.ad_groups?.[props.index]
    if (!adGroup) return

    if (hasUncheckedOrIndeterminate) {
      props.campaign.SetCampSetUpManual()
    } else {
      props.campaign.SetCampSetUpAdvantage()
    }
  },
  { deep: true }
)
</script>

<template>
  <div v-if="isShow && props.campaign.ad_groups" class="flex flex-col gap-4">
    <div class="flex items-center gap-2">
      <FloatingWrapper :name="name" rounded>
        <n-radio-group
          class="pt-3 border rounded-md p-2"
          v-model:value="props.campaign.ad_groups[props.index].placement_type"
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
      v-if="
        props.campaign.ad_groups[props.index].placement_type ===
        PLACEMENT_TYPE.MANUAL
      "
    >
      <FloatingWrapper name="Devices and operating systems" rounded>
        <n-select
          v-model:value="props.campaign.ad_groups[props.index].device"
          :options="deviceOptions"
          multiple
          @update:value="handleDevice"
          :render-tag="customRenderTag"
        />
      </FloatingWrapper>
    </div>
    <div
      class="flex items-center gap-2"
      v-if="
        props.campaign.ad_groups[props.index].placement_type ===
        PLACEMENT_TYPE.MANUAL
      "
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
              (props.campaign.ad_groups[props.index].placement_platform
                ?.length === 1 &&
                (isCheckPlat(plat) || indeterminateThisPlatform(plat))) ||
              isDisablePlat(plat)
            "
          />
        </div>
      </FloatingWrapper>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="
        props.campaign.ad_groups[props.index].placement_type ===
        PLACEMENT_TYPE.MANUAL
      "
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
