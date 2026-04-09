<script setup lang="ts">
import { SelectOption } from 'naive-ui'

const props = defineProps({
  layoutOptions: {
    type: Array as () => Array<SelectOption>,
    required: true,
  },

  preview: {
    type: String,
    required: true,
  },

  aDiv: {
    type: Boolean,
    default: false,
  },
})

const layoutID = ref<number>()

const urlNow = computed(() => {
  const url = `${props.preview}`
  let regex = /\/(\d+)\//
  let newLayout = layoutID.value
  // new url when select layout
  let newUrl = url.replace(regex, '/' + newLayout + '/')
  return newUrl
})

const open = async () => {
  window.open(urlNow.value, '_blank')
}
const copy = async () => {
  navigator.clipboard.writeText(urlNow.value)
  window.message.success('Copied to clipboard!')
}
</script>

<template>
  <n-popconfirm
    class="w-96"
    :show-icon="false"
    :positive-text="null"
    :negative-text="null"
  >
    <template #default>
      <n-flex>
        <n-select
          v-model:value="layoutID"
          class="w-52"
          :options="props.layoutOptions"
        />

        <n-flex>
          <n-button color="#f43f5e" @click="copy"> Copy </n-button>
          <n-button color="#f43f5e" @click="open"> Open </n-button>
        </n-flex>
      </n-flex>
    </template>
    <template #trigger>
      <div>
        <a class="cursor-pointer" v-if="props.aDiv">Link Preview</a>

        <n-button color="#f43f5e" size="medium" type="default" v-else>
          Preview
        </n-button>
      </div>
    </template>
  </n-popconfirm>
</template>
