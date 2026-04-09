<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Close from '@/assets/icons/Close.vue'
import { ctr_campaign } from '@/services/ctr_campaign'
import Checkmark from '@/assets/icons/Checkmark.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const changeStatusRef = ref<string>(props.params.data.status)

const handleChange = async (value: string) => {
  if (confirm(`Are you sure you want to change it?`)) {
    const payload = {
      ad_group_id: props.params.data.ad_group_id,
      campaign_id: (props.params as any).id_campaign,
      status: value,
    }
    const result = await ctr_campaign.ChangeStatusAdGroup(payload)
    if (result?.status) {
      window.message.success('Status changed successfully')

      changeStatusRef.value = value
    }
    return
  }
  window.message.info('Action was canceled')
}
</script>
<template>
  <div class="flex h-full items-center">
    <n-switch
      v-model:value="changeStatusRef"
      checked-value="on"
      unchecked-value="off"
      class="mr-2"
      :disabled="props.params.data.adgroup_id == ''"
      :on-update:value="handleChange"
    >
      <template #checked-icon>
        <n-icon :component="Checkmark" color="#121212" />
      </template>
      <template #unchecked-icon>
        <n-icon :component="Close" />
      </template>
    </n-switch>
  </div>
</template>
