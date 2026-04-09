<script setup lang="ts">
import { useDrafting } from '@/composables/useDrafting'
import useModalStore from '@/store/useModalStore'

const props = defineProps({
  text: {
    type: String,
    default: 'campaign',
  },
})
const emit = defineEmits<{
  (e: 'onStartOver'): void
  (e: 'onContinue'): void
}>()

const modalStore = useModalStore()
const { remove, hasSubmit } = useDrafting('')

const message = computed(() => {
  return modalStore.message
    ? modalStore.message
    : `We noticed that you started creating a ${
        modalStore.title ? modalStore.title : props.text
      }. Would you like to continue where you left off?`
})

const onContinue = () => {
  emit('onContinue')
  hasSubmit()
}

const changeShowModal = (value: boolean) => {}

const onStartOver = () => {
  emit('onStartOver')
  remove()
}

defineExpose({
  changeShowModal,
})
</script>

<template>
  <div>
    <n-modal
      v-model:show="modalStore.showModal"
      preset="dialog"
      :content="message"
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
