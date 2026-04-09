<script setup lang="ts">
const props = defineProps({
  data: {
    type: Object as () => any,
    required: true,
  },
})

const name =
  props.data?.first_name || props.data?.last_name
    ? `${props.data.first_name} ${props.data.last_name}`
    : 'Unknown Name'
</script>

<template>
  <span v-if="!props.data?.email">-</span>

  <div v-else class="flex flex-col overflow-hidden">
    <a
      :href="`/?plk=${props.data?.plk}&colsP=action_camp`"
      target="_blank"
      class="text-blue-link overflow-hidden text-ellipsis"
      >{{ name }}</a
    >
    <span class="text-xs overflow-hidden text-ellipsis">{{
      props.data?.email
    }}</span>
  </div>
</template>
