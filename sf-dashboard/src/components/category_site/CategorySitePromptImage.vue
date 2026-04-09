<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'

const categorySiteStore = useCategorySite()
const emits = defineEmits<{
  (e: 'change', item: any): void
}>()
const props = defineProps<{
  type: 'icon' | 'thumb'
}>()

const SIZE_ICON = '200x200'
const SIZE_THUMB = '828x552'

const sizeImage = computed(() => {
  return props.type === 'icon' ? SIZE_ICON : SIZE_THUMB
})

const toggle = ref(false)
const isSubmit = ref(false)
const handleToggle = () => {
  toggle.value = true
}
const prompt = ref('')

const handleGenerated = async () => {
  if (toggle.value && prompt.value !== null) {
    isSubmit.value = true

    const result = await categorySiteStore.generateImage({
      prompt: prompt.value,
      size: sizeImage.value,
    })
    if (result.data) {
      const fileUrl = result.data
      emits('change', fileUrl)
    }

    isSubmit.value = false
    toggle.value = false
  }
}
const resetForm = () => {
  prompt.value = ''
}
</script>

<template>
  <div>
    <n-button type="success" class="block w-24" @click="handleToggle"
      >Generate</n-button
    >

    <n-modal
      v-model:show="toggle"
      :on-after-leave="() => resetForm()"
      preset="dialog"
      :show-icon="false"
      style="width: 70vw"
    >
      <n-card :title="`Generate Image`" aria-modal="true" :bordered="false">
        <div class="flex gap-1">
          <n-input
            v-model:value="prompt"
            type="textarea"
            placeholder="Enter prompt"
            :autosize="{
              minRows: 20,
              maxRows: 55,
            }"
            style="resize: both"
            maxlength="10000"
            show-count
          />
        </div>
        <template #footer>
          <div class="flex justify-end">
            <n-button
              @click="handleGenerated"
              :loading="isSubmit"
              :disabled="isSubmit"
              type="success"
              >Submit</n-button
            >
          </div>
        </template>
      </n-card>
    </n-modal>
  </div>
</template>
<style scoped>
.n-button .n-button__content {
  display: block !important;
}
</style>
