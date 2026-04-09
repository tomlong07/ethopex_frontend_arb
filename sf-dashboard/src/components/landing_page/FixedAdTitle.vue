<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import useLandingStore from '@/store/details/landingNewStore'
import { ONOFF } from '@/enum/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'
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

const isShow = computed<boolean>(() => {
  if (landingNewStore.permissions.landingLite) return false

  if (
    props.landing.IsDemandPubPower() ||
    props.landing.IsDemandArbCore() ||
    props.landing.IsDemandCJ()
  )
    return false

  if (!props.landing.IsDemandAdsense()) return true

  if (props.landing.IsDemandAdsense() && props.landing.prelander !== ONOFF.ON)
    return true

  return false
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.landing.fixed_title = ''
    }
  }
)

const name = `Fixed AdTitle`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-show="isShow">
    <div class="flex items-center gap-2">
      <n-input
        v-model:value="props.landing.fixed_title"
        :placeholder="name"
        :disabled="props.permissionLanding.isOnlyAcceptAICreate()"
      />
    </div>
  </FloatingWrapper>
</template>
