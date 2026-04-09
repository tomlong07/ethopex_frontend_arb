// services/creative-upload/types.ts
export interface UploadContext {
  file: File
  data: any
  cre: any
}

export interface PlatformHandler {
  beforeUpload(ctx: UploadContext): Promise<boolean>
}
