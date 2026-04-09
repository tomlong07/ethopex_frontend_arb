type MaybeRef<T> = T | Ref<T>

type Store = {
  expandedNames: Ref<string[]>
  setExpanded: (names: string[]) => void
  isExpanded: (name: string) => boolean
  toggle: (name: string) => void
  clear: () => void
}

const _cache = new Map<string, Store>()

const _registry = new Map<string, Set<string>>()

export function _registerSection(key: string, name: string) {
  if (!_registry.has(key)) _registry.set(key, new Set())
  _registry.get(key)!.add(name)

  try {
    const raw = localStorage.getItem(key)
    if (!raw && _cache.has(key)) {
      const store = _cache.get(key)!
      store.setExpanded(
        Array.from(new Set([...store.expandedNames.value, name]))
      )
    }
  } catch {}
}

export function useCollapsePersist(
  keyRef: MaybeRef<string>,
  initial: string[] = []
): Store {
  const resolveKey = () => String(unref(keyRef) || '')

  const ensureStore = (key: string): Store => {
    if (_cache.has(key)) return _cache.get(key)!

    const expandedNames = ref<string[]>([])

    const load = () => {
      try {
        const raw = localStorage.getItem(key)
        if (raw) {
          const parsed = JSON.parse(raw)
          expandedNames.value = Array.isArray(parsed) ? parsed : [...initial]
        } else {
          expandedNames.value = [...initial]
        }
      } catch {
        expandedNames.value = [...initial]
      }
    }

    const save = () => {
      try {
        localStorage.setItem(key, JSON.stringify(expandedNames.value))
      } catch {}
    }

    const setExpanded = (names: string[]) => {
      expandedNames.value = [...new Set(names)]
      queueMicrotask(save)
    }
    const isExpanded = (name: string) => expandedNames.value.includes(name)
    const toggle = (name: string) => {
      if (isExpanded(name)) {
        expandedNames.value = expandedNames.value.filter((n) => n !== name)
      } else {
        expandedNames.value = [...expandedNames.value, name]
      }
      queueMicrotask(save)
    }
    const clear = () => {
      expandedNames.value = []
      queueMicrotask(save)
    }

    load()
    const store: Store = {
      expandedNames,
      setExpanded,
      isExpanded,
      toggle,
      clear,
    }
    _cache.set(key, store)
    return store
  }

  let currentKey = resolveKey()
  let currentStore = ensureStore(currentKey)

  const expandedNames = computed<string[]>({
    get: () => currentStore.expandedNames.value,
    set: (names) => currentStore.setExpanded(names),
  })
  const setExpanded = (names: string[]) => currentStore.setExpanded(names)
  const isExpanded = (name: string) => currentStore.isExpanded(name)
  const toggle = (name: string) => currentStore.toggle(name)
  const clear = () => currentStore.clear()

  watch(
    () => resolveKey(),
    (nextKey) => {
      if (nextKey === currentKey) return
      currentKey = nextKey
      currentStore = ensureStore(currentKey)
    }
  )

  return { expandedNames, setExpanded, isExpanded, toggle, clear }
}
