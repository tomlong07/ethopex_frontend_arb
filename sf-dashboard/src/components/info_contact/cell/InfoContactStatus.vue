<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'
import useInfoContact from '@/store/useInfoContact'
import { ref, computed, watch } from 'vue'
import { CSSProperties } from 'vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const infoContactStore = useInfoContact()
const options = (props.params as any).options as ColumnItem
const changeStatusURL = options?.action

const rowData = computed(() => (props.params as any).data || {})
const rowId = computed(() => rowData.value?.id)
const localStatus = ref<string | null>(rowData.value?.status ?? null)

const isChanging = ref(false)

const changeStatus = async (value: string) => {
  if (!changeStatusURL) return
  const id = rowId.value
  if (!id) return

  isChanging.value = true

  const result = await infoContactStore.changeStatus(
    id,
    value,
    changeStatusURL
  )

  isChanging.value = false

  if (result.success) {
    props.params.data.status = value
    localStatus.value = value
  }
}

watch(
  () => infoContactStore.selectedContact,
  (val) => {
    if (val && val.id == rowId.value) {
      localStatus.value = val.status
    }
  }
)

watch(
  () => infoContactStore.selectedContactStatus,
  (val) => {
    if (infoContactStore.selectedContact?.id == rowId.value && val != null) {
      localStatus.value = val
    }
  }
)

const classNow = computed(() => {
  const option = infoContactStore.statusOptions.find(opt => opt.value === localStatus.value)
  const color = (option?.style as CSSProperties | undefined)?.color
  
  return color ? `select-option-${color}` : ''
})

</script>

<template>
  <div class="select-option-wrapper w-28" :class="classNow">
    <n-select
      v-model:value="localStatus"
      :options="infoContactStore.statusOptions"
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
