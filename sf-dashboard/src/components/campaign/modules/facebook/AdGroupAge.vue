<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { adGroups, campaignTypeClass } from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { PLACEMENT_TYPE } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const props = defineProps({
  adgroup: {
    type: Object as () => adGroups,
    required: true,
  },
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

let selectMinOptions: SelectOption[] = []
const isAudienceManual = computed(() => {
  return props.adgroup.audience_type === PLACEMENT_TYPE.MANUAL
})

watchEffect(() => {
  const max = isAudienceManual.value ? 65 : 25
  let options: SelectOption[] = []
  for (let index = 18; index <= max; index++) {
    options.push({
      value: 'min_' + index,
      label: index.toString(),
    })
  }
  selectMinOptions = options
})

const selectMaxOptions: SelectOption[] = []
for (let index = 18; index <= 65; index++) {
  if (index === 65) {
    selectMaxOptions.push({ value: 'max_' + index.toString(), label: '65+' })
  } else {
    selectMaxOptions.push({
      value: 'max_' + index.toString(),
      label: index.toString(),
    })
  }
}

const onUpdateValueMinAge = (value: string) => {
  if (props.adgroup.age_groups) {
    let temp_age_groups = props.adgroup.age_groups || ['min_18', 'max_65']

    temp_age_groups[0] = value
    if (
      Number(temp_age_groups[0].replaceAll('min_', '')) >
      Number(temp_age_groups[1].replaceAll('max_', ''))
    ) {
      temp_age_groups[1] = value.replaceAll('min_', 'max_')
    }

    props.adgroup.age_groups = temp_age_groups
  }
}

const onUpdateValueMaxAge = (value: string) => {
  if (props.adgroup.age_groups) {
    let temp_age_groups = props.adgroup.age_groups || ['min_18', 'max_65']

    temp_age_groups[1] = value
    if (
      Number(temp_age_groups[1].replaceAll('max_', '')) <
      Number(temp_age_groups[0].replaceAll('min_', ''))
    ) {
      temp_age_groups[0] = value.replaceAll('max_', 'min_')
    }

    props.adgroup.age_groups = temp_age_groups
  }
}

const initMin = computed(() => {
  if (props.adgroup.age_groups) {
    const age_groups = props.adgroup.age_groups || ['18', '65']

    return age_groups[0]
  }

  return '18'
})

const initMax = computed(() => {
  if (props.adgroup.age_groups) {
    const age_groups = props.adgroup.age_groups || ['18', '65']

    return age_groups[1]
  }

  return '65'
})

const isShow = computed<boolean>(() => {
  return props.campaign.IsAPI()
})

watch(
  () => isAudienceManual.value,
  (v) => {
    if (!v) {
      props.adgroup.age_groups = props.adgroup.age_groups?.filter(
        (item) => !item.startsWith('max')
      )
    } else {
      const hasMax = props.adgroup.age_groups?.some((item) =>
        item.startsWith('max')
      )
      if (!hasMax) {
        if (!props.adgroup.age_groups) {
          props.adgroup.age_groups = []
        }
        props.adgroup.age_groups.push('max_65')
      }
    }
  }
)
</script>

<template>
  <div class="flex items-center gap-2 w-80" v-if="isShow">
    <FloatingWrapper name="Age" rounded required>
      <div class="flex gap-2">
        <n-select
          :value="initMin"
          :options="selectMinOptions"
          :on-update:value="onUpdateValueMinAge"
          :disabled="campaign.categories?.length ? true : false"
        />
        <n-select
          v-if="isAudienceManual"
          class=""
          :value="initMax"
          :options="selectMaxOptions"
          @update:value="onUpdateValueMaxAge"
          :disabled="campaign.categories?.length ? true : false"
        />
      </div>
      <template #extra>
        <n-popover trigger="hover">
          <template #trigger>
            <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
          </template>
          Select the minimum and maximum age of the people who will find your ad
          relevant.
        </n-popover>
      </template>
    </FloatingWrapper>
  </div>
</template>
