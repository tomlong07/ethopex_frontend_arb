import { loadScript } from '@/utils/utils'

import { CDN_IMAGE_MINIO_S3_IMAGE } from '@/constants/urls'

export const useCkeditorLoader = () => {
 

  const loadCkeditorScript = async () => {
    
    try {
      await loadScript('https://cdn.ckeditor.com/4.22.1/full/ckeditor.js?v=3')
    } catch (error) {
      console.error('Failed to load CKEditor:', error)
      window.message.error('Failed to load CKEditor')
      throw error
    } 
  }

  const ensureNextPagePlugin = () => {
    try {
      // @ts-ignore
      const CKEDITOR_GLOBAL = window.CKEDITOR || CKEDITOR

      if (!CKEDITOR_GLOBAL?.plugins?.registered?.nextPage) {
        CKEDITOR_GLOBAL.plugins.add('nextPage', {
          icons: 'nextPage',
          init: function (editor: any) {
            editor.addCommand('insertNextPage', {
              exec: function (editor: any) {
                editor.insertText('[next-page]')
              },
            })

            editor.ui.addButton('NextPage', {
              label: 'Insert Next Page',
              command: 'insertNextPage',
              toolbar: 'insert',
              icon: `${CDN_IMAGE_MINIO_S3_IMAGE}/NextPage.svg`,
            })
          },
        })
      }
    } catch (error) {
      console.error('Failed to register CKEditor NextPage plugin:', error)
      throw error
    }
  }

  const initEditor = (editorRef: any, attempts = 200, delay = 200) => {
    if (attempts <= 0) return

    if (editorRef.value) {
      editorRef.value?.init()
    } else {
      setTimeout(() => {
        initEditor(editorRef, attempts - 1, delay)
      }, delay)
    }
  }

  return {
    loadCkeditorScript,
    initEditor,
    ensureNextPagePlugin,
  }
}
