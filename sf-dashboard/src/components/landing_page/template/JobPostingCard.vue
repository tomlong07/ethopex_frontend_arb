<template>
  <div class="job-card-1">
    <!-- Hình ảnh bên trái -->
    <div class="job-image">
      <img :src="imageUrl" :alt="title" class="job-img" />
    </div>
    <!-- Nội dung bên phải -->
    <div class="job-content">
      <!-- Title -->
      <h3 class="job-title">{{ title }}</h3>
      <!-- description -->
      <p class="job-description">{{ description }}</p>
      <!-- Information job -->
      <div class="job-info">
        <div v-if="timePosted" class="info-item">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle cx="12" cy="12" r="10" stroke="#6b7280" stroke-width="2" />
            <polyline
              points="12,6 12,12 16,14"
              stroke="#6b7280"
              stroke-width="2"
              stroke-linecap="round"
              stroke-linejoin="round"
            />
          </svg>
          <span class="time-posted">{{ timePosted }}</span>
        </div>
        <span class="separator" v-if="jobType">•</span>
        <div v-if="jobType" class="info-item">
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <rect
              x="2"
              y="3"
              width="20"
              height="14"
              rx="2"
              ry="2"
              stroke="#6b7280"
              stroke-width="2"
            />
            <line
              x1="8"
              y1="21"
              x2="16"
              y2="21"
              stroke="#6b7280"
              stroke-width="2"
            />
            <line
              x1="12"
              y1="17"
              x2="12"
              y2="21"
              stroke="#6b7280"
              stroke-width="2"
            />
          </svg>
          <span class="job-type">{{ jobType }}</span>
        </div>
        <span class="separator" v-if="amount">•</span>
        <div class="info-item" v-if="amount">
          <svg
            height="12"
            viewBox="0 0 48 48"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
            fill="#6b7280"
          >
            <path
              d="m38.447 41.515h-37.447a1 1 0 0 1 -1-1v-21.434a1 1 0 0 1 1-1h37.447a1 1 0 0 1 1 1v21.434a1 1 0 0 1 -1 1zm-36.447-2h35.447v-19.434h-35.447z"
            />
            <path
              d="m32 38.485h-24.547a1 1 0 0 1 -1-1 2.01 2.01 0 0 0 -2.008-2.007 1 1 0 0 1 -1-1v-9.359a1 1 0 0 1 1-1 2.011 2.011 0 0 0 2.008-2.008 1 1 0 0 1 1-1h24.547a1 1 0 0 1 1 1 2.01 2.01 0 0 0 2 2.008 1 1 0 0 1 1 1v9.359a1 1 0 0 1 -1 1 2.009 2.009 0 0 0 -2.007 2.007 1 1 0 0 1 -.993 1zm-23.669-2h22.8a4.025 4.025 0 0 1 2.869-2.885v-7.608a4.023 4.023 0 0 1 -2.881-2.881h-22.793a4.021 4.021 0 0 1 -2.881 2.881v7.608a4.023 4.023 0 0 1 2.881 2.885z"
            />
            <path
              d="m19.724 35.31a5.512 5.512 0 1 1 5.511-5.51 5.519 5.519 0 0 1 -5.511 5.51zm0-9.023a3.512 3.512 0 1 0 3.511 3.513 3.515 3.515 0 0 0 -3.511-3.513z"
            />
            <path
              d="m40.819 35.788a1 1 0 0 1 -.1-1.995l1.154-.121-2.03-19.327-32.193 3.38a1 1 0 0 1 -.209-1.99l33.184-3.484a1 1 0 0 1 1.1.89l2.239 21.317a1 1 0 0 1 -.89 1.1l-2.149.226c-.036.002-.071.004-.106.004z"
            />
            <path
              d="m45.367 29.848a1 1 0 0 1 -.188-1.982l.651-.125-3.662-19.086-31.341 6.012a1 1 0 1 1 -.377-1.967l32.324-6.2a1 1 0 0 1 1.17.793l4.038 21.051a1 1 0 0 1 -.794 1.17l-1.632.313a1.024 1.024 0 0 1 -.189.021z"
            />
          </svg>
          <span class="salary">{{ amount }}</span>
        </div>
      </div>
      <!-- Apply button -->
      <button class="apply-btn" @click="handleApply">
        {{ buttonText }}
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  timePosted: {
    type: String,
    default: '1 day ago',
  },
  jobType: {
    type: String,
    default: 'Full-Time',
  },
  amount: {
    type: String,
  },
  imageUrl: {
    type: String,
    default:
      'https://cumaps.net/s1-cdn/arb/plugins/aff-ads/assets/img/logo/ic-home.png',
  },
  buttonText: {
    type: String,
    default: 'Apply now',
  },
  buttonUrl: {
    type: String,
  },
  theme: {
    type: String,
    default: 'light',
  },
})

const handleApply = () => {
  // window.open(props.buttonUrl, '_blank')
}

