import { defineStore } from 'pinia'

import {
  CreativeMediaModelType,
  creativeRequestModelType,
  PermissionCreativeRequestManage,
} from '@/types/components/creative-request'
import { ModeClassString } from '@/types/components/base'
import {
  CreativeStateManager,
  creativeTypeClass,
  newCreativeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import { ModalStateCreative } from '@/types/components/modal'

export default defineStore('useCreativeRequestStore', () => {
  const creativeMeadiaModel = ref<CreativeMediaModelType>({
    id: null,
    request_id: null,
    medias: [],
    user_id: null,
    user_email: null,
  })
  const isSubmitBtnLoading = ref<boolean>(false)
  const listCreativeMeadiaModel = ref<CreativeMediaModelType[]>([])

  const dataCreativeRequestModel = {
    id: null,
    name: null,
    keyword_set_id: null,
    description: null,
    landing_page_id: null,
    status: null,
    user_id: null,
  }
  const isLoading = ref<boolean>(false)

  const dataModal = ref<ModalStateCreative>({})

  const stateManager = new CreativeStateManager({
    dataModal,
    route: window.route,
    isModalAd: false,
  })
  const status = ref<StatusCreativeManager>(
    new StatusCreativeManager({
      showEditPreview: false,
      isUploading: false,
      isUploadingThumbnail: false,
    })
  )
  const cre = ref<creativeTypeClass>(
    stateManager.isAddPage()
      ? newCreativeClass(stateManager.createInfoModal())
      : new creativeTypeClass({})
  )
  const modeData = ref<ModeClassString>(new ModeClassString(window.route))
  const permissionCreativeRequest = ref<PermissionCreativeRequestManage>(
    new PermissionCreativeRequestManage()
  )
  const isCreatorMedia = computed<boolean>(() => {
    return (
      modeData.value.isEditPage() &&
      permissionCreativeRequest.value.isAcceptCreatorMedia()
    )
  })
  const isPermissionUpdate = computed<boolean>(() => {
    return (
      modeData.value.isEditPage() &&
      permissionCreativeRequest.value.isAcceptUpdate()
    )
  })
  const isNotEdit = computed<boolean>(() => {
    return (
      modeData.value.isEditPage() &&
      permissionCreativeRequest.value.notAcceptUpdate()
    )
  })
  const prefetch = () => {
    modeData.value = new ModeClassString(window.route)
  }

  const creativeRequestModel = ref<creativeRequestModelType>({
    ...dataCreativeRequestModel,
  })
  const clearData = () => {
    creativeRequestModel.value = { ...dataCreativeRequestModel }
  }
  const clearMedia = () => {
    listCreativeMeadiaModel.value = []
  }
  return {
    creativeRequestModel,
    modeData,
    permissionCreativeRequest,
    isCreatorMedia,
    isPermissionUpdate,
    isSubmitBtnLoading,
    isNotEdit,
    clearData,
    prefetch,
    clearMedia,
    listCreativeMeadiaModel,
    creativeMeadiaModel,
    status,
    cre,
    stateManager,
    isLoading,
  }
})
