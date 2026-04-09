import { ONOFF } from '@/enum/campaign'
import { SEND_TYPE } from '@/enum/prompt'
import { ctr_prompt } from '@/services/ctr_prompt'

import { SelectOption } from 'naive-ui'

export class promptType {
  id?: number
  name?: string
  status?: string
  version?: string
  versions?: string
  prompt_test?: number
  prompt?: string
  model?: string
  model_prioritize?: string
  send_type?: SEND_TYPE
  description?: string
  api_key?: string
  rule?: string
  prompt_rule_id?: number
  web_source?: ONOFF
  schema_response?: string | null
  config: Record<string, string> = {}

  constructor(data?: any) {
    if (data) {
      for (const key in data) {
        if (Object.prototype.hasOwnProperty.call(data, key)) {
          const element = data[key]
          if (!element) continue
          this[key as keyof this] = element
        }
      }

      if (!data.status) {
        this.status = 'off'
      }
    } else {
      this.status = 'on'
    }
  }
}

export class promptSelectOptions {
  loadingModel = ref<boolean>(true)
  models = ref<(SelectOption & { config: string[] })[]>([])
  versionOptions = ref<SelectOption[]>([])

  constructor() {}

  getModelAI = async (id?: number) => {
    this.loadingModel.value = true

    const result = await ctr_prompt.GetModels(id)

    this.models.value = result?.data || []

    this.loadingModel.value = false
  }

  renderLabel = (option: SelectOption) => {
    return h('div', { class: 'flex items-center w-full' }, [
      h('span', {}, option.label as string),

      option.source
        ? h(
            'span',
            { class: 'ml-auto text-gray-500 text-xxs' },
            option.source as string
          )
        : null,
    ])
  }
}
