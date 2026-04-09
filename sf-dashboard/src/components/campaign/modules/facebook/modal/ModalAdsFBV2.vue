<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'

import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import useFbManualAdsStore from '@/store/useFbManualAdsStore'
import {
  FBDataResponse,
  FanpageStatus,
  PostStatus,
} from '@/types/components/FBDataResponse'
import FacebookPostV2 from '@/components/campaign/cell/facebook/FacebookPostV2.vue'
import Minus from '@/assets/icons/Minus.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import { TType } from '@/enum/naiveui'
const fbManualAdsStore = useFbManualAdsStore()

const isLoading = ref(true)
const dataFB = ref<FBDataResponse>()

const mapFanpage = ref<{ [key: string]: FanpageStatus }>({})
const mapPost = ref<{ [key: string]: PostStatus }>({})
const getInitialPosition = () => {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight

  const elementWidth = Math.min(windowWidth * 1, 725)
  const elementHeight = 725

  const x = (windowWidth - elementWidth) / 2
  const y = (windowHeight - elementHeight) / 2

  return { x, y }
}

// Set initial position based on screen size
const position = ref(getInitialPosition())
const isDragging = ref(false)
const dragOffset = ref({ x: 0, y: 0 })

// Function to reset position when the floating panel is reopened
const resetPosition = () => {
  position.value = getInitialPosition()
  isZoom.value = false
}

// Listen for resetPosition event
onMounted(() => {
  document.addEventListener('resetPosition', resetPosition)
})

onUnmounted(() => {
  document.removeEventListener('resetPosition', resetPosition)
})

// Watch for changes in visibility to reset position when the panel becomes visible

const isZoom = ref(false)
const handleZoomOut = () => {
  isZoom.value = !isZoom.value
}

const fanpageId = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return ''
  return effective_object_story_id?.split('_')[0]
}

const fanpageIds = computed(() => {
  return [
    ...new Set(
      dataFB.value?.info_camp_facebook?.adsets?.data?.flatMap(
        (item) =>
          item.ads?.data
            ?.map((miniItem) =>
              fanpageId(miniItem.creative?.effective_object_story_id)
            )
            .filter(Boolean) || [] // Loại bỏ giá trị null hoặc undefined
      )
    ),
  ]
})

const classNow = (status?: string) => {
  if (!status) return undefined
  return (helper.classRender(status.toLowerCase() || '') as TType) || undefined
}

const postNow = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return

  return mapPost.value[postId(effective_object_story_id)]
}

const postId = (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return ''
  return effective_object_story_id?.split('_')[1]
}

const fetchFanpage = async (id?: string) => {
  if (!id) return
  const result = await ctr_traffic_source.GetFacebookFanpage(id)
  mapFanpage.value[id] = { ...result?.data, ready: true }
}

const effective_object_story_ids = computed(() => {
  return [
    ...new Set(
      dataFB.value?.info_camp_facebook?.adsets?.data?.flatMap(
        (item) =>
          item.ads?.data
            ?.map((miniItem) => miniItem.creative?.effective_object_story_id)
            .filter(Boolean) || [] // Loại bỏ giá trị null hoặc undefined
      )
    ),
  ]
})

const copyPostId = (id: string) => {
  helper.copyText(id)
  window.message.success('Copied!')
}

const fetchPost = async (effective_object_story_id?: string) => {
  if (!effective_object_story_id) return
  const post = postId(effective_object_story_id)
  const result = await ctr_traffic_source.GetFacebookPost({
    page_id: fanpageId(effective_object_story_id),
    search: post,
  })
  try {
    mapPost.value[post] = { ...result?.data[0], ready: true }
  } catch {}
}

const fetchPosts = () => {
  mapPost.value = {}
  effective_object_story_ids.value.forEach(async (element) => {
    if (mapPost.value[postId(element)]) return

    mapPost.value[postId(element)] = { ready: false }
  })

  let postGet: string[] = []

  effective_object_story_ids.value.forEach(async (element) => {
    const post_id = postId(element)
    if (postGet.includes(post_id)) return
    await fetchPost(element)
  })
}

