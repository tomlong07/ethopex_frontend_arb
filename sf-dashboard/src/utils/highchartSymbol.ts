import Highcharts from 'highcharts'

let inited = false

export const initHighchartsSymbols = () => {
  if (inited) return
  inited = true

  Highcharts.SVGRenderer.prototype.symbols.customExpand = function (
    x: number,
    y: number,
    w: number,
    h: number
  ) {
    return [
      'M',
      x,
      y + h * 0.3,
      'L',
      x,
      y,
      'L',
      x + w * 0.3,
      y,

      'M',
      x + w * 0.7,
      y,
      'L',
      x + w,
      y,
      'L',
      x + w,
      y + h * 0.3,

      'M',
      x + w,
      y + h * 0.7,
      'L',
      x + w,
      y + h,
      'L',
      x + w * 0.7,
      y + h,

      'M',
      x + w * 0.3,
      y + h,
      'L',
      x,
      y + h,
      'L',
      x,
      y + h * 0.7,
    ]
  }
}
