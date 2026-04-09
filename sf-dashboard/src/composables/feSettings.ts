import { FeSettings } from '@/class/fe_settings'
import ctr_menu_settings from '@/services/ctr_menu_settings'

export function useFeSettings(
  target: Ref<FeSettings | null | undefined>,
  routeUrl?: string
) {
  const fetchSettings = async () => {
    if (!routeUrl) return
    const result = await ctr_menu_settings.GetFESettings(routeUrl)
    target.value = new FeSettings(result.data || {})
  }

  onBeforeMount(fetchSettings)

  return { fetchSettings }
}
