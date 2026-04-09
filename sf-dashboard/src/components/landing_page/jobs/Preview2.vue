<script setup lang="ts">
import { landingTypeClass, prelanderConfigs } from '@/types/components/landing'
import Image_Preview from './Image_Preview.vue'
import Ads from '@/assets/icons/Ads.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
  prelander_configs: {
    type: Object as () => prelanderConfigs,
    required: true,
  },
})

const adPositionArray = computed<number[]>(() => {
  const pos = props.prelander_configs.ad_config?.ad_position as
    | string
    | number[]
    | undefined

  if (Array.isArray(pos)) {
    return pos.map((n: unknown) => Number(n)).filter((n) => !isNaN(n))
  }

  if (typeof pos === 'string') {
    return (pos as string)
      .split(',')
      .map((s: string) => parseInt(s.trim(), 10))
      .filter((n) => !isNaN(n))
  }

  return []
})

const isInsertType = computed(() => {
  return props.prelander_configs.ad_config?.insert_type === 'before'
})

const isInsertTypeAt = (index: number) => {
  return adPositionArray.value.includes(index)
}

const isReward = (value: any) => value === true

const isJobExpired = (job: any): boolean => {
  return job?.isExpired === true
}
</script>

<template>
  <div style="background-color: #111" class="!p-2 rounded-md">
    <main class="main">
      <div class="container">
        <h2 class="sponsored-title">
          {{ props.landing.prelander_configs?.sponsored_title }}
        </h2>

        <div class="results-list scroll-preview">
          <Image_Preview
            v-if="
              isInsertTypeAt(1) &&
              isInsertType &&
              !props.prelander_configs?.ad_config?.IsStatusAdOFF()
            "
          />

          <div
            class="result-item featured"
            v-if="props.landing.prelander_configs?.recomendedJob()"
          >
            <div class="featured-label">
              {{
                props.landing.prelander_configs?.recomendedJob()?.recommendLabel
              }}
            </div>
            <div class="result-number">01</div>
            <div class="result-content">
              <h3 class="result-title">
                {{ props.landing.prelander_configs?.recomendedJob()?.title }}
              </h3>
              <div class="result-rating">
                <div class="stars">
                  <div class="star" v-for="(n, index) in 5" :key="index">
                    <span class="star-bg">★</span>
                    <span
                      class="star-fill"
                      :style="{
                        width:
                          props.landing.prelander_configs
                            .recomendedJob()
                            ?.getStarFill(index) + '%',
                      }"
                    >
                      ★
                    </span>
                  </div>
                </div>
                <span class="rating-text"
                  >{{
                    props.landing.prelander_configs?.recomendedJob()?.rating
                  }}/5 ({{
                    props.landing.prelander_configs
                      ?.recomendedJob()
                      ?.numberRatingText()
                  }}
                  reviews)
                </span>
              </div>
              <div class="live-indicator">
                <span class="live-dot"></span>
                <span class="live-count" style="opacity: 1">
                  {{
                    props.landing.prelander_configs
                      ?.recomendedJob()
                      ?.numberLivingText()
                  }}
                </span>
                <span class="live-text">people viewing</span>
              </div>

              <button
                class="relative"
                :class="{
                  'continue-btn': !isJobExpired(
                    props.landing.prelander_configs?.recomendedJob()
                  ),
                  'disabled-btn': isJobExpired(
                    props.landing.prelander_configs?.recomendedJob()
                  ),
                }"
              >
                <n-icon
                  size="20"
                  :component="Ads"
                  v-if="
                    isReward(
                      props.landing.prelander_configs?.recomendedJob()?.reward
                    )
                  "
                />

                {{
                  props.landing.prelander_configs?.recomendedJob()?.buttonText
                }}

                <svg class="arrow-icon" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M5 12H19M19 12L12 5M19 12L12 19"
                    stroke="currentColor"
                    stroke-width="2"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  ></path>
                </svg>
              </button>
              <p class="result-description">
                {{
                  props.landing.prelander_configs?.recomendedJob()?.description
                }}
              </p>
            </div>
          </div>

          <Image_Preview
            v-if="
              isInsertTypeAt(1) &&
              !isInsertType &&
              !props.prelander_configs?.ad_config?.IsStatusAdOFF()
            "
          />

          <div
            v-for="(
              job, index
            ) in props.landing.prelander_configs?.normalJobs()"
            :key="index"
          >
            <Image_Preview
              v-if="
                isInsertTypeAt(index + 2) &&
                isInsertType &&
                !props.prelander_configs?.ad_config?.IsStatusAdOFF()
              "
            />

            <div class="result-item">
              <div class="result-number">
                {{ index + 2 < 10 ? `0${index + 2}` : `${index + 2}` }}
              </div>
              <div class="result-content">
                <h3 class="result-title">{{ job.title }}</h3>
                <div class="result-rating">
                  <div class="stars">
                    <div class="star" v-for="(n, index) in 5" :key="index">
                      <span class="star-bg">★</span>
                      <span
                        class="star-fill"
                        :style="{
                          width: job?.getStarFill(index) + '%',
                        }"
                      >
                        ★
                      </span>
                    </div>
                  </div>

                  <span class="rating-text"
                    >{{ job?.rating }}/5 ({{ job.numberRatingText() }} reviews)
                  </span>
                </div>
                <div class="live-indicator">
                  <span class="live-dot"></span>
                  <span class="live-count" style="opacity: 1">
                    {{ job.numberLivingText() }}
                  </span>
                  <span class="live-text">people viewing</span>
                </div>
                <button
                  class="relative"
                  :class="{
                    'continue-btn': !isJobExpired(job),
                    'disabled-btn': isJobExpired(job),
                  }"
                >
                  <n-icon
                    :component="Ads"
                    v-if="isReward(job.reward)"
                    size="20"
                  />
                  {{ job.buttonText }}

                  <svg
                    class="arrow-icon"
                    viewBox="0 0 24 24"
                    fill="none"
                    v-if="!job.isExpired"
                  >
                    <path
                      d="M5 12H19M19 12L12 5M19 12L12 19"
                      stroke="currentColor"
                      stroke-width="2"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></path>
                  </svg>
                </button>
                <p class="result-description">
                  {{ job.description }}
                </p>
              </div>
            </div>

            <Image_Preview
              v-if="
                isInsertTypeAt(index + 2) &&
                !isInsertType &&
                !props.prelander_configs?.ad_config?.IsStatusAdOFF()
              "
            />
          </div>

          <p
            class="text-slate-100 custom-editor"
            v-html="props.prelander_configs.content"
          />
        </div>
      </div>
    </main>
  </div>
</template>

<style lang="scss" scoped>
@use '@/css/Theme2.scss';
</style>
