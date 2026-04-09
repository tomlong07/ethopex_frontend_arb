<script setup lang="ts">
import { ctr_report } from '@/services/ctr_report'
import { ctr_campaign } from '@/services/ctr_campaign'
import { useReportV2 } from '@/store/report/report-v2'
import { CellComponent } from 'tabulator-tables'
const reportStoreV2 = useReportV2(helper.truePath())()

const filter = computed(() => reportStoreV2.filter)
const groupBy = computed<string[]>(() => reportStoreV2.group_by)

const props = defineProps({
  cell: {
    type: Object as () => CellComponent,
    required: true,
  },
})
const data = ref(props.cell.getRow().getData())
const isActive = ref(data.value?.section?.active || 'off')
const isBlocked = ref(props.cell.getValue())

const is_disable = computed<boolean>(() => {
  return (
    !(
      groupBy.value.includes('section') && groupBy.value.includes('campaign')
    ) &&
    !data.value.campaign_name?.id &&
    filter.value.campaigns?.length !== 1
  )
})

const classBadge = computed<string>(() => {
  if (data.value?.traffic_source === 'tiktok') {
    return isActive.value === 'on' ? 'badge-success' : 'badge-danger'
  }

  return isBlocked.value ? 'badge-danger' : 'badge-success'
})

const textShow = computed<string>(() => {
  if (data.value?.traffic_source === 'tiktok') {
    return isActive.value === 'on' ? 'On' : 'Off'
  }

  return isBlocked.value ? 'Unblock' : 'Block'
})

const toggleBlockSection = async () => {
  if (is_disable.value) return
  let filterCampaignId = 0

  if (filter.value.campaigns?.length) {
    filterCampaignId = filter.value.campaigns[0] as unknown as number
  }

  const campaign = data.value.campaign_name
  const section = data.value.section
  const message = isBlocked.value
    ? `Are you sure you want to unblock ${campaign.name}?`
    : `Are you sure you want to block ${campaign.name}?`
  const confirm = window.confirm(message)

  if (!confirm) {
    window.message.info('Canceled')
    return
  }

  if (data.value?.traffic_source === 'tiktok') {
    const newStatus = isActive.value === 'on' ? 'off' : 'on'

    const payload = {
      ad_group_id: section.id,
      campaign_id: campaign.id > 0 ? campaign.id : filterCampaignId,
      status: newStatus,
    }

    const result = await ctr_campaign.ChangeStatusAdGroup(payload)
    // const result = { status: true };
    if (result?.status) {
      isActive.value = newStatus
      window.message.success('TikTok block section updated successfully')
    }
  } else {
    const newStatus = isBlocked.value ? 'unblock' : 'block'

    const payload = {
      campaign_id: campaign.id > 0 ? campaign.id : filterCampaignId,
      section_id: section.id,
      section_name: section.name,
      type: newStatus,
    }

    const result = await ctr_report.BlockSection(payload)
    if (result?.status) {
      isBlocked.value = !isBlocked.value
      window.message.success('Block section was successful')
    }
  }
}
</script>

<template>
  <span
    class="badge"
    :class="[classBadge, is_disable ? 'opacity-50 cursor-not-allowed' : '']"
    @click="toggleBlockSection"
    >{{ textShow }}</span
  >
</template>
