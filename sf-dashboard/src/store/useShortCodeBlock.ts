import { defineStore } from 'pinia'
import { blockCode, landingTypeClass, LB } from '@/types/components/landing'
import { ModalGalleryInfo } from '@/types/components/gallery'
import { UploadFileInfo } from 'naive-ui'
import { ctr_creative } from '@/services/ctr_creative'
import { CB } from '@/enum/landing'
import { CODE_BLOCK } from '@/constants/codeBlocks'
import { URL_UPLOAD } from '@/constants/urls'

export default defineStore('useShortCodeBlock', () => {
  // Store state
  const landing = ref<landingTypeClass | null>(null)
  const modalVisible = ref(false)
  const editingIndex = ref<number | undefined>()
  const editingForm = ref<blockCode | undefined>()
  const draftBlocks = ref<blockCode[]>([])
  const hasUnsavedChanges = ref(false)
  const showAllBlocksFloating = ref(false)
  const showModalConfirm = ref(false)

  const LIMIT_CB_BUTTON_BLOCK = 5
  const LIMIT_CB_PROMO_CAROUSEL_CARD = 20
  const LIMIT_CB_QUESTION_ANSWER_BLOCK = 20
  const LIMIT_CB_AD_BLOCK = 5

  // Notification handler
  let noti: { destroy: () => void } | null = null

  // Utility functions
  const generateId = () => {
    const id = crypto.randomUUID().replace(/-/g, '').slice(0, 10)
    return `${Date.now().toString(36).slice(0, 10)}_${id}`
  }

  const deepClone = <T>(obj: T): T => JSON.parse(JSON.stringify(obj))

  const copyShortcode = async (id: string | undefined) => {
    if (!id) return
    await navigator.clipboard.writeText(`[${id}]`)
    showNotification(`Copied shortcode: [${id}]`)
  }

  // Computed properties
  const shortCodeBlocks = computed(() => landing.value?.jobBlocks || [])

  // Initialize landing data
  const initLanding = (landingData: landingTypeClass) => {
    landing.value = landingData
  }

  // Notification helper
  const showNotification = (
    message: string,
    type: 'success' | 'error' | 'warning' = 'success'
  ) => {
    if (noti) noti.destroy()
    noti = window.message[type](message)
    return noti
  }
  const displayedBlocks = computed(() => {
    const blocks = [...draftBlocks.value]
    if (editingForm && typeof editingIndex === 'number' && editingIndex >= 0) {
      blocks[editingIndex] = { ...editingForm.value }
    }
    return blocks
  })

  // State management (internal functions)
  const resetEditState = () => {
    editingIndex.value = undefined
    editingForm.value = undefined
  }

  const selectFirstBlock = () => {
    const blocks = landing.value?.jobBlocks || []
    if (blocks.length > 0 && editingForm.value === undefined) {
      editingForm.value = undefined
      nextTick(() => editBlock(0))
    }
  }

  // Initialize draft blocks from original blocks (internal)
  const initDraftBlocks = () => {
    draftBlocks.value = deepClone(shortCodeBlocks.value || [])
    hasUnsavedChanges.value = false
  }

  // Modal management
  const openModal = () => {
    modalVisible.value = true
    initDraftBlocks()
    closeAllBlocksFloating()
    nextTick(selectFirstBlock)
  }

  const closeMainModal = () => {
    modalVisible.value = false
    resetEditState()
  }

  const handleShowChange = (value: boolean) => {
    if (!value && modalVisible.value) {
      if (hasUnsavedChanges.value) {
        showModalConfirm.value = true
        return
      } else {
        closeMainModal()
      }
    } else {
      modalVisible.value = value
    }
  }

  const confirmClose = () => {
    draftBlocks.value = deepClone(shortCodeBlocks.value || [])
    hasUnsavedChanges.value = false
    showModalConfirm.value = false
    closeMainModal()
  }

  const cancelClose = () => {
    showModalConfirm.value = false
  }

  const limitArr = (template: string) => {
    switch (template) {
      case CB.BUTTON_BLOCK:
        return LIMIT_CB_BUTTON_BLOCK
      case CB.PROMO_CAROUSEL_CARD:
        return LIMIT_CB_PROMO_CAROUSEL_CARD
      case CB.QUESTION_ANSWER_BLOCK:
        return LIMIT_CB_QUESTION_ANSWER_BLOCK
      case CB.AD_BLOCK:
        return LIMIT_CB_AD_BLOCK
      default:
        return 0
    }
  }
  const validateArrBlock = (id: string, template: string) => {
    const blockIndex = draftBlocks.value.findIndex((block) => block.id === id)
    if (blockIndex === -1) return

    const block = draftBlocks.value[blockIndex]
    let currentArray: any[] = []

    switch (template) {
      case CB.BUTTON_BLOCK:
        currentArray = block[CB.BUTTON_BLOCK] || []
        break
      case CB.PROMO_CAROUSEL_CARD:
        currentArray = block[CB.PROMO_CAROUSEL_CARD] || []
        break
      case CB.QUESTION_ANSWER_BLOCK:
        currentArray = block[CB.QUESTION_ANSWER_BLOCK] || []
        break
      case CB.AD_BLOCK:
        currentArray = block[CB.AD_BLOCK] || []
        break
    }

    if (currentArray.length >= limitArr(template)) {
      showNotification(
        `No more than ${limitArr(template)} items can be added.`,
        'warning'
      )
      return false
    }
    return true
  }

  const addArrayblockItemById = (id: string, template: CB) => {
    const blockIndex = draftBlocks.value.findIndex((block) => block.id === id)
    if (blockIndex === -1 || !validateArrBlock(id, template)) return

    const block = draftBlocks.value[blockIndex]

    const templateMap: Record<CB, keyof blockCode> = {
      [CB.BUTTON_BLOCK]: CB.BUTTON_BLOCK,
      [CB.PROMO_CAROUSEL_CARD]: CB.PROMO_CAROUSEL_CARD,
      [CB.QUESTION_ANSWER_BLOCK]: CB.QUESTION_ANSWER_BLOCK,
      [CB.AD_BLOCK]: CB.AD_BLOCK,
      [CB.APP_DOWNLOAD_CARD]: CB.APP_DOWNLOAD_CARD,

      // trường hợp giữ logic cũ của codeBlock 1, 2
      [CB.JOB_POSTING_CARD]: 'items',
      [CB.PRICE_OFFER_CARD]: 'items',
    }

    const propertyName = templateMap[template]
    if (!propertyName) return

    const newItem = deepClone(CODE_BLOCK[template])

    if (Array.isArray(block[propertyName])) {
      const currentItems = block[propertyName] as any[]

      const updatedBlock = {
        ...block,
        [propertyName]: [...currentItems, newItem],
      }

      draftBlocks.value[blockIndex] = updatedBlock

      if (editingForm.value?.id === id) {
        editingForm.value = deepClone(updatedBlock)
      }

      hasUnsavedChanges.value = true
    }
  }

  // Block management
  const addNewBlock = (template: string) => {
    const defaultBlockData = JSON.parse(
      JSON.stringify(CODE_BLOCK[template as keyof typeof CODE_BLOCK])
    )
    const newBlock: blockCode = {
      id: generateId(),
      template,
    }

    switch (template) {
      case CB.BUTTON_BLOCK:
        newBlock[CB.BUTTON_BLOCK] = [defaultBlockData]
        break
      case CB.PROMO_CAROUSEL_CARD:
        newBlock[CB.PROMO_CAROUSEL_CARD] = [defaultBlockData]
        break
      case CB.QUESTION_ANSWER_BLOCK:
        newBlock[CB.QUESTION_ANSWER_BLOCK] = [defaultBlockData]
        break
      case CB.AD_BLOCK:
        newBlock[CB.AD_BLOCK] = [defaultBlockData]
        break
      case CB.APP_DOWNLOAD_CARD: {
        newBlock[CB.APP_DOWNLOAD_CARD] = defaultBlockData

        break
      }
      default:
        newBlock.items = defaultBlockData
    }

    draftBlocks.value.push(newBlock)
    hasUnsavedChanges.value = true
    showNotification(`Added new ${convertName(template)}`)

    const newIndex = draftBlocks.value.length - 1
    editBlock(newIndex)
  }

  const editBlock = (index: number) => {
    let block = draftBlocks.value[index]
    if (!block) return

    editingForm.value = undefined
    nextTick(() => {
      editingIndex.value = index
      editingForm.value = deepClone(block)
    })
  }

  // Field updates
  const updateField = (field: string, value: any) => {
    if (typeof editingIndex.value !== 'number' || !editingForm.value) return

    const currentBlock = draftBlocks.value[editingIndex.value]
    if (!currentBlock) return

    const templateFieldMap = {
      [CB.APP_DOWNLOAD_CARD]: CB.APP_DOWNLOAD_CARD,
    } as const

    let updatedBlock = { ...currentBlock }
    const template = currentBlock.template
    const propertyKey =
      templateFieldMap[template as keyof typeof templateFieldMap] || 'items'

    if (!editingForm.value[propertyKey]) {
      ;(editingForm.value as any)[propertyKey] = {}
    }
    ;((editingForm.value as any)[propertyKey] as Record<string, any>)[field] =
      value
    ;(updatedBlock as any)[propertyKey] = {
      ...(currentBlock as any)[propertyKey],
      [field]: value,
    }

    draftBlocks.value[editingIndex.value] = updatedBlock
    hasUnsavedChanges.value = true
  }

  // Update arrayblock item field
  const updateArrayblockValue = (index: number, field: string, value: any) => {
    if (editingIndex.value === undefined || !editingForm.value) return

    const currentBlock = draftBlocks.value[editingIndex.value]
    if (!currentBlock?.template) return

    const templateConfig = {
      // Array
      arrayTypes: {
        [CB.BUTTON_BLOCK]: CB.BUTTON_BLOCK,
        [CB.PROMO_CAROUSEL_CARD]: CB.PROMO_CAROUSEL_CARD,
        [CB.QUESTION_ANSWER_BLOCK]: CB.QUESTION_ANSWER_BLOCK,
        [CB.AD_BLOCK]: CB.AD_BLOCK,
      },
      // Object
      objectTypes: {
        [CB.APP_DOWNLOAD_CARD]: CB.APP_DOWNLOAD_CARD,
      },
    } as const

    const template = currentBlock.template
    let updatedBlock = { ...currentBlock }

    const objectProperty =
      templateConfig.objectTypes[
        template as keyof typeof templateConfig.objectTypes
      ]
    if (objectProperty) {
      ;(updatedBlock as any)[objectProperty] = {
        ...(currentBlock as any)[objectProperty],
        [field]: value,
      }
    } else {
      const arrayProperty =
        templateConfig.arrayTypes[
          template as keyof typeof templateConfig.arrayTypes
        ]
      if (!arrayProperty) return

      const items = [...((currentBlock as any)[arrayProperty] || [])]
      if (!items[index]) return

      items[index] = { ...items[index], [field]: value }
      ;(updatedBlock as any)[arrayProperty] = items
    }

    draftBlocks.value[editingIndex.value] = updatedBlock
    editingForm.value = deepClone(updatedBlock)
    hasUnsavedChanges.value = true
  }

  const duplicateArrayblockItem = (
    index: number,
    id: string,
    template: string
  ) => {
    if (!validateArrBlock(id, template) || editingIndex.value === undefined)
      return

    const currentBlock = draftBlocks.value[editingIndex.value]
    if (!currentBlock) return

    const templateConfig = {
      [CB.BUTTON_BLOCK]: CB.BUTTON_BLOCK,
      [CB.PROMO_CAROUSEL_CARD]: CB.PROMO_CAROUSEL_CARD,
      [CB.QUESTION_ANSWER_BLOCK]: CB.QUESTION_ANSWER_BLOCK,
      [CB.AD_BLOCK]: CB.AD_BLOCK,
    } as const

    const propertyName = templateConfig[template as keyof typeof templateConfig]
    if (!propertyName) return

    const currentArray = (currentBlock as any)[propertyName]
    if (!currentArray?.[index]) return

    // Clone item và tạo updated block
    const itemToDuplicate = deepClone(currentArray[index])
    const updatedArray = [...currentArray]
    updatedArray.splice(index + 1, 0, itemToDuplicate)

    const updatedBlock = {
      ...currentBlock,
      [propertyName]: updatedArray,
    }

    draftBlocks.value[editingIndex.value] = updatedBlock
    editingForm.value = deepClone(updatedBlock)
    hasUnsavedChanges.value = true
    showNotification('Duplicated item successfully!')
  }

  const deleteArrayblockValue = (index: number, template: string) => {
    if (typeof editingIndex.value !== 'number' || !editingForm.value) return

    const currentBlock = draftBlocks.value[editingIndex.value]
    if (!currentBlock) return

    // Template configuration với validation message
    const templateConfig = {
      [CB.BUTTON_BLOCK]: {
        property: CB.BUTTON_BLOCK,
        minMessage: 'At least one button is required',
      },
      [CB.PROMO_CAROUSEL_CARD]: {
        property: CB.PROMO_CAROUSEL_CARD,
        minMessage: 'At least one carousel item is required',
      },
      [CB.QUESTION_ANSWER_BLOCK]: {
        property: CB.QUESTION_ANSWER_BLOCK,
        minMessage: 'At least one Q&A item is required',
      },
      [CB.AD_BLOCK]: {
        property: CB.AD_BLOCK,
        minMessage: 'At least one ad block is required',
      },
    } as const

    const config = templateConfig[template as keyof typeof templateConfig]
    if (!config) return

    const currentArray = (currentBlock as any)[config.property] || []

    // Check minimum requirement
    if (currentArray.length <= 1) {
      showNotification(config.minMessage, 'warning')
      return
    }

    // Create updated block with filtered array
    const filteredArray = currentArray.filter(
      (_: any, i: number) => i !== index
    )
    const updatedBlock = {
      ...currentBlock,
      [config.property]: filteredArray,
    }

    draftBlocks.value[editingIndex.value] = updatedBlock
    editingForm.value = deepClone(updatedBlock)
    hasUnsavedChanges.value = true
  }

  // Copy shortcode
  const handleCopyShortcode = async (id: string | undefined) => {
    await copyShortcode(id)
  }

  // Floating blocks
  const openAllBlocksFloating = () => {
    // Validate all blocks before saving
    const invalidBlocks: string[] = []

    draftBlocks.value.forEach((block, index) => {
      if (block.template === CB.AD_BLOCK && block.template_ad_block) {
        block.template_ad_block.forEach((adBlock, adIndex) => {
          if (!adBlock.adMode) {
            invalidBlocks.push(
              `Ad Block ${index + 1} - Item ${adIndex + 1}: Ad Mode is required`
            )
          }
          if (adBlock.adMode === 'gam' && !adBlock.adType) {
            invalidBlocks.push(
              `Ad Block ${index + 1} - Item ${
                adIndex + 1
              }: Ad Type is required when using GAM mode`
            )
          }
        })
      }
      // // Skip validation for AD_BLOCK since we handled it above
      // if (block.template !== CB.AD_BLOCK) {
      //   const requiredFields = ['title', 'description', 'buttonText'] as const
      //   const missingFields = requiredFields.filter(
      //     (field) => !block.items?.[field]?.trim()
      //   )

      //   if (missingFields.length > 0) {
      //     const blockName = `${block.template} [${block.id}]`
      //     const errors = missingFields.map(
      //       (field) => field.charAt(0).toUpperCase() + field.slice(1)
      //     )
      //     invalidBlocks.push(
      //       `${blockName}: ${errors.join(', ')} cannot be empty`
      //     )
      //   }
      // }
    })

    if (invalidBlocks.length > 0) {
      showNotification(invalidBlocks.join('\n'), 'error')
      return
    }

    // Save to landing
    if (landing.value) {
      landing.value.jobBlocks = deepClone(draftBlocks.value)
    }
    hasUnsavedChanges.value = false

    showAllBlocksFloating.value = true
    closeMainModal()
    nextTick(() => {
      const event = new CustomEvent('resetPosition')
      document.dispatchEvent(event)
    })
  }

  const closeAllBlocksFloating = () => {
    showAllBlocksFloating.value = false
  }

  // --- Image Upload Logic ---
  const handleImageUpload = async (file: File, arrayBlockIndex?: number) => {
    if (!file) return null
    const formData = new FormData()
    formData.append('file', file)
    try {
      const result = await ctr_creative.uploadImage(formData)
      const thumb = result.data_object.thumb[0]
      if (result?.status === 'success' && thumb) {
        const imageUrl = URL_UPLOAD + thumb
        if (typeof arrayBlockIndex === 'number') {
          // Update image for specific array block item
          updateArrayblockValue(arrayBlockIndex, 'imageUrl', imageUrl)
        } else {
          // Update image for main block
          updateImageUrl(imageUrl)
        }
        return imageUrl
      }
    } catch {
      window.message.error('Upload failed')
      return null
    }
    return null
  }

  const updateImageUrl = (imageUrl: string) => {
    updateFormValue('imageUrl', imageUrl)
    window.message.success('Image updated successfully!')
  }

  const updateFormValue = (
    field: string,
    value: string | number | boolean | undefined
  ) => {
    if (value !== undefined) {
      updateField(field, value)
    }
  }
  const showModalGallery = ref<boolean>(false)
  const currentArrayBlockIndex = ref<number | null>(null)

  // --- Gallery Logic ---
  const dataModalGallery = ref<ModalGalleryInfo>(
    new ModalGalleryInfo({
      isModal: true,
      singleSelection: true,
    })
  )
  const openModalGallery = (arrayBlockIndex?: number) => {
    showModalGallery.value = true
    dataModalGallery.value.selectedMedia = []
    dataModalGallery.value.numberOfMediaSelected = 0
    dataModalGallery.value.singleSelection = true
    currentArrayBlockIndex.value =
      typeof arrayBlockIndex === 'number' ? arrayBlockIndex : null
  }
  const selectFromGallery = () => {
    if (dataModalGallery.value.selectedMedia.length > 0) {
      const selectedImageUrl = dataModalGallery.value.selectedMedia[0]
      const fullImageUrl = URL_UPLOAD + selectedImageUrl
      if (currentArrayBlockIndex.value !== null) {
        // Update image for specific array block item
        updateArrayblockValue(
          currentArrayBlockIndex.value,
          'imageUrl',
          fullImageUrl
        )
      } else {
        // Update image for main block
        updateImageUrl(fullImageUrl)
      }
      showModalGallery.value = false
    } else {
      window.message.warning('Please select one image')
    }
  }
  const onBeforeUpload = async (fileInfo: UploadFileInfo) => {
    const file = (fileInfo.file as any)?.file as File
    if (!file || !(file instanceof File)) {
      window.message.error('Invalid file')
      return false
    }
    await handleImageUpload(file)
    return false
  }

  const getBlockData = (block: blockCode) => {
    if (!block) return []

    switch (block.template) {
      case CB.BUTTON_BLOCK:
        return block[CB.BUTTON_BLOCK] || []
      case CB.PROMO_CAROUSEL_CARD:
        return block[CB.PROMO_CAROUSEL_CARD] || []
      case CB.QUESTION_ANSWER_BLOCK:
        return block[CB.QUESTION_ANSWER_BLOCK] || []
      case CB.AD_BLOCK:
        return block[CB.AD_BLOCK] || []
      case CB.APP_DOWNLOAD_CARD:
        return block[CB.APP_DOWNLOAD_CARD] || []
      case CB.JOB_POSTING_CARD:
      case CB.PRICE_OFFER_CARD:
        return block.items || {}
      default:
        return block.items || {}
    }
  }

  const convertName = (template: any) => {
    switch (template) {
      case CB.JOB_POSTING_CARD:
        return LB.JOB_POSTING_CARD
      case CB.PRICE_OFFER_CARD:
        return LB.PRICE_OFFER_CARD
      case CB.BUTTON_BLOCK:
        return LB.BUTTON_BLOCK
      case CB.APP_DOWNLOAD_CARD:
        return LB.APP_DOWNLOAD_CARD
      case CB.PROMO_CAROUSEL_CARD:
        return LB.PROMO_CAROUSEL_CARD
      case CB.QUESTION_ANSWER_BLOCK:
        return LB.QUESTION_ANSWER_BLOCK
      case CB.AD_BLOCK:
        return LB.AD_BLOCK
      default:
        return template
    }
  }

  return {
    // State
    landing,
    modalVisible,
    editingIndex,
    editingForm,
    draftBlocks,
    hasUnsavedChanges,
    showAllBlocksFloating,
    showModalConfirm,
    showModalGallery,
    dataModalGallery,

    // Computed
    shortCodeBlocks,
    displayedBlocks,

    // Actions
    initLanding,
    openModal,
    closeMainModal,
    handleShowChange,
    confirmClose,
    cancelClose,
    addNewBlock,
    editBlock,
    resetEditState,
    updateField,
    updateArrayblockValue,
    handleCopyShortcode,
    openAllBlocksFloating,
    closeAllBlocksFloating,
    showNotification,
    addArrayblockItemById,
    duplicateArrayblockItem,
    handleImageUpload,
    openModalGallery,
    selectFromGallery,
    updateFormValue,
    onBeforeUpload,
    getBlockData,
    convertName,
    // Utilities
    generateId,
    deepClone,
    copyShortcode,
    deleteArrayblockValue,
  }
})
