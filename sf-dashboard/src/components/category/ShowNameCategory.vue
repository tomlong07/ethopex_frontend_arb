<script setup lang="ts">
import { accountCategoryConfigType } from '@/types/components/accountcategory'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  accountcategoryConfig: {
    type: Object as () => accountCategoryConfigType,
    required: true,
  },
})

const name = 'Show Name'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.accountcategoryConfig.show_name"
      :disabled="true"
    />
  </FloatingWrapper>
</template>
