<script lang="ts" setup>
import CKEditor from '@/components/common/CKEditor.vue'
import { prelanderConfigs } from '@/types/components/landing'
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'

const descriptionEditorComp = ref<InstanceType<typeof CKEditor>>()
const isLoadingEditor = ref<boolean>(false)

const { loadCkeditorScript, ensureNextPagePlugin, initEditor } =
  useCkeditorLoader()

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const loadCkEditor = async () => {
  isLoadingEditor.value = true

  try {
    await loadCkeditorScript()

    try {
      ensureNextPagePlugin()
      initEditor(descriptionEditorComp)
    } catch (error) {
      window.message.error('Failed to load CKEditor')
      console.error(error)
    }
  } catch (error) {
    console.error('Failed to load script:', error)
  } finally {
    await helper.sleep(10)
    isLoadingEditor.value = false
  }
}



onMounted(loadCkEditor)
const changeEditorDescription = (content: string) => {
  props.prelander_configs.content = content
}
</script>
<template>
  <CKEditor
    id="contentEditor"
    ref="descriptionEditorComp"
    :height="356"
    :initData="props.prelander_configs.content"
    :loading="isLoadingEditor"
    :autoInit="false"
    @changeEditor="changeEditorDescription"
    title="Description"
  />
</template>

