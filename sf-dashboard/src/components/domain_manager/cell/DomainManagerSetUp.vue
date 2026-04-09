<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ref, computed } from 'vue'
import { ctr_domain } from '@/services/ctr_domain'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
  },
})

const status = ref<string>(props.params.data.set_up)
const isChecked = computed(() => status.value === 'approved')

const handleChange = async (checked: boolean) => {
  const newStatus = checked ? 'approved' : 'not_approved'
  
  const payload = {
    id: props.params.data.id,
    set_up: newStatus
  }

  const result = await ctr_domain.ChangeStatusSetup(payload)

  if (result.status) {
    status.value = newStatus
    props.params.data.set_up = newStatus

    window.message.success('Update status Set Up successfully!')
  }
}
</script>

<template>
  <n-checkbox
    :checked="isChecked"
    @update:checked="handleChange"
  />
</template>