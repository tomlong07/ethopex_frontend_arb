export interface Color {
  color?: string
  textColor?: string
}

export const colorList: { [key: string]: Color } = {
  'subtle green': {
    color: 'rgb(22, 75, 53)',
    textColor: 'rgb(186, 243, 219)',
  },
  'subtle yellow': { color: 'rgb(83, 63, 4)', textColor: 'rgb(248, 230, 160)' },
  'subtle orange': {
    color: 'rgb(112, 46, 0)',
    textColor: 'rgb(254, 222, 200)',
  },
  'subtle red': { color: 'rgb(93, 31, 26)', textColor: 'rgb(255, 213, 210)' },
  'subtle purple': {
    color: 'rgb(53, 44, 99)',
    textColor: 'rgb(223, 216, 253)',
  },

  green: { color: 'rgb(33, 110, 78)', textColor: 'rgb(186, 243, 219)' },
  yellow: { color: 'rgb(127, 95, 1)', textColor: 'rgb(248, 230, 160)' },
  orange: { color: 'rgb(165, 72, 0)', textColor: 'rgb(254, 222, 200)' },
  red: { color: 'rgb(174, 46, 36)', textColor: 'rgb(255, 213, 210)' },
  purple: { color: 'rgb(94, 77, 178)', textColor: 'rgb(223, 216, 253)' },

  'bold green': { color: 'rgb(75, 206, 151)', textColor: 'rgb(29, 33, 37)' },
  'bold yellow': { color: 'rgb(226, 178, 3)', textColor: 'rgb(29, 33, 37)' },
  'bold orange': { color: 'rgb(254, 163, 98)', textColor: 'rgb(29, 33, 37)' },
  'bold red': { color: 'rgb(248, 113, 104)', textColor: 'rgb(29, 33, 37)' },
  'bold purple': { color: 'rgb(159, 143, 239)', textColor: 'rgb(29, 33, 37)' },

  'subtle blue': { color: 'rgb(9, 50, 108)', textColor: 'rgb(204, 224, 255)' },
  'subtle sky': { color: 'rgb(22, 69, 85)', textColor: 'rgb(198, 237, 251)' },
  'subtle lime': { color: 'rgb(55, 71, 31)', textColor: 'rgb(211, 241, 167)' },
  'subtle pink': { color: 'rgb(80, 37, 63)', textColor: 'rgb(253, 208, 236)' },
  'subtle black': { color: 'rgb(69, 79, 89)', textColor: 'rgb(222, 228, 234)' },

  blue: { color: 'rgb(0, 85, 204)', textColor: 'rgb(204, 224, 255)' },
  sky: { color: 'rgb(32, 106, 131)', textColor: 'rgb(198, 237, 251)' },
  lime: { color: 'rgb(76, 107, 31)', textColor: 'rgb(211, 241, 167)' },
  pink: { color: 'rgb(148, 61, 115)', textColor: 'rgb(253, 208, 236)' },
  black: { color: 'rgb(89, 103, 115)', textColor: 'rgb(222, 228, 234)' },

  'bold blue': { color: 'rgb(87, 157, 255)', textColor: 'rgb(29, 33, 37)' },
  'bold sky': { color: 'rgb(108, 195, 224)', textColor: 'rgb(29, 33, 37)' },
  'bold lime': { color: 'rgb(148, 199, 72)', textColor: 'rgb(29, 33, 37)' },
  'bold pink': { color: 'rgb(231, 116, 187)', textColor: 'rgb(29, 33, 37)' },
  'bold black': { color: 'rgb(140, 155, 171)', textColor: 'rgb(29, 33, 37)' },

  none: { color: 'rgba(161, 189, 217, 0.08)' },
}
