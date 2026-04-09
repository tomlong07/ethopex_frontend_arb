<template>
  <div class="form-group flex items-center gap-4">
    <div class="flex-1">
      <FloatingWrapper name="Domain">
        <n-input
          v-model:value="domain"
          placeholder="Enter your domain"
          clearable
        />
      </FloatingWrapper>
    </div>
  </div>
</template>

<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue';
import { computed } from 'vue';
import { campaignTypeClass } from '@/types/components/campaign-v2';

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
});

const domain = computed({
  get() {
    return props.campaign.keyword_manager?.domain ?? '';
  },
  set(val: string) {
    if (props.campaign.keyword_manager) {
      props.campaign.keyword_manager.domain = val;
    }
  }
});

</script>
