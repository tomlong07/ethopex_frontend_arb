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

const infoContactStore = useInfoContact()
const rowId = computed(() => props.params.data?.id)
const contract = ref<string>(props.params.data.contract)

const isChecked = computed(() => contract.value === 'yes')

const handleChange = async (checked: boolean) => {
  const newContract = checked ? 'yes' : 'no'
  
  const payload = {
    id: props.params.data.id,
    contract: newContract
  }

  const result = await ctr_info_contact.ChangeContract(payload)

  if (result.status) {
    contract.value = newContract
    props.params.data.contract = newContract
    
    if (infoContactStore.selectedContact?.id === props.params.data.id) {
      infoContactStore.selectedContact.contract = newContract
    }
    window.message.success('Update contract successfully!')
  }
}

watch(
  () => infoContactStore.selectedContact,
  (val) => {
    if (val && val.id === rowId.value) {
      contract.value = val.contract
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