<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import useLandingNew from '@/store/details/landingNewStore'
import CustomSwitch from '../common/CustomSwitch.vue'
const landingNewStore = useLandingNew()
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
  if (
    landingNewStore.permissions.landingLite ||
    landingNewStore.permissions.landingSpecial
  )
    return false

  return props.landing.IsDemandAdsense() || props.landing.IsDemandPubPower()
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
      props.landing.SetPrelanderOFF()
    }
  }
)
</script>
<template>
  <div v-show="isShow">
    <div class="font-bold flex text-xs mb-2">Prelander</div>
    <div class="mb-1">
      <CustomSwitch
        v-model="props.landing.prelander"
        type="onoff"
        true-label="On"
        false-label="Off"
        :disabled="
          props.permissionLanding.isOnlyAcceptAICreate() ||
          !landingNewStore.permissions.prelanding
        "
      />
    </div>
  </div>
</template>
