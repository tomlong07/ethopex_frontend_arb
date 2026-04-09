import { ColumnItemV2 } from '@/class/template_v2'
import { formatToTimezone } from '@/utils/utils'

export function CellRenderParamsV2(column: ColumnItemV2) {
  if (!column.field || !column.params) return

  return {
    options: column,
  }
}

export function CellFormaterV2(colInfo: ColumnItemV2) {
  return function (params: any) {
    if (!colInfo.format) {
      return
    }
    switch (colInfo.format) {
      case 'date-time':
        return !params.value || params.value?.includes('0001-01-01')
          ? ''
          : formatToTimezone(params.value)

      case 'currency':
        if (colInfo.notShowEmpty && params.value == 0) return ''
        return helper.currencyFormatter(params.value, colInfo.decimal || 2)

      case 'number':
        if (colInfo.notShowEmpty && params.value == 0) return ''
        return helper.numberTranform(params.value)

      case 'percent':
        const percentNow = colInfo.decimal || 1

        return helper.getPercent(params.value, percentNow)
    }

    return ''
  }
}

export function CellFormaterCore(
  opts: { [key: string]: any } = {},
  notGetOriginalValue: boolean = false
) {
  if (!opts.type) {
    if (notGetOriginalValue) {
      return
    }
    return opts.value
  }
  switch (true) {
    case opts.type === 'upperCase':
      return helper.capitalizeFirstLetter(opts.value)

    case opts.type === 'number':
      return helper.numberTranform(opts.value)

    case opts.type.includes('percent'):
      let percentNow = 1
      const percentSet = opts.type.split('-')

      if (percentSet && percentSet.length >= 2) {
        percentNow = Number(percentSet[1])
      }

      return helper.getPercent(opts.value, percentNow)

    //Exam: object:email
    //Exam: object:first_name,last_name
    case opts.type.includes('object:'):
      if (!opts.value) {
        return ''
      }
      const realType = opts.type.replace('object:', '')
      const arrayType = realType.split(',')

      if (!arrayType || !arrayType.length) {
        return ''
      }

      let result = ''
      arrayType.forEach((element: string) => {
        result += opts.value[element] + ' '
      })
      return result

    case opts.type.includes('currency'):
      let temp = opts.type

      let decimal = 2 //Default is 2
      let ignoreEmpty = false

      //type is currency-empty => ignore empty
      if (temp.includes('empty')) {
        ignoreEmpty = true
        temp = temp.replace('-empty', '')
      }

      //If type is currency-3 => decimal = 3
      let tempArray = temp.split('-')

      if (tempArray.length == 2) {
        try {
          const newDecimal = Number(tempArray[1])

          if (helper.isNumber(newDecimal)) {
            decimal = newDecimal
          }
        } catch (error) {
          console.error(error)
        }
      }

      if (ignoreEmpty && opts.value == 0) {
        return ''
      }

      let formatValue = helper.currencyFormatter(opts.value, decimal)

      return formatValue
  }

  if (notGetOriginalValue) {
    return
  }

  return opts.value
}

export function TooltipNow(key: string) {
  if (!key) return {}

  //Sử dụng để map component hiển thị tooltip -> hiện tại ko có chỗ nào dùng

  return {}
}

//Chưa test trường hợp left, right vì chưa có case nào như thế, cả sort nữa
/* eslint-disable no-unused-vars */
// @ts-nocheck
export function TooltipTemplateV2(name: string, right?: string) {
  return (
    '<div class="ag-cell-label-container" role="presentation">' +
    '  <span ref="eMenu" class="ag-header-icon ag-header-cell-menu-button"></span>' +
    '  <div ref="eLabel" class="ag-header-cell-label" role="presentation">' +
    '    <span ref="eSortOrder" class="ag-header-icon ag-sort-order"></span>' +
    '    <span ref="eSortAsc" class="ag-header-icon ag-sort-ascending-icon"></span>' +
    '    <span ref="eSortDesc" class="ag-header-icon ag-sort-descending-icon"></span>' +
    '    <span ref="eSortNone" class="ag-header-icon ag-sort-none-icon"></span>' +
    '    <svg class="svg-inline--fa fa-circle text-danger Blink" aria-hidden="true" focusable="false" data-prefix="fas" data-icon="circle" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" data-fa-i2svg=""><path fill="currentColor" d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"></path></svg>' +
    `    <span ref="eText" class="ag-header-cell-text" role="columnheader">${name}</span>` +
    '    <span ref="eFilter" class="ag-header-icon ag-filter-icon"></span>' +
    '  </div>' +
    '</div>'
  )
}
