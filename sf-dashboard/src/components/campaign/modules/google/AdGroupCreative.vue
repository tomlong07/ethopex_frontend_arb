<script setup lang="ts">
import { SelectOption, DropdownOption } from 'naive-ui'

import {
  adGroups,
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { RenderLabel, renderTag } from '@/components/campaign/modules/Creative'

import Plus from '@/assets/icons/Plus.vue'
import useCreativeModal, { CreativeModalInfo } from '@/store/useCreativeModal'
import { ModalStateCreative } from '@/types/components/modal'
import { ModalMenuCreative } from '@/components/campaign/async'
import { renderIcon } from '@/utils/utils'
import { ctr_creative } from '@/services/ctr_creative'
import WindowStack from '@/assets/icons/WindowStack.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const creativeMenuModal = useCreativeModal()

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
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

const creativeOptionsShow = computed(() => {
  return creativeOptions.value
})

const creativeCacheOptions = ref<{ [key: string]: SelectOption }>({})

const pushCacheOptions = () => {
  creativeOptions.value.forEach((element: any) => {
    if (!creativeCacheOptions.value[element.value]) {
      creativeCacheOptions.value[element.id.toString()] = helper.clone(element)
    }
  })
}

const labelNow = (key: number) => {
  for (let index = 0; index < creativeOptions.value.length; index++) {
    const element = creativeOptions.value[index]
    if (element.id === key) {
      return element.name
    }
  }

  return key
}

const renderCreativeLabel = (option: SelectOption) => {
  return RenderLabel(option)
}

const handleCreativeSearch = debounceV2(async (query?: string) => {
  searchCreative({ q: query })
}, 300)

const searchCreative = async (opts: any) => {
  await fetchCreative(opts)
}

const creative_ids = computed<number[]>(() => {
  return props.adgroup.creatives?.map((x) => x.creative_id || 0) || []
})

const fetchCreative = async (
  opts: { q?: string; notfound?: boolean; id?: string } = { q: '' }
) => {
  let options: { [key: string]: any } = {
    id: creative_ids.value.toString(),
    q: opts.q,
    ts: props.campaign.traffic_source,
    type: props.campaign.campaign_type,
    nf: opts.notfound ? 1 : 0,
  }
  isLoading.value = true

  const result = await ctr_creative.GetAllCreative({
    params: options,
  })
  creativeOptions.value = result?.data?.creatives || []

  pushCacheOptions()
  isLoading.value = false
}

// onMounted(() => {
//   if (props.campaign.ad_groups) {
//     if (!props.adgroup.creatives) {
//       props.adgroup.creatives = []
//     }

//     fetchCreative({
//       notfound: true,
//     })
//   }
// })

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

watch(
  () => props.campaign.campaign_type,
  async (newValue, oldValue) => {
    if (newValue) {
      fetchCreative()
    }
  }
)

const menuOptions = computed<DropdownOption[]>(() => {
  let options: DropdownOption[] = []

  if (!props.campaign.IsByBot()) {
    options = [
      {
        label: 'Create New Creative',
        key: '@create',
        icon: renderIcon(Plus),
        disabled: !props.campaign.campaign_type,
      },
    ]
  }

  if (props.adgroup.creatives?.length) {
    options.push({
      type: 'divider',
      key: 'd1',
    })
    props.adgroup.creatives?.forEach((element) => {
      options.push({
        label: labelNow(element.creative_id || 0),
        key: element.creative_id as any,
        icon: renderIcon(WindowStack),
      })
    })
  }

  return options
})

const handleMenu = (key: string) => {
  if (!key) return

  let newData: ModalStateCreative = {
    type: props.campaign.campaign_type,
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
        // whiteSpace: 'nowrap',
        // overflow: 'hidden',
        // textOverflow: 'ellipsis',
        maxWidth: '250px', // Giới hạn chiều rộng của nhãn
        // display: 'inline-block',
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

const selectCreative = (values: number[]) => {
  if (props.campaign.ad_groups) {
    const cloneCreative = helper.clone(props.adgroup.creatives)
    props.adgroup.creatives = []
    values.forEach((element) => {
      props.adgroup.creatives?.push({
        creative_id: element,
        fanpage: '',
      })
    })

    if (props.adgroup.creatives) {
      cloneCreative.forEach((element: any) => {
        if (values.includes(element.creative_id) && element.fanpage != '') {
          if (props.adgroup.creatives) {
            for (
              let index = 0;
              index < props.adgroup.creatives?.length;
              index++
            ) {
              const e = props.adgroup.creatives[index]
              if (e.creative_id === element.creative_id) {
                e.fanpage = element.fanpage
                break
              }
            }
          }
        }
      })
    }
  }
}

const name = 'Creative'
</script>

<template>
  <div>
    <FloatingWrapper :name="name" rounded>
      <div class="flex gap-2">
        <n-input-group v-if="props.adgroup">
          <n-select
            :value="creative_ids"
            filterable
            remote
            value-field="id"
            label-field="name"
            multiple
            :loading="isLoading"
            :placeholder="`Select ${name}s to add new ads`"
            :render-label="renderCreativeLabel"
            :render-tag="(props: any)=>renderTag(props, true)"
            :options="creativeOptionsShow"
            :max-tag-count="1"
            @search="handleCreativeSearch"
            :on-update:value="selectCreative"
          />
        </n-input-group>

        <n-dropdown
          trigger="hover"
          :options="menuOptions"
          :on-select="handleMenu"
          :render-label="renderLabelMenu"
          class="custom-dropdown-adg-creative"
        >
          <n-button color="#f43f5e" type="default" title="Creative Menu"
            ><n-icon size="20"><ListStars /></n-icon
          ></n-button>
        </n-dropdown>
      </div>
    </FloatingWrapper>
    <ModalMenuCreative />
  </div>
</template>
