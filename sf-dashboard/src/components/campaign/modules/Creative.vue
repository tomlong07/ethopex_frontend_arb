<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { RenderLabel } from './Creative'
import { ctr_creative } from '@/services/ctr_creative'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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
})

const isLoading = ref(false)
const creativeOptions = ref<SelectOption[]>([])

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option)
}

const handleCreativeSearch = debounceV2(async (query: string = '') => {
  searchCreative({ q: query })
}, 300)

const searchCreative = async (opts: any) => {
  isLoading.value = true

  if (props.campaign.creative?.id) {
    selectedCreative.value = helper.clone(
      creativeOptions.value.find(
        (i) => props.campaign.creative && i.id === props.campaign.creative.id
      )
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
  if (props.campaign.creative?.id) {
    if (
      !creativeOptions.value.find(
        (i) => props.campaign.creative && i.id === props.campaign.creative.id
      )
    ) {
      if (selectedCreative.value) {
        creativeOptions.value.unshift(selectedCreative.value)
      } else {
        creativeOptions.value.unshift({
          id: props.campaign.creative.id,
          name: String(props.campaign.creative.id),
          ads: 0,
        })
      }
    }
  }
}

const openCreative = () => {
  if (props.campaign?.creative?.id) {
    window.open(`/creative/${props.campaign.creative.id}`, '_blank')
  }
}

const isShow = computed<boolean>(() => {
  if (props.campaign.IsTrafficGoogle() && props.campaign.IsAPI()) {
    if (props.FreezeData.isAddPage()) {
      return false
    }

    //Dùng cho camp cũ vẫn có creative vẫn hiển thị bình thường
    if (props.FreezeData.isEditPage() && props.campaign.creative?.id) {
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
      props.campaign.creative = { id: null }

      handleCreativeSearch()
    } else {
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

    props.campaign.creative = { id: null }

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
    if (!props.campaign.creative) {
      props.campaign.creative = {}
    }

    fetchCreative({
      notfound: true,
      id: String(props.campaign?.creative?.id || ''),
    })
  }
})
const name = 'Creative'
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-input-group v-if="props.campaign?.creative">
      <n-select
        v-model:value="props.campaign.creative.id"
        filterable
        remote
        value-field="id"
        label-field="name"
        :disabled="props.FreezeData.isEditPage()"
        :loading="isLoading"
        :placeholder="name"
        :render-label="renderCreativeLabel"
        :options="creativeOptions"
        @search="handleCreativeSearch"
      />
      <n-button
        v-if="props.campaign.creative.id"
        color="#f43f5e"
        type="default"
        @click="openCreative"
      >
        Open
      </n-button>
    </n-input-group>
  </FloatingWrapper>
</template>
