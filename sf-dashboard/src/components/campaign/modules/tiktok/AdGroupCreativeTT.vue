<script setup lang="ts">
import { DropdownOption, SelectOption } from 'naive-ui'

import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { RenderLabel } from '../Creative'
import { renderIcon } from '@/utils/utils'
import useCreativeModal, { CreativeModalInfo } from '@/store/useCreativeModal'
import { ModalStateCreative } from '@/types/components/modal'
import { ctr_creative } from '@/services/ctr_creative'
import { AD_SETUP } from '@/enum/campaign'
import Plus from '@/assets/icons/Plus.vue'
import WindowStack from '@/assets/icons/WindowStack.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const creativeMenuModal = useCreativeModal()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  adgroup: {
    type: Object as () => adGroups,
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

const handleCreativeSearch = debounceV2(
  async (query: string = '', adType?: string) => {
    searchCreative({ q: query })
  },
  300
)

const searchCreative = async (opts: any) => {
  isLoading.value = true

  if (
    props.adgroup.creatives?.length &&
    props.adgroup.creatives[0].creative_id
  ) {
    selectedCreative.value = helper.clone(
      creativeOptions.value.find(
        (i) =>
          props.adgroup.creatives &&
          i.id === props.adgroup.creatives[0].creative_id
      )
    )
  }

  await fetchCreative(opts)

  isLoading.value = false
}

const creative_ids = computed<number[]>(() => {
  const source = props.FreezeData.isDuplicatePage()
    ? props.adgroup.creatives
    : props.adgroup.ad_creative

  return Array.from(new Set(source?.map((x) => x.creative_id || 0) || []))
})

const selectedCreative = ref()
//
const currentOptions = ref<SelectOption[]>([])
const fetchCreative = async (
  opts: { q?: string; notfound?: boolean; id?: string; ad_type?: string } = {
    q: '',
  }
) => {
  let options: { [key: string]: any } = {
    id: creative_ids.value.toString(),
    q: opts.q,
    ts: props.campaign.traffic_source,
    type: props.campaign.campaign_type,
    nf: opts.notfound ? 1 : 0,
    ad_type: opts.ad_type || (props.campaign.IsSmart() ? 'smart' : 'manual'),
  }
  const result = await ctr_creative.GetAllCreative({
    params: options,
  })
  creativeOptions.value = result?.data?.creatives || []
}

watch(
  [() => props.statusData.IsTabAdGroup(), () => props.statusData.adGroupIndex],
  ([IsTabAdGroup, adGroupIndex]) => {
    if (
      props.campaign.ad_groups &&
      IsTabAdGroup &&
      adGroupIndex !== undefined
    ) {
      if (!props.adgroup.creatives) {
        props.adgroup.creatives = []
      }

      fetchCreative({
        notfound: true,
      })
    }
  }
)

const openCreative = () => {
  const creativeId = props.adgroup?.creatives?.[0]?.creative_id
  if (creativeId) {
    window.open(`/creative/${creativeId}`, '_blank')
  }
}

const isShow = computed<boolean>(() => {
  if (props.campaign.IsTrafficTiktok() && props.campaign.IsAPI()) {
    if (props.FreezeData.isAddPage()) {
      return true
    }

    //Dùng cho camp cũ vẫn có creative vẫn hiển thị bình thường
    if (
      props.FreezeData.isEditPage() &&
      props.adgroup.creatives?.[0]?.creative_id
    ) {
      return true
    }
  }

  return (
    (props.campaign.traffic_source &&
      props.campaign.demand_source &&
      props.campaign.IsAPI()) ||
    false
  )
})

// Helper function để khởi tạo creatives array
const initializeCreatives = () => {
  if (!props.adgroup.creatives) {
    props.adgroup.creatives = [
      {
        creative_id: null,
        ad_setup: AD_SETUP.CREATE_AD,
      },
    ]
  }
}

// Helper function để cập nhật creative_id
const updateCreativeId = (creativeId: number | null) => {
  if (!props.adgroup.creatives) {
    initializeCreatives()
  }
  if (props.adgroup.creatives && props.adgroup.creatives[0]) {
    props.adgroup.creatives.map((creative) => {
      creative.creative_id = creativeId
    })
  }
}

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (newValue) {
      initializeCreatives()
      updateCreativeId(null)
      handleCreativeSearch()
    } else {
      props.adgroup.creatives = undefined
    }
  }
)

watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || !isShow.value) {
      return
    }

    updateCreativeId(null)
    handleCreativeSearch()
  }
)

//fetch lại creative khi modal creative tạo thành công creative
watch(
  () => props.statusData.initCreative,
  async (newValue, oldValue) => {
    await fetchCreative()
  }
)

onMounted(() => {
  if (isShow.value) {
    initializeCreatives()

    const creativeIds: string[] = Array.from(
      new Set(
        props.adgroup.ad_creative?.map((item: any) => item.creative_id) ?? []
      )
    )

    fetchCreative({
      notfound: true,
      id: String(creativeIds),
    }).then(() => {
      // Lưu currentOptions sau khi fetch xong
      if (creativeOptions.value.length > 0) {
        currentOptions.value = [...creativeOptions.value]
      }
    })
  }
})

