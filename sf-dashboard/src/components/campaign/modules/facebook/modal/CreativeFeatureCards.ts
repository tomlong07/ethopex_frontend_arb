import { CreativeMediaType, displayType, typeStatus } from '@/enum/creative'
import { CreativeFeaturesSpec } from '@/types/components/campaign-v2'
import { CDN_IMAGE_MINIO_S3 } from '@/constants/urls'

export interface SpriteBackground {
  position: string
  size: string
}

export interface CreativeFeatureCard {
  key: keyof CreativeFeaturesSpec
  label: string
  type_status: typeStatus
  type: CreativeMediaType
  display_type: displayType
  url: string
  message: string
  bg?: SpriteBackground | any
  tooltip?: string
}

export const CreativeFeatureCards: CreativeFeatureCard[] = [
  // ==========single_image
  {
    key: 'image_templates',
    label: 'Add overlays',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'We’ll add text options as overlays on top of your image.',
    bg: { position: '0px -1210px', size: '171px 2425px' },
  },
  {
    key: 'image_touchups',
    label: 'Visual touch-ups',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/crop.png`,
    display_type: displayType.STATIC,
    message: 'We’ll crop and expand media, and animate text.',
    bg: {},
  },
  {
    key: 'image_music',
    label: 'Add music',
    type_status: typeStatus.ALL,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'Adding music Piano for Brian by Brent Bourgeois to your image.',
    bg: { position: '0px -906px', size: '171px 2425px' },
  },
  {
    key: 'text_optimizations',
    label: 'Text improvements',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message:
      'Any text you provide may appear as primary text, headline or description.',
    bg: { position: '0px -1826px', size: '171px 2425px' },
  },
  {
    key: 'image_animations',
    label: 'Add animation',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/videos/fb3.mp4`,
    display_type: displayType.VIDEO,
    message: 'Animating image and/or text to increase visual interest.',
    bg: { position: '0px -303px', size: '171px 2425px' },
  },
  {
    key: 'enhance_cta',
    label: 'Enhance CTA',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'We’ll pair key phrases with your CTA and optimize CTA text.',
    bg: { position: '0px -302px', size: '171px 2425px' },
  },
  {
    key: 'flex_media',
    label: 'Flex media',
    type_status: typeStatus.DEFAULT,
    type: CreativeMediaType.SINGLE_IMAGE,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/flex-media.png`,
    display_type: displayType.STATIC,
    message:
      'Show media you chose for a specific aspect ratio across all placements.',
    bg: {},
  },

  // ============ single_video
  {
    key: 'creative_stickers',
    label: 'Create sticker CTA',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/mesh-shopping-bag.jpg`,
    display_type: displayType.STATIC,
    message:
      'Adding Al-generated stickers to CTAS in your Stories ads to customize your ad...',
    bg: { size: '171px 2425px' },
  },
  {
    key: 'video_auto_crop',
    label: 'Visual touch-ups',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/videos/fb2.mp4`,
    display_type: displayType.VIDEO,
    message: 'Cropping video to fit more placements.',
    bg: {},
  },
  {
    key: 'text_optimizations',
    label: 'Text improvements',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message:
      'Any text you provide may appear as primary text, headline or description.',
    bg: { position: '0px -1826px', size: '171px 2425px' },
  },
  {
    key: 'video_effects',
    label: 'Add video effects',
    type_status: typeStatus.NONE,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/videos/fb.mp4`,
    display_type: displayType.VIDEO,
    message: 'We’ll enhance color and sharpen visuals on your video.',
    bg: {},
  },
  {
    key: 'video_expand',
    label: 'Expand video',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/expand-video.gif`,
    display_type: displayType.STATIC,
    message: '',
    bg: {},
  },
  {
    key: 'enhance_cta',
    label: 'Enhance CTA',
    type_status: typeStatus.AI,
    type: CreativeMediaType.SINGLE_VIDEO,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'We’ll pair key phrases with your CTA and optimize CTA text.',
    bg: { position: '0px -302px', size: '171px 2425px' },
  },

  //========== carousel
  {
    key: 'profile_end_card',
    label: 'Profile end card',
    type_status: typeStatus.AI,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'We’ll pair key phrases with your CTA and optimize CTA text.',
    bg: { position: '0px -302px', size: '171px 2425px' },
  },
  {
    key: 'image_touchups',
    label: 'Visual touch-ups',
    type_status: typeStatus.AI,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/crop.png`,
    display_type: displayType.STATIC,
    message: 'We’ll crop and expand media, and animate text.',
    bg: {},
  },
  {
    key: 'image_music',
    label: 'Add music',
    type_status: typeStatus.DEFAULT,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'Adding music Piano for Brian by Brent Bourgeois to your image.',
    bg: { position: '0px -906px', size: '171px 2425px' },
  },
  {
    key: 'dynamic_description',
    label: 'Dynamic description',
    type_status: typeStatus.NONE,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/img1.png`,
    display_type: displayType.STATIC,
    message:
      'Any text you provide may appear as primary text, headline or description.',
    bg: {},
  },
  {
    key: 'highlight_carousel_card',
    label: 'Highlight carousel card',
    type_status: typeStatus.NONE,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/img2.png`,
    display_type: displayType.STATIC,
    message:
      'Any text you provide may appear as primary text, headline or description.',
    bg: {},
  },
  {
    key: 'adapt_multi_image_format',
    label: 'Adapt multi-image format',
    type_status: typeStatus.DEFAULT,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/img3.png`,
    display_type: displayType.STATIC,
    message: '',
    bg: {},
  },
  {
    key: 'enhance_cta',
    label: 'Enhance CTA',
    type_status: typeStatus.AI,
    type: CreativeMediaType.CAROUSEL,
    url: `${CDN_IMAGE_MINIO_S3}/arb/images/single_image.png`,
    display_type: displayType.SPRITE,
    message: 'We’ll pair key phrases with your CTA and optimize CTA text.',
    bg: { position: '0px -302px', size: '171px 2425px' },
  },
]
