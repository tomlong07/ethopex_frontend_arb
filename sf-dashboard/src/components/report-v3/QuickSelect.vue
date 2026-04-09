<script setup lang="ts">
const props = defineProps({
  field: {
    type: String,
    required: true,
  },
  rowData: {
    type: Object,
    required: true,
  },
})

const emit = defineEmits(['select'])

const handleClick = () => {
  emit('select', {
    field: props.field,
    rowData: props.rowData,
  })
}
</script>
<template>
  <button
    class="bg-blue-400 rounded stroke-white cursor-pointer"
    @click.stop="handleClick"
  >
    <svg
      width="13px"
      height="13px"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
      <g
        id="SVGRepo_tracerCarrier"
        stroke-linecap="round"
        stroke-linejoin="round"
      ></g>
      <g id="SVGRepo_iconCarrier">
        <path
          d="M6 12H18M12 6V18"
          stroke="#currentColor"
          stroke-width="2"
          stroke-linecap="round"
          stroke-linejoin="round"
        ></path>
      </g>
    </svg>
  </button>
</template>
