<template>
  <ul class="list-none list-inside pl-0 space-y-2">
    <li v-for="(item, index) in valueParser" :key="index">
      <strong>&#8729; {{ item.content || '' }}</strong>
      <ul
        v-if="Array.isArray(item.children) && item.children.length"
        class="pl-5 mt-1 text-sm leading-snug"
      >
        <li v-for="(child, childIndex) in item.children" :key="childIndex">
          - {{ child }}
        </li>
      </ul>
    </li>
  </ul>
</template>

<script setup lang="ts">
const props = defineProps({
  value: {
    type: String,
    required: true,
  },
})

const valueParser = computed<any>(() => {
  try {
    return JSON.parse(props.value)
  } catch (error) {
    console.error('Invalid JSON string ', error)
    return null
  }
})
</script>
