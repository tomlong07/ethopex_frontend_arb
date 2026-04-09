<script setup lang="ts">
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import { ModeClassString } from '@/types/components/base'
import useLandingStoreNew from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

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

  permissionLanding: {
    type: Object as () => PermissionLandingManage,
    required: true,
  },
})

const handleInput = (v: string) => {
  if (props.modeData.isEditPage()) {
    return
  }
  props.landing.slug = helper.generateSlug(v)
}

const isDisabled = computed(() => {
  if (props.landing.IsDisabledEdit() && landingNewStore.permissions.landingLite)
    return true

  return (
    props.permissionLanding.isOnlyAcceptAICreate() &&
    props.landing.IsShowContentDescription()
  )
})

const name = `Title`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded required>
    <n-input
      v-model:value="props.landing.title"
      :placeholder="name"
      class="w-full"
      clearable
      :disabled="isDisabled"
      @input="handleInput"
    />
  </FloatingWrapper>
  <div
    v-if="true"
    @click="props.landing.t = 0"
    class="absolute text-xs bg-blue-600 text-white px-2 py-1 rounded shadow hover:bg-blue-700 cursor-pointer right-2 opacity-0 pointer-events-none transition-all group-hover:opacity-100 group-hover:pointer-events-auto"
    style="top: 50%; transform: translateY(-50%)"
  >
    Click to Edit
  </div>
</template>
