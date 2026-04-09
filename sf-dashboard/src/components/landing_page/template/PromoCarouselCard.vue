<template>
  <div class="app-card">
    <div
      v-if="hasPromoCarouselCard && promoCarouselCardLength > 0"
      class="card-container"
    >
      <!-- Main Card Slider -->
      <div
        class="card-slider"
        ref="sliderRef"
        @mousedown="handleMouseDown"
        @mousemove="handleMouseMove"
        @mouseup="handleMouseUp"
        @mouseleave="handleMouseUp"
        @dragstart="preventDefault"
      >
        <div
          class="card-track"
          ref="trackRef"
          :style="{
            transform: `translateX(${-currentIndex * 100 + dragOffset}%)`,
            transition: isTransitioning
              ? 'transform 0.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)'
              : 'none',
          }"
        >
          <!-- Render tất cả slides với vị trí tính toán -->
          <div
            v-for="(card, index) in infiniteSlides"
            :key="`slide-${index}`"
            class="card-item"
          >
            <!-- Card Image -->
            <div class="card-image">
              <img
                v-if="card.imageUrl"
                :src="card.imageUrl"
                :alt="card.title"
                @error="handleImageError"
                draggable="false"
              />
              <div v-else class="placeholder-image">
                {{ card.title || 'Card Image' }}
              </div>
            </div>

            <!-- Card Content -->
            <div class="card-content">
              <span class="card-title">{{ card.title }}</span>
              <p class="card-description">{{ card.description }}</p>
            </div>
          </div>
        </div>

        <button
          class="nav-button next-button"
          @click="nextCard"
          :disabled="isTransitioning"
        >
          <svg
            version="1.1"
            width="20"
            height="20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M335.083,271.083
			L228.416,377.749c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251c-8.341-8.341-8.341-21.824,0-30.165
			L289.835,256l-91.584-91.584c-8.341-8.341-8.341-21.824,0-30.165s21.824-8.341,30.165,0l106.667,106.667
			C343.424,249.259,343.424,262.741,335.083,271.083z"
                />
              </g>
            </g>
          </svg>
        </button>

        <button
          class="nav-button prev-button"
          @click="prevCard"
          :disabled="isTransitioning"
        >
          <svg
            version="1.1"
            width="20"
            height="20"
            fill="#fff"
            xmlns="http://www.w3.org/2000/svg"
            xmlns:xlink="http://www.w3.org/1999/xlink"
            x="0px"
            y="0px"
            viewBox="0 0 512 512"
            style="enable-background: new 0 0 512 512"
            xml:space="preserve"
          >
            <g>
              <g>
                <path
                  d="M256,0C114.837,0,0,114.837,0,256s114.837,256,256,256s256-114.837,256-256S397.163,0,256,0z M335.083,271.083 L228.416,377.749c-4.16,4.16-9.621,6.251-15.083,6.251c-5.461,0-10.923-2.091-15.083-6.251c-8.341-8.341-8.341-21.824,0-30.165 L289.835,256l-91.584-91.584c-8.341-8.341-8.341-21.824,0-30.165s21.824-8.341,30.165,0l106.667,106.667 C343.424,249.259,343.424,262.741,335.083,271.083z"
                />
              </g>
            </g>
          </svg>
        </button>
      </div>

      <!-- Dots Indicator -->
      <div class="dots-container">
        <button
          v-for="(_, index) in promoCarouselCardData"
          :key="index"
          class="dot"
          :class="{ active: getRealIndex() === index }"
          @click="goToSlide(index)"
        />
      </div>
    </div>

    <div v-else class="no-data">
      <p>No card data available</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Promo_Carousel_Card } from '@/types/components/landing'

const props = defineProps<{
  carouselBlocks?: Promo_Carousel_Card[]
}>()

const promoCarouselCardData = computed(() => {
  return props.carouselBlocks ? [...props.carouselBlocks] : []
})

const currentIndex = ref(0)
const isTransitioning = ref(false)
const sliderRef = ref<HTMLElement>()
const trackRef = ref<HTMLElement>()

// Drag functionality
const isDragging = ref(false)
const dragStartX = ref(0)
const dragOffset = ref(0)
const dragThreshold = 50 // Minimum drag distance to trigger slide change

const promoCarouselCardLength = computed(() => {
  return promoCarouselCardData.value.length
})

const hasPromoCarouselCard = computed(() => {
  return props.carouselBlocks && Array.isArray(props.carouselBlocks)
})

// Tạo slides với logic lặp vô hạn
const infiniteSlides = computed(() => {
  if (promoCarouselCardLength.value === 0) return []

  return [
    ...promoCarouselCardData.value,
    ...promoCarouselCardData.value,
    ...promoCarouselCardData.value,
  ]
})

// Lấy index thực tế (không tính bản sao)
const getRealIndex = () => {
  const realIndex =
    (currentIndex.value - promoCarouselCardLength.value) %
    promoCarouselCardLength.value
  return realIndex < 0 ? realIndex + promoCarouselCardLength.value : realIndex
}

// Drag event handlers
const handleMouseDown = (event: MouseEvent) => {
  if (isTransitioning.value || promoCarouselCardLength.value === 0) return

  isDragging.value = true
  dragStartX.value = event.clientX
  dragOffset.value = 0
}

const handleMouseMove = (event: MouseEvent) => {
  if (!isDragging.value || !sliderRef.value) return

  event.preventDefault()
  const currentX = event.clientX
  const deltaX = currentX - dragStartX.value
  const sliderWidth = sliderRef.value.offsetWidth

  // Convert pixel movement to percentage
  dragOffset.value = (deltaX / sliderWidth) * 100
}

