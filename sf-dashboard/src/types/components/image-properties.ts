// Image data interfaces
export interface ImageData {
  url: string
  alt: string
  width: number | null
  height: number | null
}

export interface LinkData {
  url: string
  target: string
}

export interface UploadStatus {
  isUploading: boolean
  uploadedFiles: string[]
  errorMessage: string
}

// Tab configuration
export interface Tab {
  id: string
  label: string
}

// Utility functions
export const imageUtils = {
  // Extract number from string (e.g., "10px" -> 10)
  extractNumber: (value: string | null): number | null => {
    if (!value) return null
    const match = value.match(/(\d+)/)
    return match ? parseInt(match[1]) : null
  },

  // Get image source with helper
  getImageSrc: (path: string): string => {
    return window.helper?.src(path) || path
  },

  // Load image dimensions
  loadImageDimensions: (
    imageSrc: string
  ): Promise<{ width: number; height: number }> => {
    return new Promise((resolve, reject) => {
      const img = new Image()
      img.onload = () =>
        resolve({
          width: img.naturalWidth,
          height: img.naturalHeight,
        })
      img.onerror = () => reject(new Error('Failed to load image'))
      img.src = imageSrc
    })
  },

  // Generate HTML for image with all attributes
  generateImageHtml: (imageData: ImageData, linkData: LinkData): string => {
    let imageHtml = `<img src="${imageData.url}"`

    if (imageData.alt) imageHtml += ` alt="${imageData.alt}"`
    if (imageData.width) imageHtml += ` width="${imageData.width}"`
    if (imageData.height) imageHtml += ` height="${imageData.height}"`

    let style = ''
    if (style) imageHtml += ` style="${style}"`

    imageHtml += '>'

    // Wrap với link nếu có
    if (linkData.url) {
      let linkHtml = `<a href="${linkData.url}"`
      if (linkData.target) linkHtml += ` target="${linkData.target}"`
      linkHtml += '>'
      imageHtml = linkHtml + imageHtml + '</a>'
    }

    return imageHtml
  },
}

// Constants
export const IMAGE_PROPERTIES_CONSTANTS = {
  RECENTLY_UPLOADED_KEY: 'img-uploaded',
  ALIGNMENT_OPTIONS: [
    { label: 'None', value: '' },
    { label: 'Left', value: 'left' },
    { label: 'Right', value: 'right' },
    { label: 'Center', value: 'center' },
  ],
  LINK_TARGET_OPTIONS: [
    { label: 'Same Window (_self)', value: '_self' },
    { label: 'New Window (_blank)', value: '_blank' },
    { label: 'Parent Frame (_parent)', value: '_parent' },
    { label: 'Top Frame (_top)', value: '_top' },
  ],
  DEFAULT_TABS: [
    { id: 'info', label: 'Image Info' },
    { id: 'upload', label: 'Upload' },
    { id: 'gallery', label: 'Gallery' },
  ] as Tab[],
}
