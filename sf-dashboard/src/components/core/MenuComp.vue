<script setup lang="ts">
import useGeneralStore from '@/store/useGeneralStore'
import { MenuOption, NIcon, NTooltip } from 'naive-ui'
import { genRouter } from '@/components/core/helper'
import { menuNew } from '@/types/state/general'
import KeepPinOutline from '@/assets/icons/KeepPinOutline.vue'
import KeepPin from '@/assets/icons/KeepPin.vue'

import { FlatToTree } from '@/plugins/helpers'

const generalStore = useGeneralStore()
const isHardMenu = computed(
  () => window.arb?.user?.modeSettings?.hardMenu || false
)

const keyRouterList = computed<{ [key: string]: string }>(() => {
  return generalStore.keyRouterList
})

const activeKey = computed(() => {
  return (
    (window.route?.meta.activeMenu as string) ||
    keyRouterList.value[window.route.meta.url as string]
  )
})

const renderLabel = (item: any) => {
  const originalLabel = item.label

  item.label = () => {
    const labelText =
      typeof originalLabel === 'function' ? originalLabel() : originalLabel

    const classWidth = window.arb?.user?.modeSettings?.bookmark
      ? 'max-w-[150px]'
      : 'max-w-[170px]'

    const divs = [h('div', { class: classWidth + '  truncate' }, [labelText])]

    if (window.arb?.user?.modeSettings?.bookmark) {
      divs.push(
        h(
          'span',
          {
            onClick: (event: MouseEvent) => {
              event.stopPropagation()
              generalStore.toggleMarks(item.key)
            },
            class: 'cursor-pointer star-icon',
          },
          [
            h(
              NTooltip,
              { trigger: 'hover' },
              {
                trigger: () =>
                  h(
                    NIcon,
                    { size: 18 },
                    {
                      default: () =>
                        h(
                          generalStore.activeMarks[item.key ?? '']
                            ? KeepPin
                            : KeepPinOutline
                        ),
                    }
                  ),
                default: () =>
                  generalStore.activeMarks[item.key ?? '']
                    ? 'Remove Bookmark'
                    : 'Bookmark',
              }
            ),
          ]
        )
      )
    }

    return h('div', { class: 'flex items-center justify-between w-full' }, divs)
  }
}

const menuOptions = computed<MenuOption[]>(() => {
  const menuRt = FlatToTree(generalStore.menuRouter as any) as menuNew[]

  if (!menuRt.length) return []
  let menuLinks: MenuOption[] = []

  for (let index = 0; index < menuRt.length; index++) {
    const element = menuRt[index]

    if (element.url) {
      element.name = element.name?.toUpperCase()

      const newRt = genRouter(element)
      renderLabel(newRt)
      menuLinks.push(newRt)
    } else {
      if (!element.children?.length) continue

      //Nếu chỉ có 1 children thì lấy chính nó làm menu to
      if (element.children.length === 1) {
        element.children[0].name = element.children[0].name?.toUpperCase()

        //Nếu ko có renderIcon của riêng nó thì lấy của cha nó
        if (!element.children[0].renderIcon) {
          element.children[0].renderIcon = element.renderIcon
        }
        const newRt = genRouter(element.children[0])
        renderLabel(newRt)

        menuLinks.push(newRt)
        continue
      }

      element.name = element.name?.toUpperCase()

      let routerTemp = genRouter(element) as any
      routerTemp.children = []
      element.children?.forEach((e: menuNew) => {
        e.renderIcon = 'child-dot' //Child luôn hiện nút dot, ko hiện icon xịn

        const newRt = genRouter(e)
        renderLabel(newRt)

        routerTemp.children?.push(newRt)
      })

      menuLinks.push(routerTemp)
    }
  }

  return menuLinks
})

const handleUpdateValue = (key: string, item: MenuOption) => {}

onMounted(() => {
  generalStore.loadFavoriteMenu()
  generalStore.listKeyFavourite.forEach((key) => {
    generalStore.activeMarks[key] = true
  })
})
</script>

<template>
  <n-menu
    :value="activeKey"
    mode="vertical"
    class="text-xs font-bold w-full custom-menu-dark-mode"
    :class="{
      'n-menu-hidden-status': generalStore.isMenuCollapse || !isHardMenu,
    }"
    :size="24"
    :options="menuOptions"
    @update:value="handleUpdateValue"
    accordion
  />
</template>

<style lang="scss">
.n-submenu > .n-menu-item > .n-menu-item-content,
.n-menu > .n-menu-item > .n-menu-item-content {
  padding-left: 16px !important;
}

.n-submenu-children > .n-menu-item > .n-menu-item-content {
  // padding-left: 40px !important;
  padding-left: 15px !important;
}

.n-menu-hidden-status {
  .n-submenu-children > .n-menu-item > .n-menu-item-content {
    padding-left: 16px !important;
  }
}
.star-icon {
  margin-top: 4px;
  flex-shrink: 0;
}
</style>
