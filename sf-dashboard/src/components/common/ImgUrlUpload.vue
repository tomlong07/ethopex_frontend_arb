<script lang="ts" setup>
const props = defineProps({
  max: Number,
})

const textareaValueUrl = ref('')
const emit = defineEmits(['updateUrls'])
const replateValue = () => {
  const rawParts = textareaValueUrl.value
    .split(/[\n,]+/)
    .map((p) => p.trim())
    .filter((p) => p !== '')

  const result: string[] = []
  rawParts.forEach((part) => {
    if (part.startsWith('https')) {
      result.push(part)
    } else {
      result.push(part)
    }
  })

  const uniqueResult = Array.from(new Set(result))

  emit('updateUrls', uniqueResult)
}
</script>
<template>
  <div class="flex gap-2 items-center">
    <n-input
      placeholder="Paste image or video URLs here"
      v-model:value="textareaValueUrl"
      :type="props.max === 1 ? 'text' : 'textarea'"
      :rows="props.max === 1 ? 1 : 2"
      class="fixed-textarea"
    />
    <n-button
      type="primary"
      @click="replateValue"
      class="whitespace-nowrap"
      size="small"
    >
      Upload
    </n-button>
  </div>
</template>
