export const AccountID = defineAsyncComponent(
  () => import('./cell/AccountID.vue')
)
export const AccountNameAd = defineAsyncComponent(
  () => import('./cell/AccountNameAd.vue')
)
export const AdvertiserName = defineAsyncComponent(
  () => import('./cell/AdvertiserName.vue')
)
export const LabelsAccountAd = defineAsyncComponent(
  () => import('./cell/LabelsAccountAd.vue')
)
export const CategoriesAccountAd = defineAsyncComponent(
  () => import('./cell/CategoriesAccountAd.vue')
)

export const ChooseLabelsModal = defineAsyncComponent(
  () => import('./ChooseLabelsModal.vue')
)
export const ChooseCategoriesModal = defineAsyncComponent(
  () => import('./ChooseCategoriesModal.vue')
)
export const CreateLabelModal = defineAsyncComponent(
  () => import('./CreateLabelModal.vue')
)
