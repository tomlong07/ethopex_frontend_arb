<script setup lang="ts">
import VueJsonPretty from 'vue-json-pretty'

import 'vue-json-pretty/lib/styles.css'
import promptLogs from '@/store/promptLogs'

const promptLogStore = promptLogs()

const props = defineProps({
  name: {
    type: String,
    required: true,
  },

  className: {
    type: String,
  },

  value: {
    type: Object,
    required: false,
  },
})

const isArray = computed(() => {
  return Array.isArray(props.value)
})

const drawerAction = async (creative_content: string) => {
  //trường hợp là đang mở 1 example rồi cần đóng mở lại để kích hoạt watch fetch data mới
  if (promptLogStore.showDrawer) {
    promptLogStore.showDrawer = false
  }

  await nextTick()
  promptLogStore.drawerContent = creative_content

  promptLogStore.showDrawer = true
}
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-semibold text-xs text-gray-500" :class="props.className">
      {{ props.name }}
    </div>

    <div class="flex gap-2" v-if="isArray">
      <n-popover trigger="hover" v-for="(item, index) in value">
        <template #trigger>
          <n-button
            :key="index"
            class="w-32"
            @click="drawerAction(item.creative_content)"
            ><div class="truncate">
              {{ item.creative_id || item.creative_content }}
            </div></n-button
          >
        </template>
        <span
          class="block max-w-[16rem] truncate whitespace-normal break-words"
        >
          {{ item.creative_content }}
        </span>
      </n-popover>
    </div>

    <div
      class="h-96 overflow-x-auto scroll-thin-custom border border-gray-200"
      v-if="value"
    >
      <vue-json-pretty
        :indent="8"
        class="whitespace-pre"
        showIcon
        :showLine="false"
        :data="value"
      />
    </div>
    <div v-else class="italic text-gray-500 text-xs">No data available</div>
  </div>
</template>
