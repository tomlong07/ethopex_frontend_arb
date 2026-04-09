<template>
  <div class="flex items-center">
    <div class="w-full">
      <FloatingWrapper name="Publisher">
        <n-select
          v-model:value="usePixelTriggersDetail.pixelConfig.publisher"
          filterable
          remote
          :loading="isPublisherLoading"
          :options="publisherOptions"
          placeholder=""
          @search="handleSearch"
        />
      </FloatingWrapper>
    </div>
  </div>
</template>
<script setup lang="ts">
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
import { debounceV2 } from '@/utils'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { ref, watch, onMounted, computed } from 'vue'
const usePixelTriggersDetail = PixelTriggersDetail()
const isPublisherLoading = ref<boolean>(false)
const publisherOptions = ref<SelectOption[]>([])
const currentPublisher = computed(
  () => usePixelTriggersDetail.pixelConfig.publisher
)
const getListPublisher = async (params: { f?: string; q?: string } = {}) => {
  isPublisherLoading.value = true

  const response = await ctr_filter_v2.FilterPublisher({
    f: params.f,
    q: params.q,
  })

  publisherOptions.value = response?.data || []

  isPublisherLoading.value = false
}
const handleSearch = debounceV2(async (q: string = '') => {
  getListPublisher({
    q,
    f: currentPublisher.value ? String(currentPublisher.value) : undefined,
  })
}, 300)

const id = Number(window.route.params.id || 0)
const isAddMode = computed<boolean>(() => id === 0)

onMounted(() => {
  if (isAddMode.value) {
    getListPublisher()
    return
  }
  const stop = watch(
    () => usePixelTriggersDetail.pixelConfig.publisher,
    (val) => {
      if (val != null) {
        getListPublisher({ f: String(val) })
        stop()
      }
    }
  )
})
</script>
