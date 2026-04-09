<script setup lang="ts">
import { creativeTypeClass } from '@/types/components/creative-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { useLocale } from '@/lang/messages'

const Creative = useLocale(
  () => import('@/lang/vi/creative'),
  () => import('@/lang/en/creative')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },
})

const text = computed(() => {
  return Creative.value.img_snap
})
</script>

<template>
  <div class="flex items-center gap-2" v-if="props.cre.IsSnapchat()">
    Tool
    <n-popover trigger="hover">
      <template #trigger>
        <n-icon size="14" :component="QuestionCircleRegular" />
      </template>
      <span>{{ text }}</span>
    </n-popover>
  </div>
</template>
