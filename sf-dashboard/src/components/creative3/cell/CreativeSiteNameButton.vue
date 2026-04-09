<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { SelectOption } from 'naive-ui'
import { ColumnItem } from '@/types/state/general'
import { ctr_creative } from '@/services/ctr_creative'
import { SiteNameStatus } from '@/options/creative'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const value = ref(props.params.data.status)

const handleUpdateValue = async (value: string, option: SelectOption) => {
  if (!urlAction) return

  const payload = {
    option: 'site_name',
    status: value,
    value: props.params.data.site_name,
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
      v-if="urlAction"
      v-model:value="value"
      size="small"
      :options="SiteNameStatus"
      @update:value="handleUpdateValue"
    />
  </div>
</template>
