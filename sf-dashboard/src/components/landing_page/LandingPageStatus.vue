<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import { SelectOption } from 'naive-ui'

import useLandingStore from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { statusOptions } from '@/options/landing_page'
const landingNewStore = useLandingStore()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  permissionLanding: {
    type: Object as () => PermissionLandingManage,
    required: true,
  },
})

const classNow = computed(() => {
  switch (props.landing.status) {
    case 'on':
      return 'select-option-green'
    case 'off':
      return 'select-option-red'
  }

  return ''
})
const name = `Status`
const reason = `Reason`

watch(
  () => props.landing.status,
  (newStatus) => {
    if (newStatus !== 'off') {
      props.landing.reason = ''
    }
  },
  { immediate: true }
)
</script>
<template>
  <FloatingWrapper :name="name" medium rounded>
    <div :class="classNow" class="select-option-wrapper">
      <n-select
        v-model:value="props.landing.status"
        :placeholder="name"
        :disabled="
          !landingNewStore.permissions.fullStatus ||
          props.permissionLanding.isOnlyAcceptAICreate()
        "
        :options="statusOptions"
      />
    </div>
  </FloatingWrapper>
  <FloatingWrapper
    :name="reason"
    medium
    rounded
    v-if="props.landing.status === 'off'"
    :class="classNow"
    variant="textarea"
  >
    <div :class="classNow" class="select-option-wrapper">
      <n-input
        v-model:value="props.landing.reason"
        class="mt-2"
        type="textarea"
      />
    </div>
  </FloatingWrapper>
</template>
