import { defineStore } from 'pinia'
import { ModalGalleryInfo } from '@/types/components/gallery'
import { validateImageThumb } from '@/components/creative3/helper'
import {
  type ImageData,
  type LinkData,
  type UploadStatus,
  imageUtils,
  IMAGE_PROPERTIES_CONSTANTS,
} from '@/types/components/image-properties'
import { ctr_creative } from '@/services/ctr_creative'

export const useImagePropertiesStore = defineStore('imageProperties', () => {
  // State
  const activeTab = ref('info')
  const isModalOpen = ref(false)

  // Image data
  const imageData = ref<ImageData>({
    url: '',
    alt: '',
    width: null,
    height: null,
  })

  // Link data
  const linkData = ref<LinkData>({
    url: '',
    target: '_self',
  })

  // Upload status
  const uploadStatus = ref<UploadStatus>({
    isUploading: false,
    uploadedFiles: [],
    errorMessage: '',
  })

  // Gallery data
  const dataModalGallery = ref<ModalGalleryInfo>(
    new ModalGalleryInfo({
      isModal: true,
      singleSelection: true,
    })
  )

  // Computed
  const hasImageUrl = computed(() => !!imageData.value.url)

  const tabs = computed(() => IMAGE_PROPERTIES_CONSTANTS.DEFAULT_TABS)

  // Actions - Image Data Management
  const loadImageDataFromElement = (
    editingImageElement: HTMLImageElement | null
  ) => {
    if (editingImageElement) {
      const img = editingImageElement
      // const computedStyle = window.getComputedStyle(img)

      imageData.value = {
        url: img.src || '',
        alt: img.alt || '',
        width:
          img.width ||
          imageUtils.extractNumber(img.getAttribute('width')) ||
          null,
        height:
          img.height ||
          imageUtils.extractNumber(img.getAttribute('height')) ||
          null,
      }

      // Check if image is wrapped in a link
      const parentLink = img.closest('a')
      if (parentLink) {
        linkData.value = {
          url: parentLink.href || '',
          target: parentLink.target || '_self',
        }
      } else {
        linkData.value = {
          url: '',
          target: '_self',
        }
      }
    }
  }

  const updateImageData = (newImageData: Partial<ImageData>) => {
    imageData.value = { ...imageData.value, ...newImageData }
  }

  const updateLinkData = (newLinkData: Partial<LinkData>) => {
    linkData.value = { ...linkData.value, ...newLinkData }
  }

  // Actions - Upload Management
  const loadRecentlyUploadedImages = () => {
    try {
      const stored = localStorage.getItem(
        IMAGE_PROPERTIES_CONSTANTS.RECENTLY_UPLOADED_KEY
      )
      if (stored) {
        const parsedImages = JSON.parse(stored)
        if (Array.isArray(parsedImages)) {
          uploadStatus.value.uploadedFiles = parsedImages
        }
      }
    } catch {
      // Silently reset uploaded files without console warning
      uploadStatus.value.uploadedFiles = []
    }
  }

  const saveRecentlyUploadedImages = () => {
    try {
      localStorage.setItem(
        IMAGE_PROPERTIES_CONSTANTS.RECENTLY_UPLOADED_KEY,
        JSON.stringify(uploadStatus.value.uploadedFiles)
      )
    } catch {
      // Silent fail without console warning
    }
  }

  const addToRecentlyUploaded = (imagePath: string) => {
    const existingIndex = uploadStatus.value.uploadedFiles.indexOf(imagePath)
    if (existingIndex !== -1) {
      uploadStatus.value.uploadedFiles.splice(existingIndex, 1)
    }

    uploadStatus.value.uploadedFiles.push(imagePath)
    saveRecentlyUploadedImages()
  }

  // Actions - Image Selection
  const selectImageFromPath = async (imageSrc: string) => {
    const fullImageSrc = imageUtils.getImageSrc(imageSrc)
    imageData.value.url = fullImageSrc
    activeTab.value = 'info'

    try {
      const dimensions = await imageUtils.loadImageDimensions(fullImageSrc)
      imageData.value.width = dimensions.width
      imageData.value.height = dimensions.height
    } catch {
      // Silently handle dimension loading error - don't show console warnings
      imageData.value.width = null
      imageData.value.height = null
    }
  }

  const selectImageFromGallery = () => {
    if (dataModalGallery.value.selectedMedia.length > 0) {
      const imageSrc = dataModalGallery.value.selectedMedia[0]
      selectImageFromPath(imageSrc)
    }
  }

  // Actions - Upload
  const validateBeforeUpload = async (data: any): Promise<boolean> => {
    try {
      return await validateImageThumb(data, false)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Image validation failed'
      window.message.warning(errorMessage)
      uploadStatus.value.errorMessage = errorMessage
      return false
    }
  }

  // Function xử lý upload manual
  const handleManualUpload = async (file: File) => {
    uploadStatus.value.isUploading = true
    uploadStatus.value.errorMessage = ''

    try {
      const formData = new FormData()
      formData.append('file', file)
      const result = await ctr_creative.uploadImage(formData)

      if (!result || result.status === 'error') {
        throw new Error(
          result?.errors?.[0]?.message || result?.message || 'Upload failed'
        )
      }

      const uploadedPath = findUploadedPath(result)
      if (!uploadedPath) {
        throw new Error('Upload successful but image path not found')
      }

      await processSuccessfulUpload(uploadedPath)
    } catch (error: any) {
      uploadStatus.value.errorMessage = error.message
      window.message.error(error.message)
    } finally {
      uploadStatus.value.isUploading = false
    }
  }

  // Helper function để tìm đường dẫn ảnh từ response
  const findUploadedPath = (result: any): string | undefined => {
    const paths = [
      result?.data_object?.thumb?.[0],
      result?.data?.thumb?.[0],
      result?.thumb?.[0],
      result?.path,
      result?.data?.path,
      result?.data_object?.path,
    ]
    return paths.find((path) => path)
  }

  // Helper function xử lý khi upload thành công
  const processSuccessfulUpload = async (uploadedPath: string) => {
    addToRecentlyUploaded(uploadedPath)
    const fullImageSrc = imageUtils.getImageSrc(uploadedPath)
    imageData.value.url = fullImageSrc
    window.message.success('Upload photo successfully!')

    // Chuyển tab và load dimensions
    setTimeout(async () => {
      activeTab.value = 'info'
      try {
        const dimensions = await imageUtils.loadImageDimensions(fullImageSrc)
        imageData.value.width = dimensions.width
        imageData.value.height = dimensions.height
      } catch {
        imageData.value.width = null
        imageData.value.height = null
      }
    }, 300)
  }

  // Actions - Tab Management
  const setActiveTab = (tabId: string) => {
    activeTab.value = tabId
  }

  // Actions - Modal Management
  const openModal = () => {
    isModalOpen.value = true
    loadRecentlyUploadedImages()
  }

  const closeModal = () => {
    isModalOpen.value = false
    resetForm()
  }

  const resetForm = () => {
    imageData.value = {
      url: '',
      alt: '',
      width: null,
      height: null,
    }
    linkData.value = {
      url: '',
      target: '_self',
    }
    dataModalGallery.value.selectedMedia = []
    uploadStatus.value.errorMessage = ''
    uploadStatus.value.isUploading = false
    activeTab.value = 'info'
  }

  // Actions - Editor Integration
  const insertImageToEditor = (
    editorInstance: any,
    editingImageElement?: HTMLImageElement | null
  ) => {
    if (!imageData.value.url) {
      window.message.warning('Please select or enter an image URL')
      return
    }

    const imageHtml = imageUtils.generateImageHtml(
      imageData.value,
      linkData.value
    )

    // Insert hoặc update ảnh trong editor
    if (editorInstance) {
      if (editingImageElement) {
        try {
          const ckElement = new window.CKEDITOR.dom.element(editingImageElement)
          const range = editorInstance.createRange()
          range.setStartBefore(ckElement)
          range.setEndAfter(ckElement)

          const selection = editorInstance.getSelection()
          selection.selectRanges([range])
          editorInstance.insertHtml(imageHtml)
        } catch {
          editorInstance.insertHtml(imageHtml)
        }
      } else {
        editorInstance.insertHtml(imageHtml)
      }
    }

    return imageData.value.url
  }

  return {
    // State
    activeTab,
    isModalOpen,
    imageData,
    linkData,
    uploadStatus,
    dataModalGallery,

    // Computed
    hasImageUrl,
    tabs,

    // Actions
    loadImageDataFromElement,
    updateImageData,
    updateLinkData,
    loadRecentlyUploadedImages,
    addToRecentlyUploaded,
    selectImageFromPath,
    selectImageFromGallery,
    validateBeforeUpload,
    handleManualUpload,
    setActiveTab,
    openModal,
    closeModal,
    resetForm,
    insertImageToEditor,
  }
})
