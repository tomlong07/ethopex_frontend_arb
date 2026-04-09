<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)

const macro = '${name}$'

const copyMacro = () => {
  helper.copyText(macro)
  window.message.success('Copied!')
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <FloatingWrapper name="Name">
      <div class="flex-1 min-w-0 flex gap-2 items-center">
        <n-input
          v-model:value="categorySite.name"
          placeholder="Enter category name"
        />

        <n-tag
          size="large"
          @click="copyMacro"
          class="cursor-copy n-tag-exclude"
          type="primary"
          >{{ macro }}</n-tag
        >
      </div>
    </FloatingWrapper>
  </div>
</template>
