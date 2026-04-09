<script lang="ts" setup>
import { prelanderConfigs } from '@/types/components/landing'

const props = defineProps({
  prelander_configs: {
    type: {} as () => prelanderConfigs,
    required: true,
  },
})

const optionInsertPosition = [
  { value: 'after', label: 'After', disabled: false },
  { value: 'before', label: 'Before', disabled: false },
]
</script>
<template>
  <n-form-item v-if="props.prelander_configs.ad_config">
    <template #label>
      <span>Insert Position</span>
    </template>

    <div class="flex items-center gap-3">
      <n-radio-group
        v-model:value="props.prelander_configs.ad_config.insert_type"
        name="radiobuttongroup3"
      >
        <n-radio-button
          v-for="item in optionInsertPosition"
          :key="item.value"
          :value="item.value"
          :disabled="item.disabled"
          :label="item.label"
        />
      </n-radio-group>
    </div>
  </n-form-item>
</template>
