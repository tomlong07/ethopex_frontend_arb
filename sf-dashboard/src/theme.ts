import { GlobalThemeOverrides } from 'naive-ui'

const colorNormal = '#6B7280'
const colorActive = '#2d5cc8'
const colorHover = '#94A3B8'

export const themeOverrides = {
  common: {
    primaryColor: '#2d5cc8',
  },
  Button: {
    textColorHover: 'none',
    borderHover: '1px solid #2080f0',
  },
  Select: {
    peers: {
      InternalSelection: {
        textColor: '#000000',
        borderHover: '1px solid rgb(32, 128, 240, 0.7)',
        borderActive: '1px solid #2080f0',
        colorActive: '1px solid #e2e8f0',
        paddingMultiple: '3px 26px 0 3px',
      },
    },
  },
  Menu: {
    itemTextColor: colorNormal,
    itemTextColorHorizontal: colorNormal,

    itemTextColorActive: colorActive,
    itemTextColorActiveHorizontal: colorActive,
    itemTextColorChildActive: colorActive,
    itemTextColorChildActiveHorizontal: colorActive,

    itemTextColorHover: colorHover,
    itemTextColorHoverHorizontal: colorHover,
    itemTextColorActiveHoverHorizontal: colorHover,
    itemTextColorChildActiveHover: colorHover,
    itemTextColorChildActiveHoverHorizontal: colorHover,
  },
  Input: {
    borderFocus: '1px solid #2080f0',
    borderHover: '1px solid #2080f0',
  },
  Switch: {
    railColorActive: '#121212',
    loadingColor: '#121212',
  },
  Checkbox: {
    colorChecked: '#000000',
    borderChecked: '1px solid #000000',
    borderFocus: '1px solid #000000',
  },
  Radio: {
    boxShadowActive: 'inset 0 0 0 1px #000000',
    boxShadowFocus: 'inset 0 0 0 1px #000000, 0 0 0 2px rgba(4, 4, 4, 0.2)',
    boxShadowHover: 'inset 0 0 0 1px #000000',
    dotColorActive: '#000000',
    buttonBorderColorActive: '#2080f0',
  },
} as GlobalThemeOverrides
