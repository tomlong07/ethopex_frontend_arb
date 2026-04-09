/* eslint-disable no-unused-vars */
// @ts-nocheck
// ts-prune-ignore-all

// Thêm để ko báo lỗi enum bị unused

export enum BIDSTRATEGY {
  HIGHEST_VOLUME = 'LOWEST_COST_WITHOUT_CAP',
  BID_CAP = 'LOWEST_COST_WITH_BID_CAP',
  COST_PER_RESULT_GOAL = 'COST_CAP',
  ROAS_GOAL = 'LOWEST_COST_WITH_MIN_ROAS',
  BIDCUSTOM = 'BID_TYPE_CUSTOM',
  BIDNOBID = 'BID_TYPE_NO_BID',
  VO_HIGHEST_VALUE = 'VO_HIGHEST_VALUE',
  VO_MIN_ROAS = 'VO_MIN_ROAS',
  TARGET_CPA = 'TARGET_CPA',
  MAX_CONVERSION = 'MAX_CONVERSION',
  CPC = 'CPC',
}

export enum ATTRIBUTION_SETTING {
  STANDARD = 'standard',
  INCREMENTAL = 'incremental',
}

export enum YES_NO {
  YES = 'YES',
  NO = 'NO',
}

export enum ONOFF {
  ON = 'on',
  OFF = 'off',
}

export enum INEX {
  INCLUDE = 'include',
  EXCLUDE = 'exclude',
}

export enum DS {
  ADSENSE = 'adsense',
  BING1 = 'codefuel',
  BING2 = 'brightcast',
  SYSTEM1 = 'system1',
  PUBPOWER = 'pubpower',
  TONIC = 'tonic',
  ARBCORE = 'arbcore',
  CJ = 'cj',
}

export enum PLACEMENT_TYPE {
  ADVANTAGE = 'advantage',
  MANUAL = 'manual',
}

export enum PLACEMENT_TYPE_TIKTOK {
  NORMAL = 'PLACEMENT_TYPE_NORMAL',
  AUTOMATIC = 'PLACEMENT_TYPE_AUTOMATIC',
}

export enum PLACEMENT_PLATFORM {
  FACEBOOK = 'facebook',
  INSTAGRAM = 'instagram',
  NETWORK = 'audience_network',
  MESSENGER = 'messenger',
  THREADS = 'threads',
}

export enum PLACEMENT_FB_POSITION {
  FEED = 'feed',
  PROFILE_FEED = 'profile_feed',
  MARKET_PLACE = 'marketplace',
  VIDEO_FEED = 'video_feeds',
  RIGHT_COLUMN = 'right_hand_column',
  BUSINESS_EXPLORE = 'biz_disco_feed',
  STORY = 'story',
  REELS = 'facebook_reels',
  INSTREAM_VIDEO = 'instream_video',
  REELS_OVERLAY = 'facebook_reels_overlay',
  SEARCH = 'search',
}

export enum PLACEMENT_INS_POSITION {
  FEED = 'stream',
  PROFILE_FEED = 'profile_feed',
  EXPLORE = 'explore',
  EXPLORE_HOME = 'explore_home',
  STORY = 'story',
  REELS = 'reels',
}

export enum DEVICE {
  ALL = 'all',
  MOBILE = 'mobile',
  DESKTOP = 'desktop',
}

export enum PLACEMENT_MESSENGER_POSITION {
  INBOX = 'messenger_home',
  STORY = 'story',
  SPONSORED_MESSAGES = 'sponsored_messages',
}

export enum PLACEMENT_NETWORK_POSITION {
  CLASSIC = 'classic',
  REWARDED = 'rewarded_video',
}

export enum PLACEMENT_FB_TAG {
  FEEDS = 'Feeds',
  STORY_REELS = 'Stories and Reels',
  INSTREAM = 'In-stream ads for videos and reels',
  SEARCH = 'Search results',
  MESSAGES = 'Messages',
  APPS_SITES = 'Apps and sites',
}

export enum PLACEMENT_THREAD {
  FEED = 'threads_stream',
}

export enum AD_SETUP {
  CREATE_AD = 'create_ad',
  USE_EXISTING_POST = 'use_existing_post',
}

export enum TIME_ZONE_TYPE {
  USER = 'USER',
  ADVERTISER = 'ADVERTISER',
}

export enum CONVERSION_LOGIC {
  BY_CLICK = 'by_click',
  BY_EPC = 'by_epc',
  BY_USER_VALUE = 'by_user_value',
}

export enum AI_STATUS {
  SUCCESS = 'success',
  PENDING = 'pending',
  BOT_REVIEW = 'bot_review',
  MANUAL_REVIEW = 'manual_review',
  REJECTED = 'rejected',
  AUTO_REVIEW = 'auto_review',
}

export enum DUPLICATE_TYPE {
  DUPLICATE_KEEP_LINK = 'duplicate_keep_link',
  DUPLICATE = 'duplicate',
  BOT = 'duplicate_bot',
}

export enum PURCHASE_VALUE_TYPE {
  RPC = 'rpc_to_day_min_x_conversions',
  FIXED = 'fixed_value',
  NONE = 'none_value',
}

export enum TS {
  FACEBOOK = 'facebook',
  GOOGLE = 'google',
  TABOOLA = 'taboola',
  OUTBRAIN = 'outbrain',
  SNAPCHAT = 'snapchat',
  MEDIAGO = 'mediago',
  MGID = 'mgid',
  TIKTOK = 'tiktok',
  POCPOC = 'pocpoc',
  QUANTUMDEX = 'quantumdex',
  REVCONTENT = 'revcontent',
  ZEMANTA = 'zemanta',
  NEWSBREAK = 'newsbreak',
  SMART_NEW = 'smartnews',
  ARB_TRAFFIC = 'arbtraffic',
  PINTEREST = 'pinterest',
  TWITTER = 'twitter',
  REDDIT = 'reddit',
  NONE = '',
}

export enum CREATE_CAMP {
  MANUAL = 'manual',
  ADVANTAGE = 'advantage',
  API = 'api',
  SMART = 'smart',
  API_PUBLIC = 'api public',
}

export enum CAMP_TYPE {
  GGSEARCH = 'gg_search',
  DEMANDGEN = 'demand_gen',
  PERFORMANCEMAX = 'performance_max',
  GGDISPLAY = 'gg_display',
  NATIVE = 'native',
  BANNER = 'banner',
}

export enum BIDDING_STRATEGY {
  BIDCONTROL = 'CPC/CPM',
  MAXCONVERSION = 'CPA',
}

export enum OPTIMIZE_AI_MAX {
  TEXTASSETAUTOMATION = 'TEXT_ASSET_AUTOMATION',
  FINALURLEXPANSIONTEXTASSETAUTOMATION = 'FINAL_URL_EXPANSION_TEXT_ASSET_AUTOMATION',
}
