<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
const usePixelTriggersDetail = PixelTriggersDetail()
const isValidBulk = computed(() => {
  if (!usePixelTriggersDetail.multipleAccountIds) return false

  if (usePixelTriggersDetail.multipleAccountIds.length == 0) return false

  return true
})
const multipleAccountsPayload = computed(() => {
  const accounts = usePixelTriggersDetail.multipleAccountIds
    .split(/,|\n/) // Tách theo dấu phẩy hoặc xuống dòng
    .map((acc) => acc.trim()) // Loại bỏ khoảng trắng xung quanh mỗi domain
    .filter((acc) => acc) // Loại bỏ các domain trống
  const checkUnipue = [...new Set(accounts)] // Check trùng lặp
  if (checkUnipue.length != accounts.length) {
    window.message.warning(
      `${
        accounts.length - checkUnipue.length
      } duplicate accounts were detected!`
    )
  }
  return checkUnipue
})
const submitBulkAccounts = () => {
  if (!isValidBulk.value) {
    window.message.error(`Submit failed: Invalid account ids, please check!`)
    return
  }
  let temp = [] as SelectOption[]

  multipleAccountsPayload.value.forEach((element) => {
    temp.push({ id: element, name: element })
  })

  for (
    let index = 0;
    index < usePixelTriggersDetail.pixelConfig.triggers.length;
    index++
  ) {
    const element = usePixelTriggersDetail.pixelConfig.triggers[index]
    if (element.field == 'ad_account') {
      usePixelTriggersDetail.pixelConfig.triggers[index].value = temp.map(
        (a) => a.id
      ) as string[]
      break
    }
  }
  // rule.value.apply_campaigns = temp as campaignTypeInRule[];
  usePixelTriggersDetail.optionPixel.adAccounts = temp as SelectOption[]
  usePixelTriggersDetail.showModal = false
}
</script>
<template>
  <n-modal
    v-model:show="usePixelTriggersDetail.showModal"
    preset="dialog"
    :closable="false"
    type="success"
    :show-icon="false"
    style="width: 60vw"
  >
    <template #header>
      <div class="flex-row">
        <div>Account IDs bulk entry</div>
        <span class="text-sm font-normal"
          >Entries should be on separate commas or lines.</span
        >
      </div>
    </template>
    <div>
      <n-input
        v-model:value="usePixelTriggersDetail.multipleAccountIds"
        type="textarea"
        placeholder="Eg. 123456, 884628"
        rows="10"
      />
    </div>
    <template #action>
      <n-button @click="usePixelTriggersDetail.showModal = false">
        Cancel
      </n-button>
      <n-button type="error" @click="submitBulkAccounts"> Save </n-button>
    </template>
  </n-modal>
</template>
