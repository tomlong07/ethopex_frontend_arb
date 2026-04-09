<script setup lang="ts">
import { landingTypeClass } from '@/types/components/landing'
import Close from '@/assets/icons/Close.vue'

import Rating from './Rating.vue'
import NumberRating from './NumberRating.vue'
import NumberLiving from './NumberLiving.vue'
import RecommendLabel from './RecommendLabel.vue'
import TimePosted from './TimePosted.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import Theme1Configs from './Theme1Configs.vue'
import AdConfig from './AdConfig.vue'
import Reward from './Reward.vue'
import Expired from './Expired.vue'
import Checkmark from '@/assets/icons/Checkmark.vue'
import PlusLg from '@/assets/icons/PlusLg.vue'
const id_route = computed(() => {
  return Number(window.route.params.id || 0)
})
const isAddPage = computed<boolean>(() => id_route.value === 0)
// const isEditPage = computed<boolean>(() => {
//   return !isAddPage.value
// })

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const onRemoveThisJob = (index: number) => {
  if (
    props.landing.prelander_configs?.jobs &&
    props.landing.prelander_configs?.jobs.length === 1
  )
    return
  if (props.landing.prelander_configs?.jobs) {
    props.landing.prelander_configs.jobs.splice(index, 1)
  }
}

const updateLogic = (value: boolean, targetIndex: number) => {
  const jobs = props.landing.prelander_configs?.jobs
  if (!jobs || !value) return
  if (props.landing.prelander_configs?.IsTheme2()) {
    jobs[targetIndex].isExpired = false
  }

  jobs.forEach((job, index) => {
    job.isRecommended = index === targetIndex
    job.isExpired = index !== targetIndex
  })
}

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
    class="card-flex-gap-4 rounded-[5px] !border-gray2 mb-4 custom-dark-mode-landing-jobs"
    v-if="props.landing.IsShowPrelanderConfigs()"
  >
    <template #header v-if="!props.landing.prelander_configs?.IsLayout100()">
      <div class="flex justify-between">
        <div class="flex">List Jobs</div>
      </div>
    </template>
    <div class="grid grid-cols-1 gap-4">
      <div
        class="flex flex-col gap-4"
        v-if="!props.landing.prelander_configs?.IsLayout100()"
      >
        <div
          v-for="(job, index) in props.landing.prelander_configs?.jobs"
          :key="index"
          :class="[
            'relative flex flex-col gap-1 rounded text-xs border border-solid custom-border',
            job.isRecommended ? 'border-[1.8px] border-[#ffdf92]' : 'shadow-md',
          ]"
        >
          <span
            class="p-3 font-bold"
            :class="{
              'bg-[#ffecbe]': job.isRecommended,
            }"
            >{{ job.isRecommended ? 'Job' : '' }}</span
          >

          <div class="flex items-center gap-2 p-4">
            <div class="flex flex-col flex-1 min-w-0 space-y-2">
              <div class="grid jobs-wrapper gap-2">
                <LandingJobTitle :job="job" />
                <JobConfigsDescription
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
              </div>

              <div class="grid jobs-wrapper gap-2">
                <JobConfigsCompany
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
                <LandingJobLocation
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
              </div>

              <div class="grid jobs-wrapper gap-2">
                <Rating
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />

                <NumberRating
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />

                <NumberLiving
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
              </div>

              <div class="grid jobs-wrapper gap-2">
                <RecommendLabel
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
                <TimePosted
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />

                <JobConfigsButtonText
                  v-if="props.landing.prelander_configs"
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
              </div>
              <div class="flex jobs-wrapper gap-2">
                <Reward
                  v-if="
                    props.landing.prelander_configs &&
                    props.landing.prelander_configs.IsTheme3()
                  "
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
                <Expired
                  v-if="
                    props.landing.prelander_configs &&
                    props.landing.prelander_configs.IsTheme3()
                  "
                  :configs="props.landing.prelander_configs"
                  :job="job"
                />
              </div>
            </div>
            <n-popover trigger="hover" :show-arrow="false">
              <template #trigger>
                <n-switch
                  v-model:value="job.isRecommended"
                  :on-update:value="(value:boolean) => updateLogic(value, index)"
                  :disabled="job.isRecommended"
                >
                  <template #checked-icon>
                    <n-icon :component="Checkmark" color="#121212" />
                  </template>
                  <template #unchecked-icon>
                    <n-icon :component="Close" /> </template
                ></n-switch>
              </template>
              <span>Recommended</span>
            </n-popover>
          </div>

          <RemoveButton
            @onClick="() => onRemoveThisJob(index)"
            class="shadow-md"
            text="Remove this item"
          />
        </div>
        <n-button
          size="small"
          class="w-24 ml-auto"
          title="Add new job"
          @click="props.landing.prelander_configs?.addJob()"
          ><n-icon :component="PlusLg" size="16" />Add Job</n-button
        >
        <Theme1Configs :landing="props.landing" />
      </div>
      <AdConfig
        v-if="props.landing.prelander_configs?.IsShowAdConfig()"
        :prelander_configs="props.landing.prelander_configs"
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
