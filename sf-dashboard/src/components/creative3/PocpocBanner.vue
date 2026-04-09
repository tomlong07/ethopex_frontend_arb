<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { creativeTypeClass } from '@/types/components/creative-v2'

import 'codemirror/mode/javascript/javascript.js'
import Codemirror from 'codemirror-editor-vue3'
// @ts-ignore
import type { EditorConfiguration } from 'codemirror'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})
const cmOptions: EditorConfiguration = {
  mode: 'text/javascript',
}
</script>

<template>
  <div v-if="props.cre.IsPocpocBanner()" class="flex flex-col gap-4">
    <div
      v-for="(t, index) in props.cre.titles"
      :key="index"
      class="flex flex-col gap-4"
    >
      <FloatingWrapper
        :name="props.cre.IsPocpocBanner() ? 'Headline' : 'Text'"
        small
        rounded
      >
        <n-input-group>
          <n-input
            v-model:value="t.title"
            placeholder="Enter the Headline"
            maxlength="100"
            show-count
          >
          </n-input>
        </n-input-group>

        <template #extra>
          <n-tooltip trigger="hover">
            <template #trigger>
              <n-icon size="12">
                <QuestionCircleRegular />
              </n-icon>
            </template>
            <div>Limit: 100</div>
          </n-tooltip>
        </template>
      </FloatingWrapper>
      <div
        v-if="props.cre.IsPocpocBanner() && props.cre.IsPocpocBannerHtml()"
        class="flex"
      >
        <div class="w-1/6 font-bold flex items-center gap-2">Banner raw</div>
        <div class="w-5/6 flex flex-col">
          <!-- <n-input
            v-model:value="t.description"
            type="textarea"
            placeholder="Enter the HTML"
            class="w-5/6"
          /> -->
          <Codemirror
            v-model:value="t.description"
            :options="cmOptions"
            :border="true"
            ref="cmRef"
            height="400"
            width="600"
          ></Codemirror>
        </div>
      </div>
    </div>
  </div>
</template>
