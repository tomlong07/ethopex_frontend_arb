import { NIcon } from 'naive-ui'
import { Router } from 'vue-router'

// Define the redirectTo function
export function redirectTo(
  router: Router,
  url: string,
  timeout: number = 1000
) {
  if (url) {
    router.push({ path: url })
    return
  }

  setTimeout(() => {
    location.reload()
  }, timeout)
}

export const loadScript = async (src: string): Promise<void> => {
  return new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = src
    script.onload = () => resolve()
    script.onerror = (error) => reject(error)
    document.head.appendChild(script)
  })
}

export const loadCSS = (href: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    const link = document.createElement('link')
    link.rel = 'stylesheet'
    link.href = href
    link.onload = () => resolve()
    link.onerror = () => reject(new Error(`Failed to load CSS: ${href}`))
    document.head.appendChild(link)
  })
}

export const renderIcon = (icon: Component) => {
  return () => {
    return h(NIcon, null, {
      default: () => h(icon),
    })
  }
}

export const addTargetBlankToLinks = (html: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')
  const tagNames = ['a', 'area', 'form', 'base', 'link', 'iframe']

  tagNames.forEach((tag) => {
    doc.querySelectorAll(tag).forEach((el) => {
      if (!el.hasAttribute('target')) {
        el.setAttribute('target', '_blank')
      }
    })
  })

  return doc.body.innerHTML
}

export const wrapTablesWithResponsive = (html: string): string => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const tables = doc.querySelectorAll('table')

  tables.forEach((table) => {
    const parent = table.parentElement

    // Nếu parent đã là <div class="table-responsive"> thì bỏ qua
    if (
      parent?.tagName === 'DIV' &&
      parent.classList.contains('table-responsive')
    ) {
      return
    }

    // Tạo div wrapper
    const wrapper = doc.createElement('div')
    wrapper.className = 'table-responsive'

    // Thay thế table bằng wrapper chứa table
    table.replaceWith(wrapper)
    wrapper.appendChild(table)
  })

  return doc.body.innerHTML
}

export const convertImageToFigure = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const imgs = doc.querySelectorAll('img')

  imgs.forEach((img) => {
    const src = img.getAttribute('src') || ''

    const width =
      img.getAttribute('width') || img.style.width?.replace('px', '') || '1000'
    const height =
      img.getAttribute('height') || img.style.height?.replace('px', '') || '600'
    const alt = img.getAttribute('alt') || ''

    const figure = document.createElement('figure')
    const newImg = document.createElement('img')

    newImg.setAttribute('width', width)
    newImg.setAttribute('height', height)
    newImg.setAttribute('class', 'lazyload-arb')
    newImg.setAttribute('data-srcset', src)
    newImg.setAttribute('alt', alt)

    figure.appendChild(newImg)

    img.replaceWith(figure)
  })

  return doc.body.innerHTML
}

export const convertFigureToImage = (html: string) => {
  const parser = new DOMParser()
  const doc = parser.parseFromString(html, 'text/html')

  const figures = doc.querySelectorAll('figure')

  figures.forEach((figure) => {
    const img = figure.querySelector('img.lazyload-arb')
    if (!img) return

    const src = img.getAttribute('data-srcset') || ''
    const width = img.getAttribute('width') || '1000'
    const height = img.getAttribute('height') || '600'

    const newImg = document.createElement('img')
    newImg.setAttribute('src', src)
    newImg.setAttribute('width', width)
    newImg.setAttribute('height', height)

    // Gán style inline nếu cần
    newImg.style.width = `${width}px`
    newImg.style.height = `${height}px`

    figure.replaceWith(newImg)
  })

  return doc.body.innerHTML
}

export const waitForElementById = (
  id: string,
  getShowChartNow: Function = () => true,
  timeout = 3000,
  interval = 100
): Promise<HTMLElement> => {
  return new Promise((resolve, reject) => {
    const start = Date.now()

    const timer = setInterval(() => {
      const el = document.getElementById(id)
      if (el) {
        clearInterval(timer)
        resolve(el)
      } else if (Date.now() - start > timeout) {
        clearInterval(timer)

        let notify = true
        if (getShowChartNow) {
          notify = getShowChartNow()
        }
        if (notify) {
          reject(
            new Error(
              `Chart container with id "${id}" not found after ${timeout}ms.`
            )
          )
        }
      }
    }, interval)
  })
}

export function formatToTimezone(
  input: string,
  targetTimezone = 'UTC'
): string {
  try {
    const date = new Date(input)
    if (isNaN(date.getTime())) return input

    // parse target timezone string like 'UTC' or '+07:00' or '-05:30'
    let targetOffsetMinutes = 0 // minutes
    if (targetTimezone !== 'UTC') {
      const m = targetTimezone.match(/^([+-])(\d{2}):?(\d{2})?$/)
      if (!m) return input // invalid target format
      const sign = m[1] === '+' ? 1 : -1
      const hours = parseInt(m[2], 10)
      const mins = parseInt(m[3] || '0', 10)
      targetOffsetMinutes = sign * (hours * 60 + mins)
    }

    // date.getTime() is UTC millis already
    const targetTs = date.getTime() + targetOffsetMinutes * 60_000
    const td = new Date(targetTs)

    const pad = (n: number) => String(n).padStart(2, '0')
    const day = pad(td.getUTCDate())
    const month = pad(td.getUTCMonth() + 1)
    const year = td.getUTCFullYear()
    const hour = pad(td.getUTCHours())
    const minute = pad(td.getUTCMinutes())
    const second = pad(td.getUTCSeconds())

    const suffix = targetTimezone === 'UTC' ? 'UTC' : `GMT${targetTimezone}`
    return `${day}/${month}/${year} ${hour}:${minute}:${second} ${suffix}`
  } catch {
    return input
  }
}
