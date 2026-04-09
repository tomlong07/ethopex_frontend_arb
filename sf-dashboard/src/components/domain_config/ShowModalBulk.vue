<template>
  <n-modal v-model:show="domainConfig.showModalBulk">
    <n-card
      style="width: 500px; height: 500px"
      title="Bulk Entry"
      size="medium"
      role="dialog"
      aria-modal="true"
      class="card-flex-gap-4 flex flex-col"
    >
      <div class="flex-1 overflow-hidden">
        <n-input
          v-model:value="domainConfig.dataBulk"
          type="textarea"
          :autosize="{
            minRows: 10,
            maxRows: 10,
          }"
          class="h-full overflow-auto resize-none"
        />
      </div>
      <n-button class="ml-auto mt-2" color="#f43f5e" @click="submitBulk">
        Submit
      </n-button>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import useDomainConfigStore from '@/store/details/useDomainConfigStore'

const domainConfig = useDomainConfigStore()

const submitBulk = () => {
  domainConfig.dataConfig.ad_accounts = helper.stringToArray(
    domainConfig.dataBulk
  )
  domainConfig.showModalBulk = false
}
</script>
