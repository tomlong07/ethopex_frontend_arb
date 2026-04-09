<script setup lang="ts">
import { CDN_IMAGE_MINIO_S1 } from '@/constants/urls'
import { landingTypeClass } from '@/types/components/landing'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const showDropdown = ref(true)
const toggleDropdown = () => {
  showDropdown.value = !showDropdown.value
}
</script>
<template>
  <div style="background-color: #f8f9fa">
    <main class="main custom-dark-mode-landing-jobs">
      <div class="container">
        <div class="page-title">
          <h1>
            {{ props.landing.prelander_configs?.sponsored_title }}
          </h1>
          <p class="job-count">1 open jobs</p>
        </div>
        <div class="scroll-preview">
          <div
            class="recommended-job"
            v-if="props.landing.prelander_configs?.recomendedJob()"
          >
            <div class="recommended-job-header">
              <span class="recommended-job-icon"
                ><svg
                  width="48"
                  height="48"
                  viewBox="0 0 48 48"
                  fill="none"
                  class="recommendation-icon"
                >
                  <path
                    d="M23.75 41c.167 0 .358-.042.575-.125.217-.084.392-.192.525-.325l16.85-16.9a4.28 4.28 0 0 1 .975-1.483A4.557 4.557 0 0 1 43 20.5a4.73 4.73 0 0 1-.325-1.7 4.243 4.243 0 0 1-.975-1.5l-9-9a4.242 4.242 0 0 1-1.5-.975A4.73 4.73 0 0 1 29.5 7c-.556 0-1.111.108-1.667.325a4.278 4.278 0 0 1-1.483.975l-.9.9 4.05 4.1a7.877 7.877 0 0 1 1.15 1.625c.333.616.5 1.291.5 2.025 0 1.267-.492 2.383-1.475 3.35-.983.966-2.108 1.45-3.375 1.45-.833 0-1.525-.125-2.075-.375a5.065 5.065 0 0 1-1.51-1.067L19.05 16.65 10 25.7a1.447 1.447 0 0 0-.35.526c-.067.184-.1.382-.1.592 0 .421.142.773.425 1.057.283.283.636.425 1.058.425.212 0 .409-.05.592-.15.183-.1.342-.217.475-.35l6.9-6.9 2.1 2.1-6.85 6.85c-.167.166-.283.35-.35.55-.067.2-.1.4-.1.6 0 .4.15.75.45 1.05.3.3.65.45 1.05.45.2 0 .392-.042.575-.125.183-.084.342-.192.475-.325l6.9-6.9 2.1 2.1-6.85 6.85a1.495 1.495 0 0 0-.325.517 1.714 1.714 0 0 0-.125.633c0 .4.15.75.45 1.05.3.3.65.45 1.05.45.2 0 .383-.033.55-.1.167-.067.333-.183.5-.35l6.9-6.9 2.1 2.1-6.9 6.9c-.167.166-.283.35-.35.55-.067.2-.1.383-.1.55 0 .467.133.833.4 1.1.267.267.633.4 1.1.4Zm.003 3c-1.102 0-2.086-.408-2.953-1.225-.867-.817-1.383-1.827-1.55-3.031-1.133-.163-2.083-.627-2.85-1.394-.767-.767-1.233-1.717-1.4-2.85-1.133-.167-2.075-.642-2.825-1.425A5.086 5.086 0 0 1 10.8 31.25c-1.233-.167-2.25-.667-3.05-1.5-.8-.834-1.2-1.834-1.2-3 0-.567.112-1.134.336-1.703a4.484 4.484 0 0 1 .964-1.497l11.2-11.2 5.5 5.5c.267.266.556.475.867.625.31.15.622.225.933.225.433 0 .842-.192 1.225-.575.383-.384.575-.794.575-1.233 0-.195-.058-.417-.175-.667-.117-.25-.308-.509-.575-.775L20.25 8.3a4.242 4.242 0 0 0-1.5-.975A4.73 4.73 0 0 0 17.05 7c-.556 0-1.111.108-1.667.325a4.298 4.298 0 0 0-1.48.968L6.3 15.9c-.467.466-.792.958-.975 1.475A6.167 6.167 0 0 0 5 19.125c-.033.65.092 1.283.375 1.9A8.04 8.04 0 0 0 6.4 22.7l-2.15 2.15c-.667-.734-1.208-1.617-1.625-2.65A8.356 8.356 0 0 1 2 19.05c0-1 .192-1.959.575-2.875A7.475 7.475 0 0 1 4.2 13.75l7.55-7.55a6.986 6.986 0 0 1 2.49-1.625 8.003 8.003 0 0 1 2.85-.525c.973 0 1.918.175 2.835.525.917.35 1.742.891 2.475 1.625l8.95 8.95a7.26 7.26 0 0 1 1.65 2.501c.367.935.55 1.885.55 2.85 0 .966-.183 1.907-.55 2.824A7.326 7.326 0 0 1 43.8 25.8L26.95 42.65a4.62 4.62 0 0 1-1.477 1 4.37 4.37 0 0 1-1.72.35Z"
                    fill="#943c00"
                  ></path></svg></span
              ><span class="recommended-job-title">{{
                props.landing.prelander_configs?.recomendedJob()?.recommendLabel
              }}</span>
              <div class="live-viewer-badge">
                <span class="live-dot"></span
                ><span class="live-count count-increasing">{{
                  props.landing.prelander_configs
                    ?.recomendedJob()
                    ?.numberLivingText()
                }}</span
                ><span class="live-text">people viewing</span>
              </div>
            </div>
            <div class="recommended-job-content">
              <div class="recommended-job-content-main">
                <div class="job-logo">
                  <img
                    :src="`${CDN_IMAGE_MINIO_S1}/arb/plugins/aff-ads/assets/img/logo/ic-home.png`"
                    alt="Desco"
                    loading="lazy"
                  />
                </div>
                <div class="job-info">
                  <h2 class="job-title">
                    {{
                      props.landing.prelander_configs?.recomendedJob()?.title
                    }}
                  </h2>
                  <div class="star-rating">
                    <div
                      class="star-container"
                      v-for="(n, index) in 5"
                      :key="index"
                    >
                      <div class="star-background">★</div>
                      <div
                        class="star-filled"
                        :style="{
                          width:
                            props.landing.prelander_configs
                              .recomendedJob()
                              ?.getStarFill(index) + '%',
                        }"
                      >
                        ★
                      </div>
                    </div>

                    <span class="text-[0.8rem] text-gray-600">
                      {{
                        props.landing.prelander_configs.recomendedJob()
                          ?.rating || 0
                      }}/5 ({{
                        props.landing.prelander_configs
                          ?.recomendedJob()
                          ?.numberRatingText()
                      }}
                      reviews)
                    </span>
                  </div>
                  <p class="job-location">
                    {{
                      props.landing.prelander_configs?.recomendedJob()?.location
                    }}
                  </p>
                </div>
              </div>
              <div class="recommended-job-content-side">
                <a href="#3" class="recommended-job-button"
                  >{{
                    props.landing.prelander_configs?.recomendedJob()?.buttonText
                  }}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="14"
                    height="14"
                    viewBox="0 0 20 20"
                    fill="none"
                    class="button-arrow"
                  >
                    <path
                      d="M10.2217 1.4043L18.707 9.88958"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M19 10.1113L10.5147 18.5966"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    ></path>
                    <path
                      d="M19 10L1 10"
                      stroke="white"
                      stroke-width="2"
                      stroke-linecap="round"
                    ></path></svg
                ></a>
              </div>
            </div>
          </div>
          <div class="job-listings">
            <div
              class="job-card bg-white"
              v-for="(
                job, index
              ) in props.landing.prelander_configs?.normalJobs()"
              :key="index"
            >
              <div class="job-card-content">
                <div class="job-logo">
                  <img
                    :src="`${CDN_IMAGE_MINIO_S1}/arb/plugins/aff-ads/assets/img/logo/ic-home.png`"
                    alt="Roofer &amp; Siding Installer"
                    loading="lazy"
                  />
                </div>
                <div class="job-info">
                  <h2 class="job-title">{{ job.title }}</h2>
                  <p class="company-name">{{ job.company }}</p>
                  <p class="job-location">{{ job.location }}</p>
                </div>
                <div class="job-meta">
                  <p class="job-time">{{ job.timePosted }}</p>
                  <a
                    href="#3"
                    class="job-button job-exprired"
                    :style="{
                      backgroundColor: job.isExpired
                        ? 'rgb(204, 204, 204)'
                        : '#d05',
                      cursor: job.isExpired ? 'not-allowed' : 'pointer',
                    }"
                    >{{ job.buttonText }}
                  </a>
                </div>
              </div>
            </div>
          </div>
          <div class="dropdown-section">
            <div class="dropdown-header">
              <h3>
                {{ props.landing.prelander_configs?.title_dropdown }}
              </h3>
              <span
                class="dropdown-icon"
                v-if="showDropdown"
                @click="toggleDropdown()"
                >▼</span
              >
              <span class="dropdown-icon" v-else @click="toggleDropdown()"
                >▲</span
              >
            </div>
            <div
              class="dropdown-content"
              style="
                display: block;
                max-height: 313px;
                overflow: hidden;
                transition: max-height 0.3s ease-in-out;
              "
              v-show="showDropdown"
            >
              <ul class="company-list">
                <li
                  class="company-item"
                  v-for="(company, index) in props.landing.prelander_configs
                    ?.list_company"
                  :key="index"
                >
                  <div class="company-info">
                    <span class="company-name">{{ company.name }}</span
                    ><span class="company-job-count">{{
                      company.numberOfJobs
                    }}</span>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>
<style lang="scss" scoped>
@use '@/css/Theme1.scss';
</style>
