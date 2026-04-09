<script setup lang="ts">
import Copy from '@/assets/icons/Copy.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  name: {
    type: String,
    default: 'URL',
  },

  class: {
    type: String,
    default: 'w-28',
  },
})

const value = defineModel<string>('value')
const copy = () => {
  if (!value.value) return

  helper.copyText(value.value)
  window.message.success('Copied!')
}
</script>

<template>
  <FloatingWrapper :name="props.name" rounded>
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <n-input
        v-model:value="value"
        type="text"
        :placeholder="props.name"
        readonly
      />

      <n-tooltip trigger="hover">
        <template #trigger>
          <n-button text @click="copy">
            <template #icon> <n-icon :component="Copy" size="16" /> </template>
          </n-button>
        </template>
        Copy
      </n-tooltip>

      <a :href="value" target="_blank"
        ><n-button @click="copy" color="#f43f5e" type="default" size="small">
          Open
        </n-button>
      </a>
    </div>
  </FloatingWrapper>
</template>
