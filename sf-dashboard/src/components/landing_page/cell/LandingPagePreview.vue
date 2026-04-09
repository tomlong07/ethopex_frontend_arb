<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useLayoutStore from '@/store/useLayoutStore'
import LandingPreviewPubpower from '@/components/landing_page/cell/LandingPreviewPubpower.vue'

const layoutStore = useLayoutStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
</script>
<template>
  <div
    v-if="props.params.data.demand === 'pubpower'"
    class="ct-landing flex items-center"
  >
    <LandingPreviewPubpower
      :layoutOptions="layoutStore.layoutLanding"
      :preview="props.params.data.preview"
      :aDiv="true"
    />
  </div>
  <div v-else-if="!props.params.data.demand" class="ct-landing flex">
    <div>&minus;</div>
  </div>
  <div v-else class="ct-landing flex">
    <a :href="`${props.params.data.preview}`" target="_blank">Link Preview</a>
  </div>
</template>
<style lang="scss">
.ct-landing a {
  color: #2196f3;
}
</style>