const fetchFanpages = () => {
  mapFanpage.value = {}
  fanpageIds.value.forEach(async (element) => {
    mapFanpage.value[element] = {
      ready: false,
    }
  })

  fanpageIds.value.forEach(async (element) => {
    await fetchFanpage(element)
  })
}

watch(
  () => fbManualAdsStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      isLoading.value = true
      resetPosition()

      const result = await ctr_campaign.GetInFoCampaign(
        fbManualAdsStore.dataModal
      )

      dataFB.value = new FBDataResponse(result?.data || {})
      isLoading.value = false

      fetchFanpages()
      fetchPosts()
    }
  }
)

const closeBlocks = () => {
  fbManualAdsStore.changeShowModal(false)
}
// Mouse event handlers for desktop
const startDrag = (e: MouseEvent) => {
  isDragging.value = true
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragOffset.value = {
    x: e.clientX - rect.left,
    y: e.clientY - rect.top,
  }

  document.addEventListener('mousemove', drag)
  document.addEventListener('mouseup', stopDrag)
}

const drag = (e: MouseEvent) => {
  if (!isDragging.value) return

  position.value = {
    x: e.clientX - dragOffset.value.x,
    y: e.clientY - dragOffset.value.y,
  }
}

const stopDrag = () => {
  isDragging.value = false
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)
}

// Touch event handlers for mobile
const startTouchDrag = (e: TouchEvent) => {
  // Prevent scrolling while dragging
  e.preventDefault()
  isDragging.value = true
  const touch = e.touches[0]
  const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
  dragOffset.value = {
    x: touch.clientX - rect.left,
    y: touch.clientY - rect.top,
  }

  document.addEventListener('touchmove', touchDrag, { passive: false })
  document.addEventListener('touchend', stopTouchDrag)
  document.addEventListener('touchcancel', stopTouchDrag)
}

const touchDrag = (e: TouchEvent) => {
  if (!isDragging.value) return

  // Prevent scrolling while dragging
  e.preventDefault()

  const touch = e.touches[0]
  position.value = {
    x: touch.clientX - dragOffset.value.x,
    y: touch.clientY - dragOffset.value.y,
  }
}

const stopTouchDrag = () => {
  isDragging.value = false
  document.removeEventListener('touchmove', touchDrag)
  document.removeEventListener('touchend', stopTouchDrag)
  document.removeEventListener('touchcancel', stopTouchDrag)
}

// Cleanup event listeners on unmount
onUnmounted(() => {
  // Clean up mouse events
  document.removeEventListener('mousemove', drag)
  document.removeEventListener('mouseup', stopDrag)

  // Clean up touch events
  document.removeEventListener('touchmove', touchDrag)
  document.removeEventListener('touchend', stopTouchDrag)
  document.removeEventListener('touchcancel', stopTouchDrag)
})
</script>

