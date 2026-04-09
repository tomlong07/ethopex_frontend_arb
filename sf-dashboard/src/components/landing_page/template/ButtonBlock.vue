<template>
  <div class="app-card">
    <div
      v-if="hasButtonBlock && buttonBlockLength > 0"
      class="button-container"
    >
      <button
        v-for="(button, index) in buttonBlockData"
        :key="index"
        class="simple-btn"
        @click="() => handleClick(button.buttonUrl)"
        :style="{
          backgroundColor: button.buttonColor,
          color: button.buttonTextColor,
        }"
      >
        <span v-if="button.configReward === 'on'" class="ad-badge text-white">
          <svg
            data-v-d31a144d=""
            class="ad-icon"
            :fill="button.buttonTextColor"
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

        {{ button.buttonText }}
        <svg
          width="16"
          height="16"
          viewBox="0 0 24 24"
          :fill="button.buttonTextColor"
          xmlns="http://www.w3.org/2000/svg"
          class="arrow-icon"
        >
          <path
            :stroke="button.buttonTextColor"
            d="M5 12H19M19 12L12 5M19 12L12 19"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          />
        </svg>
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Button_Block } from '@/types/components/landing'

const props = defineProps<{
  buttonBlocks?: Button_Block[]
}>()

const buttonBlockData = computed(() => {
  return props.buttonBlocks ? [...props.buttonBlocks] : []
})

const buttonBlockLength = computed(() => {
  return buttonBlockData.value.length
})

const hasButtonBlock = computed(() => {
  return props.buttonBlocks && Array.isArray(props.buttonBlocks)
})

const handleClick = (url?: string) => {
  // if (url && url !== '#') {
  //   window.open(url, '_blank')
  // }
}
</script>

<style scoped>
.app-card {
  background: #fff;
  padding: 5px;
  max-width: 800px;
  margin: 0 auto;
  align-items: center;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.button-container {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
  align-items: center;
}

.button-container button {
  width: 60%;
  max-width: 400px;
}

.simple-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  padding: 9px 28px;
  border: none;
  border-radius: 4px;
  color: white;
  font-size: 15px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s ease;
  min-width: 280px;
  text-decoration: none;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.simple-btn:hover {
  background-image: linear-gradient(rgba(0, 0, 0, 0.1), rgba(0, 0, 0, 0.1));
}

.simple-btn:active {
  transform: translateY(0);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
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

.arrow-icon {
  flex-shrink: 0;
  transition: transform 0.2s ease;
}

/* Responsive */
@media (max-width: 480px) {
  .simple-btn {
    min-width: 100%;
    padding: 16px 20px;
    font-size: 14px;
  }
}
</style>
