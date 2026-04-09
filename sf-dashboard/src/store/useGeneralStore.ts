import { defineStore } from 'pinia'
import { menuNew } from '@/types/state/general'
import { campaignType } from '@/types/components/campaign'
import { ModeSettings } from '@/core/window'
import { debounceV2 } from '@/utils'
import { ctr_user } from '@/services/ctr_user'
import { ctr_menu } from '@/services/ctr_menu'
import { D } from '@/enum/dark_mode'
import { EMAIL_STORAGE, LOCAL_STORAGE_TOKEN } from '@/constants/storage'
import { LIMITED_RECENT } from '@/constants/app'

export default defineStore('useGeneralStore', () => {
  const menuNew = ref<menuNew>({} as menuNew)
  const modeSettings = ref<ModeSettings>({} as ModeSettings)
  const isLastValidRoute = ref(false)

  const hoverMenu = ref(false)
  const isMenuCollapse = ref(false)
  const title = ref('')

  const showModalLogin = ref<boolean>(false)

  const showLoading = ref<boolean>(false)
  const lastTimeChangeRoute = ref<number>(Date.now())

  const showModalCopyCampaign = ref<boolean>(false)
  const sourceCopyCampaign = ref<campaignType | undefined>(undefined)

  const listKeyFavourite = ref<(string | number)[]>([])
  const initialListKeyFavourite = ref<(string | number)[]>([])

  const activeMarks = ref<{ [key: string]: boolean }>({})
  const isRecentChange = ref(0)

  const flattenMenuUrls = computed<string[]>(
    () =>
      menuNew.value?.children
        ?.map((item) => item.url)
        .filter(
          (url): url is string => typeof url === 'string' && url !== ''
        ) ?? []
  )

  const notifyNow = (rt: string) => {
    if (!rt || !menuNew.value.notify) return ''
    return menuNew.value.notify[rt] || ''
  }

  const toggleMarks = (key?: string | number) => {
    if (key === undefined) return

    const isLiked = !!activeMarks.value[key]

    if (isLiked) {
      listKeyFavourite.value = listKeyFavourite.value.filter(
        (item) => item !== key
      )
    } else {
      if (listKeyFavourite.value.length >= 7) {
        window.message.error('You can only select up to 7 bookmark items!')
        return
      }

      listKeyFavourite.value.push(key)
    }

    activeMarks.value[key] = !isLiked

    if (
      JSON.stringify(listKeyFavourite.value) !==
      JSON.stringify(initialListKeyFavourite.value)
    ) {
      saveModeSettings()
    }
  }

  const getListFavouriteForKey = () => {
    const routerList = Array.isArray(menuNew.value?.children)
      ? menuNew.value.children
      : []

    if (!routerList.length || !listKeyFavourite.value.length) return []

    return listKeyFavourite.value.flatMap((key) =>
      routerList.flatMap((group) => {
        const matchedItems = []

        if (group?.key === key) {
          matchedItems.push(group)
        }

        if (Array.isArray(group?.children)) {
          matchedItems.push(
            ...group.children.filter((item: any) => item?.key === key)
          )
        }

        return matchedItems
      })
    )
  }

  const isHardMenu = ref<boolean>(false)
  const bookmarkMenu = ref<boolean>(false)
  const isFavouriteMenu = ref<boolean>(false)
  const isSaveRecent = ref<boolean>(false)
  const isNewLayout = ref<boolean>(false)
  const recentActivity = ref<any[]>([])

  const flatMenuMap = computed(() => {
    const map = new Map<string, any>()

    const flatten = (list: any[]) => {
      for (const item of list) {
        if (item.url) {
          map.set(item.url, item)
        }
        if (Array.isArray(item.children)) {
          flatten(item.children)
        }
      }
    }

    flatten(menuRouter.value)
    return map
  })

  const loadFavoriteMenu = () => {
    listKeyFavourite.value =
      window.arb.user.modeSettings?.listKeyFavourite ?? []
    initialListKeyFavourite.value = [...listKeyFavourite.value]
  }
  const loadSystemSettings = () => {
    isHardMenu.value = window.arb.user.modeSettings?.hardMenu ?? false
    bookmarkMenu.value = window.arb.user.modeSettings?.bookmark ?? false
    isFavouriteMenu.value = window.arb.user.modeSettings?.favouriteMenu ?? false
    isSaveRecent.value = window.arb.user.modeSettings?.recentPage ?? false
    isNewLayout.value = window.arb.user.modeSettings?.newLayout ?? false
  }
  const createModeSettingsPayload = () => {
    return {
      ...window.arb.user.modeSettings,
      hardMenu: isHardMenu.value,
      favouriteMenu: isFavouriteMenu.value,
      bookmark: bookmarkMenu.value,
      listKeyFavourite: listKeyFavourite.value,
      recentPage: isSaveRecent.value,
      newLayout: isNewLayout.value,
    } as ModeSettings
  }

  const saveModeSettings = debounceV2(async (isReload: boolean = false) => {
    const modeSettingsPayload = createModeSettingsPayload()

    window.arb.user.changeModeSettings(modeSettingsPayload)

    const result = await ctr_user.SaveFrontendModeSettings({
      mode_settings: JSON.stringify(modeSettingsPayload),
    })
    if (result?.status && isReload) {
      window.location.reload()
    }
  }, 300)

  const saveRecentSettings = debounceV2(async () => {
    const _recents = {
      recent_settings: JSON.stringify(recentActivity.value),
    }
    await ctr_user.SaveFrontendRecentSettings(_recents)
  }, 300)

  const getRecentSettings = async () => {
    const result = await ctr_user.GetFrontendRecentSettings()
    if (result?.status) {
      const rawSettings = result.data?.recent_settings
      recentActivity.value = rawSettings ? JSON.parse(rawSettings) : []
    }
  }

  const getModeSettings = async () => {
    const result = await ctr_menu.fetchModeSettings()
    if (result?.data) {
      modeSettings.value = result?.data
        ? JSON.parse(result?.data)
        : ({ menuLeftMode: true } as ModeSettings)
    } else {
      modeSettings.value = { menuLeftMode: true } as ModeSettings
    }
  }

  const homePage = computed<string>(() => {
    if (!menuNew.value.children) return ''

    for (const el of menuNew.value.children) {
      if (!el?.url || el.notHomePage || !el.show) continue
      return el.url
    }
    return ''
  })

  const quickLoginURL = computed(() => {
    return menuNew.value?.quickLogin || ''
  })

  const userName = computed(() => {
    return menuNew.value?.userName || ''
  })

  const userId = computed(() => {
    return menuNew.value?.userId || ''
  })

  const userNameShow = computed(() => {
    return userName?.value.replace(/"/g, '') || ''
  })

  const userFullInfoShow = computed(() => {
    return userNameShow.value + ' - ' + userEmailShow.value
  })

  const email = computed(() => {
    return menuNew.value?.email || ''
  })

  const userEmailShow = computed(() => {
    return email?.value.replace(/"/g, '') || ''
  })

  const hostURL = computed(() => {
    return menuNew.value?.host || ''
  })

  const menuRouter = computed(() => {
    return menuNew.value?.children || []
  })

  const keyRouterList = computed(() => {
    if (!menuRouter.value.length) return {}

    let routerKeys: Record<string, string> = {}

    menuRouter.value.forEach((element) => {
      if (!element.url) return

      const key = element.key ? element.key : element.activeMenu
      if (!key) return

      routerKeys[element.url] = key
    })

    return routerKeys
  })

  const routerinfo = computed(() => {
    if (!menuRouter.value.length) {
      return []
    }

    let info = [] as any[]
    let exists = [] as string[]

    menuRouter.value.forEach((element) => {
      // Kiểm tra nếu phần tử có thuộc tính url
      if (element.url && !element.url.includes(':')) {
        // Thêm thông tin của phần tử vào mảng info
        if (!exists.includes(element.url)) {
          info.push({
            url: element.url,
            name: element.name,
            title: element.title,
          })
          exists.push(element.url)
        }
      }

      if (!element.url && element.href) {
        info.push({
          url: element.href,
          name: element.name,
          title: element.title,
        })
        exists.push(element.href)
      }
    })

    return info
  })

  const fetchInfo = {
    fetchMenuNew: async () => {
      const res = await ctr_menu.fetchMenuNew()

      window.arb.menuRawInfo = res

      await Promise.all([getRecentSettings(), getModeSettings()])

      if (!res) return

      // Handle cases when account is rejected / various error scenarios
      if (res.errors) {
        let text = ''

        if (Array.isArray(res.errors)) {
          res.errors.forEach((element: { message: string }) => {
            text += `${element.message}<br>`
          })
        } else {
          text += res.errors
        }

        text = `<style>button {
					background-color: #04AA6D;
					margin-top: 100px;
					color: white;
					bottom: 20px;
					padding: 14px 20px;
					margin-left: auto;
					border: none;
					cursor: pointer;
					width: 25%;
				}
				button:hover {
					opacity: 0.8;
				}</style>
				<div style="text-align:center;margin:20px;">
				<div style="font-size:32px;font-weight:600">Please contact the administrator for more information.</div>
				<div style="font-size:24px">${text}</div>
				<button href="/login" onclick="localStorage.setItem('uif', '');window.location = '/login'">BACK TO LOGIN</button></div>`

        document.body.innerHTML = text

        return
      }

      if (!res.data) return

      menuNew.value = res.data

      const thisEmail = res.data?.email

      const savedEmail = localStorage.getItem(EMAIL_STORAGE)

      // If the new login email is different from the previous one -> clear all previous settings
      if (savedEmail !== thisEmail) {
        localStorage.setItem(EMAIL_STORAGE, thisEmail)

        helper.clearLocalStorageExceptV2(
          LOCAL_STORAGE_TOKEN,
          'version',
          EMAIL_STORAGE
        )
      }

      trackInit()

      return true
    },
  }

  const trackInit = (): void => {
    try {
      if (menuNew.value.hj) helper.hotJar()

      if (menuNew.value.cla) {
        helper.clarity(menuNew.value.cla)
        window.clarity('identify', menuNew.value?.email || 'Unknown')
      }
    } catch (error) {
      console.error(error)
    }
  }

  const changeModalLogin = (value: boolean) => {
    if (value === true) {
      helper.clearStorageInfo()
    }
    showModalLogin.value = value
  }

  const changeShowLoading = (value: boolean, time: number) => {
    if (value === true) {
      showLoading.value = value
      lastTimeChangeRoute.value = time
      return
    }

    //Đảm bảo change loading nhiều lần thì chỉ change loading về false ở lần cuối cùng
    if (lastTimeChangeRoute.value > time) {
      return
    }
    showLoading.value = value
    lastTimeChangeRoute.value = time
  }

  const changeModalCopyCampaign = (
    status: boolean,
    source: campaignType | undefined = undefined
  ) => {
    showModalCopyCampaign.value = status

    if (!status) {
      sourceCopyCampaign.value = undefined
      return
    }
    sourceCopyCampaign.value = source
  }

  const saveUserRecent = (recents: any[]) => {
    recentActivity.value = recents
    saveRecentSettings()
  }

  const getRecent = async () => {
    if (!recentActivity.value?.length) {
      return []
    }

    try {
      const urlMap = new Map(
        menuNew.value.children?.map((item) => [item.url, item])
      )
      const result = []

      const maxRecent = recentActivity.value.slice(0, LIMITED_RECENT)
      for (const url of maxRecent) {
        const item = urlMap.get(url)
        if (item) result.push(item)
      }

      if (result.length !== recentActivity.value.length) {
        await saveRecentSettings()
      }

      return result
    } catch (e) {
      console.error('Failed to get recents', e)
      return []
    }
  }

  const dateForNow = computed(() => Date.now())

  // Theme management: 'system' | 'dark' | 'light'
  const THEME_STORAGE_KEY = 'arb_theme_mode'
  const themeMode = ref<D.SYSTEM | D.DARK | D.LIGHT>(D.LIGHT)

  const isDark = computed(() => {
    const mode = themeMode.value || D.SYSTEM
    if (mode === D.DARK) return true
    if (mode === D.LIGHT) return false
    return window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  const updateGlobalDarkFlag = () => {
    if (typeof window === 'undefined' || !window.arb) {
      return
    }
    window.arb.isDark = isDark.value
  }

  const applyTheme = (mode: D.SYSTEM | D.DARK | D.LIGHT) => {
    try {
      const el = document.documentElement

      const setDark = (isDark: boolean) => {
        if (isDark) {
          el.classList.add(D.DARK)
          el.setAttribute('data-theme', D.DARK)
        } else {
          el.classList.remove(D.DARK)
          el.setAttribute('data-theme', D.LIGHT)
        }
      }

      if (mode === D.SYSTEM) {
        const isSysDark = window.matchMedia(
          '(prefers-color-scheme: dark)'
        ).matches
        setDark(isSysDark)
      } else if (mode === D.DARK) {
        setDark(true)
      } else {
        setDark(false)
      }
    } catch (e) {
      console.error('applyTheme error', e)
    }
    updateGlobalDarkFlag()
  }

  const persistTheme = (mode: D.SYSTEM | D.DARK | D.LIGHT) => {
    try {
      localStorage.setItem(THEME_STORAGE_KEY, mode)
    } catch {}
  }

  const setThemeMode = (mode: D.SYSTEM | D.DARK | D.LIGHT) => {
    themeMode.value = mode
    applyTheme(mode)
    persistTheme(mode)
  }

  const loadThemeFromStorage = () => {
    try {
      const saved = localStorage.getItem(THEME_STORAGE_KEY) as
        | D.SYSTEM
        | D.DARK
        | D.LIGHT
        | null

      const toUse = saved || D.LIGHT
      themeMode.value = toUse
      applyTheme(toUse)

      // If system, listen to changes
      if (toUse === D.SYSTEM) {
        try {
          const mq = window.matchMedia('(prefers-color-scheme: dark)')
          const listener = () => {
            applyTheme(D.SYSTEM)
          }
          if (mq.addEventListener) {
            mq.addEventListener('change', listener)
          } else if ((mq as any).addListener) {
            ;(mq as any).addListener(listener)
          }
        } catch {}
      }
    } catch (e) {
      console.error('loadThemeFromStorage error', e)
    }
  }

  updateGlobalDarkFlag()

  const saveRecent = async (value: any) => {
    if (!value?.url || !isSaveRecent.value) return

    const recentRaw = (await getRecent()) || []

    const recentEmpty = recentRaw.map((item) =>
      typeof item === 'string' ? item : item.url
    )
    const filtered = recentEmpty.filter((url) => url !== value.url)
    const reversedRecent = [value.url, ...filtered]
    const limitedRecent = reversedRecent.slice(0, LIMITED_RECENT)
    await saveUserRecent(limitedRecent)

    isRecentChange.value = dateForNow.value
  }

  const removeRecentAll = async () => {
    saveUserRecent([])
    isRecentChange.value = dateForNow.value
  }

  const removeRecent = async (recent: any) => {
    const recentRaw = (await getRecent()) || []
    const recentEmpty = recentRaw?.map((item) => (item.url ? item.url : item))

    if (recentEmpty && Array.isArray(recentEmpty)) {
      const recentAfter = recentEmpty.filter((item: any) => item !== recent.url)
      await saveUserRecent(recentAfter)
    }

    isRecentChange.value = dateForNow.value
  }

  return {
    isDark,
    themeMode,
    setThemeMode,
    loadThemeFromStorage,
    menuNew,
    hoverMenu,
    isMenuCollapse,
    userName,
    userId,
    userNameShow,
    email,
    userEmailShow,
    userFullInfoShow,
    showModalLogin,
    menuRouter,
    keyRouterList,
    title,
    homePage,
    quickLoginURL,
    hostURL,
    fetchInfo,
    routerinfo,
    showLoading,
    showModalCopyCampaign,
    sourceCopyCampaign,

    flatMenuMap,
    modeSettings,
    changeModalLogin,
    changeShowLoading,
    changeModalCopyCampaign,

    listKeyFavourite,
    activeMarks,
    toggleMarks,
    getListFavouriteForKey,
    isHardMenu,
    bookmarkMenu,
    isFavouriteMenu,
    loadFavoriteMenu,
    loadSystemSettings,
    saveModeSettings,
    saveRecent,
    getRecent,
    isRecentChange,
    removeRecentAll,
    isSaveRecent,
    isNewLayout,
    removeRecent,
    recentActivity,
    isLastValidRoute,
    flattenMenuUrls,

    notifyNow,
  }
})
