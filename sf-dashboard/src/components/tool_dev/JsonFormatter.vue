<script setup lang="ts">
import ArrowDownload16Regular from '@/assets/icons/ArrowDownload16Regular.vue'
import Copy from '@/assets/icons/Copy.vue'
import VueJsonPretty from 'vue-json-pretty'
import 'vue-json-pretty/lib/styles.css'

const formatterRawJson = ref('')
const formatterPrettyJson = ref('')

const formatJson = () => {
  try {
    let text = formatterRawJson.value
    if (!text?.trim()) {
      formatterPrettyJson.value = ''
      return
    }

    text = text.trim()
    if (
      (text.startsWith('`') && text.endsWith('`')) ||
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      text = text.slice(1, -1)
      formatterRawJson.value = text
    }

    const obj = JSON.parse(text)
    formatterPrettyJson.value = JSON.stringify(obj, null, 2)
  } catch (e: any) {
    formatterPrettyJson.value = `JSON parse error: ${
      e?.message ?? 'Invalid JSON'
    }`
  }
}

const handleFormatterJsonPaste = (e: ClipboardEvent) => {
  try {
    const target = e.target as HTMLTextAreaElement | HTMLInputElement
    if (!target) return

    e.preventDefault()
    let text = e.clipboardData?.getData('text/plain') ?? ''

    text = text.trim()
    if (
      (text.startsWith('`') && text.endsWith('`')) ||
      (text.startsWith('"') && text.endsWith('"')) ||
      (text.startsWith("'") && text.endsWith("'"))
    ) {
      text = text.slice(1, -1)
    }

    const start = target.selectionStart ?? 0
    const end = target.selectionEnd ?? 0

    const currentValue = formatterRawJson.value
    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end)

    setTimeout(() => {
      formatterRawJson.value = newValue
      target.setSelectionRange(start + text.length, start + text.length)

      try {
        if (!newValue.trim()) {
          formatterPrettyJson.value = ''
          return
        }
        const obj = JSON.parse(newValue)
        formatterPrettyJson.value = JSON.stringify(obj, null, 2)
      } catch (err: any) {
        formatterPrettyJson.value = `JSON parse error: ${
          err?.message ?? 'Invalid JSON'
        }`
      }
    }, 0)
  } catch (err: any) {
    window.message?.error?.(err.message, { closable: true })
  }
}

const canFormatterDownload = computed(() => {
  try {
    if (!formatterPrettyJson.value?.trim()) return false
    JSON.parse(formatterPrettyJson.value)
    return true
  } catch {
    return false
  }
})

const downloadJson = (filename = 'result.json') => {
  if (!canFormatterDownload.value) return
  const blob = new Blob([formatterPrettyJson.value], {
    type: 'application/json;charset=utf-8',
  })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  a.remove()
  URL.revokeObjectURL(url)
}

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    window.message?.success?.('Copied!')
  } catch {}
}

const convertFormatterJson = () => {
  try {
    return JSON.parse(formatterPrettyJson.value)
  } catch {
    return null
  }
}

const isFormatterValidJson = computed(() => {
  try {
    JSON.parse(formatterPrettyJson.value)
    return true
  } catch {
    return false
  }
})

const clearFormatter = () => {
  formatterRawJson.value = ''
  formatterPrettyJson.value = ''
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-3">
    <div>
      <n-form label-placement="top">
        <div
          class="bg-gray-100 px-3 py-2 -mb-[1.62rem] border-b-0 font-semibold border rounded-t-lg overflow-hidden"
        >
          Raw JSON
        </div>
        <n-form-item>
          <n-input
            class="rounded-t-none min-h-[550px]"
            v-model:value="formatterRawJson"
            type="textarea"
            :rows="12"
            placeholder="Paste JSON here"
            @paste="handleFormatterJsonPaste"
          />
        </n-form-item>
        <div class="flex justify-end">
          <n-space>
            <n-button tertiary @click="clearFormatter">Clear</n-button>
            <n-button type="primary" @click="formatJson">Format</n-button>
          </n-space>
        </div>
      </n-form>
    </div>

    <div>
      <n-form label-placement="top">
        <div
          class="bg-gray-100 px-3 py-2 border-b-0 font-semibold border rounded-t-lg overflow-hidden flex justify-between"
        >
          <span>Result</span>
          <div class="gap-3 flex">
            <n-button
              text
              :disabled="!formatterPrettyJson"
              @click="copy(formatterPrettyJson)"
            >
              <template #icon>
                <Copy />
              </template>
            </n-button>

            <n-button
              text
              :disabled="!canFormatterDownload"
              @click="downloadJson()"
            >
              <template #icon>
                <ArrowDownload16Regular />
              </template>
            </n-button>
          </div>
        </div>
        <div
          :class="{
            'rounded-t-none rounded border pl-4 py-3':
              formatterPrettyJson && isFormatterValidJson,
          }"
        >
          <div
            v-if="formatterPrettyJson && isFormatterValidJson"
            class="max-h-[525px] overflow-auto [scrollbar-width:thin]"
          >
            <vue-json-pretty
              :indent="2"
              :show-double-quotes="true"
              :show-line="true"
              :data="convertFormatterJson()"
              showIcon
              class="whitespace-pre"
            />
          </div>
          <n-input
            v-else
            class="rounded-t-none min-h-[550px] overflow-auto"
            :value="formatterPrettyJson"
            readonly
            type="textarea"
            placeholder=""
            :rows="12"
          />
        </div>
      </n-form>
    </div>
  </div>
</template>

<style scoped>
.gutter {
  text-align: right;
  opacity: 0.6;
  user-select: none;
}
:deep(.vjs-tree) {
  white-space: pre-wrap;
}
:deep(.vjs-tree-node) {
  flex-wrap: wrap;
}
</style>
