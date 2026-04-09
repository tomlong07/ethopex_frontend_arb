export interface Option {
  label: string
  value: string
  children?: Option[]
}

export const flattenTree = (list: undefined | Option[]): Option[] => {
  const result: Option[] = []
  function flatten(_list: Option[] = []) {
    _list.forEach((item) => {
      result.push(item)
      flatten(item.children)
    })
  }
  flatten(list)
  return result
}

const ensurePath = (source: Record<string, any>, segments: string[]) => {
  let cursor = source
  for (let index = 0; index < segments.length - 1; index++) {
    const key = segments[index]
    if (cursor[key] == null || typeof cursor[key] !== 'object') {
      cursor[key] = {}
    }
    cursor = cursor[key]
  }
  return { cursor, lastKey: segments[segments.length - 1] }
}

const normalizePath = (path: string | string[]): string[] => {
  if (Array.isArray(path)) return path
  return path
    .split('.')
    .map((item) => item.trim())
    .filter(Boolean)
}

const readValue = (source: any, segments: string[]) => {
  return segments.reduce((acc: any, key: string) => {
    if (acc == null) return undefined
    return acc[key]
  }, source)
}

export const linkField = <T = any>(
  path: string | string[],
  targets: Array<() => Record<string, any> | undefined>,
  options: { fallback?: T | null } = {}
) => {
  const segments = normalizePath(path)
  const { fallback = null } = options

  return computed<T | null>({
    get() {
      for (const getHost of targets) {
        const host = getHost()
        if (!host) continue
        const value = readValue(host, segments)
        if (value !== undefined && value !== null) {
          return value as T
        }
      }
      return fallback
    },
    set(value) {
      const normalized =
        value === undefined ? undefined : (value as T | null) ?? fallback

      targets.forEach((getHost) => {
        const host = getHost()
        if (!host) return

        if (segments.length === 0) return

        const { cursor, lastKey } = ensurePath(host, segments)

        if (normalized === undefined) {
          if (cursor && typeof cursor === 'object') {
            delete cursor[lastKey]
          }
          return
        }

        cursor[lastKey] = normalized
      })
    },
  })
}
