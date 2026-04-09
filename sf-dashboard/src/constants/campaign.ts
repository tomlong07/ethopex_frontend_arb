import {
  PLACEMENT_FB_POSITION,
  PLACEMENT_FB_TAG,
  PLACEMENT_INS_POSITION,
  PLACEMENT_MESSENGER_POSITION,
  PLACEMENT_NETWORK_POSITION,
  PLACEMENT_PLATFORM,
  PLACEMENT_THREAD,
} from '@/enum/campaign'
import { CreativeFeaturesSpec } from '@/types/components/campaign-v2'

export const ValDayparting =
  '000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

export const RemoveKeySingleImage: (keyof CreativeFeaturesSpec)[] = [
  'image_animations',
  'enhance_cta',
  'flex_media',
]

export const RemoveKeySingleVideo: (keyof CreativeFeaturesSpec)[] = [
  'creative_stickers',
  'enhance_cta',
]

export const FACEBOOK_PLACEMENTS = [
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
