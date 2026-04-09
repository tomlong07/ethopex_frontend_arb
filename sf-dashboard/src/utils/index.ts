export const debounce = (fn: Function, ms = 300) => {
  let timeoutId: ReturnType<typeof setTimeout>
  return function (this: any, ...args: any[]) {
    clearTimeout(timeoutId)
    timeoutId = setTimeout(() => fn.apply(this, args), ms)
  }
}

export function debounceV2<T extends (...args: any[]) => Promise<void> | void>(
  fn: T,
  delay: number
) {
  let timeoutId: ReturnType<typeof setTimeout> | undefined

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId)
    }
    timeoutId = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}

export const getFieldByKey = (target: any, field: any) => {
  if (!field) {
    return target
  }
  let result = Object.assign({}, target)
  for (const key of field.split('.')) {
    result = result[key]
  }
  return result
}
export const replacePlk = (plk: string) => {
  const url = new URL(window.location.href)
  url.searchParams.set('plk', plk)
  window.history.pushState({}, '', url.toString())
}
export const showComponentKeyword = (d: string, elem: string) => {
  if (!elem || !d) {
    return false
  }
  if (elem == 'card') {
    switch (d) {
      case 'adsense':
      case 'system1':
      case 'tonic':
      case 'tapstone':
      case 'domain_active':
      case 'brightcast':
      case 'codefuel':
      case 'ads_com':
        return true
      default:
        return false
    }
  }
  if (elem == 'main_keyword') {
    switch (d) {
      case 'system1':
      case 'brightcast':
      case 'codefuel':
        return true
      default:
        return false
    }
  }
  if (elem == 'keyword') {
    switch (d) {
      case 'adsense':
      case 'system1':
      case 'tonic':
      case 'tapstone':
      case 'domain_active':
      case 'ads_com':
        return true
      default:
        return false
    }
  }

  return false
}

export const buildQueryStringEncodeURI = (obj: any) => {
  const queryStringArr: string[] = []

  for (let [key, value] of Object.entries(obj)) {
    queryStringArr.push(
      `${encodeURIComponent(key)}=${encodeURIComponent(value as any)}`
    )
  }

  return queryStringArr.join('&')
}

export const copyTextToClipboard = (text: any) => {
  try {
    helper.copyText(text)
    window.message.success('Copied!')
  } catch (error) {
    console.error(error)
  }
}

export const typeOfObject = (obj: any) => {
  try {
    return Object.prototype.toString.call(obj).slice(8, -1).toLocaleLowerCase()
  } catch {
    return null
  }
}

export const checkEmpty = (value: any): boolean => {
  return value === null || value === undefined || value === ''
}

export const parseJson = (data: any) => {
  try {
    return typeOfObject(data) == 'string' &&
      (data.includes('{') || data.includes('['))
      ? JSON.parse(data)
      : data
  } catch {
    return data
  }
}

export const processDataShow = (data: any) => {
  if (typeOfObject(data) === 'object') {
    return JSON.stringify(data)
  } else if (typeOfObject(data) === 'array') {
    return data.length > 0 ? JSON.stringify(data) : 'N/A'
  } else {
    return `${data}`
  }
}
