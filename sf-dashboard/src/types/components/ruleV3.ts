import { SelectOption } from 'naive-ui'

export const dataFromOptions = ref<SelectOption[]>([
  { value: 'report', label: 'Report' },
  { value: 'link', label: 'Link' },
  { value: 'list_campaign_origin', label: 'List Campaigns' },
])
