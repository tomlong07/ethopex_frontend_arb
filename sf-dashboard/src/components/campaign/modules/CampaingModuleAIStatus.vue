<template>
  <span class="text-sm font-medium text-gray-800"> Policy Review: </span>
  <div class="flex items-center">
    <n-dropdown
      trigger="hover"
      :options="adsOptions"
      @select="(key: string) => handleSelect(key, ad, ad.id)"
      placement="bottom-start"
    >
      <n-tag
        :type="typeNow(ad.ai_status)"
        class="cursor-pointer hover:opacity-80 transition-opacity"
      >
        {{ currentStatusParts.main || 'N/A' }}
      </n-tag>
    </n-dropdown>
  </div>
</template>
<script setup lang="ts">
import { AI_STATUS } from '@/enum/campaign'
import { TType } from '@/enum/naiveui'
import { statusDescriptions } from '@/types/components/campaign-v2'
const props = defineProps({
  ad: {
    type: Object,
    required: true,
  },
})
const currentStatusParts = computed(() => {
  return props.ad.ai_status
    ? statusDescriptions[props.ad.ai_status as AI_STATUS] || {
        main: '',
        note: '',
      }
    : { main: '', note: '' }
})

const typeNow = (status: string = '') => {
  return (helper.classRender(status) as TType) || undefined
}

const getAdsOptions = () => {
  const isDisabled = false

  return [
    {
      label: 'AI Recheck',
      key: 'ai_recheck',
      disabled: isDisabled,
    },
    {
      label: 'Manual Review',
      key: 'manual_review',
      disabled: isDisabled,
    },
  ]
}

const adsOptions = computed(() => getAdsOptions())
const handleSelect = async (key: string, ad: any, ind: number) => {
  if (key === 'ai_recheck') {
    return
  }
  if (key === 'manual_review') {
    return
  }
}
</script>
