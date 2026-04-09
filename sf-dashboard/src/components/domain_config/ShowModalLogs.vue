<script setup lang="ts">
import { ctr_domain } from '@/services/ctr_domain'
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
const domainConfig = useDomainConfigStore()

const handleSubmitLogs = async () => {
  if (!domainConfig.dataConfig.logs) {
    domainConfig.showModalLogs = true
    window.message.error('Log is required')
    return
  }
  domainConfig.showModalLogs = false
  domainConfig.isSubmitBtnLoading = true
  if (domainConfig.modeData.isEditPage()) {
    const result = await ctr_domain.CheckUpdateDomainConfig(
      domainConfig.dataConfig
    )

    if (result?.status) {
      if (result?.data?.length) {
        domainConfig.dataCampaignModal = result?.data || []
        domainConfig.showModal = true
      } else {
        await domainConfig.editDomainConfig()
        const result = await ctr_domain.DomainConfigByID(
          domainConfig.modeData.id
        )
        if (result?.status) {
          domainConfig.dataConfig = result.data
          if (!domainConfig.dataConfig.domain_id_backup) {
            domainConfig.dataConfig.domain_id_backup = undefined
          }
        }
      }
    }
  }
  domainConfig.isSubmitBtnLoading = false
}
</script>

<template>
  <n-modal v-model:show="domainConfig.showModalLogs">
    <n-card
      style="width: 800px"
      title="Enter your logs"
      role="dialog"
      aria-modal="true"
    >
      <n-input
        type="textarea"
        v-model:value="domainConfig.dataConfig.logs"
        placeholder="Please Input..."
        rows="15"
      />
      <div class="flex justify-end gap-3 mt-4">
        <n-button @click="domainConfig.showModalLogs = false">Cancel</n-button>
        <n-button type="primary" @click="handleSubmitLogs">OK</n-button>
      </div>
    </n-card>
  </n-modal>
</template>
