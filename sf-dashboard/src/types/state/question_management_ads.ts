export interface Answer {
  id: 0
  status: 'on' | 'off'
  answer: string
  by: string
}

export interface QuestionManagementAds {
  id?: number
  name: string
  question: string
  type: string | null
  status: 'on' | 'off'
  type_input: string | null
  apply_mcc: string[]
  note: string
  answers: Answer[]
}
