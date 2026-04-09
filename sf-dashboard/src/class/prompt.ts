export class PromptTest {
  cost: number = 0
  display_model: string = ''
  user_selected_model: string = ''

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
}
