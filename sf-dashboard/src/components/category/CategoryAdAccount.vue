<script setup lang="ts">
import { accountCategoryConfigType } from '@/types/components/accountcategory'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const props = defineProps({
  accountcategoryConfig: {
    type: Object as () => accountCategoryConfigType,
    required: true,
  },
})

const name = 'Ad Account'
</script>
<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.accountcategoryConfig.ad_account"
      :disabled="true"
    />
  </FloatingWrapper>
</template>
