<script setup lang="ts">
import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isShow = computed(() => {
  return props.campaign.IsDemandBing2()
})
watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (!newValue) {
      props.campaign.amxt = ''
    }
  }
)

const name = 'AMXT'
</script>

<template>
  <div v-if="isShow">
    <FloatingWrapper :name="name" rounded>
      <n-input
        v-model:value="props.campaign.amxt"
        :placeholder="name"
        max="2000"
      />
    </FloatingWrapper>
  </div>
</template>
