<script setup lang="ts">
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import SuggestionsShow from '@/components/ai_verify/SuggestionsShow.vue'
import MediaVerify from './MediaVerify.vue'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const statusColor = (text: string) => {
  return helper.classRender(text) || undefined
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-2" v-if="props.cre.verify_manual">
      <div class="w-40 font-bold">Verify Manual</div>
      <div class="flex-1 min-w-0">
        <n-tag :type="statusColor(props.cre.verify_manual)" round size="small">
          {{ props.cre.verify_manual }}
        </n-tag>
      </div>
    </div>

    <div class="flex items-center gap-2" v-if="props.cre.reason">
      <div class="w-40 font-bold">Reason</div>
      <div class="flex-1 min-w-0">
        {{ props.cre.reason }}
      </div>
    </div>
    <n-divider
      v-if="props.cre.verify_manual || props.cre.reason"
      class="!m-0"
    />

    <div class="flex items-center gap-2">
      <div class="w-40 font-bold">Compliance Status</div>
      <div class="flex-1 min-w-0">
        <n-tag
          :type="statusColor(props.cre.ai_verify?.compliance_status_show || '')"
          round
          size="small"
        >
          {{ props.cre.ai_verify?.compliance_status_show }}
        </n-tag>
      </div>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="props.cre.ai_verify?.content_consistency"
    >
      <div class="w-40 font-bold">Content Consistency</div>
      <div class="flex-1 min-w-0">
        <n-tag
          :type="statusColor(props.cre.ai_verify?.content_consistency || '')"
          round
          size="small"
        >
          {{ props.cre.ai_verify?.content_consistency }}
        </n-tag>
      </div>
    </div>
    <p
      v-if="props.cre.ai_verify?.IsContentFail()"
      class="text-xs text-gray-500 italic"
    >
      Your creative contains unrelated content topics. Please ensure all
      elements relate to the same product/service.
    </p>

    <SuggestionsShow :cre="props.cre" :status="props.status" />
    <MediaVerify :cre="props.cre" :status="props.status" />
  </div>
</template>
