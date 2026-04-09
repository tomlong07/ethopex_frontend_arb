<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.landing.demand_source === 'system1'
})

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
    } else {
      props.landing.main_keyword = ''
    }
  }
)

const name = `Main Keyword`
</script>
<template>
  <n-card
    v-if="isShow"
    title="System1"
    class="card-flex-gap-4 rounded-[5px] !border-gray2"
  >
    <FloatingWrapper :name="name" medium rounded>
      <div class="flex items-center gap-2">
        <n-input v-model:value="landing.main_keyword" :placeholder="name" />
      </div>
    </FloatingWrapper>
  </n-card>
</template>
