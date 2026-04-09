export class AmountUser {
  amount_wallet?: number
  amount_invoice_pending?: number
  is_wallet?: boolean

  constructor(obj: any) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this[key as keyof this] = obj[key]
      }
    }
  }

  isShowWallet() {
    return this.is_wallet === true
  }

  walletShow() {
    return this.amount_wallet
      ? Number(this.amount_wallet?.toFixed(2)).toLocaleString('en-US')
      : 0
  }

  pendingShow() {
    return this.amount_invoice_pending
      ? Number(this.amount_invoice_pending?.toFixed(2)).toLocaleString('en-US')
      : 0
  }
}
