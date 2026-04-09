<script lang="ts" setup>
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { adGroups } from '@/types/components/campaign-v2'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const name = 'Name'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-input
      v-model:value="props.adgroup.name"
      :placeholder="name"
      show-count
      maxlength="100"
    />
  </FloatingWrapper>
</template>
