<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  campaignTypeClass,
  FreezeClass,
  Interest,
} from '@/types/components/campaign-v2'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { debounceV2 } from '@/utils'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

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
})

const interestOptions = ref<SelectOption[]>([])

const isLoadingOption = ref<boolean>(false)

const searchInterest = debounceV2(async (value: string) => {
  isLoadingOption.value = true

  const result = await ctr_traffic_source.GetTargetingSuggest({
    traffic_source: props.campaign.traffic_source,
    search: value,
  })
  interestOptions.value = result?.data || []

  isLoadingOption.value = false
}, 300)

const addInterest = (values: string[], options: SelectOption[]) => {
  if (props.campaign.ad_groups) {
    if (!props.campaign.ad_groups[props.index].interest)
      props.campaign.ad_groups[props.index].interest = []

    for (let index = 0; index < options.length; index++) {
      const found = props.campaign.ad_groups[props.index].interest?.find(
        (element) => element.id === options[index].id
      )

      if (found) continue

      props.campaign.ad_groups[props.index].interest?.push({
        id: options[index].id,
        name: options[index].name,
      } as Interest)
    }
  }
}

const onRemoveInterest = (i: number) => {
  if (props.campaign.ad_groups) {
    props.campaign.ad_groups[props.index].interest?.splice(i, 1)
  }
}

const renderInterestLabel = (option: SelectOption) => {
  let size = ''

  try {
    size = `Size: ${formatNumberWithCommas(
      option.audience_size_lower_bound as number
    )} - ${formatNumberWithCommas(option.audience_size_upper_bound as number)}`
  } catch {}
  return h('div', { class: 'flex' }, [
    h('div', {
      innerHTML: option.name,
    }),
    h('div', {
      class: 'text-xs text-gray-500	ml-auto',
      innerHTML: size,
    }),
  ])
}

function formatNumberWithCommas(num: number): string {
  return num.toLocaleString('en-US')
}

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

const name = 'Advantage detailed targeting'
</script>

<template>
  <div v-if="isShow && props.campaign.ad_groups">
    <div class="flex items-center gap-2">
      <FloatingWrapper :name="name" rounded>
        <n-select
          filterable
          remote
          multiple
          :value="[]"
          value-field="id"
          label-field="name"
          :loading="isLoadingOption"
          :options="interestOptions"
          :render-label="renderInterestLabel"
          placeholder="Add demographics, interests or behaviors"
          :on-update:value="addInterest"
          :on-search="searchInterest"
        />
      </FloatingWrapper>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        We may deliver ads beyond your audience for eligible ad objectives, if
        it’s likely to improve performance.
      </n-popover>
    </div>
    <n-tag
      v-for="(inter, index) in props.campaign.ad_groups[props.index].interest"
      :key="index"
      class="shadow-md"
      >{{ inter.name }}
      <RemoveButton
        @onClick="() => onRemoveInterest(index)"
        class="z-10 shadow-md"
        text="Remove this interest"
      />
    </n-tag>
  </div>
</template>
