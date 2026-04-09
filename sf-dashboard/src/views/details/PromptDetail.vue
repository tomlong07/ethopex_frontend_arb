<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/SkeletonDetail.vue'
import { ModeClass } from '@/types/components/base'
import { promptType } from '@/types/components/prompt'

import PromptRule from '@/components/prompt_detail/PromptRule.vue'
import PromptSchemaResponse from '@/components/prompt_detail/PromptSchemaResponse.vue'
import PromtDetail from '@/store/details/PromptDetail'
import UsedMacros from '@/components/prompt_detail/UsedMacros.vue'
import { ctr_prompt } from '@/services/ctr_prompt'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import PromptWebSource from '@/components/prompt_detail/PromptWebSource.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import PromptMacrosLanding from '@/components/prompt_detail/PromptMacrosLanding.vue'
import PromptMacrosPrompt from '@/components/prompt_detail/PromptMacrosPrompt.vue'
import PromptModel from '@/components/prompt_detail/PromptModel.vue'
import PromptName from '@/components/prompt_detail/PromptName.vue'
import PromptPrompt from '@/components/prompt_detail/PromptPrompt.vue'
import PromptStatus from '@/components/prompt_detail/PromptStatus.vue'
import PromptDescriptions from '@/components/prompt_detail/PromptDescriptions.vue'
import PromptTest from '@/components/prompt_detail/PromptTest.vue'
import PromptVersion from '@/components/prompt_detail/PromptVersion.vue'
import ModalNewVersion from '@/components/prompt_detail/ModalNewVersion.vue'
import SendType from '@/components/prompt_detail/SendType.vue'
const usePromtDetail = PromtDetail()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

//Freeze lại tránh thay đổi các data này
const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

if (modeData.isAddPage()) {
  usePromtDetail.clearData()
  usePromtDetail.handleVersionOptions() //clear bỏ version options -> SPA nên sẽ bị lúc chuyển trang từ edit -> add
}
const submitForm = async () => {
  usePromtDetail.statusData.isSubmitBtnLoading = true
  if (modeData.isAddPage()) {
    const result = await ctr_prompt.Add(usePromtDetail.Payload())
    if (result?.status) {
      window.message.success(`Submit success!`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }
  if (modeData.isEditPage()) {
    const result = await ctr_prompt.Update(usePromtDetail.Payload())
    if (result?.status) window.message.success(`Update success!`)
  }
  usePromtDetail.statusData.isSubmitBtnLoading = false
}

const getPermission = async () => {
  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  usePromtDetail.setPermissions(result?.data || {})
}

onMounted(async () => {
  await getPermission()

  usePromtDetail.resetTabNow()
  usePromtDetail.selectData.getModelAI(modeData.id)
  usePromtDetail.statusData.isLoading = true
  if (modeData.isEditPage()) {
    const id = modeData.id
    const res = await ctr_prompt.GetByID(id)

    usePromtDetail.dataConfig = new promptType(res?.data || {})
    usePromtDetail.handleVersionOptions()

    if (usePromtDetail.isPrompt13) usePromtDetail.testData.text = ['']
  }
  usePromtDetail.statusData.isLoading = false
})

const readyToInit = computed(
  () =>
    !usePromtDetail.statusData.isLoading &&
    !usePromtDetail.selectData.loadingModel &&
    modeData.isEditPage()
)

watch(readyToInit, (ok) => {
  if (!ok) return // chỉ chạy khi đủ điều kiện

  if (!usePromtDetail.dataConfig.model) return

  const orginalConfigs = helper.clone(usePromtDetail.dataConfig.config)

  usePromtDetail.dataConfig.config = {} //Xóa hết để tránh dư thừa

  usePromtDetail.configsNow.forEach((key) => {
    if (orginalConfigs[key]) {
      //Lấy dữ liệu cũ nếu có
      usePromtDetail.dataConfig.config[key] = orginalConfigs[key]
    } else {
      // Bổ sung các trường thiếu nếu chưa có
      usePromtDetail.dataConfig.config[key] = ''
    }
  })
})
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base my-12 flex-1 gap-4">
      <BackPage
        :url="feSettings?.page_list"
        :name="usePromtDetail.statusData.name"
        v-if="feSettings?.page_list"
      />

      <div class="flex justify-center items-start">
        <div class="w-full max-w-[923px]">
          <Skeleton v-if="usePromtDetail.statusData.isLoading" />
          <n-grid x-gap="14" y-gap="14" cols="1" v-else>
            <n-gi class="flex flex-col gap-4">
              <n-card class="card-flex-gap-4">
                <n-tabs
                  type="line"
                  animated
                  v-model:value="usePromtDetail.tabNow"
                >
                  <n-tab-pane name="prompt" tab="Prompt">
                    <div class="flex flex-col gap-4">
                      <PromptName />

                      <PromptStatus />
                      <PromptVersion />
                      <PromptTest
                        v-if="
                          modeData.isEditPage() &&
                          usePromtDetail.permissionSettings.promptTest
                        "
                        :modeData="modeData"
                      />

                      <SendType
                        v-if="
                          modeData.isEditPage() &&
                          !!usePromtDetail.dataConfig.send_type
                        "
                      />

                      <PromptPrompt />

                      <PromptModel />
                      <PromptWebSource
                        v-if="usePromtDetail.isPerplexity"
                        v-model:value="usePromtDetail.dataConfig.web_source"
                      />

                      <PromptDescriptions />

                      <PromptMacrosPrompt />

                      <PromptMacrosLanding />

                      <PromptRule />

                      <PromptSchemaResponse />
                    </div>
                  </n-tab-pane>
                  <n-tab-pane
                    name="test"
                    tab="Test"
                    v-if="modeData.isEditPage()"
                  >
                    <div class="flex flex-col gap-4">
                      <UsedMacros /></div
                  ></n-tab-pane>
                </n-tabs>
              </n-card>
            </n-gi>
          </n-grid>
          <div
            class="flex flex-row-reverse sticky bottom-0 z-10 px-6 py-2"
            v-if="usePromtDetail.isTabPrompt"
          >
            <div class="flex items-center gap-4">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :disabled="usePromtDetail.statusData.isLoading"
                :loading="usePromtDetail.statusData.isSubmitBtnLoading"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </div>

          <ModalNewVersion />
        </div>
      </div>
    </div>
  </div>
</template>
