<template>
  <div class="app-card" v-if="appDownloadCard">
    <!-- App icon and info -->
    <div class="app-header-wrapper">
      <div class="app-header">
        <img
          :src="appDownloadCardData.imageUrl"
          :alt="appDownloadCardData.heading"
          class="app-icon"
        />
        <div class="app-info">
          <h3 class="app-title">{{ appDownloadCardData.heading }}</h3>
          <p class="app-subtitle">{{ appDownloadCardData.subHeading }}</p>
        </div>
      </div>
    </div>

    <!-- App stats -->
    <div class="app-stats">
      <div class="stat-item">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <polygon
            points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26"
            fill="#676767"
            stroke="#676767"
            stroke-width="1"
          />
        </svg>
        <span class="stat-text">{{ appDownloadCardData.textRating }}</span>
      </div>

      <div class="stat-item">
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"
            stroke="#666"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="7,10 12,15 17,10"
            stroke="#666"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
            stroke="#666"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="stat-text">{{ appDownloadCardData.textDownload }}</span>
      </div>

      <div class="stat-item">
        <svg
          width="16"
          height="16"
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
            stroke="#666"
            stroke-width="2"
            fill="none"
          />
          <line x1="8" y1="21" x2="16" y2="21" stroke="#666" stroke-width="2" />
          <line
            x1="12"
            y1="17"
            x2="12"
            y2="21"
            stroke="#666"
            stroke-width="2"
          />
        </svg>
        <span class="stat-text">{{ appDownloadCardData.textUse }}</span>
      </div>
    </div>

    <!-- Download button -->
    <div class="download-btn-wrapper">
      <button
        class="download-btn"
        @click="handleDownload"
        :style="{ backgroundColor: appDownloadCardData.buttonColor }"
      >
        <svg
          width="14"
          height="14"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M21 15v2a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-2"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <polyline
            points="7,10 12,15 17,10"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
          <line
            x1="12"
            y1="15"
            x2="12"
            y2="3"
            stroke="white"
            stroke-width="2"
            stroke-linecap="round"
          />
        </svg>
        <span class="text-button">{{ appDownloadCardData.buttonText }}</span>
        <span
          v-if="appDownloadCard.configReward === 'on'"
          class="ad-badge text-white"
        >
          <svg
            data-v-d31a144d=""
            class="ad-icon"
            fill="#fff"
            height="22"
            viewBox="0 0 32 32"
            width="22"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g data-v-d31a144d="" data-name="Layer 2">
              <path data-v-d31a144d="" d="m19 13v6a3 3 0 0 0 0-6z"></path>
              <path
                data-v-d31a144d=""
                d="m28 6h-24a2 2 0 0 0 -2 2v16a2 2 0 0 0 2 2h24a2 2 0 0 0 2-2v-16a2 2 0 0 0 -2-2zm-13.757 14.97a.976.976 0 0 1 -.243.03 1 1 0 0 1 -.969-.757l-.312-1.243h-2.438l-.311 1.243a1 1 0 0 1 -1.94-.486l2-8a1 1 0 0 1 .97-.757h1a1 1 0 0 1 .97.757l2 8a1 1 0 0 1 -.727 1.213zm4.757.03h-1a1 1 0 0 1 -1-1v-8a1 1 0 0 1 1-1h1a5 5 0 0 1 0 10z"
              ></path>
              <path data-v-d31a144d="" d="m10.781 17h1.438l-.719-2.877z"></path>
            </g>
          </svg>
        </span>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { App_Download_Card } from '@/types/components/landing'

const props = defineProps<{
  appDownloadCard?: App_Download_Card
}>()

const appDownloadCardData = computed(() => {
  return props.appDownloadCard ? { ...props.appDownloadCard } : {}
})

const handleDownload = () => {
  // Handle download action
  // console.log('Download clicked')
}
</script>

<style scoped>
.app-header-wrapper {
  background: #f9fafb; /* Màu khác biệt */
  padding: 16px;
  border-bottom: 1px solid #dcdcdc; /* Gạch ngăn cách */
  border-top-left-radius: 8px;
  border-top-right-radius: 8px;
  margin: -18px -18px 16px -18px;
}

.app-card {
  background: #fff;
  padding: 18px;
  max-width: 800px;
  margin: 0 auto;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid #e5e7eb;
  border-radius: 8px;
}

.app-header {
  display: flex;
  align-items: flex-start;
  gap: 16px;
  margin: 10px 0;
}

.app-icon {
  width: 70px;
  height: 70px;
  border-radius: 6px;
  object-fit: cover;
  flex-shrink: 0;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.app-info {
  flex: 1;
  padding-top: 4px;
}

.app-title {
  font-size: 14px;
  font-weight: 600;
  color: #202124;
  margin: 0 0 6px 0;
  line-height: 1.3;
}

.app-subtitle {
  font-size: 11px;
  color: #5f6368;
  margin: 0;
  font-weight: 400;
}

.app-stats {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 13px;
  flex-wrap: wrap;
  justify-content: space-between;
}

.stat-item {
  display: flex;
  align-items: center;
  gap: 3px;
}

.stat-item svg {
  flex-shrink: 0;
}

.stat-text {
  font-size: 11px;
  color: #5f6368;
  white-space: nowrap;
  font-weight: 400;
}

.download-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 7px;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 10px 16px;
  font-size: 12px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  box-shadow: 0 1px 3px rgba(1, 39, 28, 0.3);
}

.text-button {
  font-size: 12px;
}

.download-btn-wrapper {
  display: flex;
  justify-content: flex-end;
}

.download-btn:hover {
  background-color: #059669;
  color: white;
  text-decoration: none;
  transform: translateY(-2px);
  box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
}

.download-btn:active {
  background: #016b4c;
  transform: translateY(0);
  box-shadow: 0 1px 3px rgba(1, 135, 95, 0.3);
}

.ad-badge {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-size: 9px;
  font-weight: 700;
  padding: 2px 4px;
  border-radius: 3px;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  min-width: 20px;
  height: 16px;
  flex-shrink: 0;
}

/* Responsive */
@media (max-width: 768px) {
  .app-card {
    padding: 20px;
    margin: 16px;
  }

  .app-stats {
    gap: 24px;
  }
}

@media (max-width: 480px) {
  .app-card {
    padding: 16px;
  }

  .app-header {
    gap: 12px;
    margin-bottom: 20px;
  }

  .app-icon {
    width: 64px;
    height: 64px;
    border-radius: 12px;
  }

  .app-title {
    font-size: 18px;
  }

  .app-subtitle {
    font-size: 13px;
  }

  .app-stats {
    flex-direction: column;
    align-items: flex-start;
    gap: 16px;
    margin-bottom: 20px;
  }

  .stat-item {
    width: 100%;
  }

  .stat-text {
    font-size: 13px;
  }

  .download-btn {
    padding: 14px 20px;
    font-size: 13px;
  }
}
</style>
