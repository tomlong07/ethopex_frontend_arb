<script setup lang="ts">
import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import Close from '@/assets/icons/Close.vue'

import BackPage from '@/components/common/BackPage.vue'

import AddDomainConfig from '@/components/domain_config/AddDomainConfig.vue'
import ConfigDomain from '@/components/domain_config/ConfigDomain.vue'
import ConfigDomainBackup from '@/components/domain_config/ConfigDomainBackup.vue'
import Condition from '@/components/domain_config/Condition.vue'
import CampainDomainConfig from '@/components/domain_config/CampainDomainConfig.vue'
import ShowModalBulk from '@/components/domain_config/ShowModalBulk.vue'
import useDomainConfigStore from '@/store/details/useDomainConfigStore'
import useDomainConfigNavStore from '@/store/details/useDomainConfigNavStore'
import { newColumnsDefKeywordSet } from '@/constants/keywordSet'
import ShowModalLogs from '@/components/domain_config/ShowModalLogs.vue'
import ShowLogs from '@/components/domain_config/ShowLogs.vue'
import { ctr_domain } from '@/services/ctr_domain'
import ConfigAB from '@/components/domain_config/ConfigAB.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import NavBarDomainConfig from '@/components/domain_config/NavBarDomainConfig.vue'
import { DC } from '@/enum/domain_config'
import { themeAlpine } from 'ag-grid-community'
import { useLocale } from '@/lang/messages'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const domainConfig = useDomainConfigStore()
const domainConfigNav = useDomainConfigNavStore()
const columnsDef2 = newColumnsDefKeywordSet({
  id: 0.2,
  name: 0.6,
  status: 0.2,
})
const isSubmitModalLoading = ref<boolean>(false)
onMounted(async () => {
  domainConfig.preIdRoute()
  domainConfig.isLoading = true
  if (domainConfig.modeData.isEditPage()) {
    domainConfig.isDisable = true
    const result = await ctr_domain.DomainConfigByID(domainConfig.modeData.id)
    if (result?.status) {
      domainConfig.dataConfig = result.data

      //Cho khỏi hiển thị số 0
      if (!domainConfig.dataConfig.domain_id_backup) {
        domainConfig.dataConfig.domain_id_backup = undefined
      }

      if (domainConfig.dataConfig.domain_id) {
        await domainConfig.getListAdsenseAccountByDomainIds(
          domainConfig.dataConfig.domain_id
        )
      }

      if (domainConfig.dataConfig.domain_id_backup) {
        await domainConfig.getListAdsenseAccountByDomainIdsBackup(
          domainConfig.dataConfig.domain_id_backup
        )
      }

      const ab = domainConfig.dataConfig.config_ab_test || []
      const accountIds = ab.map((i: any) => i.account_adsense).filter(Boolean)

      if (!domainConfig.dataConfig.config_ab_test)
        domainConfig.dataConfig.config_ab_test = []

      if (accountIds.length) {
        await domainConfig.prefetchDomainForAdsenses(accountIds)
      }
      domainConfig.isDisable = false
    }
    domainConfig.getCampaignsInDomainConfig()
  } else {
    domainConfig.isDisable = false
    domainConfig.clearDataDomainConfig()
  }

  domainConfig.isLoading = false
})

const submitForm = async () => {
  if (domainConfig.dataConfig.name == '') {
    window.message.error(`Submit failed: Name is required`)
    domainConfig.isSubmitBtnLoading = false
    return
  }

  if (domainConfig.modeData.isAddPage()) {
    domainConfig.isSubmitBtnLoading = true

    const result = await ctr_domain.AddDomainConfig(domainConfig.dataConfig)
    if (result?.status) {
      window.message.success(`Add ${domainConfig.name} successfully`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value?.page_list })
      }
    }
  }
  if (domainConfig.modeData.isEditPage()) domainConfig.showModalLogs = true

  domainConfig.isSubmitBtnLoading = false
}

const editDomainConfigByModal = async () => {
  isSubmitModalLoading.value = true
  await domainConfig.editDomainConfig()
  domainConfig.showModal = false
  isSubmitModalLoading.value = false
  domainConfig.isSubmitBtnLoading = false
}

const searchTimeout = ref<ReturnType<typeof setTimeout>>()

