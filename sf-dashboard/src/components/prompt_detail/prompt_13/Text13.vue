<script setup lang="ts">
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import PromtDetail from '@/store/details/PromptDetail'

const usePromtDetail = PromtDetail()

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false,
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="font-bold text-xs">Texts</div>
    <div class="w-full flex gap-2 flex-col" v-if="usePromtDetail.testData.text">
      <div
        v-for="(item, index) in usePromtDetail.testData.text"
        :key="index"
        class="flex items-center gap-2"
      >
        <n-input
          v-model:value="usePromtDetail.testData.text[index]"
          :placeholder="`Enter text ${index + 1}`"
          :key="index"
          :disabled="props.disabled"
        />

        <n-input-group class="w-fit">
          <n-button
            :disabled="
              usePromtDetail.testData.text.length === 1 || props.disabled
            "
            @click="usePromtDetail.testData.text.splice(index, 1)"
          >
            <n-icon :component="Minus"
          /></n-button>

          <n-button
            @click="usePromtDetail.testData.text.push('')"
            :disabled="props.disabled"
          >
            <n-icon :component="Plus"
          /></n-button>
        </n-input-group>
      </div>
    </div>
  </div>
</template>
