<script setup lang="ts">
import { KeywordCampaign } from '@/types/components/campaignkeywords'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const showModal = ref(false)

const keywordCampaigns = computed((): KeywordCampaign[] => {
  return props.params?.data?.keyword_campaigns || []
})

const containerRef = ref<HTMLElement>()
const moreButtonRef = ref<HTMLElement>()

const visibleItems = ref<KeywordCampaign[]>([])
const hiddenCount = ref(0)

const calculateVisibleItems = () => {
  if (!containerRef.value || !keywordCampaigns.value.length) return

  const containerWidth = containerRef.value.offsetWidth
  const moreButtonWidth = moreButtonRef.value?.offsetWidth || 80
  const dotWidth = 20
  const padding = 8

  let totalWidth = 0
  let visibleCount = 0

  // Luôn để lại chỗ cho "+X more" button nếu có items bị ẩn
  const reservedWidth =
    keywordCampaigns.value.length > 1 ? moreButtonWidth + dotWidth : 0
  const availableWidth = containerWidth - reservedWidth

  for (let i = 0; i < keywordCampaigns.value.length; i++) {
    const item = keywordCampaigns.value[i]
    // Ước tính width của từng keyword item
    const campaignText = item.campaign != null ? item.campaign.toString() : '0'
    const estimatedWidth =
      (item.keyword.length + campaignText.length + 5) * 8 + 40 // rough calculation

    const itemTotalWidth = totalWidth + estimatedWidth + (i > 0 ? padding : 0)

    if (itemTotalWidth <= availableWidth) {
      totalWidth = itemTotalWidth
      visibleCount++
    } else {
      break
    }
  }

  // Đảm bảo ít nhất hiển thị 1 item nếu có data
  if (visibleCount === 0 && keywordCampaigns.value.length > 0) {
    visibleCount = 1
  }

  visibleItems.value = keywordCampaigns.value.slice(0, visibleCount)
  hiddenCount.value = keywordCampaigns.value.length - visibleCount
}

// Observer để theo dõi thay đổi kích thước
const resizeObserver = ref<ResizeObserver>()

onMounted(() => {
  nextTick(() => {
    calculateVisibleItems()

    if (containerRef.value) {
      resizeObserver.value = new ResizeObserver(() => {
        calculateVisibleItems()
      })
      resizeObserver.value.observe(containerRef.value)
    }
  })
})

onUnmounted(() => {
  if (resizeObserver.value) {
    resizeObserver.value.disconnect()
  }
})

const openModal = () => {
  showModal.value = true
}

const closeModal = () => {
  showModal.value = false
}

const columns = [
  {
    title: 'Keyword',
    key: 'keyword',
    render: (row: KeywordCampaign) =>
      h('span', { class: 'text-blue-600 font-medium' }, row.keyword),
  },
  {
    title: 'Campaign',
    key: 'campaign',
    render: (row: KeywordCampaign) =>
      h(
        'span',
        { class: 'text-green-600 font-medium' },
        row.campaign != null ? row.campaign : 0
      ),
  },
]
</script>

<template>
  <div
    ref="containerRef"
    class="flex items-center h-full w-full overflow-hidden"
  >
    <div
      v-if="keywordCampaigns.length"
      class="flex items-center gap-2 flex-nowrap min-w-0 flex-1"
    >
      <div
        v-for="(item, index) in visibleItems"
        :key="index"
        class="flex items-center flex-shrink-0"
      >
        <span
          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-800 whitespace-nowrap"
        >
          {{ item.keyword }} →
          {{ item.campaign != null ? item.campaign : 0 }}
        </span>
      </div>

      <template v-if="hiddenCount > 0">
        <span class="text-gray-300 flex-shrink-0">•</span>
        <button
          ref="moreButtonRef"
          @click="openModal"
          class="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-600 hover:bg-gray-200 transition-colors flex-shrink-0 whitespace-nowrap"
        >
          +{{ hiddenCount }} more
        </button>
      </template>
    </div>

    <!-- Modal -->
    <n-modal
      v-model:show="showModal"
      :mask-closable="true"
      preset="card"
      :style="{ maxWidth: '1000px' }"
      :title="`Keyword Campaigns (${keywordCampaigns.length})`"
      size="huge"
      closable
      :segmented="true"
    >
      <div class="max-h-96">
        <n-data-table
          :columns="columns"
          :data="keywordCampaigns"
          :pagination="false"
          :bordered="false"
          :single-line="false"
          size="small"
          max-height="384"
        />
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button @click="closeModal"> Close </n-button>
        </div>
      </template>
    </n-modal>
  </div>
</template>
