<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import api_v2 from '@/core/api_v2'
import { ONOFF } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  item: {
    type: Object as () => any,
    required: true,
  },
})

const isLoading = ref<boolean>(false)

const landingOptions = ref<SelectOption[]>([])

const renderLandingLabel = (option: SelectOption) => {
  let landingItem = landingOptions.value.find(
    (item: SelectOption) => item.value === option.value
  )

  if (!landingItem) {
    landingItem = option
  }
  return h('div', { class: 'flex justify-between w-full' }, [
    h('div', {
      innerHTML: `${
        (option.label as any).match(/^\d/)
          ? option.label
          : `${landingItem.value}: ${option.label}`
      }`,
      style:
        'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
    }),
    h('div', {
      innerHTML: `${
        landingItem?.cvr ? (landingItem.cvr as number).toFixed(2) : 0
      }%`,
    }),
  ])
}

const editLandingPage = () => {
  if (!props.item?.landing_page_id) return

  window.open(`/landing_page/${props.item?.landing_page_id}`, '_blank')
}

const ajax = async (opts: { q: string; notfound?: boolean } = { q: '' }) => {
  let data = {
    filter: { demand_source: props.campaign.demand_source } as Record<
      string,
      any
    >,
  }

  if (props.campaign.prelanding === ONOFF.ON) {
    data.filter.prelander = 'off'
  }
  const landingResult = await api_v2.request({
    url: 'filter/landing-page',
    params: {
      q: opts.q,
      f: props.item?.landing_page_id || undefined,
      nf: opts.notfound ? 1 : 0,
    },

    data: data,
  })
  landingOptions.value = (landingResult?.data || []).map((element: any) =>
    Object.assign({}, element, {
      value: element.value,
      label: `${element.value} - ${element.label}`,
    })
  )
}

const fetchLandingPageByDemand = async (
  opts: { q: string; notfound?: boolean } = { q: '' }
) => {
  isLoading.value = true

  ajax(opts)

  isLoading.value = false
}

const isShow = computed<boolean>(() => {
  if (props.campaign.IsDemandBing1()) return false

  if (props.campaign.IsTrafficGoogle()) {
    if (props.campaign.IsOnSearch2Search()) return false
  }

  if (!props.FreezeData.isEditPage()) return false
  return props.campaign.demand_source ? true : false
})

onMounted(() => {
  fetchLandingPageByDemand()
})
</script>

<template>
  <div
    class="flex items-center gap-2"
    v-if="isShow && props.item?.landing_page_id"
  >
    <div class="w-28">Landing Page</div>

    <div class="w-[calc(100%-7rem)] flex items-center gap-2">
      <div class="overflow-hidden text-ellipsis w-full">
        <n-select
          v-model:value="props.item.landing_page_id"
          filterable
          remote
          clearable
          :loading="isLoading"
          placeholder="Landing Page"
          :render-label="renderLandingLabel"
          :options="landingOptions"
          class="flex-1 min-w-0"
          :disabled="true"
        />
      </div>

      <div class="flex gap-2">
        <n-button
          v-if="props.item?.landing_page_id"
          color="#f43f5e"
          type="default"
          size="small"
          class="always-on"
          @click="editLandingPage"
        >
          Open
        </n-button>
      </div>
    </div>
  </div>
</template>
