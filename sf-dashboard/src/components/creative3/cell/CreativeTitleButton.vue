<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { SelectOption } from 'naive-ui'
import { ColumnItem } from '@/types/state/general'
import { ctr_creative } from '@/services/ctr_creative'
import { TitleStatus } from '@/options/creative'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const value = ref(props.params.data.status)

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const handleUpdateValue = async (value: string, option: SelectOption) => {
  if (!urlAction) return
  const payload = {
    option: 'title',
    status: value,
    value: props.params.data.title,
    id: props.params.data.creative_id, //Thêm để log
  }
  const result = await ctr_creative.ChangeStatusOptionV2(urlAction, payload)
  if (result?.status) {
    window.message.success('Status updated successfully')
  }
}
const classNow = computed(() => {
  switch (value.value) {
    case 'approved':
      return 'select-option-green'
    case 'rejected':
      return 'select-option-red'
    case 'warning':
      return 'select-option-warning'
    default:
      return ''
  }
})
</script>
<template>
  <div class="w-32 select-option-wrapper" :class="classNow">
    <n-select
      class="items-center flex"
      v-model:value="value"
      :disabled="!urlAction"
      size="small"
      :options="TitleStatus"
      @update:value="handleUpdateValue"
    />
  </div>
</template>
