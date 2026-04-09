<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'

const Preview1 = defineAsyncComponent(() => import('./Preview1.vue'))

const Preview2 = defineAsyncComponent(() => import('./Preview2.vue'))

const id_route = computed(() => {
  return Number(window.route.params.id || 0)
})
const isAddPage = computed<boolean>(() => id_route.value === 0)

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

watch(
  () => props.landing.prelander_configs?.layout,
  (newValue) => {
    if (newValue === 96) {
      props.landing.prelander_configs?.jobs?.forEach((job) => {
        if (job.isRecommended) return

        if (job.buttonText === 'Continue') {
          job.buttonText = 'Expired'
        }
        job.isExpired = true
      })
    }

    if (newValue === 97) {
      props.landing.prelander_configs?.jobs?.forEach((job) => {
        // if (job.isRecommended) return

        if (job.buttonText === 'Expired') {
          job.buttonText = 'Continue'
        }
        if (job.isExpired === true) {
          job.isExpired = false
        }
      })
    }

    if (newValue === 99) {
      props.landing.prelander_configs?.jobs?.forEach((job) => {
        // if (job.isRecommended) return

        if (job.buttonText === 'Expired') {
          job.buttonText = 'Continue'
        }
        if (isAddPage.value) {
          job.isExpired = false
          job.reward = false
        }
      })
    }
  },
  { immediate: true }
)
</script>
<template>
  <n-card
    class="card-flex-gap-4 rounded-[5px] !border-gray2 sticky top-16"
    v-if="
      props.landing.IsShowPrelanderConfigs() &&
      !props.landing.prelander_configs?.IsLayout100()
    "
  >
    <template #header>
      <div class="flex justify-between">
        <div class="flex">Preview</div>
      </div>
    </template>
    <div class="grid grid-cols-1">
      <Preview1
        :landing="props.landing"
        v-if="props.landing.prelander_configs?.IsTheme1()"
      />

      <Preview2
        :landing="props.landing"
        :prelander_configs="props.landing.prelander_configs"
        v-if="
          props.landing.prelander_configs?.IsTheme2() ||
          props.landing.prelander_configs?.IsTheme3()
        "
      />
    </div>
  </n-card>
</template>

<style lang="scss" scoped>
.jobs-wrapper {
  grid-template-columns: repeat(auto-fit, minmax(0, 1fr));
}
:deep(.n-input),
:deep(.n-base-selection) {
  border-radius: 0.375rem !important;
}
</style>
