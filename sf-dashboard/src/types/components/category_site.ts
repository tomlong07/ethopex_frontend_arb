import { keywordSetType } from './keyword_set'

export interface keywordGroupType {
  keyword?: string
  status?: boolean
  show_in_home?: boolean
  list_keywords?: string[] | null
}

export interface categorySiteType {
  id?: number
  type?: string
  show_in_home?: boolean
  name?: string
  slug?: string
  icon?: string | null
  title?: string
  description?: string
  thumb?: string
  posts?: number[]
  parents?: number[] | null
  children?: number[] | null
  keyword_group?: keywordGroupType[] | null
  status?: boolean
  keyword_set?: keywordSetType
  keyword_set_id?: number
}

export class categorySiteCls implements categorySiteType {
  id?: number
  type?: string
  show_in_home?: boolean
  name?: string
  slug?: string
  icon?: string | null
  title?: string
  description?: string = ''
  thumb?: string
  posts?: number[]
  parents?: number[] | null
  children?: number[] | null
  keyword_group?: keywordGroupType[] | null
  status?: boolean
  keyword_set?: keywordSetType
  keyword_set_id?: number

  constructor(data?: Partial<categorySiteType>) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key as keyof categorySiteType]

          if (element === '') continue

          switch (key) {
            case 'keyword_group':
              if (Array.isArray(element) && element.length > 0) {
                this.keyword_group = element.map((item: any) => ({
                  keyword: item.keyword || '',
                  status: item.status ?? false,
                  show_in_home: item.show_in_home ?? false,
                  list_keywords: item.list_keywords || [],
                }))
              } else {
                this.keyword_group = this.SetKeyWordGroupDefaultList()
              }
              break

            default:
              ;(this as any)[key] = element
              break
          }
        }
      }
    } else {
      this.show_in_home = false
      this.SetTypeCategory()
      this.keyword_group = this.SetKeyWordGroupDefaultList()
    }
  }

  SetTypeCategory() {
    this.type = 'category'
  }

  IsTypeCategory(): boolean {
    return this.type === 'category'
  }

  IsTypeTrending(): boolean {
    return this.type === 'trending'
  }
  SetKeyWordGroupDefaultList() {
    return [
      {
        keyword: '',
        status: false,
        show_in_home: false,
        list_keywords: [],
      },
    ]
  }
}
