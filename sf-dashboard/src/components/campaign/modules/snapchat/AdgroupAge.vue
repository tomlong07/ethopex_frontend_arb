<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { campaignTypeClass, adGroups } from '@/types/components/campaign-v2'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { linkField } from './helpers'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  adGroup: {
    type: Object as () => adGroups,
    required: true,
  },
})

const ageGroups = linkField<string[] | null>('age_groups', [
  () => props.adGroup,
])

const locationValues = linkField<string[] | null>('location.value', [
  () => props.adGroup,
])

const ensureAgeGroups = () => {
  if (!Array.isArray(ageGroups.value) || ageGroups.value.length < 2) {
    ageGroups.value = ['min_13', 'max_50']
  }
}

const setAgeGroup = (index: number, value: string) => {
  ensureAgeGroups()
  const current = ageGroups.value as string[]
  const next = [...current]
  next[index] = value
  ageGroups.value = next
}

const selectMin: SelectOption[] = []

for (let index = 13; index <= 35; index++) {
  selectMin.push({ value: 'min_' + index.toString(), label: index.toString() })
}

const checkIsLower18 = (value: string, prefix: string) => {
  try {
    const arr = value.split(prefix + '_')

    if (arr.length > 1 && Number(arr[1]) < 18) {
      return true
    }

    return false
  } catch {
    return false
  }
}

//Xử lí với quốc gia eu || uk
const selectMinOptions = computed(() => {
  if (locationValues.value?.length) {
    if (isMustMin18.value) {
      //Tự động đưa về 18 nếu < 18
      ensureAgeGroups()
      const current = ageGroups.value as string[]
      if (checkIsLower18(current[0], 'min')) {
        setAgeGroup(0, 'min_18')
      }

      //Disabled hết các option < 18
      let newOptions: SelectOption[] = []
      for (let index = 0; index < selectMin.length; index++) {
        const element = selectMin[index]
        const newOpts = helper.clone(element)

        if (Number(element.label) < 18) {
          newOpts.disabled = true
        }
        newOptions.push(newOpts)
      }

      return newOptions
    }
  }
  return selectMin
})

const selectMax: SelectOption[] = []
for (let index = 13; index <= 50; index++) {
  if (index === 50) {
    selectMax.push({ value: 'max_' + index.toString(), label: '50+' })
  } else {
    selectMax.push({
      value: 'max_' + index.toString(),
      label: index.toString(),
    })
  }
}

const isMustMin18 = computed(() => {
  if (locationValues.value?.length) {
    for (let index = 0; index < locationValues.value.length; index++) {
      const element = locationValues.value[index]

      if (helper.isMinAge18(element)) {
        return true
      }
    }
  }
  return false
})

//Xử lí với quốc gia eu || uk
const selectMaxOptions = computed(() => {
  if (locationValues.value?.length) {
    if (isMustMin18.value) {
      //Tự động đưa về 18 nếu < 18
      ensureAgeGroups()
      const current = ageGroups.value as string[]
      if (checkIsLower18(current[1], 'max')) {
        setAgeGroup(1, 'max_18')
      }

      //Disabled hết các option < 18
      let newOptions: SelectOption[] = []
      for (let index = 0; index < selectMax.length; index++) {
        const element = selectMax[index]
        const newOpts = helper.clone(element)

        if (Number(element.label) < 18) {
          newOpts.disabled = true
        }
        newOptions.push(newOpts)
      }

      return newOptions
    }
  }
  return selectMax
})

const onUpdateValueMinAge = (value: string) => {
  ensureAgeGroups()
  const current = ageGroups.value as string[]
  const next = [...current]

  next[0] = value

  if (
    Number(value.replaceAll('min_', '')) >
    Number(next[1].replaceAll('max_', ''))
  ) {
    next[1] = value.replaceAll('min_', 'max_')
  }

  ageGroups.value = next
}

const onUpdateValueMaxAge = (value: string) => {
  ensureAgeGroups()
  const current = ageGroups.value as string[]
  const next = [...current]

  next[1] = value

  if (
    Number(value.replaceAll('max_', '')) <
    Number(next[0].replaceAll('min_', ''))
  ) {
    next[0] = value.replaceAll('max_', 'min_')
  }

  ageGroups.value = next
}
</script>

<template>
  <FloatingWrapper name="Age" rounded v-if="ageGroups?.length">
    <div class="flex items-center gap-2 w-80">
      <n-select
        v-model:value="ageGroups[0]"
        :options="selectMinOptions"
        @update:value="onUpdateValueMinAge"
      />
      <n-select
        v-model:value="ageGroups[1]"
        :options="selectMaxOptions"
        @update:value="onUpdateValueMaxAge"
      />
    </div>
    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        For EU and UK country targeting, Snapchatters ages 13-17 can only be
        targeted using the Impressions Optimization Goal.
      </n-popover>
    </template>
  </FloatingWrapper>
</template>
