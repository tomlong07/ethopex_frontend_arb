<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const src = ref(props.params.data.thumb)
</script>

<style>
.thumb-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 35px;
  overflow: hidden;
}

.thumb-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: 6px;
}
</style>
<template>
  <div class="thumb-container">
    <template v-if="src">
      <n-image
        class="thumb-img"
        :img-props="{ style: { objectFit: 'cover' } }"
        width="40"
        height="40"
        :src="src"
      />
    </template>
  </div>
</template>
