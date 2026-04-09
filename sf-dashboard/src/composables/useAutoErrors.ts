import { ref, computed, Ref } from 'vue'

export default function useAutoErrors<T extends Record<string, any>>(config: Ref<T>) {
  const rawErrors = ref<{ id: keyof T; message: string }[]>([])

  const hasValue = (v: any) =>
    v !== null && v !== undefined && v.toString?.().trim() !== ''

  const errors = computed(() =>
    Object.fromEntries(
      rawErrors.value
        .filter(e => !hasValue((config.value as any)[e.id])) 
        .map(e => [e.id, e.message])
    )
  )

  return { rawErrors, errors }
}
