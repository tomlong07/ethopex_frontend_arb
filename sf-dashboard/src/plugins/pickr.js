import { loadScript, loadCSS } from '@/utils/utils'

export const initializePickrPlugin = async (editor, window) => {
  try {
    let pickrInstance = null
    let pickrLoadedPromise = null

    // Đảm bảo Pickr chỉ được load 1 lần và chỉ khi cần
    const ensurePickrLoaded = () => {
      if (window.Pickr) return Promise.resolve()

      if (!pickrLoadedPromise) {
        pickrLoadedPromise = (async () => {
          await loadScript(
            'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/pickr.min.js'
          )
          await loadCSS(
            'https://cdn.jsdelivr.net/npm/@simonwep/pickr/dist/themes/monolith.min.css'
          )
        })()
      }

      return pickrLoadedPromise
    }

    // Lệnh mở Pickr, sẽ tự load script/css nếu chưa có
    editor.addCommand('openPickrBgColor', {
      exec: async function (_, data) {
        await ensurePickrLoaded()

        const { containerEl, clickX, clickY, savedBookmark, editorInstance } =
          data
        if (!containerEl || !editorInstance) return
        // Focus và restore selection
        editorInstance.focus()
        if (savedBookmark) {
          const selection = editorInstance.getSelection()
          if (selection) selection.selectBookmarks(savedBookmark)
        }

        // Xóa Pickr cũ nếu có
        const oldContainer = document.querySelector('.pcr-app')
        if (oldContainer) {
          const oldPickr = oldContainer._pickr
          if (oldPickr) oldPickr.destroyAndRemove()
          else oldContainer.remove()
        }

        // Tạo container mới
        const pickrContainer = document.createElement('div')
        pickrContainer.className = 'pickr-app'
        containerEl.appendChild(pickrContainer)

        const pickr = window.Pickr.create({
          el: pickrContainer,
          theme: 'monolith',
          default: data.defaultColor,
          components: {
            preview: true,
            opacity: true,
            hue: true,
            interaction: {
              input: true,
              save: true,
              cancel: true,
            },
          },
        })

        pickrInstance = pickr
        pickrContainer._pickr = pickr

        pickr.on('save', (color) => {
          const rgb = color.toRGBA().toString()
          const selection = editorInstance.getSelection()
          const ranges = selection.getRanges()

          if (!ranges || ranges.length === 0) {
            window.message.error('Please select at least one cell in the table')
            return
          }

          ranges.forEach((range) => {
            const startNode = range.startContainer.getAscendant(
              (el) =>
                el.type === window.CKEDITOR.NODE_ELEMENT &&
                (el.getName() === 'td' || el.getName() === 'th'),
              true
            )
            if (startNode) {
              startNode.setStyle('background-color', rgb)
            }

            const walker = new window.CKEDITOR.dom.walker(range)
            walker.evaluator = (node) =>
              node.type === window.CKEDITOR.NODE_ELEMENT &&
              (node.getName() === 'td' || node.getName() === 'th')

            let node
            while ((node = walker.next())) {
              node.setStyle('background-color', rgb)
            }
          })

          pickr.destroyAndRemove()
          pickrInstance = null
        })

        pickr.on('cancel', () => {
          pickr.destroyAndRemove()
          pickrInstance = null
        })

        pickr.on('show', () => {
          const autoPickrDiv = document.querySelector('.pickr')
          if (autoPickrDiv) autoPickrDiv.remove()
        })

        pickr.show()

        requestAnimationFrame(() => {
          const pickerApp = document.querySelector('.pcr-app')
          if (pickerApp) {
            pickerApp.style.position = 'fixed'
            pickerApp.style.top = `${clickY + 5}px`
            pickerApp.style.left = `${clickX + 5}px`
          }
        })
      },
    })

    // Thêm nút Background Color
    if (!editor._pickrBgColorAdded) {
      editor.ui.addButton('PickrBgColor', {
        label: 'Select Color RGB',
        command: 'openPickrBgColor',
        toolbar: 'customTools,4',
        icon: 'https://arb-ul.pubpowerplatform.io/data/image/thumb_1765449006442182375_8f16496adb1dbf8d1283e371b01e8c7b.png',
      })
      editor._pickrBgColorAdded = true
    }

    // Xử lý sự kiện instanceReady để gán sự kiện click cho nút
    editor.on('instanceReady', () => {
      const buttons = document.querySelectorAll('.cke_button__pickrbgcolor')

      buttons.forEach((el) => {
        if (el instanceof HTMLElement && !el.dataset.pickrBound) {
          el.dataset.pickrBound = 'true'

          el.addEventListener('click', (e) => {
            e.preventDefault()

            let savedBookmark = null
            let defaultColor = 'rgb(255,255,255)'

            const buttonEl = e.currentTarget
            const mouseEvent = e

            // Tìm đúng instance từ nút được click
            const wrapper = buttonEl.closest('.cke')
            if (!wrapper || !wrapper.id) return

            const instanceId = wrapper.id.replace(/^cke_/, '')
            const currentEditor = window.CKEDITOR.instances[instanceId]
            if (!currentEditor) return

            // Focus và lấy selection
            currentEditor.focus()

            // Chờ selection đồng bộ rồi tạo bookmark
            setTimeout(() => {
              const selection = currentEditor.getSelection()
              if (selection) {
                savedBookmark = selection.createBookmarks2(true)
                const startElement = selection.getStartElement()

                if (startElement) {
                  const inlineColor = startElement.getStyle('background-color')
                  const computedColor =
                    startElement.getComputedStyle('background-color')

                  if (
                    inlineColor &&
                    inlineColor !== 'transparent' &&
                    inlineColor !== 'rgba(0,0,0,0)'
                  ) {
                    defaultColor = inlineColor
                  } else if (
                    computedColor &&
                    computedColor !== 'transparent' &&
                    computedColor !== 'rgba(0, 0, 0, 0)'
                  ) {
                    defaultColor = computedColor
                  }
                }
              }

              currentEditor.execCommand('openPickrBgColor', {
                containerEl: buttonEl,
                clickX: mouseEvent.clientX,
                clickY: mouseEvent.clientY,
                savedBookmark,
                editorInstance: currentEditor,
                defaultColor,
              })
            }, 0)
          })
        }
      })
    })

    // Thêm sự kiện click toàn cục để ẩn Pickr
    document.addEventListener('click', (e) => {
      const target = e.target
      if (
        pickrInstance &&
        !target.closest('.pcr-app') &&
        !target.closest('.cke_button__pickrbgcolor')
      ) {
        pickrInstance.destroyAndRemove()
        pickrInstance = null
      }
    })

    return {
      pickrInstance,
      cleanup: () => {
        if (pickrInstance) {
          pickrInstance.destroyAndRemove()
          pickrInstance = null
        }
      },
    }
  } catch (error) {
    console.error('Failed to initialize Pickr plugin:', error)
    return { pickrInstance: null }
  }
}
