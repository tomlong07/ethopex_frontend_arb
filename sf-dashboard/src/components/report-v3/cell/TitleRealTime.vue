<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const value = props.cell.getValue()
</script>
<template>
  <div class="inline-flex items-center headerName gap-2">
    <span>{{ value }}</span
    ><svg
      class="svg-inline--fa fa-circle text-danger Blink"
      aria-hidden="true"
      focusable="false"
      data-prefix="fas"
      data-icon="circle"
      role="img"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 512 512"
      data-fa-i2svg=""
    >
      <path
        fill="currentColor"
        d="M256 512c141.4 0 256-114.6 256-256S397.4 0 256 0S0 114.6 0 256S114.6 512 256 512z"
      ></path>
    </svg>
  </div>
</template>
