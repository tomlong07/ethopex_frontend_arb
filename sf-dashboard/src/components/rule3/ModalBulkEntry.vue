<script setup lang="ts">
import useRuleStoreV3 from '@/store/details/ruleV3'

const ruleStoreV3 = useRuleStoreV3()

const modalText = computed(() => {
  if (ruleStoreV3.typeModal != '') {
    return helper.capitalizeFirstLetter(ruleStoreV3.typeModal)
  }

  return ''
})

const multipleEntriesPayload = computed(() => {
  return ruleStoreV3.multipleEntries
    .split(/,|\n/) // Tách theo dấu phẩy hoặc xuống dòng
    .map((text) => text.trim()) // Loại bỏ khoảng trắng xung quanh mỗi giá trị
    .filter((text) => text) // Loại bỏ các giá trị trống
})

const isValidBulkEntries = computed(() => {
  if (!ruleStoreV3.multipleEntries) return false

  //Nếu id campaigns không phải là số và typeModal là campaign -> báo sai
  //trường hợp section thì ko cần validate cái isOnlyNumber (vì section có cả text)
  if (
    !helper.isOnlyNumber(ruleStoreV3.multipleEntries) &&
    ruleStoreV3.typeModal === 'campaign'
  ) {
    return false
  }

  if (multipleEntriesPayload.value.length == 0) return false

  return true
})

const submitBulkEntries = () => {
  if (!isValidBulkEntries.value) {
    window.message.error(
      `Submit failed: Invalid ${modalText.value} ids, please check!`
    )
    return
  }

  switch (ruleStoreV3.typeModal) {
    case 'campaign':
      ruleStoreV3.ruleV3.apply_campaigns?.splice(0)
      multipleEntriesPayload.value.forEach((element) => {
        const campaignID = Number(element)
        ruleStoreV3.ruleV3.apply_campaigns?.push(campaignID)

        if (!ruleStoreV3.campaignMapName[campaignID]) {
          ruleStoreV3.campaignMapName[campaignID] = element
        }
      })

      break

    case 'origin_campaigns':
      ruleStoreV3.ruleV3.add_campaign.list_campaign_origin?.splice(0)

      multipleEntriesPayload.value.forEach((element) => {
        const campaignID = Number(element)
        ruleStoreV3.ruleV3.add_campaign.list_campaign_origin?.push(campaignID)

        if (!ruleStoreV3.campaignMapName[campaignID]) {
          ruleStoreV3.campaignMapName[campaignID] = element
        }
      })
      break

    case 'section':
      ruleStoreV3.ruleV3.apply_sections = multipleEntriesPayload.value
      break

    case 'user':
      const ids = multipleEntriesPayload.value
        ?.map((userValue) => {
          const option = ruleStoreV3.userOptions.find(
            (opt) => opt.email === userValue
          )
          return option?.id as number
        })
        .filter(Boolean) // loại bỏ undefined nếu không khớp
      ruleStoreV3.ruleV3.apply_user = ids || []
      break

    default:
      break
  }

  ruleStoreV3.showModal = false
}
</script>

<template>
  <n-modal
    v-model:show="ruleStoreV3.showModal"
    preset="dialog"
    :closable="false"
    type="success"
    :show-icon="false"
    style="width: 60vw"
  >
    <template #header>
      <div class="flex-row">
        <div>{{ modalText }} IDs bulk entry</div>
        <span class="text-sm font-normal"
          >Entries should be on separate commas or lines.</span
        >
      </div>
    </template>
    <div>
      <n-input
        v-model:value="ruleStoreV3.multipleEntries"
        type="textarea"
        placeholder="Eg. 123456, 884628"
        rows="10"
      />
    </div>
    <template #action>
      <n-button @click="ruleStoreV3.showModal = false"> Cancel</n-button>
      <n-button type="error" @click="submitBulkEntries"> Save</n-button>
    </template>
  </n-modal>
</template>
