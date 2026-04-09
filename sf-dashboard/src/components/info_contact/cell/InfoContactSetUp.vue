<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ref, computed, CSSProperties } from 'vue'
import { ctr_info_contact } from '@/services/ctr_info_contact'
import useInfoContact from '@/store/useInfoContact'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const infoContactStore = useInfoContact()
const rowData = computed(() => (props.params as any).data || {})
const rowId = computed(() => rowData.value?.id)
const localStatus = ref<string | null>(rowData.value?.set_up ?? null)

const isChanging = ref(false)

const changeStatus = async (value: string) => {
  const id = rowId.value
  if (!id) return

  isChanging.value = true
  const payload = {
    id,
    set_up: value,
  }

  const result = await ctr_info_contact.ChangeSetUp(payload)

  isChanging.value = false

  if (result.status) {
    localStatus.value = value

    props.params.data.set_up = value
    
    if (infoContactStore.selectedContact?.id === id) {
      infoContactStore.selectedContact.set_up = value
    }
    window.message.success('Set Up status updated successfully!')
  }
}

watch(
  () => infoContactStore.selectedContact,
  (val) => {
    if (val && val.id === rowId.value) {
      localStatus.value = val.set_up
    }
  }
)

const classNow = computed(() => {
  const option = infoContactStore.setupOptions.find(opt => opt.value === localStatus.value)
  const color = (option?.style as CSSProperties | undefined)?.color
  return color ? `select-option-${color}` : ''
})

</script>

<template>
  <div class="select-option-wrapper w-32" :class="classNow">
    <n-select
      v-model:value="localStatus"
      :options="infoContactStore.setupOptions"
      size="medium"
      :loading="isChanging"
      @update:value="changeStatus"
    />
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
