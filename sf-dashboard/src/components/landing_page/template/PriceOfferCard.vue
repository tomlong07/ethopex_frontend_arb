<template>
  <div class="job-card-2">
    <!-- Bên trái: Giá + Nút Book Now -->
    <div class="left-section">
      <div class="amount">{{ amount }}</div>
      <button class="book-btn" @click="handleBookNow">
        {{ buttonText }}
      </button>
    </div>
    <!-- Bên phải: Title + Description + Company -->
    <div class="right-section">
      <div class="block-title-2">{{ title }}</div>
      <div class="block-description-2">{{ description }}</div>
      <div class="job-info">
        <div class="company">
          <svg
            height="12"
            viewBox="0 0 32 32"
            width="12"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g
              id="_97_Office_Building_Block_Apartment_Buildings_Hotel_Offices"
              data-name="97 Office Building, Block Apartment, Buildings, Hotel, Offices"
            >
              <path
                d="m4 10a1 1 0 0 0 -1 1v16h5v-17zm3 14h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm21-6h-4v17h5v-16a1 1 0 0 0 -1-1zm-1 14h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm-5-14h-12a1 1 0 0 0 -1 1v24h14v-24a1 1 0 0 0 -1-1zm-7 22h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm4 16h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm0-4h-2v-2h2zm11 22h-28v-2h28z"
              />
            </g>
          </svg>
          <span class="job-type">{{ company }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  amount: {
    type: String,
  },
  title: {
    type: String,
  },
  description: {
    type: String,
  },
  company: {
    type: String,
  },
  buttonText: {
    type: String,
    default: 'Book now',
  },
  buttonUrl: {
    type: String,
  },
  theme: {
    type: String,
    default: 'light',
  },
})

const handleBookNow = () => {
  // window.open(props.buttonUrl, '_blank')
}

interface Theme {
  name: 'light' | 'dark'
  appearance: {
    backgroundColorBtnHover?: string
    backgroundColorBtn?: string
    backgroundColor: string
    textColor: string
    borderColor?: string
    textColorBtn?: string
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
      backgroundColorBtn: '#6842ff',
      backgroundColorBtnHover: '#df5efa',
      textColorBtn: '#fff',
    },
  },
  mixed: {
    name: 'light',
    appearance: {
      backgroundColor: '#2f2f31',
      textColor: '#f0f0f0',
      borderColor: 'transparent',
      backgroundColorBtn: '#6842ff',
      backgroundColorBtnHover: '#df5efa',
      textColorBtn: '#fff',
    },
  },
  dark: {
    name: 'dark',
    appearance: {
      backgroundColor: '#2f2f31',
      textColor: '#f0f0f0',
      borderColor: '#4c4c4c',
      backgroundColorBtn: '#ffc107',
      backgroundColorBtnHover: '#d0a300',
      textColorBtn: '#333',
    },
  },
  current: 'light', // Default theme
}
const useTheme = (theme: 'light' | 'dark') => {
  themes.current = theme
  document.documentElement.style.setProperty(
    '--block-2-background-color',
    themes[theme].appearance.backgroundColor
  )
  document.documentElement.style.setProperty(
    '--block-2-text-color',
    themes[theme].appearance.textColor
  )
  document.documentElement.style.setProperty(
    '--block-2-border-color',
    themes[theme].appearance.borderColor || 'transparent'
  )
  document.documentElement.style.setProperty(
    '--block-2-background-color-btn',
    themes[theme].appearance.backgroundColorBtn || '#6842ff'
  )
  document.documentElement.style.setProperty(
    '--block-2-background-color-btn-hover',
    themes[theme].appearance.backgroundColorBtnHover || '#df5efa'
  )
  document.documentElement.style.setProperty(
    '--block-2-text-color-btn',
    themes[theme].appearance.textColorBtn || '#fff'
  )
}

useTheme(props.theme as 'light' | 'dark')
</script>

<style scoped>
.job-card-2 {
  display: flex;
  background: var(--block-2-background-color, #f9fafb);
  padding: 12px;
  border: 1px solid var(--block-2-border-color, #f9fafb);
  max-width: 500px;
  gap: 12px;
  margin: 8px 0;
}

/* Bên trái: Giá + Nút Book */
.left-section {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 8px;
  flex-shrink: 0;
  max-width: 150px;
  text-align: center;
  overflow: hidden;
}

.amount {
  font-size: 14px;
  font-weight: 700;
  color: var(--block-2-text-color, #4b5563);
  line-height: 1;
  margin: 0;
  width: 100%;
  text-align: center;
}

.book-btn {
  background: #ff6b35;
  color: white;
  border: none;
  padding: 5px 11px;
  border-radius: 15px;
  font-size: 11px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s ease;
  white-space: nowrap;
  width: 90%;
  text-align: center;
}

.book-btn:hover {
  background: #e55a2b;
}

.book-btn:active {
  background: #cc4e24;
}

/* Bên phải: Title + Description + Company */
.right-section {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.block-title-2 {
  font-size: 14px;
  font-weight: 600;
  color: var(--block-2-text-color, #4b5563);
  line-height: 1.3;
}

.block-description-2 {
  font-size: 12px;
  color: var(--block-2-text-color, #4b5563);
  line-height: 1.4;
}

.job-info {
  display: flex;
  align-items: center;
  font-size: 11px;
  gap: 8px;
  margin: 0px 0 5px 0;
  flex-wrap: wrap;
}

.company {
  color: var(--block-2-text-color, #4b5563);
  line-height: 1.3;
  margin-top: 2px;
  display: inline-flex;
  align-items: center;
  gap: 4px;
  height: 14px;
  /* Cố định chiều cao */
}

.company svg {
  width: 12px;
  height: 12px;
  flex-shrink: 0;
  display: block;
  fill: var(--block-1-text-color, #4b5563);
}

.company span {
  line-height: 1;
  white-space: nowrap;
  font-size: 12px;
}

/* Responsive */
@media (max-width: 480px) {
  .job-card-2 {
    max-width: 100%;
    padding: 12px;
    gap: 12px;
  }

  .amount {
    font-size: 15px;
  }

  .block-title-2 {
    font-size: 13px;
  }

  .block-description-2 {
    font-size: 11px;
  }

  .company {
    font-size: 10px;
  }

  .book-btn {
    padding: 5px 10px;
    font-size: 10px;
  }
}
</style>
