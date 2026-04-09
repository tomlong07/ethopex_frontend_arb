<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
const crawlFacebookTemplateStore = useCrawlFacebookTemplate()

const selectMinOptions = computed<SelectOption[]>(() => {
  const max = crawlFacebookTemplateStore.crawlFBTemplate.IsManual() ? 65 : 25

  return Array.from({ length: max - 17 }, (_, i) => {
    const value = 18 + i
    return {
      value: `min_${value}`,
      label: value.toString(),
    }
  })
})

const selectMaxOptions: SelectOption[] = Array.from(
  { length: 65 - 18 + 1 },
  (_, i) => {
    const value = 18 + i
    return {
      value: `max_${value}`,
      label: value === 65 ? '65+' : String(value),
    }
  }
)

const onUpdateValueMinAge = (value: string) => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.age_groups) {
    let temp_age_groups = crawlFacebookTemplateStore.crawlFBTemplate
      .age_groups || ['min_18', 'max_65']

    temp_age_groups[0] = value
    if (
      Number(temp_age_groups[0].replaceAll('min_', '')) >
      Number(temp_age_groups[1].replaceAll('max_', ''))
    ) {
      temp_age_groups[1] = value.replaceAll('min_', 'max_')
    }

    crawlFacebookTemplateStore.crawlFBTemplate.age_groups = temp_age_groups
  }
}

const onUpdateValueMaxAge = (value: string) => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.age_groups) {
    let temp_age_groups = crawlFacebookTemplateStore.crawlFBTemplate
      .age_groups || ['min_18', 'max_65']

    temp_age_groups[1] = value
    if (
      Number(temp_age_groups[1].replaceAll('max_', '')) <
      Number(temp_age_groups[0].replaceAll('min_', ''))
    ) {
      temp_age_groups[0] = value.replaceAll('max_', 'min_')
    }

    crawlFacebookTemplateStore.crawlFBTemplate.age_groups = temp_age_groups
  }
}

const initMin = computed(() => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.age_groups) {
    const age_groups = crawlFacebookTemplateStore.crawlFBTemplate
      .age_groups || ['18', '65']

    return age_groups[0]
  }

  return 'min_18'
})

const initMax = computed(() => {
  if (crawlFacebookTemplateStore.crawlFBTemplate.age_groups) {
    const age_groups = crawlFacebookTemplateStore.crawlFBTemplate
      .age_groups || ['18', '65']

    return age_groups[1]
  }

  return 'max_65'
})

watch(
  () => crawlFacebookTemplateStore.crawlFBTemplate.IsManual(),
  (v) => {
    if (v) {
      crawlFacebookTemplateStore.crawlFBTemplate.age_groups = [
        'min_18',
        'max_65',
      ]
    } else {
      //Ở ai campaign thì advantage set rỗng, bên be tự set default
      crawlFacebookTemplateStore.crawlFBTemplate.age_groups = []
    }
  }
)
</script>

<template>
  <div
    class="flex items-center gap-2 w-80"
    v-if="crawlFacebookTemplateStore.crawlFBTemplate.IsManual()"
  >
    <FloatingWrapper name="Age" rounded required>
      <div class="flex gap-2">
        <n-select
          :value="initMin"
          :options="selectMinOptions"
          :on-update:value="onUpdateValueMinAge"
        />
        <n-select
          class=""
          :value="initMax"
          :options="selectMaxOptions"
          @update:value="onUpdateValueMaxAge"
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