const handleMouseUp = () => {
  if (!isDragging.value) return

  const sliderWidth = sliderRef.value?.offsetWidth || 1
  const dragDistance = (dragOffset.value / 100) * sliderWidth

  // Determine if drag is significant enough to change slide
  if (Math.abs(dragDistance) > dragThreshold) {
    if (dragDistance > 0) {
      // Dragged right, go to previous slide
      prevCard()
    } else {
      // Dragged left, go to next slide
      nextCard()
    }
  }

  // Reset drag state
  isDragging.value = false
  dragOffset.value = 0
}

const preventDefault = (event: Event) => {
  event.preventDefault()
}

const nextCard = () => {
  if (promoCarouselCardLength.value === 0 || isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value++
  setTimeout(() => {
    if (currentIndex.value >= promoCarouselCardLength.value * 2) {
      isTransitioning.value = false
      currentIndex.value = promoCarouselCardLength.value
      setTimeout(() => {
        isTransitioning.value = false
      }, 20)
    } else {
      isTransitioning.value = false
    }
  }, 400)
}

const prevCard = () => {
  if (promoCarouselCardLength.value === 0 || isTransitioning.value) return

  isTransitioning.value = true
  currentIndex.value--

  setTimeout(() => {
    if (currentIndex.value < promoCarouselCardLength.value) {
      isTransitioning.value = false
      currentIndex.value = promoCarouselCardLength.value * 2 - 1
      setTimeout(() => {
        isTransitioning.value = false
      }, 20)
    } else {
      isTransitioning.value = false
    }
  }, 400)
}

const goToSlide = (index: number) => {
  if (isTransitioning.value || promoCarouselCardLength.value === 0) return

  isTransitioning.value = true
  currentIndex.value = promoCarouselCardLength.value + index // Đi đến bản sao thứ 2

  setTimeout(() => {
    isTransitioning.value = false
  }, 400)
}

// Khởi tạo vị trí ban đầu ở giữa (bản sao thứ 2)
onMounted(() => {
  if (promoCarouselCardLength.value > 0) {
    currentIndex.value = promoCarouselCardLength.value // Bắt đầu từ bản sao thứ 2
  }
})

const handleImageError = (event: Event) => {
  const target = event.target as HTMLImageElement
  target.style.display = 'none'

  if (target.nextElementSibling instanceof HTMLElement) {
    target.nextElementSibling.style.display = 'flex'
  }
}

watch(promoCarouselCardLength, (newLength) => {
  if (newLength > 0) {
    currentIndex.value = newLength // Reset về bản sao thứ 2
    isTransitioning.value = false
  }
})
</script>

<style scoped>
.app-card {
  background: #fff;
  padding: 20px 0px 10px 0px;
  max-width: 800px;
  margin: 0 auto;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  border: 1px solid #e5e7eb;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
}

.card-container {
  position: relative;
  width: 100%;
  max-width: 600px;
  margin: 0 auto;
}

.card-slider {
  overflow: hidden;
  position: relative;
  min-height: 225px;
}

.card-track {
  display: flex;
  transition: transform 0.5s cubic-bezier(0.4, 0, 0.2, 1);
  width: 100%;
}

.card-item {
  flex: 0 0 100%;
  position: relative;
  overflow: hidden;
  min-height: 225px;
  display: flex;
  flex-direction: column;
}

.card-image {
  width: 250px;
  height: 150px;
  position: relative;
  margin: 0 auto;
  border-radius: 16px;
  padding: 8px;
}

.card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 12px;
  display: block;
}

.card-content {
  background: white;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 0px 10px;
}

.card-title {
  font-size: 1rem;
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 6px;
  text-align: center;
}

.card-description {
  font-size: 0.75rem;
  color: #4a5568;
  line-height: 1.6;
  text-align: center;
}

.nav-button {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border: none;
  border-radius: 5px;
  background: var(--slider-card-button-arrow, #4a90e2);
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.15);
  transition: all 0.3s ease;
  z-index: 10;
}

.slider-content:hover .nav-button {
  opacity: 1;
  visibility: visible;
}

.nav-button:hover:not(:disabled) {
  background: #c36;
  transform: translateY(-50%) scale(1.1);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.2);
}

.prev-button svg {
  transform: scaleX(-1);
}

.prev-button {
  left: 23px;
  color: #4a90e2;
}

.next-button svg {
  transform: scaleX(1);
}

.next-button {
  right: 23px;
  color: #4a90e2;
}

.dots-container {
  display: flex;
  justify-content: center;
  gap: 8px;
  margin-top: 10px;
}

.dot {
  width: 9px;
  height: 9px;
  border-radius: 50%;
  background: #e2e8f0;
  transition: all 0.3s ease;
}

.dot.active {
  background: #4a90e2;
  transform: scale(1.2);
}

.dot:hover {
  background: #cbd5e0;
}

.no-data {
  text-align: center;
  padding: 40px;
  color: #4a5568;
  font-size: 16px;
}

/* Responsive */
@media (max-width: 768px) {
  .card-item {
    min-height: 350px;
  }

  .card-image {
    height: 200px;
  }

  .card-title {
    font-size: 20px;
  }

  .card-description {
    font-size: 14px;
  }

  .nav-button {
    width: 40px;
    height: 40px;
  }

  .nav-button svg {
    width: 16px;
    height: 16px;
  }
}
</style>
