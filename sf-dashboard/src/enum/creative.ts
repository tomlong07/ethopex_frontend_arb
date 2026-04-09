/* eslint-disable no-unused-vars */
// @ts-nocheck
// ts-prune-ignore-all

// Thêm để ko báo lỗi enum bị unused

export enum CRE_TYPE {
  NATIVE = 'native',
  TIKTOK = 'tiktok',
  GGSEARCH = 'gg_search',
  SNAPCHAT = 'snapchat',
  DEMANDGEN = 'demand_gen',
  PP_BANNER = 'banner',
  PMAX = 'performance_max',
  FACEBOOK = 'facebook',
  GG_DISPLAY = 'gg_display',
  NEWSBREAK = 'newsbreak',
}

export enum CONTENT_SAFETY {
  SAFE = 'Safe',
  UNSAFE = 'Unsafe',
}

export enum ENROLL_STATUS {
  OPT_IN = 'OPT_IN',
  OPT_OUT = 'OPT_OUT',
}

export enum typeStatus {
  ALL = 'All',
  AI = 'AI',
  DEFAULT = 'Default',
  NONE = '',
}

export enum displayType {
  STATIC = 'static', // <img>
  SPRITE = 'sprite', // background-position
  VIDEO = 'video', // mp4 preview
}

export enum CreativeMediaType {
  SINGLE_IMAGE = 'single_image',
  SINGLE_VIDEO = 'single_video',
  CAROUSEL = 'carousel',
  FLEXIBLE = 'flexible',
}

export enum CONTENT_CONSISTENCY {
  PASSED = 'Passed',
  FAILED = 'Failed',
}

export enum VERIFY_MANUAL {
  PENDING = 'pending',
}