const handleDomainSearch = async () => {
  domainConfig.isLoadingCamp = true
  if (searchTimeout.value) clearTimeout(searchTimeout.value)

  searchTimeout.value = setTimeout(async () => {
    await domainConfig.getCampaignsInDomainConfig()
    domainConfig.isLoadingCamp = false
  }, 500)
}
//
watch(
  () => [
    domainConfig.dataConfig.ad_accounts,
    domainConfig.dataConfig.traffic_sources,
    domainConfig.dataConfig.labels,
  ],
  (newValues, oldValues) => {
    if (domainConfig.isLoading) return
    handleDomainSearch()
  }
)
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>
<template>
  <div class="flex flex-col bg-base pr-8 flex-1 main_head">
    <div class="h-screen flex flex-col bg-base mt-4 flex-1 gap-4">
      <div v-if="domainConfig.isLoading">
        <Skeleton />
      </div>

      <div class="flex gap-4" v-else>
        <div class="flex w-[74px] lg:w-[280px] flex-none relative">
          <NavBarDomainConfig />
        </div>
        <div class="flex-1 content w-full max-w-screen-2xl mb-[60px] mx-auto">
          <div class="flex justify-between items-center mb-3">
            <BackPage
              v-if="feSettings?.page_list"
              :url="feSettings?.page_list"
              :name="domainConfig.name"
            />
          </div>

          <div class="grid gap-3 grid-cols-1">
            <div class="p-0 xl:w-full flex flex-col">
              <div class="flex flex-col flex-1 lg:mb-20">
                <div class="campaign">
                  <!-- Modal Warning -->
                  <n-modal v-model:show="domainConfig.showModal">
                    <n-card
                      style="width: 80vw"
                      title="Warning"
                      size="huge"
                      role="dialog"
                      aria-modal="true"
                      class="card-flex-gap-4"
                    >
                      <template #header-extra>
                        <n-icon
                          size="26"
                          class="button-close cursor-pointer"
                          @click="domainConfig.showModal = false"
                        >
                          <Close />
                        </n-icon>
                      </template>

                      <div class="flex flex-col gap-2">
                        {{ Message.conf_dm_conf }}
                        <span>
                          <n-tag type="success">
                            Total: {{ domainConfig.dataCampaignModal.length }}
                          </n-tag>
                        </span>
                      </div>

                      <div
                        style="max-height: 500px"
                        class="overflow-x-auto border"
                      >
                        <ag-grid-vue
                          :theme="customTheme"
                          dom-layout="autoHeight"
                          :column-defs="columnsDef2"
                          :row-data="domainConfig.dataCampaignModal"
                        />
                      </div>

                      <div class="flex">
                        <span class="ml-auto flex gap-4">
                          <n-button
                            size="medium"
                            @click="domainConfig.showModal = false"
                          >
                            Cancel
                          </n-button>
                          <n-button
                            color="#f43f5e"
                            size="medium"
                            type="success"
                            :loading="isSubmitModalLoading"
                            @click="editDomainConfigByModal"
                          >
                            Confirm
                          </n-button>
                        </span>
                      </div>
                    </n-card>
                  </n-modal>

                  <ShowModalLogs />

                  <!-- Tab Basic: Config Detail -->
                  <div
                    v-if="domainConfigNav.isStep(DC.DOMAIN_CONFIG)"
                    class="flex flex-col gap-4"
                  >
                    <AddDomainConfig />
                    <ConfigDomain />
                    <ConfigDomainBackup />
                    <ConfigAB />
                    <Condition />
                    <ShowModalBulk />
                  </div>

                  <!-- Tab Campaigns -->
                  <div v-if="domainConfigNav.isStep(DC.CAMPAIGNS_USED)">
                    <CampainDomainConfig />
                  </div>

                  <!-- Tab Logs -->
                  <div v-if="domainConfigNav.isStep(DC.LOGS)">
                    <ShowLogs />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <div class="fixed bottom-0 left-0 right-0 z-[11] bg-white border-t p-2">
      <div class="flex gap-3 justify-end w-full px-4">
        <n-button
          v-if="!domainConfigNav.isFirstStep"
          @click="domainConfigNav.navigate(-1)"
        >
          Back
        </n-button>

        <n-button
          v-if="!domainConfigNav.isLastStep"
          type="success"
          size="medium"
          @click="domainConfigNav.navigate(1)"
        >
          Next
        </n-button>

        <n-button
          v-if="
            domainConfig.modeData.isEditPage() ||
            (domainConfig.modeData.isAddPage() && domainConfigNav.isLastStep)
          "
          color="#f43f5e"
          size="medium"
          type="success"
          :disabled="domainConfig.isDisable"
          :loading="domainConfig.isSubmitBtnLoading"
          @click="submitForm"
        >
          Submit
        </n-button>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }

  .dynamic-button {
    padding: 0 0.5rem;
  }
}

/* Màu sắc cho nút khi hover */
.custom-radio-button.include:hover {
  background-color: #82b4fd; /* Màu xanh lá khi chọn "Include" */
}

.custom-radio-button.exclude:hover {
  background-color: #f88c9d; /* Màu đỏ khi chọn "Exclude" */
}

/* Đổi màu khi được chọn cho Include */
.n-radio-button--checked.include {
  background-color: #82b4fd; /* Màu xanh lá khi chọn "Include" */
  color: #ffffff;
}

/* Đổi màu khi được chọn cho Exclude */
.n-radio-button--checked.exclude {
  background-color: #f88c9d; /* Màu đỏ khi chọn "Exclude" */
  color: #ffffff;
}

/* Kiểu dáng chung khi được chọn */
.n-radio-button--checked {
  border-color: transparent;
  font-weight: bold;
}
</style>
