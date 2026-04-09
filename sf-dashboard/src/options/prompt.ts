import { SEND_TYPE } from '@/enum/prompt'

export const CreativeContentTypeOptions = [
  { label: 'Text', value: 'Text' },
  { label: 'Image Summary', value: 'Image Summary' },
  { label: 'Video Summary', value: 'Video Summary' },
]

export const SendTypeOptions = [
  { label: 'API', value: SEND_TYPE.API },
  { label: 'Batch', value: SEND_TYPE.BATCH },
]
