export const IMAGE_TYPE = ['image/jpeg', 'image/png', 'image/bmp', 'image/gif']
export const AUDIO_TYPE = ['audio/mpeg', 'audio/x-m4a']
export const VIDEO_TYPE = ['video/mp4']
// Image ratios
export const SIZE_RATIO = ['1:1', '16:9', '4:5', '1.91:1']
export const RATIO_NEWSBREAK = ['9:16', '16:9']
export const RATIO_DEMAND = ['1:1', '16:9', '9:16', '4:5', '1.91:1']

// Snapchat specs
export const SNAP_WIDTH = 720
export const SNAP_HEIGHT = 1280
export const SNAP_RATIO = 0.5625 // 9/16 ratio

// Ratio validation map
export const MapRatioValid: {
  [key: string]: { [key: string]: number | string }
} = {
  '1:1': {
    width: 300,
    height: 300,
    gwidth: 300,
    gheight: 300,
    google: '300x300',
  },
  '1.91:1': {
    width: 620,
    height: 325,
    gwidth: 600,
    gheight: 314,
    google: '600x314',
  },
  '4:5': {
    width: 496,
    height: 620,
    gwidth: 480,
    gheight: 600,
    google: '480x600',
  },

  '9:16': {
    width: 620,
    height: 1103,
    gwidth: 600,
    gheight: 1067,
    google: '600x1067',
  },
}
