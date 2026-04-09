<script setup lang="ts">
const modelValue = defineModel<string>()
const name = 'Reward'

const switchValue = computed({
  get: () => modelValue.value === 'on',
  set: (val: boolean) => {
    modelValue.value = val ? 'on' : 'off'
  },
})
</script>

<template>
  <n-form-item
    label="Ad Type"
    :label-style="{ fontWeight: 'bold', fontSize: '13px' }"
  >
    <n-switch v-model:value="switchValue">
      <template #checked>
        <span class="text-xs">{{ name }}</span>
      </template>
      <template #unchecked>
        <span class="text-xs">{{ name }}</span>
      </template>
    </n-switch>
  </n-form-item>
</template>
