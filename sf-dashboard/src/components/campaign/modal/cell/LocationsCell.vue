<template>
  <n-popover trigger="hover" placement="top">
    <template #trigger>
      <div
        class="block max-w-full whitespace-nowrap overflow-hidden text-ellipsis"
      >
        {{ display }}
      </div>
    </template>

    <div class="max-w-3xl">
      <div v-if="names && names.length">
        <span v-for="(n, i) in names" :key="i">
          {{ n }}<span v-if="i < names.length - 1">, </span>
        </span>
      </div>
      <div v-else>
        <span class="whitespace-normal">{{ display }}</span>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
const props = withDefaults(defineProps<{ params: any }>(), {
  params: undefined,
})

const data = props.params?.data || {}
const display = data.locations_display || data.locations || ''
const names: string[] = data.locations_names || []
</script>
