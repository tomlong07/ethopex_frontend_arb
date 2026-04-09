<script setup lang="ts">
import { CellComponent } from 'tabulator-tables'
import { railStyle } from '@/utils/styleHelper'

import { ctr_campaign } from '@/services/ctr_campaign'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const active = ref('off')

try {
  active.value = props.cell.getValue().status
} catch {}

const isLoading = ref(false)

const onClick = async () => {
  const newStatus = active.value === 'on' ? 'off' : 'on'

  const message = `Are you sure you want to change status to ${newStatus}?`
  const confirm = window.confirm(message)

  if (!confirm) return

  isLoading.value = true

  const loading = window.message.loading('Changing is on process. Please wait!')

  const config = {
    id: props.cell.getRow().getData().campaign_name.id,
    status: newStatus,
  }

  const result = await ctr_campaign.ChangeStatus(config)
  if (result?.status) {
    active.value = newStatus

    window.message.success('Status updated successfully')
  }

  loading.destroy()

  isLoading.value = false
}
</script>
<template>
  <n-switch
    :rail-style="railStyle"
    :value="active"
    :on-update:value="onClick"
    checked-value="on"
    unchecked-value="off"
    :loading="isLoading"
  />
</template>
