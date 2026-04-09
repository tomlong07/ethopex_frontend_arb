<script setup lang="ts">
import { ctr_account } from '@/services/ctr_account'
import { useTemplateV2 } from '@/store/templateV2Store'
const templateV2Store = useTemplateV2(helper.truePath())()

const isSubmmiting = ref(false)
const isDisabled = ref(false)

const addSync = async () => {
  if (!templateV2Store.asyncConfigs.actionBlackList) return
  isSubmmiting.value = true
  isDisabled.value = true

  const result = await ctr_account.SyncBlackListGoogleAds(
    templateV2Store.asyncConfigs.actionBlackList
  )

  if (result?.status) {
    window.message.success('Sync Blacklist Google job was added successfully.')
  }
  isSubmmiting.value = false

  await helper.sleep(5000)

  isDisabled.value = false
}
</script>

<template>
  <n-button
    color="#f43f5e"
    size="small"
    class="mr-4"
    :loading="isSubmmiting"
    :disabled="isDisabled"
    @click="addSync()"
  >
    Sync Blacklist
  </n-button>
</template>
