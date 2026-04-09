<script setup lang="ts">
import { ctr_report } from '@/services/ctr_report'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

onMounted(async () => {
  //fix page report vì nhu cầu đang cần lấy profile của page report
  const result = await ctr_report.ReportProfiles('/')

  templateV2Store.profileOptions = result?.data || []
})
</script>

<template></template>
