export interface demandConfigType {
  id: number
  name: string
  show_name: string
  status: string
  fixed_adtitle: string
  macros: macrosTraffics[]
}

interface macroType {
  name: string
  value: string
}

export interface macrosTraffics {
  supply: string
  name: string
  macro: macroType[]
}

export interface macroOptions {
  id: number
  value: string
  label: string
  disabled: boolean
}
