<script setup lang="ts">
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { ICellRendererParams } from 'ag-grid-community'
import { NPopover } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const handleEdit = async () => {
  window.router.push({ path: `/postback/edit/${props.params.data.id}` })
}

</script>

<template>
  <div class="flex h-full items-center gap-2">
    <NPopover placement="bottom" trigger="hover">
      <template #trigger>
        <div
          class="w-[24px] h-[24px] cursor-pointer flex items-center justify-center"
          @click="handleEdit"
        >
          <Settings20Regular :size="22" />
        </div>
      </template>
      <span>Edit</span>
    </NPopover>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
