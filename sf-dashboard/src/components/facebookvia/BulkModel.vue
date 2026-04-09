<template>
  <n-modal v-model:show="facebookConfig.modalManager.showModal">
    <n-card
      style="width: 600px; height: 650px"
      :title="`Bulk Entry Ad Accounts`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="flex items-center">
        <n-input
          v-model:value="facebookConfig.modalManager.dataModal"
          placeholder="Label"
          type="textarea"
          :autosize="{
            minRows: 15,
            maxRows: 20,
          }"
        ></n-input>
      </div>

      <template #footer>
        <div class="flex justify-end">
          <n-button class="button-apply" color="#f43f5e" @click="addBulk()">
            Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
<script setup lang="ts">
import { useFacebookViaStore } from '@/store/details/useFacebookViaStore'
const facebookConfig = useFacebookViaStore()
const addBulk = () => {
  let newData = helper.stringToArray(facebookConfig.modalManager.dataModal)

  newData = newData.map((el: string) =>
    el.includes('act_') ? el : 'act_' + el
  )
  const uniqueArray = [...new Set(newData)]

  facebookConfig.dataConfig.ad_accounts = uniqueArray as string[]
  facebookConfig.modalManager.showModal = false
}
</script>
