<script setup lang="ts">
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
import { useGlobalConfig } from '@/store/details/globalConfig'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const globalConfigStore = useGlobalConfig()

const options = [
  {
    label: 'Fixed',
    value: 'fixed',
  },
]

const name = `Target Geo By`
const note = `If Fixed, it will select the default config set to Fixed; otherwise, it will select the default config corresponding to the ad's language.
`
</script>

<template>
  <FloatingWrapper
    :name="name"
  >
    <template #extra>
      <n-popover trigger="hover" placement="top">
        <template #trigger>
          <n-icon size="12" class="cursor-pointer">
            <QuestionCircleRegular />
          </n-icon>
        </template>
        <span>{{ note }}</span>
      </n-popover>
    </template>
    <div class="w-full flex flex-col">
      <n-select
        v-model:value="globalConfigStore.globalConfigData.target_geo_by"
        :placeholder="''"
        :options="options"
      />
    </div>
  </FloatingWrapper>
</template>
