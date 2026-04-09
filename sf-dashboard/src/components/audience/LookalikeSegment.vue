<script setup lang="ts">
import { googleAudienceData } from '@/types/components/google-audience'
import { loadingManager } from '@/types/components/audience-segment'
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
  lookalikeOptions: {
    type: Array as () => SelectOption[],
    default: () => [],
  },
})

const name = 'Lookalike segment'
</script>

<template>
  <FloatingWrapper :name="name" rounded>
    <n-select
      v-model:value="props.audienceConfig.lookalike"
      placeholder=""
      filterable
      multiple
      value-field="id"
      label-field="name"
      :disabled="!props.accountId"
      :loading="props.loadingStatus.loadingLookalike"
      :options="props.lookalikeOptions"
    />
  </FloatingWrapper>
</template>
