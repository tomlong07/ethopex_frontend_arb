<script setup lang="ts">
import { initializePickrPlugin } from '@/plugins/pickr'
import ImagePropertiesModal from '@/components/image_properties/ImagePropertiesModal.vue'
import useGeneralStore from '@/store/useGeneralStore'
const generalStore = useGeneralStore()
import { TableTemplate } from '@/constants/templates'
import {
  CDN_IMAGE_MINIO_S3_IMAGE,
  FULL_URL_MEDIA,
  URL_UPLOAD,
} from '@/constants/urls'
import { DEFAULT_CKEDITOR_TOOLBAR } from '@/constants/ckeditor'

const props = defineProps({
  initData: {
    type: String,
    required: false,
    default: '',
  },

  id: {
    type: String,
    required: true,
  },

  autoInit: {
    type: Boolean,
    default: false,
  },

  loading: {
    type: Boolean,
    default: false,
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  height: {
    type: Number,
    default: 200,
  },
  title: {
    type: String,
    required: true,
  },
  isOpenTool: {
    type: Boolean,
    default: true,
  },
  onlyColorToolbar: {
    type: Boolean,
    default: false,
  },
  editorType: {
    type: String,
    default: '',
  },

  overlay: {
    type: Boolean,
    default: false,
  },

  minimalToolbar: {
    type: Boolean,
    default: false,
  },
})

const editorInstance = ref<any>(null)
const content = ref<string>(props.initData)

watch(
  () => generalStore.isDark,
  (newVal, oldVal) => {
    if (newVal !== oldVal) {
      window.location.reload()
    }
  }
)

// New Image Properties Modal
const showImageModal = ref<boolean>(false)
const editingImageElement = ref<HTMLImageElement | null>(null)

const buildEditorConfig = (): Record<string, any> => {
  const baseConfig: Record<string, any> = {
    filebrowserUploadUrl: FULL_URL_MEDIA,
    removePlugins: 'about,print,smiley,exportpdf,image',
    extraAllowedContent:
      'img[*]{*}(*) video[*]{*}(*) source[*]{*}(*) iframe[*]{*}(*) table[*]{*}(*)',
    allowedContent: true,
    filebrowserUploadMethod: 'form-data',
    extraPlugins: 'uploadimage,tabletools,contextmenu,customtools',
    clipboard_handleImages: false,
    height: props.height + 'px',
    versionCheck: false,
    skin: 'moono-lisa',
    customBaseUrl: CDN_IMAGE_MINIO_S3_IMAGE,
  }

  switch (true) {
    case props.onlyColorToolbar:
      baseConfig.toolbar = [
        { name: 'colors', items: ['TextColor', 'BGColor'] }
      ]
      break

    case props.minimalToolbar:
      baseConfig.toolbar = [
        { name: 'colors', items: ['TextColor'] },
        { name: 'customTools', items: ['CustomImage'] }
      ]
      break

    default:
      baseConfig.toolbar = DEFAULT_CKEDITOR_TOOLBAR
  }

  if (generalStore.isDark) {
    baseConfig.skin = 'moono-dark,/ckeditor/skins/moono-dark/'
    baseConfig.contentsCss = [
      '/ckeditor/skins/moono-dark/editor.css',
      '/ckeditor/custom-contents.css',
    ]
  }

  return baseConfig
}

const init = (attempts = 10, delay = 100) => {
  if (attempts <= 0) {
    window.message.error(
      'CKEditor not loaded. Please reload the page to try again'
    )
    return
  }

  if (window.CKEDITOR) {
    // CKEditor đã được load, thực hiện các hành động cần thiết tại đây
    initializeCKEditor()
  } else {
    // CKEditor chưa được load, thử lại sau delay milliseconds
    setTimeout(() => {
      init(attempts - 1, delay)
    }, delay)
  }
}

// Thiết lập plugins bổ sung cho CKEditor
const setupCKEditorPlugins = () => {
  window.CKEDITOR.plugins.addExternal(
    'tabletools',
    '/ckeditor/plugins/tabletools/',
    'plugin.js'
  )
  window.CKEDITOR.plugins.addExternal(
    'customtools',
    '/ckeditor/plugins/customtools/',
    'plugin.js'
  )
}

// xử lý ảnh
const setupImageCommands = () => {
  editorInstance.value.addCommand('insertCustomImage', {
    exec: function (editor: any) {
      editingImageElement.value = null
      showImageModal.value = true
    },
  })

  editorInstance.value.addCommand('editCustomImage', {
    exec: function (editor: any) {
      let targetImage = null

      if (editor._contextImage) {
        targetImage = editor._contextImage
        delete editor._contextImage
      } else {
        const selection = editor.getSelection()
        const element = selection.getStartElement()

        if (element && element.is('img')) {
          targetImage = element.$
        }
      }

      if (targetImage) {
        editingImageElement.value = targetImage
        showImageModal.value = true
      }
    },
  })
}

// xử lý sự kiện cho ảnh (context menu và double click)
const setupImageEventHandlers = () => {
  editorInstance.value.on('contentDom', function () {
    editorInstance.value.addMenuGroup('imageGroup')
    editorInstance.value.addMenuItem('editImage', {
      label: 'Edit Image',
      icon: `${CDN_IMAGE_MINIO_S3_IMAGE}/EditImage.png`,

      command: 'editCustomImage',
      group: 'imageGroup',
    })

    editorInstance.value.contextMenu.addListener(function (element: any) {
      if (element.getAscendant('img', true)) {
        const img = element.getAscendant('img', true)
        editorInstance.value._contextImage = img.$

        return {
          editImage: window.CKEDITOR.TRISTATE_OFF,
        }
      }
      return {}
    })

    const editable = editorInstance.value.editable()
    editable.attachListener(editable, 'dblclick', function (evt: any) {
      const element = evt.data.getTarget()
      if (element.is('img')) {
        editingImageElement.value = element.$
        showImageModal.value = true
        evt.data.preventDefault()
      }
    })
  })
}

// Thiết lập template bảng có sẵn
const setupTableTemplate = () => {
  editorInstance.value.addCommand('insertTableTemplate', {
    exec: function (editor: any) {
      editor.insertHtml(TableTemplate)
    },
  })
}

// Thiết lập nút chèn trang mới
const setupNextPageButton = () => {
  editorInstance.value.addCommand('nextPage', {
    exec: function (editor: any) {
      editor.insertHtml('[next-page]')
    },
  })
}

// Thiết lập xử lý upload file
const setupFileUploadHandlers = () => {
  editorInstance.value.on(
    'fileUploadRequest',
    function (evt: any) {
      try {
        var fileLoader = evt.data.fileLoader,
          formData = new FormData(),
          xhr = fileLoader.xhr
        xhr.open('POST', fileLoader.uploadUrl, true)
        formData.append('file', fileLoader.file, fileLoader.fileName)
        fileLoader.xhr.send(formData)
        evt.stop()
      } catch (error) {
        console.error(error)
      }
    },
    null,
    null,
    4
  )

  editorInstance.value.on('fileUploadResponse', function (evt: any) {
    try {
      evt.stop()

      var data = evt.data,
        xhr = data.fileLoader.xhr,
        response = xhr.responseText.split('|')

      if (response && response.length) {
        const res = response[0]
        const resDecode = JSON.parse(res)
        if (resDecode.status == 'success') {
          if (
            resDecode.data_object?.thumb &&
            resDecode.data_object?.thumb.length
          ) {
            data.url = URL_UPLOAD + resDecode.data_object?.thumb[0]
          } else {
            data.message = 'Error Response Upload'
          }
        } else {
          if (resDecode.errors && resDecode.errors.length) {
            data.message = resDecode.errors[0].message
          } else {
            data.message = 'Error upload'
          }
          evt.cancel()
        }
      }
    } catch (error) {
      console.error(error)
    }
  })
}

// Thiết lập xử lý sự kiện thay đổi nội dung
const setupChangeHandler = () => {
  editorInstance.value.on('change', () => {
    content.value = editorInstance.value.getData()
    emit('changeEditor', content.value)
  })
}

// Khởi tạo CKEditor với tất cả các thiết lập
const initializeCKEditor = async () => {
  if (editorInstance.value) return
  try {
    setupCKEditorPlugins()

    // Xóa instance CKEditor cũ trùng id (nếu có) để tránh lỗi editor-element-conflict
    const existing = window.CKEDITOR?.instances?.[props.id]
    if (existing) {
      existing.destroy(true)
    }

    editorInstance.value = window.CKEDITOR.replace(
      props.id,
      buildEditorConfig()
    )
    editorInstance.value.setData(content.value)

    const { cleanup: pickrCleanup } = await initializePickrPlugin(
      editorInstance.value,
      window
    )
    pickrCleanup?.()

    setupImageCommands()
    setupImageEventHandlers()
    setupTableTemplate()
    setupNextPageButton()
    setupFileUploadHandlers()
    setupChangeHandler()
  } catch (error) {
    console.error('Failed to initialize CKEditor:', error)
  }
}

const emit = defineEmits<{
  (e: 'changeEditor', data: string): void
  (e: 'emitEdit'): void
}>()

// Xử lý khi ảnh được chọn từ modal
const handleImageSelected = (imageSrc: string) => {
  editingImageElement.value = null
}

// Cập nhật dữ liệu cho editor
const setData = (data: any) => {
  if (!data) {
    data = ''
  }
  if (editorInstance.value) {
    editorInstance.value.setData(data)
  } else {
    content.value = data
    init()
  }
}

onMounted(async () => {
  if (props.autoInit) {
    init()
  }
})

// Func Event
const emitEdit = async () => {
  emit('emitEdit')
}

defineExpose({
  setData,
  init,
  editorInstance,
})
</script>

<template>
  <div class="relative">
    <n-spin
      size="small"
      :show="props.loading"
      :style="{ height: props.height + 108 + 36 + 'px' }"
    >
      <div class="relative">
        <textarea
          :id="id"
          :disabled="props.disabled"
          class="border w-full"
          :style="{ height: props.height + 108 + 36 + 'px' }"
        ></textarea>

        <!-- Layer đè khi disabled -->
        <div
          v-if="props.overlay"
          class="absolute inset-0 bg-white/50 cursor-not-allowed group hover:bg-white/60 transition"
        >
          <div
            class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition"
          >
            <button
              class="text-sm bg-blue-600 text-white px-4 py-2 rounded shadow hover:bg-blue-700"
              @click="emitEdit()"
            >
              Click to Edit
            </button>
          </div>
        </div>
      </div>
    </n-spin>

    <!-- Image Properties Modal -->
    <ImagePropertiesModal
      v-model:show="showImageModal"
      :editor-instance="editorInstance"
      :editor-id="props.id"
      :editor-type="props.editorType"
      :editing-image-element="editingImageElement"
      @image-selected="handleImageSelected"
    />
  </div>
</template>
