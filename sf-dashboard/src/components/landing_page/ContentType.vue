<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import { SelectOption } from 'naive-ui'
import useLandingStoreNew from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ONOFF } from '@/enum/campaign'
import { contentTypeOption } from '@/options/landing_page'

const landingNewStore = useLandingStoreNew()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})
const isShow = computed<boolean>(() => {
  if (landingNewStore.permissions.landingSpecial) return false

  return props.landing.prelander === ONOFF.OFF
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
      props.landing.content_type = 'n2s'
    } else {
      props.landing.content_type = undefined
    }
  }
)

const name = 'Content Type'
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <n-select
      v-model:value="props.landing.content_type"
      :placeholder="name"
      :options="contentTypeOption"
      :disabled="true"
    />
  </FloatingWrapper>
</template>
