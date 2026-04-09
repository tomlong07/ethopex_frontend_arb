export class AmountUserTestBudget {
  budget_remaining?: number
  time?: number //Trả về từ api theo định dạng giây nên khi sleep cần x 1000 ra ms

  constructor(obj: any) {
    for (const key in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, key)) {
        this[key as keyof this] = obj[key]
      }
    }
  }

  budgetRemainingShow() {
    return helper.currencyFormatterAuto(this.budget_remaining || 0)
  }
}
