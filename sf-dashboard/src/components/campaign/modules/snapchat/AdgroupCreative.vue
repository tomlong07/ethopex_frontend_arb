<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
  adGroups,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { ctr_creative } from '@/services/ctr_creative'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { RenderLabel } from '../Creative'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const isLoading = ref(false)
const creativeOptions = ref<SelectOption[]>([])
const creativeIdModel = computed({
  get: () => {
    return props.adGroup.creatives?.[0]?.creative_id || null
  },
  set: (id: number | string | null) => {
    if (id !== null && id !== undefined) {
      props.adGroup.creatives = [{ creative_id: id as number }]
    } else {
      props.adGroup.creatives = []
    }
  },
})
const hasCreativeId = computed(() => {
  const value = creativeIdModel.value
  return value !== null && value !== undefined
})

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option)
}

const handleCreativeSearch = debounceV2(async (query: string = '') => {
  searchCreative({ q: query })
}, 300)

const searchCreative = async (opts: any) => {
  isLoading.value = true

  const currentId = creativeIdModel.value

  if (currentId !== null && currentId !== undefined) {
    selectedCreative.value = helper.clone(
      creativeOptions.value.find((i) => i.id === currentId)
    )
  }

  await fetchCreative(opts)

  isLoading.value = false
}

const selectedCreative = ref()
//
const fetchCreative = async (
  opts: { q?: string; notfound?: boolean; id?: string } = { q: '' }
) => {
  let options: { [key: string]: any } = {
    id: opts.id,
    q: opts.q,
    ts: props.campaign.traffic_source,
    type: props.campaign.campaign_type,
    nf: opts.notfound ? 1 : 0,
  }

  const result = await ctr_creative.GetAllCreative({
    params: options,
  })
  creativeOptions.value = result?.data?.creatives || []

  //adding item in edit mode
  const currentId = creativeIdModel.value

  if (currentId !== null && currentId !== undefined) {
    if (!creativeOptions.value.find((i) => i.id === currentId)) {
      if (selectedCreative.value) {
        creativeOptions.value.unshift(selectedCreative.value)
      } else {
        creativeOptions.value.unshift({
          id: currentId,
          name: String(currentId),
          ads: 0,
        })
      }
    }
  }
}

const openCreative = () => {
  const currentId = creativeIdModel.value
  if (currentId !== null && currentId !== undefined) {
    window.open(`/creative/${currentId}`, '_blank')
  }
}

const isShow = computed<boolean>(() => {
  if (props.campaign.IsTrafficGoogle() && props.campaign.IsAPI()) {
    if (props.FreezeData.isAddPage()) {
      return false
    }

    //Dùng cho camp cũ vẫn có creative vẫn hiển thị bình thường
    if (props.FreezeData.isEditPage() && hasCreativeId.value) {
      return true
    }
    return false
  }

  return (
    (props.campaign.traffic_source &&
      props.campaign.demand_source &&
      props.campaign.IsAPI()) ||
    false
  )
})

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (newValue) {
      creativeIdModel.value = null

      handleCreativeSearch()
    } else {
      props.adGroup.creatives = []
      props.campaign.creative = undefined
    }
  }
)

watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || !isShow.value) {
      return
    }

    creativeIdModel.value = null

    handleCreativeSearch()
  }
)

//fetch lại creative khi modal creative tạo thành công creative
watch(
  () => props.statusData.initCreative,
  async (newValue, oldValue) => {
    fetchCreative()
  }
)

onMounted(() => {
  if (isShow.value) {
    if (creativeIdModel.value === null) {
      creativeIdModel.value = null
    }

    fetchCreative({
      notfound: true,
      id: String(creativeIdModel.value || ''),
    })
  }
})
const name = 'Creative'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-input-group>
      <n-select
        v-model:value="creativeIdModel"
        filterable
        remote
        value-field="id"
        label-field="name"
        :loading="isLoading"
        :placeholder="name"
        :render-label="renderCreativeLabel"
        :options="creativeOptions"
        @search="handleCreativeSearch"
      />
      <n-button
        v-if="hasCreativeId"
        color="#f43f5e"
        type="default"
        @click="openCreative"
      >
        Open
      </n-button>
    </n-input-group>
  </FloatingWrapper>
</template>
