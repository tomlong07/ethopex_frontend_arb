// constants/urls.ts
const URL_UPLOAD = 'https://arb-ul.pubpowerplatform.io'
const URL_IMAGE = '/api/v1/image'
const URL_VIDEO = '/api/v1/video-mp4'
const URL_AUDIO = '/api/v1/audio'

// Page routes
export const LOGIN_URL = '/login'
export const QUICK_ALT_URL = '/quick_alt'
export const API_DOCUMENT = '/api-document'

// API endpoints
export const FULL_URL_MEDIA = `${URL_UPLOAD}${URL_IMAGE}`
export const FULL_URL_VIDEO = `${URL_UPLOAD}${URL_VIDEO}`
export const FULL_URL_AUDIO = `${URL_UPLOAD}${URL_AUDIO}`
export { URL_UPLOAD }

// CDN URLs
export const CDN_CK_EDITOR = 'https://cdn.ckeditor.com/4.22.1/full/ckeditor.js'
export const CDN_IMAGE = 'https://s3.pp-cdn.net'
export const CDN_IMAGE_MINIO_S3 = CDN_IMAGE + '/s3-pw'
export const CDN_IMAGE_MINIO_S3_IMAGE = CDN_IMAGE + '/s3-pw/arb/images'
export const CDN_IMAGE_MINIO_S3_ICON = CDN_IMAGE + '/s3-pw/arb/icons'
export const CDN_IMAGE_MINIO_S1 = CDN_IMAGE + '/s1-cdn'

export const ICON_VERSION = '22' //Đổi để reset cache icon svg

// Default images
export const DEFAULT_ICON =
  '/assets/img/thumb_da200eb515c2d232b2b9bc36999b35e0.jpg'
export const NO_THUMBNAIL =
  '/assets/img/thumb_007cc1f0c93c0758ea61a23e0888891a.png'
