<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
} from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

import { ctr_account_category } from '@/services/ctr_account_category'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },
})

const isLoading = ref(false)
const tiktokPixelOptions = ref<SelectOption[]>([])
const isDataReady = computed(() => {
  return props.campaign.account && props.campaign.account_supply_id
})

const loadPixels = async (mode: 'fetch' | 'sync' = 'fetch') => {
  if (!props.campaign.account_supply_id) return
  isLoading.value = true
  try {
    let result

    if (mode === 'sync') {
      result = await ctr_account_category.SyncPixelsByAdAccount(
        'newsbreak',
        String(props.campaign.account)
      )
    } else {
      result = await ctr_account_category.GetPixelsByAdAccountV2(
        'newsbreak',
        String(props.campaign.account)
      )
    }

    tiktokPixelOptions.value = result.data.map((item: any) => ({
      label: item.name,
      value: item.id,
    }))
  } finally {
    isLoading.value = false
  }
}

const removeNewsBreakPixel = computed(() => {
  if (props.campaign.type === 'WEB_TRAFFIC') {
    props.adgroup.pixel = undefined
    return false
  }
  return true
})

watch(
  () => isDataReady.value,
  (ready) => {
    if (ready) {
      loadPixels('fetch')
    }
  },
  { immediate: true }
)
</script>

<template>
  <div v-if="removeNewsBreakPixel" class="flex items-center gap-2">
    <FloatingWrapper name="Newsbreak Pixel">
      <div class="flex-1 min-w-0 flex items-center gap-2">
        <n-select
          class="flex-1"
          v-model:value="props.adgroup.pixel"
          filterable
          clearable
          :disabled="
            (props.FreezeData.isEditPage() ||
              !props.campaign?.account_supply_id) &&
            !!props.adgroup.id &&
            !!props.adgroup.ad_group_id
          "
          :loading="isLoading"
          :options="tiktokPixelOptions"
        />
        <!-- Nút Sync -->
        <n-button
          color="#f43f5e"
          type="default"
          title="Creative Menu"
          :loading="isLoading"
          @click="() => loadPixels('sync')"
        >
          Sync
        </n-button>
      </div>
    </FloatingWrapper>
  </div>
</template>
