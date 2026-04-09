import { creativeTypeClass } from '@/types/components/creative-v2'
import { useLocale } from '@/lang/messages'
const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)
interface MinMaxInfo {
  maxTitle: number
  maxLongHeadline?: number
  maxDescription: number
}

export const useCreativeField = () => {
  const validateField = (input: string) => {
    const invalidText = findInvalidSubstrings(input)
    if (invalidText.length > 0) {
      window.message.error(
        Creative.value.invalid_chain + invalidText.join(', ')
      )
    }
  }

  const findInvalidSubstrings = (input: string) => {
    const pattern = /\{[^}]*\}/g
    const matches = input.match(pattern) || []

    const invalidMatches = matches.filter((match) => {
      const content = match.substring(1, match.length - 1).trim()
      if (!content.includes(':')) return true
      const parts = content.split(':')
      return parts[0].trim() === '' || parts[1].trim() === ''
    })

    return invalidMatches
  }

  const updateField = (
    creative: creativeTypeClass,
    index: number,
    fieldType: 'ttArray' | 'lhArray' | 'dArray',
    minMaxInfo: MinMaxInfo
  ) => {
    let targetArray: string[]
    let maxItems: number
    let fieldName: string

    switch (fieldType) {
      case 'ttArray':
        targetArray = creative.titles[0].ttArray
        maxItems = minMaxInfo.maxTitle
        fieldName = 'titles'
        break
      case 'lhArray':
        targetArray = creative.titles[0].lhArray
        maxItems = minMaxInfo.maxLongHeadline || 0
        fieldName = 'long headlines'
        break
      case 'dArray':
        targetArray = creative.titles[0].dArray
        maxItems = minMaxInfo.maxDescription
        fieldName = 'descriptions'
        break
      default:
        return
    }

    if (!targetArray[index]) return
    // if (creative.type === 'tiktok' && targetArray[index].includes(',')) {
    //   let newContent = helper.stringToArrayTT(targetArray[index])
    //   processContentSplit(targetArray, newContent, index, maxItems, fieldName)
    // }
    if (creative.type !== 'tiktok' && targetArray[index].includes('\n')) {
      let newContent = helper.stringToArrayLine(targetArray[index])
      processContentSplit(targetArray, newContent, index, maxItems, fieldName)
    }
  }

  const processContentSplit = (
    targetArray: string[],
    newContent: string[],
    index: number,
    maxItems: number,
    fieldName: string
  ) => {
    if (newContent.length > 0) {
      targetArray[index] = newContent[0]
      let lengthContent = newContent.length

      // Tính toán số slot còn trống, bao gồm cả các phần tử rỗng hiện có
      const nonEmptyCount = targetArray.filter(
        (item) => item && item.trim() !== ''
      ).length
      const availableSlots = maxItems - nonEmptyCount
      const itemsToAdd: string[] = []
      const excessItems: string[] = []

      for (let i = 1; i < lengthContent; i++) {
        const item = newContent[i]?.trim()
        if (!item) continue // Bỏ qua items rỗng

        if (itemsToAdd.length < availableSlots) {
          itemsToAdd.push(item)
        } else {
          excessItems.push(item)
        }
      }

      itemsToAdd.forEach((item) => {
        targetArray.push(item)
      })

      // Hiển thị thông báo nếu có items thừa
      if (excessItems.length > 0) {
        window.message.warning(
          `Exceeded maximum ${fieldName} (${maxItems}). Excess items: ${excessItems.join(
            ', '
          )}`
        )
      }

      setTimeout(() => {
        // Cleanup các phần tử rỗng
        for (let i = targetArray.length - 1; i >= 0; i--) {
          if (!targetArray[i] || targetArray[i].trim() === '') {
            targetArray.splice(i, 1)
          }
        }
      }, 1)
    }
  }

  const copyToClipboard = (
    creative: creativeTypeClass,
    type: 'ttArray' | 'lhArray' | 'dArray'
  ) => {
    let textToCopy = ''
    switch (type) {
      case 'ttArray':
        const fillTitleArr = creative.titles[0].ttArray.filter((c) => c != '')
        textToCopy = fillTitleArr.join('\n')
        break
      case 'lhArray':
        textToCopy = creative.titles[0].lhArray.join('\n')
        break
      case 'dArray':
        const fillDesArr = creative.titles[0].dArray.filter((c) => c != '')
        textToCopy = fillDesArr.join('\n')
        break
    }

    helper.copyText(textToCopy)
    window.message.success('Copied!')
  }

  const addToArray = (
    creative: creativeTypeClass,
    index: number,
    fieldType: 'ttArray' | 'lhArray' | 'dArray'
  ) => {
    switch (fieldType) {
      case 'ttArray':
        creative.titles[index].ttArray.push('')
        break
      case 'lhArray':
        creative.titles[index].lhArray.push('')
        break
      case 'dArray':
        creative.titles[index].dArray.push('')
        break
    }
  }

  const deleteFromArray = (
    creative: creativeTypeClass,
    index: number,
    itemIndex: number,
    fieldType: 'ttArray' | 'lhArray' | 'dArray'
  ) => {
    switch (fieldType) {
      case 'ttArray':
        creative.titles[index].ttArray.splice(itemIndex, 1)
        break
      case 'lhArray':
        creative.titles[index].lhArray.splice(itemIndex, 1)
        break
      case 'dArray':
        creative.titles[index].dArray.splice(itemIndex, 1)
        break
    }
  }

  return {
    updateField,
    validateField,
    copyToClipboard,
    addToArray,
    deleteFromArray,
  }
}
