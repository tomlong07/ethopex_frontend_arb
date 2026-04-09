<script setup lang="ts">
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { ONOFF } from '@/enum/campaign'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'
const usePromtDetail = PromtDetail()

const changeModel = (value: string) => {
  usePromtDetail.dataConfig.model = value
  usePromtDetail.dataConfig.config = {}
  usePromtDetail.configsNow.forEach((element) => {
    usePromtDetail.dataConfig.config[element] = ''
  })

  if (usePromtDetail.isPerplexity) {
    usePromtDetail.dataConfig.web_source = ONOFF.OFF
  } else {
    usePromtDetail.dataConfig.web_source = undefined
  }
}

const onInputNumber = (key: string) => {
  const val = usePromtDetail.dataConfig.config[key] || ''
  usePromtDetail.dataConfig.config[key] = val.replace(/[^0-9]/g, '')
}
</script>
<template>
  <div class="grid grid-cols-2 gap-4 w-full">
    <FloatingWrapper name="Model">
      <n-select
        :loading="usePromtDetail.selectData.loadingModel"
        v-model:value="usePromtDetail.dataConfig.model"
        :options="usePromtDetail.selectData.models"
        :render-label="usePromtDetail.selectData.renderLabel"
        :on-update:value="changeModel"
        filterable
        placeholder=""
        class="w-full min-w-[100px]"
      />
    </FloatingWrapper>

    <FloatingWrapper name="Api Key">
      <n-input
        v-model:value="usePromtDetail.dataConfig.api_key"
        placeholder="Enter Api Key..."
        class="w-full min-w-[200px]"
        type="password"
        show-password-on="click"
        :input-props="{ autocomplete: 'new-password' }"
      />
    </FloatingWrapper>
  </div>

  <div class="grid grid-cols-3 gap-4 w-full">
    <div
      v-for="(config, key, index) in usePromtDetail.dataConfig.config"
      :key="key + index"
      class="flex items-center"
    >
      <FloatingWrapper :name="key" class="flex-1 min-w-0">
        <n-input
          v-model:value="usePromtDetail.dataConfig.config[key]"
          class="flex-1"
          @input="onInputNumber(key)"
        />
      </FloatingWrapper>
    </div>
  </div>

  <FloatingWrapper name="Model Prioritize">
    <n-select
      :loading="usePromtDetail.selectData.loadingModel"
      v-model:value="usePromtDetail.dataConfig.model_prioritize"
      :options="usePromtDetail.selectData.models"
      :render-label="usePromtDetail.selectData.renderLabel"
      filterable
      placeholder=""
      class="w-full min-w-[100px]"
    />

    <template #extra>
      <n-popover trigger="hover">
        <template #trigger>
          <n-icon size="14" :component="QuestionCircleRegular"></n-icon>
        </template>
        If set, this model will be used with priority when generating prompts.
      </n-popover></template
    >
  </FloatingWrapper>
</template>
