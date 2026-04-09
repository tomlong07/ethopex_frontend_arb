<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { landingTypeClass } from '@/types/components/landing'
import useLandingStoreNew from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const landingNewStore = useLandingStoreNew()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  if (
    landingNewStore.permissions.landingLite ||
    props.landing.IsDemandCJ() ||
    props.landing.IsDemandPubPower() ||
    props.landing.IsDemandArbCore()
  )
    return false

  return true
})

watch(
  () => isShow.value,
  (newValue) => {
    if (!newValue) {
      props.landing.keyword_search = ''
    }
  }
)

const name = `Keyword search job`
</script>

<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <n-input
      v-model:value="props.landing.keyword_search"
      :placeholder="name"
      maxlength="1000"
    />
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon :component="QuestionCircleRegular" />
        </template>
        This parameter should contain the users search phrase. The FeedAPI will
        return Jobs that contain these terms.
      </n-popover>
    </template>
  </FloatingWrapper>
</template>
