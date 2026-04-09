<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import { ModeClassString } from '@/types/components/base'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  modeData: {
    type: Object as () => ModeClassString,
    required: true,
  },

  permissionLanding: {
    type: Object as () => PermissionLandingManage,
    required: true,
  },
})

const name = `Slug`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded required>
    <n-input
      v-model:value="landing.slug"
      :placeholder="name"
      :disabled="
        modeData.isEditPage() ||
        (props.permissionLanding.isOnlyAcceptAICreate() &&
          props.landing.IsShowContentDescription())
      "
    />
  </FloatingWrapper>
</template>
