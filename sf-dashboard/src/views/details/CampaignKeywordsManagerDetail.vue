<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
        />

        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div v-show="isLoading">
              <Skeleton />
            </div>

            <div v-if="!isLoading" class="flex mt-6">
              <n-card :title="`${textShow} ${name}`" class="card-flex-gap-4">
                <div class="mx-auto bg-white sm:w-full">
                  <div class="space-y-6">
                    <NameKeywords />
                    <StatusKeywords />
                    <DomainKeywords />
                    <KeywordsCampaign />
                  </div>
                </div>
                <template #footer>
                  <div class="flex justify-end">
                    <n-button
                      @click="submitForm"
                      :disable="campaignKeywordsStore.isSubmitBtnLoading"
                      :loading="campaignKeywordsStore.isSubmitBtnLoading"
                      class="button-apply"
                      color="#f43f5e"
                    >
                      Submit
                    </n-button>
                  </div>
                </template>
              </n-card>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import { campaignKeywordsManagerStore } from '@/store/details/campaignKeywordsManagerStore'
import ctr_campaign_keywords_manager from '@/services/ctr_campaign_keywords_manager'
import KeywordsCampaign from '@/components/campaign_keywords/KeywordsCampaign.vue'
import NameKeywords from '@/components/campaign_keywords/NameKeywords.vue'
import StatusKeywords from '@/components/campaign_keywords/StatusKeywords.vue'
import DomainKeywords from '@/components/campaign_keywords/DomainKeywords.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { KeywordCampaign } from '@/types/components/campaignkeywords'
import { ONOFF } from '@/enum/campaign'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const name = 'Campaign Keywords Manager'
const campaignKeywordsStore = campaignKeywordsManagerStore()
const id = Number(window.route.params.id || 0)
const isLoading = ref<boolean>(true)
const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => {
  return !isAddPage.value
})

const textShow = computed<string>(() => {
  return isAddPage.value ? 'Add' : 'Edit'
})

onMounted(async () => {
  isLoading.value = true
  campaignKeywordsStore.clearData()

  if (isEditPage.value) {
    const result = await ctr_campaign_keywords_manager.GetByID(id)
    if (result.status && result.data) {
      campaignKeywordsStore.campaignKeyword = result.data
      const campaignIds =
        result.data.keyword_campaigns?.map(
          (item: KeywordCampaign) => item.campaign
        ) || []
      campaignKeywordsStore.selectedCampaignIds = campaignIds
    } else {
      campaignKeywordsStore.clearData()
    }
  }

  isLoading.value = false
})

const trimInputs = () => {
  if (campaignKeywordsStore.campaignKeyword.name) {
    campaignKeywordsStore.campaignKeyword.name =
      campaignKeywordsStore.campaignKeyword.name.trim()
  }

  if (campaignKeywordsStore.campaignKeyword.domain) {
    campaignKeywordsStore.campaignKeyword.domain =
      campaignKeywordsStore.campaignKeyword.domain.trim()
  }

  if (campaignKeywordsStore.campaignKeyword.keyword_campaigns) {
    campaignKeywordsStore.campaignKeyword.keyword_campaigns.forEach(
      (item: KeywordCampaign) => {
        item.keyword = item.keyword.trim()
        item.keyword_prelander = item.keyword_prelander.trim()
      }
    )
  }
}

const isValidDomain = (domain: string): boolean => {
  if (!domain) return false

  const domainRegex =
    /^([a-zA-Z0-9]([a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/
  return domainRegex.test(domain.trim())
}

const validatePrelanderFields = (): boolean => {
  if (!isValidDomain(campaignKeywordsStore.campaignKeyword.domain)) {
    window.message.error(
      'Please enter a valid domain format (e.g., example.com)'
    )
    return false
  }

  const hasInvalidItem =
    campaignKeywordsStore.campaignKeyword.keyword_campaigns.some(
      (item: KeywordCampaign) =>
        item.status_prelander === ONOFF.ON &&
        (!item.keyword_prelander || !item.campaign)
    )

  if (hasInvalidItem) {
    window.message.warning(
      'Please fill in all "Keyword Prelander" and "Campaign" fields for active prelanders.'
    )
    return false
  }

  return true
}
const submitForm = async () => {
  // Trim tất cả inputs trước khi validate
  trimInputs()

  const ok = validatePrelanderFields()

  if (!ok) return

  campaignKeywordsStore.isSubmitBtnLoading = true

  if (isEditPage.value) {
    try {
      const result = await ctr_campaign_keywords_manager.Update(
        id,
        campaignKeywordsStore.campaignKeyword
      )
      if (result?.status) window.message.success(`Edit ${name} successfully`)
    } catch {
      window.message.error(
        'An error occurred while editing the keyword campaign.'
      )
    }
  }

  if (isAddPage.value) {
    try {
      const result = await ctr_campaign_keywords_manager.Add(
        campaignKeywordsStore.campaignKeyword
      )
      if (result?.status) {
        window.message.success(`Add ${name} successfully`)

        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value?.page_list })
        }
      }
    } catch {
      window.message.error(
        'An error occurred while adding the keyword campaign.'
      )
    }
  }

  campaignKeywordsStore.isSubmitBtnLoading = false
}
</script>
