<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ctr_info_contact } from '@/services/ctr_info_contact'
import { ref, computed } from 'vue'
import useInfoContact from '@/store/useInfoContact'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
  },
})

const status = ref<string>(props.params.data.status_approved)

const infoContactStore = useInfoContact()
const rowId = computed(() => props.params.data?.id)

const isChecked = computed(() => status.value === 'approved')

const handleChange = async (checked: boolean) => {
  const newStatus = checked ? 'approved' : 'not_approved'
  
  const payload = {
    id: props.params.data.id,
    status_approved: newStatus
  }

  const result = await ctr_info_contact.ChangeStatusApproved(payload)

  if (result.status) {
    status.value = newStatus
    props.params.data.status_approved = newStatus
    
    if (infoContactStore.selectedContact?.id === props.params.data.id) {
      infoContactStore.selectedContact.status_approved = newStatus
    }

    window.message.success('Update status approved successfully!')
  }
}

watch(
  () => infoContactStore.selectedContact,
  (val) => {
    if (val && val.id === rowId.value) {
      status.value = val.status_approved
    }
  }
)
</script>

<template>
  <n-checkbox
    :checked="isChecked"
    @update:checked="handleChange"
  />
</template>