<script setup lang="ts">
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import VueJsonPretty from 'vue-json-pretty'

import 'vue-json-pretty/lib/styles.css'

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
})

const modelValue = defineModel<any>()

const isShowModal = ref(false)

const copyJson = () => {
  if (!modelValue.value) {
    window.message.warning(`No Data!`)
    return
  }

  helper.copyText(JSON.stringify(modelValue.value))

  window.message.success(`Copied!`)
}
</script>

<template>
  <n-button
    round
    @click="isShowModal = true"
    :type="(props.type as any)"
    secondary
    size="small"
    >{{ props.name }}</n-button
  >

  <n-modal v-model:show="isShowModal">
    <n-card
      style="width: 1280px"
      size="huge"
      title="AI Input"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div
        class="border border-gray-200 px-3 pb-3 rounded overflow-y-auto relative"
        style="max-height: 60vh; scrollbar-width: thin"
        v-if="modelValue"
      >
        <div class="sticky top-0 text-end py-2 bg-white z-10">
          <button @click="copyJson" class="hover:text-blue-500">
            <n-icon :component="CopyOutline" size="18" />
          </button>
        </div>
        <vue-json-pretty
          class="whitespace-pre"
          :indent="8"
          showIcon
          :showLine="false"
          :data="modelValue"
        />
      </div>
    </n-card>
  </n-modal>
</template>
