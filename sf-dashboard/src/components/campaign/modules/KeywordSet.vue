<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { DropdownOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import useCampaign2Store from '@/store/useCampaign2Store'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import { ModalKeywordSet } from '@/components/campaign/async'

import { renderIcon } from '@/utils/utils'
import { ONOFF } from '@/enum/campaign'
import WindowPlus from '@/assets/icons/WindowPlus.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import PencilFill from '@/assets/icons/PencilFill.vue'
import Plus from '@/assets/icons/Plus.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { LIMIT_PAGE_VIEW } from '@/constants/limits'
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

const kwsetStore = useKeywordSetStore()

const campaignStore2 = useCampaign2Store()

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
})

const fKeywordSet = computed<string>(() => {
  return props.campaign.keyword_set_id
    ? String(props.campaign.keyword_set_id)
    : ''
})
const isAdmin = window.arb.isAdmin()

const keywordSetOptions = ref<SelectOption[]>([])

const isLoading = ref<boolean>(false)
const fetchKeywordSets = async (q: string = '') => {
  isLoading.value = true

  keywordSetOptions.value = []
  try {
    const result = await ctr_filter_v2.FilterKeywordSet({
      q: q,
      f: fKeywordSet.value,
    })

    keywordSetOptions.value = result?.data || []
  } finally {
    isLoading.value = false
  }

  if (!keywordSetOptions.value.length && props.campaign.IsKwSetDefault()) {
    keywordSetOptions.value = [
      {
        label: 'Default (empty keyword)',
        value: 1,
      },
    ]
  }
}

const searchTimeout = ref<ReturnType<typeof setTimeout>>()

const handleSearchKeywordSet = (query: string) => {
  if (searchTimeout.value) {
    clearTimeout(searchTimeout.value)
  }

  searchTimeout.value = setTimeout(() => {
    fetchKeywordSets(query)
  }, 300)
}

const openKeywordset = () => {
  if (!props.campaign.keyword_set_id) {
    return
  }

  window.open(`/keyword-set/edit/${props.campaign.keyword_set_id}`, '_blank')
}

const createNewKeywordSet = () => {
  kwsetStore.activeKey = 'keyword_set'
  campaignStore2.changeDataModal({})
  campaignStore2.changeModalKeywordset(true)
}

const EditKeywordSet = () => {
  campaignStore2.changeDataModal({ id: props.campaign.keyword_set_id })
  campaignStore2.changeModalKeywordset(true)
}

watch(
  () => campaignStore2.idKeywordSet,
  (newValue, oldValue) => {
    if (props.FreezeData.isClonePage(props.campaign) || newValue === 0) {
      return
    }
    props.campaign.keyword_set_id = newValue
    fetchKeywordSets()
  }
)

watch(
  () => campaignStore2.updateKeywordList,
  (newValue, oldValue) => {
    fetchKeywordSets()
  }
)

const menuOptions = computed<DropdownOption[]>(() => {
  return [
    {
      label: 'Create New Keyword Set',
      key: 'create',
      icon: renderIcon(Plus),
    },
    {
      label: 'Edit Selected Keyword Set',
      key: 'edit',
      icon: renderIcon(PencilFill),
      disabled:
        !props.campaign.keyword_set_id ||
        (props.campaign.keyword_set_id === 1 && !isAdmin) ||
        (props.campaign.keyword_optimize && !isAdmin),
    },

    {
      label: 'Open Selected Keyword Set',
      key: 'open',
      icon: renderIcon(WindowPlus),
      disabled:
        !props.campaign.keyword_set_id ||
        (props.campaign.keyword_optimize && !isAdmin),
    },
  ]
})

const handleMenu = (key: string) => {
  switch (key) {
    case 'create':
      createNewKeywordSet()
      break

    case 'edit':
      if (!props.campaign.keyword_set_id) {
        return
      }
      EditKeywordSet()
      break
    case 'open':
      if (!props.campaign.keyword_set_id) {
        return
      }
      openKeywordset()
      break
  }
}

const keywordNow = computed<any>(() => {
  return (
    keywordSetOptions.value.find(
      (item) => item.value === props.campaign.keyword_set_id
    ) || {}
  )
})

const keywordsShow = computed<any[]>(() => {
  try {
    return JSON.parse(keywordNow.value?.keywords)
  } catch {
    return []
  }
})

const limitPageViewShow = computed<number>(() => {
  if (keywordNow.value?.limit_page_view == 0) {
    return LIMIT_PAGE_VIEW
  }
  return keywordNow.value?.limit_page_view
})

const keywordsShowOld = computed<any[]>(() => {
  try {
    if (props.campaign?.keywords) {
      return props.campaign?.keywords.split(', ')
    }

    return []
  } catch {
    return []
  }
})

const limitPageViewShowOld = computed<number>(() => {
  if (props.campaign?.limit_page_view) {
    if (props.campaign?.limit_page_view == 0) {
      return LIMIT_PAGE_VIEW
    }
  }

  return props.campaign?.limit_page_view || 0
})

// onMounted(() => {
//   if (props.campaign.IsHasKeywordSet()) {
//     fetchKeywordSets()
//   }
// })

watch(
  () => props.statusData.IsTabCampaign(),
  (v) => {
    if (v && props.campaign.IsHasKeywordSet()) {
      fetchKeywordSets()
    }
  },
  { deep: true }
)

watch(
  () => props.campaign.IsHasKeywordSet(),
  (newVal, oldVal) => {
    if (!newVal === true) {
      props.campaign.keyword_set_id = undefined
    }
  }
)

