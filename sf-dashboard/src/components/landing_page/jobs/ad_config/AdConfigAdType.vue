<script lang="ts" setup>
import { prelanderConfigs } from '@/types/components/landing'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const optionAdTypeBase = [
  { value: 'banner', label: 'Banner', disabled: false },
  { value: 'native', label: 'Native', disabled: false },
]

const optionAdType = computed(() => {
  const adMode = props.prelander_configs.ad_config?.ad_mode
  return optionAdTypeBase.map((item) => {
    if (adMode === 'adsense' && item.value === 'native') {
      return { ...item, disabled: true }
    }
    return { ...item, disabled: false }
  })
})

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
      <span>Ad Type</span>
    </template>

    <div class="flex items-center gap-3">
      <n-radio-group
        v-model:value="props.prelander_configs.ad_config.ad_type"
        name="radiobuttongroup2"
      >
        <n-radio-button
          v-for="type in optionAdType"
          :key="type.value"
          :value="type.value"
          :disabled="type.disabled"
          :label="type.label"
        />
      </n-radio-group>
    </div>
  </n-form-item>
</template>
