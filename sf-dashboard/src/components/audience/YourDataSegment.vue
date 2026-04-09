<script setup lang="ts">
import { loadingManager } from '@/types/components/audience-segment'
import { googleAudienceData } from '@/types/components/google-audience'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  audienceConfig: {
    type: Object as () => googleAudienceData,
    required: true,
  },
  accountId: Number,
  loadingStatus: {
    type: Object as () => loadingManager,
    required: true,
  },
  yourDataOptions: {
    type: Array as () => SelectOption[],
    default: () => [],
  },
})

const name = 'Your Data segment'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.audienceConfig.yourData"
      placeholder=""
      filterable
      multiple
      value-field="id"
      label-field="name"
      :disabled="!props.accountId"
      :loading="props.loadingStatus.loadingYourData"
      :options="props.yourDataOptions"
    />
  </FloatingWrapper>
</template>