defineExpose({
  fetchKeywordSets,
})

const isDisabled = computed(() => {
  if (props.campaign.category_site_builder === ONOFF.ON) return true

  if (props.campaign.IsCloneCampaign()) return true

  return false
})

const name = 'Keyword Set'

const renderKeywordLabel = (option: any) => {
  if (
    props.campaign.keyword_optimize &&
    String(option.label).includes('Auto Optimize')
  ) {
    return 'Auto Optimize'
  }

  return option.label
}

const keywordSetOptionsShow = computed(() => {
  if (props.campaign.keyword_optimize) {
    const vl = keywordSetOptions.value?.find(
      (x) => x.value === props.campaign.keyword_set_id
    )
    if (vl) {
      return [vl] as SelectOption[]
    }

    return [
      {
        value: props.campaign.keyword_set_id,
        label: props.campaign.keyword_set_id,
      },
    ] as SelectOption[]
  }

  return keywordSetOptions.value
})

const updateKwSetDefault = async () => {
  await nextTick()

  if (!props.campaign.keyword_optimize) props.campaign.keyword_set_id = 1
}
</script>

<template>
  <div class="flex flex-col gap-4">
    <div
      class="flex items-center gap-2"
      v-if="props.campaign.keyword_set_id && props.campaign.IsHasKeywordSet()"
    >
      <div class="font-bold text-xs flex items-center gap-2">
        AI Keyword Optimization
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
          </template>
          Automatically fine-tune and optimize keywords with AI to improve
          performance.
        </n-popover>
      </div>
      <div class="flex-1 min-w-0">
        <CustomSwitch
          v-model="props.campaign.keyword_optimize"
          type="boolean"
          true-label="On"
          false-label="Off"
          size="small"
          @change="updateKwSetDefault"
        />
      </div>
    </div>

    <FloatingWrapper
      :name="name"
      rounded
      v-if="props.campaign.IsHasKeywordSet()"
    >
      <div class="flex-1 min-w-0 flex gap-2">
        <n-select
          :value="props.campaign.keyword_set_id"
          @update:value="
            (v) =>
              !props.campaign.keyword_optimize &&
              (props.campaign.keyword_set_id = v)
          "
          :options="keywordSetOptionsShow"
          :render-label="renderKeywordLabel"
          :disabled="isDisabled"
          filterable
          remote
          :loading="isLoading"
          :placeholder="name + ' - Default (empty keyword)'"
          @search="handleSearchKeywordSet"
        />

        <n-dropdown
          v-if="!campaign.IsAPIPublic()"
          class="custom-dropdown-adg-creative"
          trigger="hover"
          :options="menuOptions"
          :on-select="handleMenu"
        >
          <n-button
            color="#f43f5e"
            type="default"
            :class="{
              'pointer-events-none': isDisabled,
            }"
            :disabled="isDisabled"
            ><n-icon size="20"><ListStars /></n-icon
          ></n-button>
        </n-dropdown>
      </div>
    </FloatingWrapper>

    <div
      class="flex flex-col gap-2"
      v-if="
        props.campaign.keyword_set_id &&
        !props.campaign.IsKwSetDefault() &&
        !props.campaign.keyword_optimize
      "
    >
      <div class="text-xs text-gray-500 font-semibold">Keywords</div>
      <div class="flex-1 min-w-0 flex flex-col gap-4">
        <div
          v-for="(keyword, index) in keywordsShow"
          :key="index"
          class="flex items-center flex-row gap-2"
        >
          <n-input
            placeholder="Keyword"
            :value="keyword.keyword"
            :disabled="true"
          >
          </n-input>
        </div>
      </div>
    </div>

    <div
      class="flex items-center gap-2"
      v-if="
        props.campaign.keyword_set_id &&
        !props.campaign.IsKwSetDefault() &&
        !props.campaign.keyword_optimize
      "
    >
      <div class="font-bold text-xs">Keyword A/B Test</div>
      <div class="flex-1 min-w-0">
        <CustomSwitch
          v-model="keywordNow.keyword_ab_test"
          type="boolean"
          true-label="On"
          false-label="Off"
          size="small"
          :disabled="true"
        />
      </div>
    </div>

    <FloatingWrapper
      name="Limit Page View"
      rounded
      v-show="props.campaign.keyword_set_id && keywordNow.keyword_ab_test"
    >
      <n-input-number :value="limitPageViewShow" :disabled="true" />
    </FloatingWrapper>

    <FloatingWrapper
      name="Keyword Detail (Old)"
      rounded
      v-if="
        props.FreezeData.isEditPage() &&
        !props.campaign.keyword_set_id &&
        props.campaign.keywords &&
        props.campaign.IsOffSearch2Search()
      "
    >
      <div class="flex-1 min-w-0 flex flex-col gap-4">
        <div
          v-for="(keyword, index) in keywordsShowOld"
          :key="index"
          class="flex items-center flex-row gap-2"
        >
          <n-input placeholder="Keyword" :value="keyword" :disabled="true">
          </n-input>
        </div>
      </div>
    </FloatingWrapper>

    <FloatingWrapper
      name="Limit Page View (Old)"
      rounded
      v-show="
        props.FreezeData.isEditPage() &&
        !props.campaign.keyword_set_id &&
        props.campaign.IsOffSearch2Search()
      "
    >
      <n-input-number :value="limitPageViewShowOld" :disabled="true" />
    </FloatingWrapper>

    <ModalKeywordSet />
  </div>
</template>
