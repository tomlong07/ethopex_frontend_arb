// Create a reusable composition function
import { SelectOption } from 'naive-ui'

export function useLogicGoAndLeave(isFetching: Ref<boolean>, func: Function) {
  const isLoadAgain = ref<boolean>(false)

  const listerEnter = (e: any) => {
    // Disable the enter key event from reloading the table when editing a cell
    if (e.target?.classList.contains('ag-input-field-input')) {
      return
    }

    if (e.key === 'Enter') {
      // Check if any modal is open -> if yes, disable the enter key event that reloads the table
      const modalShow = document.querySelectorAll(
        '.n-modal-container .n-modal-body-wrapper'
      )

      if (modalShow && modalShow.length) {
        return
      }

      // go to page
      if (e.target.closest('.n-pagination-quick-jumper')) {
        return
      }
      // const editCells = document.querySelectorAll('.ag-cell-edit-wrapper');

      // if (editCells && editCells.length) {
      //   return;
      // }

      // Wait for the payload to be updated before requesting new data
      setTimeout(() => {
        func()
      }, 5)
    }
  }

  onMounted(() => {
    window.addEventListener('keydown', listerEnter)
  })

  onDeactivated(() => {
    window.removeEventListener('keydown', listerEnter)

    if (isFetching.value) {
      isLoadAgain.value = true
    }
  })

  onActivated(() => {
    if (isLoadAgain.value) {
      func()
      isLoadAgain.value = false
    }

    window.addEventListener('keydown', listerEnter)
  })
}

export function campaignMenu(
  key: string,
  item: { accountIdNow: string; accountCategoryIdNow: string }
) {
  switch (key) {
    case 'account_id':
      if (!item.accountIdNow) {
        window.message.error('Linked Account ID not found!')
        return
      }
      helper.copyText(item.accountIdNow)
      window.message.success(`ID: ${item.accountIdNow} Copied!`)
      break

    case 'account_category_id':
      if (!item.accountCategoryIdNow) {
        window.message.error('Account Category ID not found!')
        return
      }
      helper.copyText(item.accountCategoryIdNow)
      window.message.success(`ID: ${item.accountCategoryIdNow} Copied!`)
      break

    case 'open_account':
      if (!item.accountIdNow) {
        window.message.error('Linked Account ID not found!')
        return
      }
      window.open('/accounts/edit/' + item.accountIdNow, '_blank')
      break

    case 'open_account_category':
      if (!item.accountCategoryIdNow) {
        window.message.error('Account Category ID not found!')
        return
      }
      window.open(
        '/account-category/submit/' + item.accountCategoryIdNow,
        '_blank'
      )
      break

    default:
      break
  }
}

export const renderCreativeLabel = (option: SelectOption) => {
  return option.name && (option.ads || option.ads === 0)
    ? h('div', { class: 'flex justify-between w-full' }, [
        h('div', {
          innerHTML: `${
            (option.name as any).match(/^\d/)
              ? option.name
              : `${option.id}: ${option.name}`
          }`,
        }),
        h('div', {
          innerHTML: `${option.ads} ads`,
        }),
      ])
    : ''
}
