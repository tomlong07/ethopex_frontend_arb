<template>
  <div>
    <div class="w-full font-bold text-xs flex items-center gap-2 mb-4">
      Ad Accounts
      <n-button
        class="w-20 ml-2"
        size="small"
        type="info"
        @click="openModalBulkEntry"
        >Bulk Entry</n-button
      >
      <n-button
        class="w-20"
        size="small"
        type="info"
        :disabled="!facebookConfig.dataConfig.ad_accounts?.length"
        @click="copySelectedAdAccounts"
        >Copy</n-button
      >
    </div>
    <div class="w-full">
      <n-transfer
        v-model:value="facebookConfig.dataConfig.ad_accounts"
        :loading="facebookConfig.selectData.loadingAdAccounts"
        :options="(facebookConfig.selectData.adAccounts) as TransferOption[]"
        source-filterable
        target-filterable
        :filter="customAdAccountFilter"
      />
    </div>
  </div>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
import { TransferOption } from 'naive-ui'

const facebookConfig = useFacebookViaStore()

const openModalBulkEntry = () => {
  facebookConfig.modalManager.dataModal = facebookConfig.dataConfig.ad_accounts
    ? facebookConfig.dataConfig.ad_accounts.join(',')
    : ''
  facebookConfig.modalManager.showModal = true
}
const copySelectedAdAccounts = () => {
  let copyAdAccounts = helper.clone(facebookConfig.dataConfig.ad_accounts) || []
  for (let index = 0; index < copyAdAccounts.length; index++) {
    const element = copyAdAccounts[index]
    if (element.includes('act_')) {
      copyAdAccounts[index] = element.replace('act_', '')
    }
  }

  helper.copyText(copyAdAccounts.join('\n'))
  window.message.success('Copied!')
}
const customAdAccountFilter = (
  pattern: string,
  option: TransferOption,
  from: 'source' | 'target'
) => {
  const lowerCasedPattern = pattern.toLowerCase()
  let arrayPattern = []

  if (lowerCasedPattern.includes(',') || lowerCasedPattern.includes('\n')) {
    arrayPattern = helper.stringToArray(lowerCasedPattern)
  } else {
    arrayPattern = [lowerCasedPattern]
  }

  try {
    for (let index = 0; index < arrayPattern.length; index++) {
      if (
        String(option.label).toLowerCase().includes(arrayPattern[index]) ||
        String(option.value).toLowerCase().includes(arrayPattern[index])
      ) {
        return true
      }
    }
    return false
  } catch {}
  return false
}
</script>
