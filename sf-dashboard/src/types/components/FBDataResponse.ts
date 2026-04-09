export class FBDataResponse {
  info_camp_facebook?: FBAdset

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]

          this[key as keyof this] = element
        }
      }
    }
  }
}

interface FBAdset {
  adsets?: { data?: FBAd[] }
}
interface FBAd {
  ads: { data?: FBAdDataItem[] }
}
interface FBAdDataItem {
  id?: string
  name?: string
  status?: string
  creative?: { effective_object_story_id?: string }
}

export interface FanpageStatus {
  ready?: boolean
  id?: string
  page_id?: string
  name?: string
  link?: string
  picture?: string
}

export interface PostStatus {
  ready?: boolean
  id?: string
  post_id?: string
  name?: string
  link?: string
  media?: string
  likes?: number
  shares?: number
  comments?: number
  created_at?: string
}
