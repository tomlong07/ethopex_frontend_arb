<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1 items-center">
    <div
      class="h-screen flex flex-col bg-base my-12 flex-1 gap-4 w-full xl:w-[600px] 2xl:w-[768px]"
    >
      <BackPage
        :url="feSettings?.page_list"
        :name="name"
        v-if="feSettings?.page_list"
      />

      <Skeleton v-if="usePromtRule.isLoading" />

      <n-grid x-gap="14" y-gap="14" cols="1" v-else>
        <n-gi class="flex flex-col gap-4">
          <n-card class="card-flex-gap-4">
            <NamePromptRule />
            <ContentPromptRule />
          </n-card>
        </n-gi>
      </n-grid>

      <div class="flex flex-row-reverse sticky bottom-0 p-2">
        <div class="flex items-center gap-4">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="usePromtRule.isLoading"
            :loading="usePromtRule.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
import ContentPromptRule from '@/components/prompt_rule/ContentPromptRule.vue'
import NamePromptRule from '@/components/prompt_rule/NamePromptRule.vue'
import ctr_prompt_rule from '@/services/ctr_prompt_rule'
import promptRuleStore from '@/store/details/promptRuleStore'
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const name = 'prompt rule'
const usePromtRule = promptRuleStore()
const id = Number(window.route.params.id || 0)
const isAddPage = computed(() => id === 0)
const isEditPage = computed(() => !isAddPage.value)

onMounted(async () => {
  usePromtRule.isLoading = true
  if (isEditPage.value) {
    const res = await ctr_prompt_rule.GetByID(id)
    usePromtRule.dataConfig = res.data
  } else {
    usePromtRule.initializeData()
  }
  usePromtRule.isLoading = false
})

const submitForm = async () => {
  usePromtRule.isSubmitBtnLoading = true
  if (isAddPage.value) {
    const result = await ctr_prompt_rule.Add(usePromtRule.dataConfig)
    if (result?.status) {
      window.message.success(`Submit success!`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }
  if (isEditPage.value) {
    const result = await ctr_prompt_rule.Update(usePromtRule.dataConfig)
    if (result?.status) window.message.success(`Update success!`)
  }
  usePromtRule.isSubmitBtnLoading = false
}
</script>
