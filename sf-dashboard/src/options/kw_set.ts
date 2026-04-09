import { MenuOption, SelectOption } from 'naive-ui'

export const menuOptions: MenuOption[] = [
  {
    label: 'Keyword set',
    key: 'keyword_set',
  },
  {
    label: 'Campaign used',
    key: 'campaigns',
  },
]

export const rpiOptions: SelectOption[] = [
  { value: 'rpm', label: 'RPM' },
  { value: 'rpc', label: 'RPC' },
]
