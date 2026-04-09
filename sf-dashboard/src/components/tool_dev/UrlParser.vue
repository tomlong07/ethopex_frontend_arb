<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import CornerDownRight from '@/assets/icons/CornerDownRight.vue'

const urlInput = ref('')

watch(urlInput, (newUrl) => {
  if (newUrl?.trim()) {
    parseUrl()
  } else {
    Object.assign(urlParts, urlDefaults)
    queryParams.value = []
  }
})

const handleUrlPaste = (e: ClipboardEvent) => {
  try {
    const target = e.target as HTMLTextAreaElement | HTMLInputElement
    if (!target) return

    e.preventDefault()
    const text = e.clipboardData?.getData('text/plain') ?? ''

    const start = target.selectionStart ?? 0
    const end = target.selectionEnd ?? 0

    const currentValue = urlInput.value
    const newValue =
      currentValue.substring(0, start) + text + currentValue.substring(end)

    setTimeout(() => {
      urlInput.value = newValue
      target.setSelectionRange(start + text.length, start + text.length)
    }, 0)
  } catch (err: any) {
    window.message?.error?.(err.message, { closable: true })
  }
}

const urlParts = reactive({
  protocol: '',
  hostname: '',
  port: '',
  pathname: '',
  search: '',
  hash: '',
})
const queryParams = ref<{ key: string; value: string }[]>([])

const parseUrl = () => {
  queryParams.value = []
  try {
    const u = new URL(urlInput.value)
    urlParts.protocol = u.protocol
    urlParts.hostname = u.hostname
    urlParts.port = u.port
    urlParts.pathname = u.pathname
    urlParts.search = u.search
    urlParts.hash = u.hash
    u.searchParams.forEach((v, k) =>
      queryParams.value.push({ key: k, value: v })
    )
  } catch (e: any) {
    window.message?.error?.(e.message, { closable: true })
  }
}

const urlDefaults = {
  protocol: '',
  username: '',
  password: '',
  hostname: '',
  port: '',
  pathname: '',
  search: '',
  hash: '',
}

const copy = async (text: string) => {
  try {
    await navigator.clipboard.writeText(text)
    window.message?.success?.('Copied!')
  } catch {}
}

const clearUrl = () => {
  urlInput.value = ''
  Object.assign(urlParts, urlDefaults)
  queryParams.value = []
}
</script>

<template>
  <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
    <div class="flex flex-col">
      <n-form label-placement="top" class="-mt-6">
        <n-form-item>
          <n-input
            v-model:value="urlInput"
            placeholder="Enter URL..."
            @paste="handleUrlPaste"
            clearable
          />
        </n-form-item>
        <div class="flex items-end justify-end">
          <n-space class="flex-shrink-0">
            <n-button tertiary @click="clearUrl"> Clear </n-button>
            <n-button type="primary" @click="parseUrl"> Parse </n-button>
          </n-space>
        </div>
      </n-form>

      <div class="mt-auto pt-4">
        <span class="text-gray-400 italic text-sm"
          >Parse a URL into its separate constituent parts (protocol, origin,
          params, port, username-password, ...)</span
        >
      </div>
    </div>

    <n-card>
      <div class="space-y-2 overflow-auto max-h-[600px] [scrollbar-width:thin]">
        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Protocol</label>
          <n-input readonly :value="urlParts.protocol" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.protocol)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Hostname</label>
          <n-input readonly :value="urlParts.hostname" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.hostname)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Port</label>
          <n-input readonly :value="urlParts.port" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.port)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Path</label>
          <n-input readonly :value="urlParts.pathname" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.pathname)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Params</label>
          <n-input readonly :value="urlParts.search" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.search)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-3 gap-2 items-center">
          <label class="text-sm font-medium text-gray-700">Hash</label>
          <n-input readonly :value="urlParts.hash" class="col-span-2">
            <template #suffix>
              <n-button text @click="copy(urlParts.hash)">
                <template #icon>
                  <Copy />
                </template>
              </n-button>
            </template>
          </n-input>
        </div>

        <div class="grid grid-cols-1 gap-2">
          <template v-for="(param, idx) in queryParams" :key="idx">
            <div class="grid grid-cols-3 gap-2 items-center">
              <label class="text-sm font-medium text-gray-700"
                ><CornerDownRight
              /></label>
              <n-input readonly :value="param.key" class="col-span-1">
                <template #suffix>
                  <n-button text @click="copy(param.key)">
                    <template #icon>
                      <Copy />
                    </template>
                  </n-button>
                </template>
              </n-input>
              <n-input readonly :value="param.value" class="col-span-1">
                <template #suffix>
                  <n-button text @click="copy(param.value)">
                    <template #icon>
                      <Copy />
                    </template>
                  </n-button>
                </template>
              </n-input>
            </div>
          </template>
        </div>
      </div>
    </n-card>
  </div>
</template>
