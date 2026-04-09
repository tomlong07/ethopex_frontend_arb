import { defineStore } from 'pinia'
import { LayoutItem } from '../useLayoutStore'
import Codemirror from 'codemirror-editor-vue3'
import 'codemirror/mode/vue/vue.js' // Hỗ trợ Vue SFC
import 'codemirror/lib/codemirror.css' // CSS mặc định của Codemirror
import 'codemirror/addon/search/search.js'
import 'codemirror/addon/search/searchcursor.js'
import 'codemirror/addon/dialog/dialog.js'
import 'codemirror/addon/dialog/dialog.css'

export default defineStore('useLayoutDetail', () => {
  const CodemirrorComponent = markRaw(Codemirror)
  const id = computed<number>(() => {
    return Number(window.route.params.id || 0)
  })
  const isSubmitBtnLoading = ref<boolean>(false)
  const isLoading = ref(false)
  const isAddPage = computed<boolean>(() => id.value === 0)
  const isEditPage = computed<boolean>(() => !isAddPage.value)

  const layoutConfig = ref<LayoutItem>(new LayoutItem())
  const domains = ref<string[]>([])

  const cmOptions = ref({
    mode: 'text/x-vue', // Định dạng Vue SFC
    // theme: 'monokai', // Chủ đề tối
    lineNumbers: true, // Hiển thị số dòng
    tabSize: 2, // Dùng 2 spaces
    indentWithTabs: false, // Dùng spaces thay vì tab
    lineWrapping: true, // Xuống dòng khi quá dài
    matchBrackets: true, // Highlight cặp dấu {}
    autoCloseBrackets: true, // Tự động đóng ngoặc
    extraKeys: {
      'Ctrl-F': 'findPersistent',
      'Cmd-F': 'findPersistent',
    },
  })
  const isOnSearch = computed<boolean>(() => {
    return (
      layoutConfig.value.type == 'search' ||
      layoutConfig.value.type == 'search_to_search'
    )
  })

  const infomationError = ref<any>({})
  const showErr = computed(() => {
    const _errors = infomationError.value?.errors || []

    return _errors.reduce((acc: any, err: any) => {
      acc[err.id] = err.message
      return acc
    }, {} as Record<string, string>)  
  })

  const clearData = () => {
    layoutConfig.value = new LayoutItem()
  }
  return {
    isSubmitBtnLoading,
    layoutConfig,
    isLoading,
    isEditPage,
    isAddPage,
    isOnSearch,
    id,
    cmOptions,
    domains,
    Codemirror: CodemirrorComponent,
    clearData,
    infomationError,
    showErr,
  }
})
