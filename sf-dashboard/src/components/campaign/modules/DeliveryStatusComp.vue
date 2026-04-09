<script lang="ts" setup>
import { TType } from '@/enum/naiveui'

const props = defineProps({
  campaign: {
    type: Object,
    required: true,
  },

  class1: {
    type: String,
    default: 'w-24 font-bold text-xs',
  },

  class2: {
    type: String,
    default: 'flex-1 min-w-0',
  },
})

const isAdmin = window.arb.isAdmin()

const delivery_status_reasons_parse = (() => {
  const data = props.campaign?.delivery_status_reasons ?? ''

  try {
    const parsedData = JSON.parse(data)
    return Array.isArray(parsedData) ? parsedData : [parsedData]
  } catch {
    return data ? [data] : []
  }
})()

const typeNow = (status: string = '') => {
  return (helper.classRender(status) as TType) || undefined
}
</script>
<template>
  <div class="flex items-center gap-2">
    <div :class="props.class1">Delivery Status</div>
    <div :class="props.class2">
      <n-tooltip
        :disabled="
          !props.campaign.delivery_status_reasons ||
          props.campaign.delivery_status_reasons == 'null'
        "
        style="max-width: 200px; white-space: normal; word-break: break-word"
      >
        <template #trigger>
          <n-tag :type="typeNow(props.campaign.delivery_status)">
            <component
              :is="isAdmin && props.campaign.traffic_source_id ? 'a' : 'div'"
              :href="
                isAdmin && props.campaign.traffic_source_id
                  ? `https://ads.google.com/aw/campaigns?campaignId=${campaign.traffic_source_id}`
                  : null
              "
              :target="
                isAdmin && props.campaign.traffic_source_id ? '_blank' : null
              "
            >
              {{ props.campaign.delivery_status?.toUpperCase() || 'Pending' }}
            </component>
          </n-tag>
        </template>
        <div
          v-for="(reason, index) in delivery_status_reasons_parse"
          :key="index"
        >
          {{ reason }}
        </div>
      </n-tooltip>
    </div>
  </div>
</template>
