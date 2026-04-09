<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ICellRendererParams } from 'ag-grid-community'

import { ctr_landing_page } from '@/services/ctr_landing_page'
import { ColumnItem } from '@/types/state/general'
import { statusOptions } from '@/options/cell'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem

const changeStatusURL = options?.action

const status = ref(props.params.data.status)
const isChanging = ref(false)
const modalVisible = ref(false)
const rejectReason = ref('')
const pendingStatus = ref('')

const changeStatus = async (value: string) => {
  if (value === 'off') {
    pendingStatus.value = value
    modalVisible.value = true
    rejectReason.value = ''
    return
  }

  await performChangeStatus(value)
}

const performChangeStatus = async (value: string, reason?: string) => {
  if (!changeStatusURL || !props.params.data.id) return

  isChanging.value = true

  const payload = {
    id: props.params.data.id,
    status: value,
    reason: value === 'off' ? reason || '' : '',
  }

  const result = await ctr_landing_page.ChangeStatusV2(changeStatusURL, payload)

  isChanging.value = false

  if (result?.status) {
    status.value = value
    window.message.success('Change status successfully.')
    modalVisible.value = false
    const rowNode = props.params.node
    rowNode.setData({
      ...rowNode.data,
      reason: rejectReason.value,
      status: status.value,
    })
  }
}

const confirmReject = async () => {
  if (!rejectReason.value.trim()) {
    window.message.warning('Please enter a rejection reason.')
    return
  }

  await performChangeStatus(pendingStatus.value, rejectReason.value.trim())
}

const classNow = computed(() => {
  switch (status.value) {
    case 'on':
      return 'select-option-green'
    case 'off':
      return 'select-option-red'
  }

  return ''
})

watch(modalVisible, (visible) => {
  if (visible) {
    rejectReason.value = props.params.data?.reason || ''
  } else {
    rejectReason.value = ''
  }
})
</script>

<template>
  <div class="select-option-wrapper w-28" :class="classNow">
    <n-select
      :value="status"
      :options="statusOptions"
      size="medium"
      :loading="isChanging"
      :on-update:value="changeStatus"
      :disabled="!changeStatusURL"
    />
  </div>

  <n-modal
    v-model:show="modalVisible"
    :title="`${props.params.data.name} - ${props.params.data.id}`"
    preset="card"
    style="width: 500px"
  >
    <n-input
      v-model:value="rejectReason"
      class="mt-2"
      placeholder="Reason"
      type="textarea"
    />

    <template #footer>
      <div class="flex justify-end gap-2 mt-4">
        <n-button @click="modalVisible = false" :disabled="isChanging">
          Cancel
        </n-button>
        <n-button type="error" @click="confirmReject" :loading="isChanging">
          Submit
        </n-button>
      </div>
    </template>
  </n-modal>
</template>
