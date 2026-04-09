<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { DropdownOption } from 'naive-ui'

import { CampaignContext } from '@/types/components/campaign-v2'
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

const campaignStore2 = useCampaign2Store()

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})

const fKeywordSet = computed<string>(() => {
  return props.data.campaign.keyword_set_id
    ? String(props.data.campaign.keyword_set_id)
    : ''
})

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

  if (!keywordSetOptions.value.length && props.data.campaign.IsKwSetDefault()) {
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
  if (!props.data.campaign.keyword_set_id) {
    return
  }

  window.open(
    `/keyword-set/edit/${props.data.campaign.keyword_set_id}`,
    '_blank'
  )
}

const createNewKeywordSet = () => {
  campaignStore2.changeDataModal({})
  campaignStore2.changeModalKeywordset(true)
}

const EditKeywordSet = () => {
  campaignStore2.changeDataModal({ id: props.data.campaign.keyword_set_id })
  campaignStore2.changeModalKeywordset(true)
}

watch(
  () => campaignStore2.idKeywordSet,
  (newValue, oldValue) => {
    if (
      props.data.FreezeData.isClonePage(props.data.campaign) ||
      newValue === 0
    ) {
      return
    }
    props.data.campaign.keyword_set_id = newValue
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
      disabled: !props.data.campaign.keyword_set_id,
    },

    {
      label: 'Open Selected Keyword Set',
      key: 'open',
      icon: renderIcon(WindowPlus),
      disabled: !props.data.campaign.keyword_set_id,
    },
  ]
})

const handleMenu = (key: string) => {
  switch (key) {
    case 'create':
      createNewKeywordSet()
      break

    case 'edit':
      if (!props.data.campaign.keyword_set_id) {
        return
      }
      EditKeywordSet()
      break
    case 'open':
      if (!props.data.campaign.keyword_set_id) {
        return
      }
      openKeywordset()
      break
  }
}

const keywordNow = computed<any>(() => {
  return (
    keywordSetOptions.value.find(
      (item) => item.value === props.data.campaign.keyword_set_id
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
    if (props.data.campaign?.keywords) {
      return props.data.campaign?.keywords.split(', ')
    }

    return []
  } catch {
    return []
  }
})

const limitPageViewShowOld = computed<number>(() => {
  if (props.data.campaign?.limit_page_view) {
    if (props.data.campaign?.limit_page_view == 0) {
      return LIMIT_PAGE_VIEW
    }
  }

  return props.data.campaign?.limit_page_view || 0
})

// onMounted(() => {
//   if (campaign.IsHasKeywordSet()) {
//     fetchKeywordSets()
//   }
// })

watch(
  () => props.data.statusData.IsTabCampaign(),
  (v) => {
    if (v && props.data.campaign.IsHasKeywordSet()) {
      fetchKeywordSets()
    }
  },
  { deep: true }
)

watch(
  () => props.data.campaign.IsHasKeywordSet(),
  (newVal, oldVal) => {
    if (!newVal === true) {
      props.data.campaign.keyword_set_id = undefined
    }
  }
)

defineExpose({
  fetchKeywordSets,
})

const isDisabled = computed(() => {
  if (props.data.campaign.category_site_builder === ONOFF.ON) return true

  if (props.data.campaign.IsCloneCampaign()) return true

  return false
})

const name = 'Keyword Set'
</script>

<template>
  <div class="flex flex-col gap-4">
    <FloatingWrapper
      :name="name"
      rounded
      v-if="props.data.campaign.IsHasKeywordSet()"
    >
      <div class="flex-1 min-w-0 flex gap-2">
        <n-select
          v-model:value="props.data.campaign.keyword_set_id"
          filterable
          remote
          :loading="isLoading"
          :placeholder="name + ' - Default (empty keyword)'"
          :options="keywordSetOptions"
          :disabled="isDisabled"
          @search="handleSearchKeywordSet"
        />

        <n-dropdown
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

    <FloatingWrapper
      name="Keywords"
      rounded
      v-if="
        props.data.campaign.keyword_set_id &&
        !props.data.campaign.IsKwSetDefault()
      "
    >
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
    </FloatingWrapper>

    <div
      class="flex items-center gap-2"
      v-if="
        props.data.campaign.keyword_set_id &&
        !props.data.campaign.IsKwSetDefault()
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
      v-show="props.data.campaign.keyword_set_id && keywordNow.keyword_ab_test"
    >
      <n-input-number :value="limitPageViewShow" :disabled="true" />
    </FloatingWrapper>

    <FloatingWrapper
      name="Keyword Detail (Old)"
      rounded
      v-if="
        props.data.FreezeData.isEditPage() &&
        !props.data.campaign.keyword_set_id &&
        props.data.campaign.keywords &&
        props.data.campaign.IsOffSearch2Search()
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
        props.data.FreezeData.isEditPage() &&
        !props.data.campaign.keyword_set_id &&
        props.data.campaign.IsOffSearch2Search()
      "
    >
      <n-input-number :value="limitPageViewShowOld" :disabled="true" />
    </FloatingWrapper>

    <ModalKeywordSet />
  </div>
</template>
