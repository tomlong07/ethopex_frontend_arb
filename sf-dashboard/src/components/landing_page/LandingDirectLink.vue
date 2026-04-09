<script setup lang="ts">
import { ModeClassString } from '@/types/components/base'
import { landingTypeClass } from '@/types/components/landing'
import useLandingStoreNew from '@/store/details/landingNewStore'
import CustomSwitch from '../common/CustomSwitch.vue'

const landingNewStore = useLandingStoreNew()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  modeData: {
    type: Object as () => ModeClassString,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.landing.IsDemandPubPower() || props.landing.IsDemandArbCore()
})

watch(
  () => isShow.value && props.modeData.isAddPage(),
  (newValue, oldValue) => {
    if (newValue) {
      props.landing.SetDirectLinkOFF()
    } else {
      props.landing.direct_link = undefined
    }
  }
)
</script>
<template>
  <div
    v-if="isShow"
    class="flex items-center gap-2"
    v-show="!landingNewStore.permissions.landingSpecial"
  >
    <CustomSwitch
      v-model="props.landing.direct_link"
      type="onoff"
      true-label="Direct Link On"
      false-label="Direct Link Off"
    />
  </div>
</template>
