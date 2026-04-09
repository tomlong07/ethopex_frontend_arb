<script setup lang="ts">
import { DropdownOption, SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import useAudienceStore from '@/store/useAudienceStore'

import Plus from '@/assets/icons/Plus.vue'

import ModalAudience from '@/components/campaign/modal/ModalAudience.vue'
import { renderIcon } from '@/utils/utils'
import { ctr_audience } from '@/services/ctr_audience'
import WindowStack from '@/assets/icons/WindowStack.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const audienceStore = useAudienceStore()

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },

  FreezeData: {
    type: Object as () => FreezeClass,
    required: true,
  },

  index: {
    type: Number,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsDemandGen() || props.campaign.IsPMax()
})

const isLoading = ref(false)
const audienceOptions = ref<SelectOption[]>([])
const createAudience = async () => {
  audienceStore.changeAdGroupIndex(props.index)
  audienceStore.changeDataModal({ id: 0 })
  audienceStore.changeShowModal(true)
}

const editAudience = async () => {
  if (props.campaign.ad_groups) {
    audienceStore.changeAdGroupIndex(props.index)
    audienceStore.changeDataModal({
      id: props.campaign.ad_groups[props.index].audience || undefined,
    })
    audienceStore.changeShowModal(true)
  }
}

watch(
  () => audienceStore.resultModal,
  async (newValue, oldValue) => {
    if (props.index !== audienceStore.adGroupModalIndex) {
      return
    }

    fetchAudienceOptions()

    if (newValue?.data && props.campaign.ad_groups) {
      props.campaign.ad_groups[props.index].audience = newValue.data
    }
  }
)

const fetchAudienceOptions = async () => {
  if (!props.campaign.account_supply_id) {
    return
  }
  isLoading.value = true
  const audienceResult = await ctr_audience.Filter({
    filter: {
      account_id: props.campaign.account_supply_id,
      traffic_source: TS.GOOGLE,
    },
  })

  audienceOptions.value = (audienceResult?.data?.items || []).map(
    (item: any) => {
      return {
        id: item.id,
        name: `${item.id} - ${item.name}`,
      }
    }
  )

  isLoading.value = false
}

watch(
  () => isShow.value,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (!newValue && props.campaign.ad_groups) {
      props.campaign.ad_groups[props.index].audience = undefined
    }
  }
)

watch(
  () => [props.statusData.adGroupIndex, props.statusData.IsTabAdGroup()],
  ([index, IsTabAdGroup]) => {
    if (index !== null && IsTabAdGroup) {
      fetchAudienceOptions()
    }
  }
)

watch(
  () => audienceStore.resultModal,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    if (props.index !== audienceStore.adGroupModalIndex) {
      return
    }

    if (newValue?.data && props.campaign.ad_groups) {
      props.campaign.ad_groups[props.index].audience = newValue?.data
      fetchAudienceOptions()
    }
  }
)

watch(
  () => props.campaign.account_supply_id,
  async (newValue, oldValue) => {
    if (props.FreezeData.isEditPage()) {
      return
    }

    fetchAudienceOptions()
  }
)

defineExpose({
  fetchAudienceOptions,
})

const name = 'Audience'

const menuOptions = computed<DropdownOption[]>(() => {
  let options: DropdownOption[] = []

  if (!props.campaign.IsByBot()) {
    options = [
      {
        label: 'Create New Audience',
        key: 'create',
        icon: renderIcon(Plus),
        disabled:
          !props.campaign?.account_supply_id || props.FreezeData.isEditPage(),
      },
    ]
  }

  options.push({
    label: 'Open Selected Audience',
    key: 'open',
    icon: renderIcon(WindowStack),
    disabled:
      !props.campaign?.account_supply_id ||
      !props.campaign.ad_groups ||
      !props.campaign.ad_groups[props.index].audience,
  })
  return options
})

const handleMenu = (key: string) => {
  switch (key) {
    case 'create':
      createAudience()
      break

    case 'open':
      if (
        !props.campaign.ad_groups ||
        !props.campaign.ad_groups[props.index].audience
      ) {
        return
      }

      editAudience()
      break
  }
}
</script>

<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <div class="flex-1 min-w-0 flex flex-row gap-2">
      <n-select
        v-if="props.campaign.ad_groups"
        v-model:value="props.campaign.ad_groups[props.index].audience"
        filterable
        clearable
        value-field="id"
        label-field="name"
        :loading="isLoading"
        :options="audienceOptions"
        :placeholder="name"
        :disabled="!props.campaign?.account_supply_id"
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
            'pointer-events-none': !props.campaign.account_supply_id,
          }"
          :disabled="!props.campaign.account_supply_id"
          ><n-icon size="20"><ListStars /></n-icon
        ></n-button>
      </n-dropdown>
    </div>
  </FloatingWrapper>

  <ModalAudience :campaign="campaign" />
</template>
