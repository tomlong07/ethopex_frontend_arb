CKEDITOR.plugins.add('customtools', {
  icons: '',

  init: function (editor) {
    // customBaseUrl define từ baseConfig trong CKEditor.vue
    var baseUrl = editor.config.customBaseUrl

    editor.ui.addButton('CustomImage', {
      label: 'Insert/Edit Image',
      command: 'insertCustomImage',
      toolbar: 'customTools,1',
      icon: baseUrl + '/CustomImageIcon.png',
    })

    editor.ui.addButton('InsertTableTemplate', {
      label: 'Insert Table Template',
      command: 'insertTableTemplate',
      toolbar: 'customTools,2',
      icon: baseUrl + '/InsertTableTemplate.png',
    })

    editor.ui.addButton('NextPage', {
      label: 'Insert Next Page',
      command: 'nextPage',
      toolbar: 'customTools,3',
      icon: baseUrl + '/NextPage.svg',
    })
  },
})
