<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import useFundsStore from '@/store/details/useFundsStore'

import SourceSelect from '@/components/funds/SourceSelect.vue'
import AmountInput from '@/components/funds/AmountInput.vue'
import NoteTextarea from '@/components/funds/NoteTextarea.vue'
import StatusSelect from '@/components/funds/StatusSelect.vue'
import { ctr_funds } from '@/services/ctr_funds'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const dataConfig = useFundsStore()

const isSubmitBtnLoading = ref(false)
const id = Number(window.route.params.id || 0)
if (id === 0) {
  dataConfig.clearData()
  dataConfig.clearOptionSource()
}

const name = `funds`

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  const idFund = window.router.currentRoute.value.params.id

  try {
    const ok = window.confirm('Are you sure you want to submit this form?')
    if (!ok) {
      window.message.info('Submit cancel!')
      return
    }

    if (idFund) {
      const result = await ctr_funds.Edit(dataConfig.fundsConfig)
      if (result?.status) {
        window.message.success(`Edit ${name} successfully!`)
      } else {
        dataConfig.infomationError = result
      }
      return
    }

    const result = await ctr_funds.Add(dataConfig.fundsConfig)
    if (result?.status) {
      window.message.success(`Add ${name} successfully!`)

      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }

      return
    } else {
      dataConfig.infomationError = result
    }
  } finally {
    isSubmitBtnLoading.value = false
  }
}
onMounted(async () => {
  const idFund = window.router.currentRoute.value.params.id
  if (idFund) {
    const res = await ctr_funds.GetByID(idFund)
    if (res.status) {
      dataConfig.fundsConfig = res.data
    }
  }

  getPermission()
})

const getPermission = async () => {
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  dataConfig.setPermissions(result?.data || {})
}
</script>
<template>
  <div class="min-h-screen flex flex-col bg-base px-3 flex-1 mt-4">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
          class="mb-6"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div class="flex justify-center">
              <n-card title="Funds">
                <n-form
                  :model="dataConfig.fundsConfig"
                  :rules="dataConfig.rules"
                  label-placement="left"
                  label-width="auto"
                >
                  <FundPublisherSelect
                    v-if="dataConfig.fundPermission.showPublisher"
                  />
                  <SourceSelect />
                  <AmountInput />
                  <NoteTextarea />
                  <StatusSelect
                    v-if="dataConfig.fundPermission.showPublisher"
                  />
                </n-form>
              </n-card>
            </div>
            <div class="flex flex-row-reverse sticky bottom-0 py-2">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :loading="isSubmitBtnLoading"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<style lang="scss"></style>
