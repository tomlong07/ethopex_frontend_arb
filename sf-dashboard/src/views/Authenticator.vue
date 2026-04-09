<script setup lang="ts">
import { ctr_authenticator } from '@/services/ctr_authenticator'
import { onMounted, onUnmounted, ref } from 'vue'

// Biến lưu mã OTP
const code = ref('Loading...')

const isLoading = ref<boolean>(false)
// Biến để đếm ngược và điều chỉnh progress
const countdown = ref(30)
const progress = ref(0)
let interval: number | null = null

// Hàm để cập nhật code mỗi 30 giây
const fetchCodeAndIcon = async () => {
  isLoading.value = true
  const res = await ctr_authenticator.GetCode()
  code.value = res.data?.code
  countdown.value = res.data?.time_remaining
  progress.value = (30 - countdown.value) * (100 / 30)
  isLoading.value = false
}

const copyToClipboard = () => {
  helper.copyText(code.value)
  window.message.success('Copy Code!')
}

// Khi component được mount, chạy hàm fetch và đếm ngược
onMounted(() => {
  fetchCodeAndIcon()

  interval = window.setInterval(() => {
    countdown.value--
    progress.value = (30 - countdown.value) * (100 / 30) // Điều chỉnh progress từ 0 đến 100

    if (countdown.value === 0) {
      fetchCodeAndIcon()
    }
  }, 1000)
})

onUnmounted(() => {
  if (interval) clearInterval(interval)
})
</script>

<template>
  <div
    class="wrapper flex flex-col bg-base px-3 flex-auto justify-self-auto pt-8 text-left"
  >
    <div v-show="!isLoading" class="flex justify-center">
      <n-card
        title="Authenticator"
        class="2xl:w-1/3 xl:w-1/3 lg:w-2/3 md:w-2/3 sm:w-2/3"
      >
        <div class="otp-container">
          <div class="otp-timer" style="transform: rotate(270deg)">
            <svg
              class="circle-svg"
              width="150"
              height="150"
              viewBox="0 0 36 36"
            >
              <path
                class="circle-bg"
                d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="circle"
                :stroke-dasharray="100"
                :stroke-dashoffset="progress"
                d="M18 2.0845
                 a 15.9155 15.9155 0 0 1 0 31.831
                 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <text x="18" y="22.5" class="percentage">{{ countdown }}</text>
            </svg>
          </div>
          <div class="otp-code-container flex-row justify-items-center">
            <h1 class="otp-code">{{ code }}</h1>
            <button
              @click="copyToClipboard"
              class="copy-button flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                fill="currentColor"
                class="bi bi-copy mt-1"
                viewBox="0 0 16 16"
              >
                <path
                  fill-rule="evenodd"
                  d="M4 2a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2zm2-1a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1V2a1 1 0 0 0-1-1zM2 5a1 1 0 0 0-1 1v8a1 1 0 0 0 1 1h8a1 1 0 0 0 1-1v-1h1v1a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h1v1z"
                />
              </svg>
            </button>
          </div>
        </div>
      </n-card>
    </div>
  </div>
</template>

<style scoped>
.otp-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  margin-top: 50px;
}

.otp-timer {
  position: relative;
  width: 150px;
  height: 150px;
}

.circle-svg {
  transform: rotate(90deg);
}

.circle-bg {
  fill: none;
  stroke: #eee;
  stroke-width: 3.8;
}

.circle {
  fill: none;
  stroke-width: 3.8;
  stroke: #4caf50;
  stroke-linecap: butt;
  transition: stroke-dashoffset 1s linear;
}

.percentage {
  font-size: 12px;
  text-anchor: middle;
  fill: #333;
  font-weight: bold;
}

.otp-code-container {
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.otp-code {
  font-size: 32px;
  font-weight: bold;
  color: #1e90ff;
  margin-right: 10px;
}

.copy-button {
  background-color: transparent;
  border: none;
  outline: none;
}

.copy-button svg {
  fill: #1e90ff;
  transition: fill 0.2s;
}

.copy-button:hover svg {
  fill: #333;
}
</style>
