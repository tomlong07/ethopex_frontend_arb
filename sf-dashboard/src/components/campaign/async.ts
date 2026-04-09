//Async component chỉ load khi hiển thị
export const ModalKeywordSet = defineAsyncComponent(
  () => import('./modal/ModalKeywordSet.vue')
)

export const ModalMenuCreative = defineAsyncComponent(
  () => import('./modal/ModalMenuCreative.vue')
)

export const ModalSegment = defineAsyncComponent(
  () => import('./modal/ModalSegment.vue')
)

export const ModalFacebookPost = defineAsyncComponent(
  () => import('./modal/ModalFacebookPost.vue')
)

export const ModalAdData = defineAsyncComponent(
  () => import('./modal/ModalAdData.vue')
)

export const ModalUseExistingPost = defineAsyncComponent(
  () => import('./modal/ModalUseExistingPost.vue')
)

export const ModalCreateAd = defineAsyncComponent(
  () => import('./modal/ModalCreateAd.vue')
)

export const URLs = defineAsyncComponent(() => import('./modules/URLs.vue'))

export const CreativeTable = defineAsyncComponent(
  () => import('./modules/CreativeTable.vue')
)

export const PixelTable = defineAsyncComponent(
  () => import('./modules/PixelTable.vue')
)

export const TriggerTable = defineAsyncComponent(
  () => import('./modules/TriggerTable.vue')
)

export const AdsGroupTable = defineAsyncComponent(
  () => import('@/components/campaign/modules/tiktok/AdsGroupTable.vue')
)

export const ModalAdsFB = defineAsyncComponent(
  () => import('@/components/campaign/modules/facebook/modal/ModalAdsFB.vue')
)
export const ModalAdsFBV2 = defineAsyncComponent(
  () => import('@/components/campaign/modules/facebook/modal/ModalAdsFBV2.vue')
)

export const ModalAddMultipleAd = defineAsyncComponent(
  () =>
    import(
      '@/components/campaign/modules/facebook/modal/ModalAddMultipleAd.vue'
    )
)
export const ModalGeneralV2 = defineAsyncComponent(
  () => import('./modal/ModalAdGeneralV2.vue')
)