<template>
  <div
    v-if="fbManualAdsStore.showModal"
    class="floating-blocks fixed z-50 shadow-2xl cursor-move bg-white rounded-lg"
    :class="{ '!max-w-[250px]': isZoom }"
    :style="{ left: position.x + 'px', top: position.y + 'px' }"
    @mousedown="startDrag"
    @touchstart="startTouchDrag"
  >
    <div class="relative rounded-lg">
      <!-- Header with title and close button -->
      <div class="flex justify-between bg-[#2d5bc8e3] items-center p-3">
        <h3 class="text-white font-medium">Info Ads</h3>
        <div>
          <n-button
            quaternary
            circle
            size="small"
            class="text-white"
            @click="handleZoomOut"
          >
            <template #icon>
              <n-icon :component="Minus" size="8" />
            </template>
          </n-button>
          <n-button
            quaternary
            circle
            size="small"
            class="text-white"
            @click="closeBlocks"
          >
            <template #icon>
              <n-icon><Close /></n-icon>
            </template>
          </n-button>
        </div>
      </div>
      <div
        v-if="!isZoom"
        class="space-y-4 p-4 bg-gray-50 rounded-lg overflow-y-auto custom-scrollbar blocks-container"
      >
        <div class="text-center" v-if="isLoading">
          <n-spin size="small" />
        </div>
        <div
          v-else-if="!dataFB?.info_camp_facebook?.adsets?.data?.length"
          class="text-center"
        >
          No Data Info Ads !
        </div>
        <template v-else>
          <div
            v-for="(item, index) in dataFB?.info_camp_facebook?.adsets?.data"
            :key="index"
            class="space-y-3"
          >
            <div
              v-for="(miniItem, miniIndex) in item.ads?.data"
              :key="miniIndex"
              class="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden transition-all hover:shadow-md"
            >
              <div class="p-5 space-y-4">
                <!-- Post ID Section -->
                <div class="flex items-center space-x-2 group">
                  <span class="text-sm font-semibold text-gray-600"
                    >Post ID:</span
                  >
                  <span
                    @click="
                      copyPostId(
                        postId(miniItem.creative?.effective_object_story_id)
                      )
                    "
                    class="text-blue-600 cursor-pointer font-mono text-sm hover:text-blue-800 hover:underline transition-colors"
                  >
                    {{
                      postId(miniItem.creative?.effective_object_story_id) ||
                      'N/A'
                    }}
                  </span>
                  <span
                    class="text-xs text-gray-400 opacity-0 group-hover:opacity-100 transition-opacity"
                    >(Click to copy)</span
                  >
                </div>

                <!-- Name Section -->
                <div class="flex items-start space-x-2">
                  <span class="text-sm font-semibold text-gray-600">Name:</span>
                  <span class="text-gray-800 text-sm break-words">{{
                    miniItem.name
                  }}</span>
                </div>

                <!-- Status Section -->
                <div class="flex items-center space-x-2">
                  <span class="text-sm font-semibold text-gray-600"
                    >Status:</span
                  >
                  <n-tag
                    size="small"
                    round
                    :type="classNow(miniItem.status)"
                    class="!text-xs !px-2 !py-1"
                  >
                    {{ miniItem.status || '' }}
                  </n-tag>
                </div>

                <!-- Post Content Section -->
                <div class="mt-3">
                  <template
                    v-if="!miniItem.creative?.effective_object_story_id"
                  >
                    <span class="text-gray-500 italic text-sm">N/A</span>
                  </template>

                  <template
                    v-else-if="
                      !postId(miniItem.creative?.effective_object_story_id) ||
                      !postNow(miniItem.creative?.effective_object_story_id)
                    "
                  >
                    <span class="text-gray-500 italic text-sm">Not Found</span>
                  </template>

                  <n-spin
                    v-else
                    :show="
                      !postNow(miniItem.creative?.effective_object_story_id)
                        ?.ready
                    "
                  >
                    <div class="space-y-3">
                      <a
                        :href="
                          postNow(miniItem.creative?.effective_object_story_id)
                            ?.link
                        "
                        target="_blank"
                        class="inline-block text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors truncate max-w-full"
                      >
                        {{
                          postNow(miniItem.creative?.effective_object_story_id)
                            ?.name
                        }}
                      </a>

                      <FacebookPostV2
                        :params="{
                          data: postNow(
                            miniItem.creative?.effective_object_story_id
                          ),
                        }"
                        :flexCol="true"
                        class="border border-gray-100 rounded-lg p-3"
                      />
                    </div>
                  </n-spin>
                </div>
              </div>
            </div>
          </div>
        </template>
      </div>
    </div>
  </div>
</template>

<style scoped>
.floating-blocks {
  user-select: none;
  width: 90%;
  max-width: 500px;
  /* Ensure it's fully visible on mobile */
  max-height: 80vh;
  /* Prevent it from going off-screen on mobile */
  overflow: hidden;
}

.blocks-container {
  min-height: 100px;
  /* Shorter max-height on mobile to ensure it fits */
  max-height: 60vh;
}

.custom-scrollbar {
  scrollbar-width: thin;
}

/* Mobile-specific adjustments */
@media (max-width: 767px) {
  .floating-blocks {
    /* Add subtle visual indicator that it can be moved on mobile */
    border-top: 4px solid #3b82f6;
  }
}
</style>
