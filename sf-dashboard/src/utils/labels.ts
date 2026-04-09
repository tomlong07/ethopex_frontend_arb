import { SelectOption } from 'naive-ui'

export const renderPromptLabel = (option: SelectOption) => {
  return h('div', { class: 'flex justify-between items-center w-full' }, [
    h('span', { class: 'text-sm truncate' }, option.name as any),
    h('span', { class: 'text-xs text-gray-400 ml-auto' }, `ID: ${option.id}`),
  ])
}
