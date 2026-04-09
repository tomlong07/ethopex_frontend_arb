<template>
  <n-card title="Configs (Backup)" class="rounded-md">
    <div class="space-y-6 my-2">
      <FloatingWrapper name="Domain (Backup)" rounded>
        <n-select
          v-model:value="domainConfig.dataConfig.domain_id_backup"
          filterable
          clearable
          :disabled="domainConfig.isLoading"
          :options="domainConfig.domainOptions"
          :on-update:value="handleChangeDomainBackup"
        />
      </FloatingWrapper>

      <FloatingWrapper name="Adsense Accounts (Backup)" rounded>
        <n-select
          v-model:value="domainConfig.dataConfig.adsense_accounts_backup"
          filterable
          multiple
          :disabled="
            domainConfig.isLoading || !domainConfig.dataConfig.domain_id_backup
          "
          :loading="isLoadingAdsenseAccountBackup"
          :options="domainConfig.adsenseAccountOptionsBackup"
        />
      </FloatingWrapper>
    </div>
  </n-card>
</template>
<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const domainConfig = useDomainConfigStore()

const isLoadingAdsenseAccountBackup = ref(false)

const handleChangeDomainBackup = (value: number) => {
  domainConfig.dataConfig.domain_id_backup = value
  domainConfig.dataConfig.adsense_accounts_backup = []

  domainConfig.getListAdsenseAccountByDomainIdsBackup(value)
}
</script>
