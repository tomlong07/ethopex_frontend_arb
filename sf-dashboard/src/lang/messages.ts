import { computed, shallowRef } from 'vue'

import { LANGUAGE, Locale } from '@/enum/language'

const SUPPORTED_LOCALES = [Locale.EN, Locale.VI] as const

type LocaleKey = (typeof SUPPORTED_LOCALES)[number]

// Lấy locale khởi tạo từ localStorage (mặc định EN nếu không có)
const getInitialLocale = (): LocaleKey => {
  if (typeof localStorage === 'undefined') return Locale.EN

  const saved = localStorage.getItem(LANGUAGE.K) as LocaleKey | null

  if (saved && SUPPORTED_LOCALES.includes(saved)) {
    return saved
  }

  return Locale.EN
}

type LocaleData<T> = { default: T } | T
type LocaleInput<T> = T | (() => Promise<LocaleData<T>>)

// Phân biệt giữa dữ liệu tĩnh và loader bất đồng bộ
const isLazy = <T>(
  value: LocaleInput<T>
): value is () => Promise<LocaleData<T>> => {
  return typeof value === 'function'
}

// Chuẩn hóa giá trị trả về từ loader về object thuần
const toLocale = async <T>(
  loader: () => Promise<LocaleData<T>>
): Promise<T> => {
  const module = await loader()
  if (module && typeof module === 'object' && 'default' in module) {
    return (module as { default: T }).default
  }
  return module as T
}

export function useLocale<T>(vi: LocaleInput<T>, en: LocaleInput<T>) {
  const locale = getInitialLocale()
  const cache: Partial<Record<LocaleKey, T>> = {}

  if (!isLazy(vi)) {
    cache[Locale.VI] = vi
  }

  if (!isLazy(en)) {
    cache[Locale.EN] = en
  }

  const current = shallowRef<T>(cache[locale] ?? ({} as T))

  // Tải locale khi cần và lưu lại để tái sử dụng
  const load = async (target: LocaleKey) => {
    if (cache[target]) {
      current.value = cache[target] as T
      return
    }

    const source = target === Locale.VI ? vi : en
    if (!isLazy(source)) {
      cache[target] = source
      current.value = source
      return
    }

    const value = await toLocale<T>(source)
    cache[target] = value
    current.value = value
  }

  void load(locale)

  return computed<T>(() => current.value ?? cache[locale] ?? ({} as T))
}
