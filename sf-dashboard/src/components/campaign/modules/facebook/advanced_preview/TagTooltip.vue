<script lang="ts" setup>
import Bling from '@/assets/icons/Bling.vue'
import { typeStatus } from '@/enum/creative'

const props = defineProps({
  type: {
    type: String as PropType<typeStatus>,
    default: 'default',
  },
})
</script>
<template>
  <div>
    <n-popover trigger="hover" v-if="props.type === 'AI'">
      <template #trigger>
        <n-tag size="small" round> <n-icon :component="Bling" /> AI </n-tag>
      </template>
      <div>
        <div><n-icon :component="Bling" /> Generated with AI</div>
        This enhancement uses AI to optimize your original asset. View terms
      </div>
    </n-popover>
    <n-tag v-else-if="props.type === typeStatus.DEFAULT" size="small" round>
      On by default
    </n-tag>
    <div class="flex gap-2 items-center" v-else>
      <n-popover trigger="hover">
        <template #trigger>
          <n-tag size="small" round> <n-icon :component="Bling" /> AI </n-tag>
        </template>
        <div>
          <div><n-icon :component="Bling" /> Generated with AI</div>
          This enhancement uses AI to optimize your original asset. View terms
        </div>
      </n-popover>
      <n-tag size="small" round> On by default </n-tag>
    </div>
  </div>
</template>