watch(
  () => props.campaign.IsSmart(),
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage() || !isShow.value) {
      return
    }

    updateCreativeId(null)

    const adType = newValue ? 'smart' : 'manual'
    await fetchCreative({ ad_type: adType })
  }
)
const enhancedCreativeOptions = computed(() => {
  const currentId = props.adgroup.creatives?.[0]?.creative_id
  if (!currentId) return creativeOptions.value

  if (creativeOptions.value.find((i) => i.id === currentId)) {
    return creativeOptions.value
  }

  const existingCreative = currentOptions.value.find((i) => i.id === currentId)

  if (existingCreative) {
    return [existingCreative, ...creativeOptions.value]
  }

  return creativeOptions.value
})
const labelNow = (key: number) => {
  return enhancedCreativeOptions.value.find((e) => e.id === key)?.name || key
}
const menuOptions = computed<DropdownOption[]>(() => {
  let options: DropdownOption[] = []

  if (!props.campaign.IsByBot()) {
    options = [
      {
        label: 'Create New Creative',
        key: '@create',
        icon: renderIcon(Plus),
      },
    ]
  }

  if (props.adgroup.creatives?.length) {
    const validCreatives = props.adgroup.creatives.filter(
      (element) => element.creative_id != null
    )

    if (validCreatives.length > 0) {
      options.push({
        type: 'divider',
        key: 'd1',
      })

      validCreatives.forEach((element) => {
        options.push({
          label: labelNow(element.creative_id!),
          key: element.creative_id!,
          icon: renderIcon(WindowStack),
        })
      })
    }
  }
  return options
})

const handleMenu = (key: string) => {
  if (!key) return

  let newData: ModalStateCreative = {
    type: props.campaign.traffic_source,
    ad_type: props.campaign.campaign_setup,
    traffic_source: props.campaign.traffic_source,
    modalMenu: true,
  }
  switch (key) {
    case '@create':
      newData.id = 0
      break

    default:
      newData.id = Number(key)
      break
  }

  creativeMenuModal.changeDataModal(newData)

  creativeMenuModal.changeDataOriginal({
    adgroup: props.adgroup,
    callback: fetchCreative,
  } as CreativeModalInfo)

  creativeMenuModal.changeShowModal(true)
}

const renderLabelMenu = (option: DropdownOption) => {
  return h(
    'span',
    {
      style: {
        maxWidth: '250px', // Giới hạn chiều rộng của nhãn
      },

      class: [
        'overflow-hidden',
        'text-ellipsis',
        'inline-block',
        'whitespace-nowrap',
      ],
      title: option.label as string,
    },
    option.label as string
  )
}

const selectedCreativeId = computed<number | null>(() => {
  const firstValidCreative = props.adgroup.creatives?.find(
    (c) => c.creative_id != null
  )

  return firstValidCreative?.creative_id ?? null
})

const updateSelectedCreativeId = (val: number | null) => {
  props.adgroup.creatives = [
    {
      creative_id: val,
      fanpage: '',
    },
  ]
}

const selectedCreativeIds = computed<number[] | undefined>(() => {
  const ids =
    props.adgroup.creatives
      ?.map((x) => x.creative_id ?? null)
      .filter((id): id is number => id !== null) ?? []

  return ids.length === 0 ? undefined : ids
})

const updateSelectedCreativeIds = (vals: (number | null)[] | undefined) => {
  if (!vals || vals.length === 0) {
    props.adgroup.creatives = []
    return
  }

  props.adgroup.creatives = vals.map((id) => ({
    creative_id: id,
    fanpage: '',
  }))
}

const name = 'Creative'
</script>

<template>
  <div v-if="isShow" class="flex items-center gap-2">
    <div class="flex-1 min-w-0">
      <FloatingWrapper :name="name" rounded>
        <n-input-group class="gap-2" v-if="props.adgroup">
          <n-select
            :value="
              props.campaign.IsSmart()
                ? selectedCreativeId
                : selectedCreativeIds
            "
            filterable
            remote
            value-field="id"
            label-field="name"
            :multiple="!props.campaign.IsSmart()"
            :disabled="
              props.FreezeData.isEditPage() &&
              !!props.adgroup.id &&
              props.campaign.IsSmart()
            "
            :loading="isLoading"
            :placeholder="name"
            :render-label="renderCreativeLabel"
            :options="creativeOptions"
            @search="handleCreativeSearch"
            @update:value="
              props.campaign.IsSmart()
                ? updateSelectedCreativeId($event)
                : updateSelectedCreativeIds($event)
            "
          />
          <n-button
            v-if="props.campaign.IsSmart()"
            color="#f43f5e"
            type="default"
            @click="openCreative"
          >
            Open
          </n-button>
          <n-dropdown
            trigger="hover"
            :options="menuOptions"
            :on-select="handleMenu"
            :render-label="renderLabelMenu"
          >
            <n-button color="#f43f5e" type="default" title="Creative Menu">
              <n-icon size="20"><ListStars /></n-icon>
            </n-button>
          </n-dropdown>
        </n-input-group>
      </FloatingWrapper>
    </div>
  </div>
</template>
