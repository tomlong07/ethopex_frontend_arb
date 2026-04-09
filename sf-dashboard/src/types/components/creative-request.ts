export class PermissionCreativeRequestManage {
  permission: string = ''

  constructor() {}

  changePermission(value: string) {
    this.permission = value
  }

  permissionsAccept(): string {
    return this.permission
  }

  isStop(): boolean {
    return !this.permission || this.permission.trim() === ''
  }

  isAcceptNormalCreate(): boolean {
    return this.permission === 'add'
  }

  isAcceptUpdate(): boolean {
    return this.permission === 'update'
  }
  isAcceptCreatorMedia(): boolean {
    return this.permission === 'create_media'
  }
  notAcceptUpdate(): boolean {
    return !this.isAcceptUpdate()
  }
}
export interface creativeRequestModelType {
  id: string | null
  name: string | null
  keyword_set_id: string | null
  description: string | null
  landing_page_id: string | null
  status: string | null
  user_id: string | null
}
export interface MediaModel {
  media: string
  thumb: string
  type: string
}

export interface CreativeMediaModelType {
  id: number | null
  request_id: string | null
  medias: MediaModel[]
  user_id?: string | null
  user_email?: string | null
}
