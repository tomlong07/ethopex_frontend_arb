<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import useLandingStoreNew from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const landingNewStore = useLandingStoreNew()

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
const isShow = computed<boolean>(() => {
  if (landingNewStore.permissions.landingSpecial) return false

  return props.landing.prelander === 'off'
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.landing.keywords = ''
    }
  }
)

const name = 'Keywords'
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <n-input
      v-model:value="props.landing.keywords"
      :placeholder="name"
      :disabled="
        props.permissionLanding.isOnlyAcceptAICreate() &&
        props.landing.IsShowContentDescription()
      "
    />
  </FloatingWrapper>
</template>
