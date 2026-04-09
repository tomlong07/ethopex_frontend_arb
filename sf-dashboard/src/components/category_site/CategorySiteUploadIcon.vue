<script setup lang="ts">
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import Upload from '../common/Upload.vue'
import { computed } from 'vue'

const categorySiteStore = useCategorySite()
const { categorySite } = storeToRefs(categorySiteStore)

const iconComputed = computed({
  get: () => categorySite.value.icon ?? '',
  set: (val: string | string[] | undefined) => {
    if (typeof val === 'string') {
      categorySite.value.icon = val
    } else if (Array.isArray(val)) {
      categorySite.value.icon = val[0] || ''
    } else {
      categorySite.value.icon = ''
    }
  },
})

const handleChange = (data: any) => {
  if (data) {
    categorySite.value.icon = data
  }
}
</script>

<template>
  <div class="flex gap-2 items-center">
    <div class="w-150-px font-bold">Upload Icon</div>
    <div class="flex-1 min-w-0 flex flex-col gap-1">
      <Upload v-model="iconComputed" />
      <CategorySitePromptImage @change="handleChange" type="icon" />
    </div>
  </div>
</template>
