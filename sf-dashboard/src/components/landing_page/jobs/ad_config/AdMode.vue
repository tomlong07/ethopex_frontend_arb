<script lang="ts" setup>
import { prelanderConfigs } from '@/types/components/landing'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const optionAdMode = [{ value: 'gam', label: 'GAM', disabled: false }]

watch(
  () => props.prelander_configs.ad_config?.ad_mode,
  (newVal) => {
    const config = props.prelander_configs.ad_config
    if (config && config.IsModeAdsense()) {
      config.ad_type = config.AdTypeBanner()
    }
  }
)
</script>
<template>
  <n-form-item v-if="props.prelander_configs.ad_config">
    <template #label>
      <span>Ad Mode</span>
    </template>

    <div class="flex items-center gap-3">
      <n-radio-group
        v-model:value="props.prelander_configs.ad_config.ad_mode"
        name="radiobuttongroup2"
      >
        <n-radio-button
          v-for="mode in optionAdMode"
          :key="mode.value"
          :value="mode.value"
          :disabled="mode.disabled"
          :label="mode.label"
        />
      </n-radio-group>
    </div>
  </n-form-item>
</template>
