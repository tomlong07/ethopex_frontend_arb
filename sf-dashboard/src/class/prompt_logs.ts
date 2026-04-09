export class PromptLogData {
  id?: string
  creative_id?: string
  creative_content?: string
  language?: string
  version?: string
  model_display?: string
  model_select?: string
  example?: string
  media_url?: string

  ai_decision?: string
  ai_rule_violated?: string
  ai_explanation?: string
  human_reviewed?: boolean
  human_decision?: string
  human_rule_violated?: string
  human_explanation?: string
  agreement?: boolean
  campaigns?: Array<any>

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue

          this[key as keyof this] = element
        }
      }
    }
  }

  hasMedia() {
    return !!this.media_url
  }

  isVideo() {
    return (
      this.hasMedia() &&
      (this.media_url?.toLowerCase().endsWith('.mp4') ||
        this.media_url?.toLowerCase().endsWith('.mov'))
    )
  }

  isImage() {
    return this.hasMedia() && !this.isVideo()
  }

  isYoutube() {
    return (
      this?.media_url?.includes('youtube') ||
      this?.media_url?.includes('youtu.be') ||
      false
    )
  }

  buildEmbedUrl = () => {
    const videoId = helper.youtubeVideoID(this?.media_url)

    if (!videoId) {
      window.message.error('Invalid YouTube video URL:')
      return
    }

    return `https://www.youtube.com/embed/${videoId}`
  }

  ExampleJSON() {
    if (!this.example) return null
    try {
      return JSON.parse(this.example || '')
    } catch {
      return this.example
    }
  }
}
