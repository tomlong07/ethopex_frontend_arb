<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const isShow = computed(() => {
  if (
    props.landing.demand_source === 'adsense' &&
    props.landing.prelander === 'on'
  )
    return true
  return false
})

const name = `Sub Title`
</script>
<template>
  <div
    class="flex items-center gap-2"
    v-if="isShow && props.landing.quizConfig"
  >
    <div class="w-150-px font-bold">{{ name }}</div>
    <div class="w-calc-150-px">
      <n-input
        v-model:value="props.landing.quizConfig.subtitle_quiz"
        :placeholder="name"
        class="mt-1"
      />
    </div>
  </div>
</template>
