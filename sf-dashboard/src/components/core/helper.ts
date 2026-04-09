import { RouterLink } from 'vue-router'
import { menuNew } from '@/types/state/general'
import { MenuOption, NIcon } from 'naive-ui'
import ReportMenu from '@/assets/icons/ReportMenu.vue'
import SetupMenu from '@/assets/icons/SetupMenu.vue'
import BusinessCenter from '@/assets/icons/BusinessCenter.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'
import TrendingUp from '@/assets/icons/TrendingUp.vue'
import SystemMenu from '@/assets/icons/SystemMenu.vue'
import FinanceMenu from '@/assets/icons/FinanceMenu.vue'
import Logging from '@/assets/icons/Logging.vue'
import CodeSlash from '@/assets/icons/CodeSlash.vue'
import Tools from '@/assets/icons/Tools.vue'
import API from '@/assets/icons/API.vue'
import Travel from '@/assets/icons/Travel.vue'
import Rule from '@/assets/icons/Rule.vue'
import ChartData from '@/assets/icons/ChartData.vue'
import LinkedAccount from '@/assets/LinkedAccount.vue'
import Speed from '@/assets/icons/Speed.vue'
import News from '@/assets/icons/News.vue'
import AccountBox from '@/assets/icons/AccountBox.vue'
import Android from '@/assets/icons/Android.vue'
import Extension from '@/assets/icons/Extension.vue'
import DotMenu from '@/assets/icons/DotMenu.vue'

const renderIcon = (icon: Component, size: number = 20) => {
  return () => h(NIcon, { size: size }, { default: () => h(icon) })
}
const getIcon = (iconKey: string) => {
  switch (iconKey) {
    case 'ReportMenu':
      return renderIcon(ReportMenu)
    case 'SetupMenu':
      return renderIcon(SetupMenu)
    case 'BusinessCenter':
      return renderIcon(BusinessCenter, 20)
    case 'EyeOutline':
      return renderIcon(EyeOutline)
    case 'TrendingUp':
      return renderIcon(TrendingUp, 24)
    case 'SystemMenu':
      return renderIcon(SystemMenu)
    case 'FinanceMenu':
      return renderIcon(FinanceMenu, 24)
    case 'Logging':
      return renderIcon(Logging)
    case 'CodeSlash':
      return renderIcon(CodeSlash)
    case 'Tools':
      return renderIcon(Tools)
    case 'API':
      return renderIcon(API)
    case 'Travel':
      return renderIcon(Travel)
    case 'Rule':
      return renderIcon(Rule)
    case 'ChartData':
      return renderIcon(ChartData)
    case 'LinkedAccount':
      return renderIcon(LinkedAccount)
    case 'Speed':
      return renderIcon(Speed)
    case 'News':
      return renderIcon(News)
    case 'AccountBox':
      return renderIcon(AccountBox)
    case 'Android':
      return renderIcon(Android)
    case 'Extension':
      return renderIcon(Extension)

    case 'child-dot':
      return renderIcon(DotMenu)
    default:
      return renderIcon(DotMenu)
  }
}

export const genRouter = (element: menuNew): MenuOption => {
  if (element.href) {
    return {
      label: () =>
        h(
          'a',
          {
            href: element.href,
            target: 'blank',
          },
          { default: () => element.name }
        ),
      key: element.key,
      icon: element.renderIcon ? getIcon(element.renderIcon) : undefined,
    }
  }

  let routerTemp = {
    label: element.name,
    key: element.key,
    children: element.children?.length ? element.children : undefined,
  } as any

  if (element.url) {
    routerTemp.label = () =>
      h(
        RouterLink,
        {
          to: {
            path: element.url,
          },
        },
        { default: () => element.name }
      )
  } else {
    routerTemp.label = element.name
  }

  if (element.renderIcon) {
    routerTemp.icon = getIcon(element.renderIcon)
  }

  return routerTemp as MenuOption
}
