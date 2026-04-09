import useGeneralStore from '@/store/useGeneralStore'

import helper from '@/utils/helper'
import { createRouter, createWebHistory } from 'vue-router'
import { ctr_user } from '@/services/ctr_user'
import { LOCAL_BACK_URL, LOCAL_STORAGE_TOKEN } from '@/constants/storage'
import { API_DOCUMENT, LOGIN_URL, QUICK_ALT_URL } from '@/constants/urls'
import { NOTFOUND_CLASS, TITLE_DEFAULT } from '@/constants/app'

function newRouter(element) {
  //thêm (\\d+) để chỉ nhận route là số id
  let routerOriginal = {
    path: element.url.includes(':id')
      ? element.url.replace(':id', ':id(\\d+)')
      : element.url,
    meta: {
      title: element.title,
    },
  }

  Object.keys(element).forEach((e) => {
    if (e != 'title') {
      routerOriginal.meta[e] = element[e]
    }
  })

  //Sử dụng cách này mới build đc file chunks để dynamic import
  //Cần import tất thư mục con để nó build ra file chunks
  switch (true) {
    case element.component.includes('views/campaign/'):
      routerOriginal.component = () =>
        import(
          `../views/campaign/${element.component.replace(
            'views/campaign/',
            ''
          )}.vue`
        )
      break
    case element.component.includes('views/details/'):
      routerOriginal.component = () =>
        import(
          `../views/details/${element.component.replace(
            'views/details/',
            ''
          )}.vue`
        )
      break
    case element.component.includes('views/pw/'):
      routerOriginal.component = () =>
        import(`../views/pw/${element.component.replace('views/pw/', '')}.vue`)
      break
    case element.component.includes('views/test/'):
      routerOriginal.component = () =>
        import(
          `../views/test/${element.component.replace('views/test/', '')}.vue`
        )
      break
    case element.component.includes('views/'):
      routerOriginal.component = () =>
        import(`../views/${element.component.replace('views/', '')}.vue`)
      break
  }

  return routerOriginal
}

function addRoutes(routes, routerObject) {
  routes.forEach((element) => {
    if (element.url && element.component) {
      routerObject.routes.push(newRouter(element))
    }
  })
}

export default function initRouter() {
  const generalStore = useGeneralStore()

  const routerNow = generalStore.menuRouter

  const routerObject = {
    history: createWebHistory(),
    routes: [
      {
        path: QUICK_ALT_URL,
        component: () => import('../views/general/QuickAlt.vue'),
        meta: {
          title: 'Login',
          layout: 'login',
        },
      },
      {
        path: LOGIN_URL,
        component: () => import('../views/general/Login.vue'),
        meta: {
          title: 'Login',
          layout: 'login',
        },
      },

      {
        path: API_DOCUMENT,
        component: () => import('../views/ApiDocument.vue'),
        meta: {
          title: 'API Document',
          layout: 'login',
        },
      },
    ],
  }

  addRoutes(routerNow, routerObject)

  routerObject.routes.push({
    path: '/:pathMatch(.*)*',
    component: () => import('../views/general/NotFound.vue'),
    meta: {
      title: 'Not Found',
      layout: 'notfound',
    },
  })

  const router = createRouter(routerObject)
  let timeNow = Date.now()

  const saveRecentByParams = async (option) => {
    const generalStore = useGeneralStore()

    if (!option?.params || Object.keys(option.params).length) return

    const findMenuItem = generalStore.flatMenuMap.get(option.path) || null

    if (findMenuItem) await generalStore.saveRecent(findMenuItem)
  }

  router.beforeEach(async (to, from, next) => {
    const generalStore = useGeneralStore()

    if (generalStore.flattenMenuUrls?.includes(to.path)) {
      generalStore.isLastValidRoute = true
      localStorage.setItem('last_route', JSON.stringify(to.fullPath))
    }

    if (to.path !== from.path) saveRecentByParams(to)

    if ([QUICK_ALT_URL, API_DOCUMENT].includes(to.path)) {
      next()
      return
    }

    timeNow = Date.now()
    generalStore.changeShowLoading(true, timeNow)

    const loggedIn = localStorage.getItem(LOCAL_STORAGE_TOKEN)
    const obj = JSON.parse(loggedIn || '{}')

    if (
      (!loggedIn && to.path !== LOGIN_URL) ||
      obj.expire < parseInt(Date.now() / 1000)
    ) {
      next(false)
      generalStore.changeModalLogin(true)

      return
    }
    if (to.path === LOGIN_URL && loggedIn) {
      next(false)

      const backUrl = localStorage.getItem(LOCAL_BACK_URL)
      if (backUrl) {
        window.location.href = decodeURIComponent(backUrl)
      } else {
        window.location.href = '/'
      }
      return
    }

    if (helper.truePath(to.path) == '/' && to.meta?.layout === 'notfound') {
      next({ path: generalStore.homePage, replace: true })
      return
    }

    if (to.meta?.layout === 'notfound') {
      document.body.classList.add(NOTFOUND_CLASS)
    } else {
      document.body.classList.remove(NOTFOUND_CLASS)
    }

    const id = to.params?.id
    //change title page
    let title = to.meta?.title || 'Not Found'

    if (id) title = title + ` - ${id}`

    title += ` || ${TITLE_DEFAULT} `

    if (window.location.href.includes('duplicate')) {
      title = title.replace('Add', 'Duplicate')
    }
    document.title = title
    generalStore.title = to.meta?.name || to.meta?.title
    next()
  })

  router.afterEach(async (to, from) => {
    generalStore.changeShowLoading(false, timeNow)
    if (![LOGIN_URL, API_DOCUMENT].includes(to.path)) {
      ctr_user.Lac({ router: { from: from.fullPath, to: to.fullPath } })
      localStorage.setItem(LOCAL_BACK_URL, helper.pathNow())
    }
  })

  router.onError(() => {
    generalStore.changeShowLoading(false, timeNow)
  })

  return router
}
