export interface creativeType {
  id: number
  user_id?: number
  name?: string
  site_name: string
  status?: string
  site_name_status?: string
  headline?: string
  created_at?: string
  deleted_at?: string | null
  titles: titlesStruct[]
  site_icon?: string
  images: images[]
  type: string
  display_path: string[] | string
  email?: string
  site_link?: string
  info_image?: SnapData[]
}

export interface SnapData {
  title?: string
  description?: string
  call_to_action?: string
  image?: string
  coordinates?: coordinatesType
}

export interface titlesStruct {
  id?: number
  creative_id?: number
  title?: string
  status?: string
  description?: string
  ttArray: string[]
  dArray: string[]
}

export interface images {
  id?: number
  creative_id?: number
  image: string
  status?: string
  thumb?: string
  list_thumb?: listThumb[]
  image_ratio?: imageRatio[]
  change?: boolean
  off?: boolean
}

export interface imageRatio {
  ratio: string
  image?: string
  coordinates?: coordinatesType
  canvasData?: {
    left: number
    top: number
    width: number
    height: number
    rotate?: number
    scaleX?: number
    scaleY?: number
  }
  change: boolean
  off: boolean
  zoom?: number
}

export interface coordinatesType {
  x: number
  y: number
  width: number
  height: number
  rotate: number
  scaleX: number
  scaleY: number
}
interface listThumb {
  image: string
  thumb?: string
}
