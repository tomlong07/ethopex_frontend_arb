<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_landing_page } from '@/services/ctr_landing_page'

const props = defineProps({
  data: {
    type: Object,
    required: true,
  },

  class: {
    type: String,
    default: 'w-44',
  },
})
const isLandingLoading = ref<boolean>(false)
const landingOptions = ref<any[]>([])

const slugLanding = computed<string>(() => {
  const found = landingOptions.value.find(
    (element: any) => element.id === props.data.landing_page_id
  )

  return found ? found.slug || '' : ''
})

const handleLandingSearch = async (query: string) => {
  isLandingLoading.value = true
  await fetchLandingPageByDemand(query)
  isLandingLoading.value = false
}

const fetchLandingPageByDemand = async (
  q: string = '',
  ad_account?: string
) => {
  const landingResult = await ctr_landing_page.GetLandingPages({
    q: q,
    demand_source: 'adsense',
    // ad_account: search_ad_account.value || campaign.value.account,
  })
  if (landingResult?.status) {
    landingOptions.value = landingResult?.data?.landing_pages || []
  }
}

const renderLandingLabel = (option: any) => {
  if (String(option.id) === option.label) {
    return option.label
  }

  return h('div', { class: 'flex justify-between w-full' }, [
    h('div', {
      innerHTML: `${
        (option.name as any).match(/^\d/)
          ? option.name
          : `${option.id}: ${option.name}`
      }`,
      style:
        'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
    }),
    h('div', {
      innerHTML: `${option?.cvr ? option?.cvr?.toFixed(2) : 0}%`,
    }),
  ])
}

const editLandingPage = () => {
  if (!props.data.landing_page_id) {
    return
  }

  window.open(`/landing_page/${props.data.landing_page_id}`, '_blank')
}

onMounted(async () => {
  fetchLandingPageByDemand()
})
</script>

<template>
  <div class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <n-input-group>
        <div class="flex items-center w-full">
          <FloatingWrapper
            name="Landing Page"
          >
            <n-select
              v-model:value="props.data.landing_page_id"
              filterable
              remote
              clearable
              value-field="id"
              placeholder=""
              :loading="isLandingLoading"
              :render-label="renderLandingLabel"
              :options="landingOptions"
              @search="handleLandingSearch"
            />
          </FloatingWrapper>

          <n-button
            v-if="slugLanding"
            color="#f43f5e"
            type="default"
            @click="editLandingPage"
          >
            Edit
          </n-button>
        </div>
      </n-input-group>
    </div>
  </div>
</template>
