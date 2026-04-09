import { SelectOption } from 'naive-ui'

export const transformOptions = (
  baseOptions: Ref,
  isHasAll: boolean
): SelectOption[] => {
  let options: SelectOption[] = []

  const cloneOptions = helper.clone(baseOptions.value)
  if (isHasAll) {
    options = cloneOptions.map((element: SelectOption) => {
      if (element.value === 'ALL') return element
      return { ...element, disabled: true }
    })
  } else {
    options = cloneOptions.map((element: SelectOption) => {
      if (element.value === 'ALL') return { ...element, disabled: true }
      return element
    })
  }

  return options
}
