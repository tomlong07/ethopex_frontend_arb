<script setup lang="ts">
import { optionsBlockAdType } from '@/options/landing_page';
import { SelectOption } from 'naive-ui'

const modelValue = defineModel<string>()
</script>
<template>
  <n-form-item
    label="Ad Type"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-select
      v-model:value="modelValue"
      :options="optionsBlockAdType"
      placeholder="Select Ad Type"
      clearable
    >
    </n-select>
  </n-form-item>
</template>
