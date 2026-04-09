import { CONTENT_CONSISTENCY, CONTENT_SAFETY } from '@/enum/creative'

export class AIVerifyClass {
  compliance_status?: string
  content_consistency?: CONTENT_CONSISTENCY

  contents?: AIVerifySuggestionClass[]
  images?: MediaVerifyClass[]
  videos?: MediaVerifyClass[]

  constructor(data: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          switch (key) {
            case 'contents':
              try {
                this[key as keyof this] = data[key]?.map(
                  (item: any) => new AIVerifySuggestionClass(item)
                )
              } catch (error) {
                console.error(error)
              }

              break
            case 'images':
            case 'videos':
              try {
                this[key as keyof this] = data[key]?.map(
                  (item: any) => new MediaVerifyClass(item)
                )
              } catch (error) {
                console.error(error)
              }
              break

            default:
              const element = data[key]
              this[key as keyof this] = element
              break
          }
        }
      }
    }
  }

  get compliance_status_show() {
    const textLower = this.compliance_status?.toLowerCase()
    switch (textLower) {
      case 'no':
        return 'REJECTED'
      case 'yes':
        return 'APPROVED'

      default:
        return this.compliance_status
    }
  }

  get invalidInput() {
    return this?.contents_show?.map((element) => element.content?.trim()) || []
  }

  get contents_show() {
    return this?.contents?.filter((item) => item.isError()) || []
  }

  get media_data_show() {
    return (
      (this?.images?.filter((item) => item.isError()) || []).concat(
        this?.videos?.filter((item) => item.isError()) || []
      ) || []
    )
  }

  IsContentFail() {
    return this.content_consistency === CONTENT_CONSISTENCY.FAILED
  }

  isInvalid(input?: string) {
    return this.invalidInput.includes(input?.trim())
  }
}

export class AIVerifySuggestionClass {
  compliance_status?: string
  rule_violated?: string
  content?: string
  suggestion?: string
  text_id: string = ''
  explanation?: string
  is_add?: boolean //Biến để giao diện ẩn nút add đi

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

  isError() {
    return (
      !this.compliance_status || this.compliance_status.toLowerCase() !== 'yes'
    )
  }

  isSiteLink() {
    return this.text_id.includes('site_link')
  }

  isShortDescription() {
    return this.text_id.includes('short_description')
  }

  fieldNow = () => {
    try {
      const f = this.text_id.replace(/_\d+$/, '')
      if (f === 'primary_text') return 'long_headline'
      return f
    } catch {
      return this.text_id || ''
    }
  }

  get isShowFixButton() {
    return !this.is_add && this.isError()
  }
}

export class MediaVerifyClass {
  url?: string
  video?: string
  explanation?: string
  compliance_status?: string

  content_safety?: CONTENT_SAFETY
  rule_violated?: string

  is_action?: boolean //Biến để giao diện ẩn nút action đi

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

  urlImage() {
    return helper.removeDomainAndParams(this.url || '')
  }

  urlVideo() {
    return helper.removeDomainAndParams(this.video || '')
  }

  isError() {
    return (
      !this.compliance_status || this.compliance_status.toLowerCase() !== 'yes'
    )
  }

  get is_show_delete_image() {
    return !this.is_action && this.isError()
  }
}
