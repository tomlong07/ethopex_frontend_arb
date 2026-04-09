const creative = {
  only_img: 'Please upload images',
  ratio_1_1: 'Image aspect ratio must be 1:1.',
  icon_max:
    'Images with a resolution exceeding 1280 x 1280 pixels are not supported.',
  icon_min: 'With this creative. The minimum size is 128x128.',
  auto_domain: "Default: automatic get from 'domain'.",
  max_thumb: 'The image file size should be less than 950KB.',
  media_format:
    'Allowed formats: Video: mp4 / Image: jpg, jpeg, bmp, gif, png.',
  max_video: 'The video file size should be less than',
  max_img: 'The image file size should be less than',
  img_small: '%v image resized (image is too small).',
  img_snap_9x16: 'image does not meet the 9:16 ratio requirement.',
  img_err: 'An error occurred while processing the image.',
  img_snap:
    "Tool to automatically create images. Click 'Create Images' to create.",
  tit_des: 'Please check inputs again.',
  video_snap: "The video does not meet Snapchat's requirements.",
  media_snap:
    'Snapchat: video requirements: min width: %v, min height: %v, ratio: %v, max size: %v.',
  media_general: 'Video: max size: %v.',
  img_warn: 'This image could not be used.',
  img_video: 'Please upload either all images or all videos.',
  pmax: 'Performance Max must have at least 1 image 1:1 and 1.91:1.',
  img_exist: 'Please do not upload duplicate images.',
  cre_tem:
    'This is an AD on the traffic source (a copy of the creative template). Edit the original creative template here.',
  minimum: 'Minimum',
  maximum: 'Maximum',
  maximum_charac: 'Maximum {maxLengthTitle} characters',
  invalid_chain: 'There is an invalid string, please check again:',
  video_popover: `Maximum duration is 60 minutes
          Recommended resolution: 1280 x 720 pixels (HD) or higher, depending on
          the aspect ratio.
          Supported aspect ratios:
          Landscape: 16:9
          Portrait: 9:16
          Square: 1:1
          If the video does not match the required format, it may be
          automatically cropped or may not display properly on some incompatible
          platforms.`,
}
export default creative
