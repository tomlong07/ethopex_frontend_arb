<script setup lang="ts">
import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
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

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isLoading = ref(false)
const tiktokPixelOptions = ref<SelectOption[]>([])
const allTiktokPixelOptions = ref([])
const mappedPixels = ref([])
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
        'tiktok',
        String(props.campaign.account)
      )
    } else {
      result = await ctr_account_category.GetPixelsByAdAccountV2(
        'tiktok',
        String(props.campaign.account)
      )
    }

    const pixels = result.data
    props.statusData.pixelsTemp = pixels

    mappedPixels.value = pixels.map((p: any, index: number) => ({
      ...p,
      uniqueKey: `${p.id}_${index}`,
      id: String(p.id),
    }))

    allTiktokPixelOptions.value = mappedPixels.value
    tiktokPixelOptions.value = mappedPixels.value

    if (mappedPixels.value.length === 0) {
      props.adgroup.pixel = null
    }
  } finally {
    isLoading.value = false
  }
}

//Xóa bỏ nếu nó không hiển thị -> tránh gửi thừa vào payload
watch(
  () => props.campaign.IsAPI(),
  async (newValue, oldValue) => {
    if (newValue) {
      loadPixels('fetch')
    } else {
      props.adgroup.pixel = undefined
    }
  }
)
watch(
  [
    () => props.statusData.IsTabAdGroup(),
    () => props.statusData.adGroupIndex,
    () => props.campaign.optimization_goal,
  ],
  ([IsTabAdGroup, adGroupIndex, optimizationGoal]) => {
    if (!IsTabAdGroup) return

    //khi optimization_goal là value thì chỉ cho chọn shopping nên chỉ cho hiện thi những option pixel có evenet là shopping
    if (optimizationGoal === 'VALUE') {
      const filteredPixels = allTiktokPixelOptions.value.filter((item: any) => {
        return (
          item.events &&
          item.events.some((event: any) => event.value === 'SHOPPING')
        )
      })

      tiktokPixelOptions.value = filteredPixels.length > 0 ? filteredPixels : []

      if (tiktokPixelOptions.value.length === 0) {
        props.adgroup.pixel = null
      }
    } else {
      tiktokPixelOptions.value = [...allTiktokPixelOptions.value]
    }

    if (props.adgroup.pixel) {
      const baseId = props.adgroup.pixel

      const matchingPixel = (mappedPixels.value as any[]).find((p: any) =>
        baseId.includes('_')
          ? String(p.uniqueKey) === baseId
          : String(p.id) === baseId
      )

      if (matchingPixel) {
        props.adgroup.pixel = matchingPixel.uniqueKey
      } else {
        // Nếu pixel hiện tại không còn trong list mới thì reset
        props.adgroup.pixel = null
      }
    }
  },
  { immediate: true }
)

onMounted(() => {
  if (props.campaign.IsAPI() && isDataReady.value) {
    loadPixels('fetch')
  }
})

watch(isDataReady, (ready) => {
  if (ready && props.campaign.IsAPI()) {
    loadPixels('fetch')
  }
})
</script>

<template>
  <div v-if="props.campaign.IsAPI()" class="flex items-center gap-2">
    <div class="flex-1 min-w-0 flex items-center gap-2">
      <FloatingWrapper name="TikTok Pixel" rounded required>
        <n-select
          class="flex-1"
          v-model:value="props.adgroup.pixel"
          filterable
          clearable
          value-field="uniqueKey"
          label-field="name"
          :disabled="
            (props.FreezeData.isEditPage() ||
              !props.campaign?.account_supply_id) &&
            (props.campaign.IsSmartCreated() ||
              (!!props.adgroup.id && !!props.adgroup.ad_group_id))
          "
          :loading="isLoading"
          :options="tiktokPixelOptions"
        />
      </FloatingWrapper>
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
  </div>
</template>
