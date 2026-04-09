<script setup lang="ts">
import { useDraftConfirm } from '@/composables/useDraftConfirm'

const props = defineProps({
  newVer: {
    type: Boolean,
    required: false,
  },

  text: {
    type: String,
    default: 'campaign',
  },

  statusData: {
    type: Object as () => any,
    required: true,
  },
})

const onContinue = () => {
  props.statusData.showModalSaveForm = false

  if (props.newVer) {
    emit('onContinue')
  }
}

const changeShowModal = (value: boolean) => {
  props.statusData.showModalSaveForm = value
}

const emit = defineEmits<{
  (e: 'onStartOver'): void
  (e: 'onContinue'): void
}>()

const onStartOver = () => {
  emit('onStartOver')

  props.statusData.showModalSaveForm = false
}

defineExpose({
  changeShowModal,
})
const showModalRef = toRef(props.statusData, 'showModalSaveForm')
useDraftConfirm.showModal = showModalRef

</script>

<template>
  <div class="custom-draft-confirm">
    <n-modal
      v-model:show="props.statusData.showModalSaveForm"
      preset="dialog"
      :content="`We noticed that you started creating a ${props.text}. Would you like to continue where you left off?`"
      positive-text="Continue"
      negative-text="Start Over"
      :show-icon="false"
      :closable="false"
      :on-mask-click="onContinue"
      :on-esc="onContinue"
      @positive-click="onContinue"
      @negative-click="onStartOver"
    />
  </div>
</template>
