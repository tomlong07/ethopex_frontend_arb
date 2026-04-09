export const SiteNameStatus = [
  { label: 'Approved', value: 'approved', style: { color: 'green' } },
  { label: 'Pending', value: 'pending' },
  { label: 'Rejected', value: 'rejected', style: { color: 'red' } },
]

export const TitleStatus = [
  { label: 'Pending', value: 'pending' },
  { label: 'Approved', value: 'approved', style: { color: 'green' } },
  { label: 'Warning', value: 'warning', style: { color: '#FFBF00' } },
  { label: 'Rejected', value: 'rejected', style: { color: 'red' } },
]

export const CreativeToCloneOptions = [
  { value: 'highest_ctr', label: 'Highest CTR' },
  { value: 'highest_cvr', label: 'Highest CVR' },
  { value: 'all', label: 'All' },
]

export const FBAdTypeOptions = [
  { label: 'Single image', value: 'single_image' },
  { label: 'Single video', value: 'single_video' },
  { label: 'Carousel', value: 'carousel' },
  { label: 'Flexible', value: 'flexible' },
]

export const TiktokAdTypeOptions = [
  { label: 'Manual', value: 'manual' },
  { label: 'Smart', value: 'smart' },
]

export const PocPocBanerAdTypeOptions = [
  { label: 'Image', value: 'image' },
  { label: 'Html', value: 'html' },
]

export const NewsbreakAdTypeOptions = [
  { label: 'Single Image or Video Ads', value: 'manual' },
]

export const DemandGenAdTypeOptions = [
  { label: 'Default', value: 'default' },
  {
    label: 'Video',
    value: 'video',
  },
]

export const GoogleDisplayAdTypeOptions = [
  { label: 'Standard', value: 'standard' },
  { label: 'Responsive', value: 'responsive' },
]

export const FullAdTypeOptions = [
  ...FBAdTypeOptions,
  ...TiktokAdTypeOptions,
  ...PocPocBanerAdTypeOptions,
  ...NewsbreakAdTypeOptions,
  ...DemandGenAdTypeOptions,
  ...GoogleDisplayAdTypeOptions,
]

export const statusOptions = [
  {
    label: 'Approved',
    value: 'approved',
    style: {
      color: 'green',
    },
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Warning',
    value: 'warning',
    style: {
      color: 'orange',
    },
  },
  {
    label: 'Rejected',
    value: 'rejected',
    style: {
      color: 'red',
    },
  },
]

export const siteNameStatus = [
  {
    label: 'Approved',
    value: 'approved',
    style: {
      color: 'green',
    },
  },
  {
    label: 'Pending',
    value: 'pending',
  },
  {
    label: 'Rejected',
    value: 'rejected',
    style: {
      color: 'red',
    },
  },
]
