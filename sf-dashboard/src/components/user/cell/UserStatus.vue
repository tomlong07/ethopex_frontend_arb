<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ref, computed } from 'vue'
import { ctr_user } from '@/services/ctr_user'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const isChanging = ref(false)
const statusValue = ref(props.params?.data.status ?? 'pending')

const STATUS_MAP = { approved: 1, rejected: 3, pending: 2 }

const changeStatus = async (value: keyof typeof STATUS_MAP) => {
  if (!props.params?.setValue) return
  
  isChanging.value = true
  try {
    const result = await ctr_user.ChangeStatus({
      id: props.params.data.id,
      status: STATUS_MAP[value],
    })
    if (result.status) 
      window.message.success('Status changed successfully')
  } finally {
    isChanging.value = false
  }
}

const classNow = computed(() => 
  statusValue.value === 'approved' ? 'select-option-green' :
  statusValue.value === 'rejected' ? 'select-option-red' : ''
)

const optionsStatus = ref<SelectOption[]>([
  {
    label: 'Approved',
    value: 'approved',
    style: {
      color: 'green',
    },
  },
  {
    label: 'Rejected',
    value: 'rejected',
    style: {
      color: 'red',
    },
  },
  {
    label: 'Pending',
    value: 'pending',
  },
])
</script>
<template>
  <div class="select-option-wrapper w-28" :class="classNow">
    <n-select
      v-model:value="statusValue"
      :options="optionsStatus"
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
