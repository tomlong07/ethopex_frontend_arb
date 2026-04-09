<script setup lang="ts">
import Submit from '@/assets/icons/Submit.vue'
import { ctr_report } from '@/services/ctr_report'
import { NIcon, NInputNumber, NButton } from 'naive-ui'
import { CellComponent } from 'tabulator-tables'

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})

const value = props.cell.getValue()
const data = props.cell.getRow().getData()

let percentValue = 0
let cpcValue = 0

try {
  cpcValue = Number(data.campaign_name.cpc.toFixed(2))
  percentValue = Number(value.percent.toFixed(2))
} catch {}

const percentRef = ref(percentValue)
const cpcRef = computed(() => {
  return cpcValue + (cpcValue * percentRef.value) / 100
})

const is_disable = computed(() => {
  return value ? false : true
})

const changeCPC = async () => {
  if (is_disable.value) return

  const message = `Are you sure you want to change CPC for ${data.campaign_name?.name} ? `
  const confirm = window.confirm(message)

  if (confirm) {
    const payload = {
      cpc_adjustment: percentRef.value,
      section_id: data.section?.id,
      section_name: data.section?.name,
      traffic_source_id: data.campaign_name?.traffic_source_id,
    }

    const result = await ctr_report.ChangeBidSection(payload)
    if (result?.status) {
      percentRef.value = percentValue
      window.message.success('Bid section updated successfully')
    }
  } else {
    window.message.info('Bid section update canceled')
  }
}
</script>
<template>
  <div :class="{ 'opacity-50': is_disable }" class="flex flex-col">
    <div class="flex w-40 gap-2">
      <n-input-number
        size="small"
        v-model:value="percentRef"
        :min="-200"
        :max="1000"
      >
        <template #suffix> % </template>
      </n-input-number>
      <n-button size="small" type="success" @click="changeCPC">
        <template #icon>
          <n-icon
            :component="Submit"
            color="green"
            size="18"
          ></n-icon> </template
      ></n-button>
    </div>
    <span class="cpcAdjustment--label text-xs">{{
      `CPC is $${cpcRef.toFixed(2)}`
    }}</span>
  </div>
</template>