interface Theme {
  name: 'light' | 'dark' | 'mixed'
  appearance: {
    backgroundColorBtnHover?: string
    backgroundColorBtn?: string
    backgroundColor: string
    textColor: string
    borderColor?: string
    textColorBtn?: string
    fillColor?: string
  }
}
interface ThemeConfig {
  light: Theme
  dark: Theme
  mixed: Theme
  current: 'light' | 'dark'
}
const themes: ThemeConfig = {
  light: {
    name: 'light',
    appearance: {
      backgroundColor: '#f9fafb',
      textColor: '#4b5563',
      borderColor: 'transparent',
      fillColor: '#fff',
    },
  },
  mixed: {
    name: 'mixed',
    appearance: {
      backgroundColor: '#2f2f31',
      textColor: '#f0f0f0',
      borderColor: 'transparent',
      fillColor: '#fff',
    },
  },
  dark: {
    name: 'dark',
    appearance: {
      backgroundColor: '#2f2f31',
      textColor: '#f0f0f0',
      borderColor: '#4c4c4c',
      fillColor: '#fff',
    },
  },
  current: 'light', // Default theme
}
const useTheme = (theme: 'light' | 'dark') => {
  themes.current = theme
  document.documentElement.style.setProperty(
    '--block-1-background-color',
    themes[theme].appearance.backgroundColor
  )
  document.documentElement.style.setProperty(
    '--block-1-text-color',
    themes[theme].appearance.textColor
  )
  document.documentElement.style.setProperty(
    '--block-1-fill-color',
    themes[theme].appearance.fillColor || '#fff'
  )
  document.documentElement.style.setProperty(
    '--block-1-border-color',
    themes[theme].appearance.borderColor || 'transparent'
  )
  document.documentElement.style.setProperty(
    '--block-1-background-color-btn',
    themes[theme].appearance.backgroundColorBtn || '#6842ff'
  )
  document.documentElement.style.setProperty(
    '--block-1-background-color-btn-hover',
    themes[theme].appearance.backgroundColorBtnHover || '#df5efa'
  )
  document.documentElement.style.setProperty(
    '--block-1-text-color-btn',
    themes[theme].appearance.textColorBtn || '#fff'
  )
}

useTheme(props.theme as 'light' | 'dark')
</script>

<style scoped>
.job-card-1 {
  display: flex;
  background: var(--block-1-background-color, white);
  overflow: hidden;
  border: 1px solid var(--block-1-border-color, #e2e8f0);
  max-width: 500px;
  margin: 8px 0;
}

/* Hình ảnh bên trái - CĂNG GIỮA */
.job-image {
  flex-shrink: 0;
  width: 100px;
  background: transparent;
  display: grid;
  place-items: center;
  /* Căn giữa hoàn hảo */
  padding: 12px 8px;
}

.job-img {
  max-width: 95px;
  width: 100%;
  height: 100%;
  object-fit: contain;
  padding: 4px;
}

/* Nội dung bên phải */
.job-content {
  flex: 1;
  padding: 9px 15px 10px 10px;
  display: flex;
  flex-direction: column;
  gap: 3px;
  justify-content: center;
  /* Căn giữa nội dung theo chiều dọc */
}

/* Title */
.job-title {
  font-size: 14px;
  font-weight: 600;
  color: var(--block-1-text-color, #4b5563);
  margin: 0;
  line-height: 1.2;
  margin-bottom: 0px !important;
}

/* Location */
.job-description {
  font-size: 12px;
  color: var(--block-1-text-color, #4b5563);
  margin: 0;
  line-height: 1.3;
}

/* Information job - CĂNG CHỈNH ICON VÀ TEXT */
.job-info {
  display: flex;
  align-items: center;
  font-size: 11px;
  gap: 8px;
  margin: 0px 0 5px 0;
  flex-wrap: wrap;
}

.info-item {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 14px;
  /* Cố định chiều cao */
}

.info-item svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: block;
}

.info-item svg path {
  stroke: var(--block-1-fill-color, #4b5563);
}

.info-item span {
  line-height: 1;
  white-space: nowrap;
}

.separator {
  color: #cbd5e0;
  line-height: 1;
  align-self: center;
}

.time-posted,
.job-type,
.salary {
  color: var(--block-1-text-color, #4b5563);
}

/* Apply button */
.apply-btn {
  background: #0046b7;
  color: white;
  border: none;
  padding: 5px 16px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s ease;
  align-self: flex-start;
  margin-top: 0px;
  min-width: 165px;
}

.apply-btn:hover {
  background: #2563eb;
}

.apply-btn:active {
  background: #1d4ed8;
}

/* Responsive */
@media (max-width: 480px) {
  .job-card {
    max-width: 100%;
  }

  .job-image {
    width: 80px;
    padding: 10px 6px;
  }

  .job-content {
    padding: 10px 12px;
  }

  .job-info {
    gap: 6px;
  }

  .separator {
    display: none;
    /* Ẩn separator trên mobile */
  }
}
</style>
