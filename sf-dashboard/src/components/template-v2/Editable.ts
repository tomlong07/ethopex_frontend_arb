import { ctr_supply_account } from '@/services/ctr_supply_account'

class EditableStruct {
  name: string = ''
  colV2: string = ''

  constructor(name: string, colV2: string) {
    this.name = name
    this.colV2 = colV2
  }

  isValid(): boolean {
    return this.isUpdateNameAccountAd() || this.isUpdateNameAdvertiser()
  }

  isUpdateNameAdvertiser() {
    return (
      (this.name === 'name' &&
        this.colV2 === 'manager-facebook-business_s09') ||
      false
    )
  }

  isUpdateNameAccountAd() {
    return (this.name === 'name' && this.colV2 === 'account-ad_r23') || false
  }
}

export default async function editHandle(params: any): Promise<void> {
  if (!params.data) return

  const config = new EditableStruct(
    params?.colDef?.cellRendererParams?.baseType,
    params?.colDef?.cellRendererParams?.baseColV2
  )

  if (!config.isValid()) return
  const loadingNotification = window.message.loading('Updating...')
  let result: any = null
  if (config.isUpdateNameAdvertiser()) {
    if (!params.data?.id) return
    result = await ctr_supply_account.UpdateNameAdvertiser(params.data?.id, {
      name: params.newValue,
    })
  }

  if (config.isUpdateNameAccountAd()) {
    if (!params.data?.id) return
    result = await ctr_supply_account.UpdateNameAccountAd(params.data?.id, {
      name: params.newValue,
    })
  }

  if (result?.status) {
    window.message.success('Update successfully!')
    loadingNotification.destroy()

    return result
  }

  loadingNotification.destroy()
}
