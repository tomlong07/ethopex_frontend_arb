<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Round from '@/components/template-v2/cell/Round.vue'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const copyUrlBackup = () => {
  if (!props.params?.data?.url_backup) {
    window.message.warning('No backup URL available!')

    return
  }
  helper.copyText(props.params?.data?.url_backup)
  window.message.success('Copied!')
}
</script>
<template>
  <div class="flex items-center" v-if="props.params?.data?.url_backup">
    <Round :params="props.params" />
    <n-icon
      title="Copy URL Backup"
      class="cursor-pointer ml-2"
      :component="CopyOutline"
      @click="copyUrlBackup"
    />
  </div>
</template>
