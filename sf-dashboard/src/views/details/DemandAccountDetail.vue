<script setup lang="ts">
import { adsenseAccountConfigPayload } from '@/types/components/types'

import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'

import { ctr_filter_v2 } from '@/services/ctr_filter_v2'

import NameAdsenseAccount from '@/components/demand_account/NameAdsenseAccount.vue'
import StatusAdsenseAccount from '@/components/demand_account/StatusAdsenseAccount.vue'
import GenerationAdsenseAccount from '@/components/demand_account/GenerationAdsenseAccount.vue'
import PubIdAdsenseAccount from '@/components/demand_account/PubIdAdsenseAccount.vue'
import ApiKeyAdsenseAccount from '@/components/demand_account/ApiKeyAdsenseAccount.vue'
import ChannelAdsenseAccount from '@/components/demand_account/ChannelAdsenseAccount.vue'
import GenerationAdsenseEdit from '@/components/demand_account/GenerationAdsenseEdit.vue'
import LayoutN2S from '@/components/demand_account/LayoutN2S.vue'
import LayoutS2S from '@/components/demand_account/LayoutS2S.vue'
import addsenseAcountStore from '@/store/details/useAdsenseStore'
import Plus from '@/assets/icons/Plus.vue'
import { ctr_account } from '@/services/ctr_account'
import AdsensePosition from '@/components/demand_account/AdsensePosition.vue'
import { ctr_layout } from '@/services/ctr_layout'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const feSettings = ref(new FeSettings())

useFeSettings(feSettings, window.route?.meta?.url as string)

const name = 'demand account'

const dataConfig = addsenseAcountStore()
const id = Number(window.route.params.id || 0)
const isAddPage = computed(() => id === 0)
const isEditPage = computed(() => !isAddPage.value)

const textShow = computed(() => (isAddPage.value ? 'Add' : 'Edit'))

const channelArr = computed(() => {
  return helper.stringToArray(dataConfig.adsenseAccountConfig.channels)
})

// State cho add tab
const selectedTrafficSources = ref<string[]>([])

const payload = computed<adsenseAccountConfigPayload>(() => {
  const obj: adsenseAccountConfigPayload = helper.clone(
    dataConfig.adsenseAccountConfig
  )
  obj.channels = channelArr.value

  // Lấy layout config từ active tabs
  const allTabsLayout = dataConfig.getAllTabsPayload()
  obj.layout_config = allTabsLayout

  return obj
})

const addLayoutOptions = async () => {
  const result = await ctr_layout.List({ run_on_network: 'on' })
  const newData = result?.data || []
  dataConfig.layoutOptions = newData.map((item: any) => ({
    value: item.id,
    name: item.name,
  }))
}

const isLayoutTabLoading = ref(false)

const fetchTrafficSource = async () => {
  isLayoutTabLoading.value = true
  const response = await ctr_filter_v2.FilterTrafficSource()

  let sources = []
  if (response.data) {
    sources = response.data.map((item: any) => ({
      id: item.value,
      name: item.label,
    }))
  }

  dataConfig.setAvailableTrafficSources(sources)

  isLayoutTabLoading.value = false
}

// Handle add tab
const handleAddTabs = () => {
  if (!selectedTrafficSources.value.length) return

  // Add each selected traffic source as a separate tab
  selectedTrafficSources.value.forEach((trafficSourceId) => {
    dataConfig.addTab(trafficSourceId)
  })

  // Clear selection after adding
  selectedTrafficSources.value = []
}

// Handle close tab
const handleCloseTab = (tabName: string) => {
  const tab = dataConfig.activeTabs.find((t) => t.name === tabName)
  if (tab && tab.id !== 'default') {
    dataConfig.removeTab(tab.id)
  }
}

// Watch để handle tab switching
watch(
  () => dataConfig.activeTabName,
  (newTabName) => {
    dataConfig.switchTab(newTabName)
  }
)

onMounted(async () => {
  dataConfig.clearDataAdsense()
  dataConfig.isLoading = true
  await fetchTrafficSource()
  await addLayoutOptions()

  if (isEditPage.value) {
    dataConfig.isDisable = true
    const result = await ctr_account.GetAccountAdsense(id)
    if (result?.status) {
      let temp = helper.clone(result.data)
      temp.channels = temp.channels.join('\n')
      dataConfig.adsenseAccountConfig = temp
      dataConfig.initFromAdsenseConfig(temp)
      dataConfig.isDisable = false
    }
  }

  dataConfig.isLoading = false
})

const submitForm = async () => {
  payload.value.pub_id = String(payload.value.pub_id ?? '').replace(/\D+/g, '')
  if (!payload.value.pub_id) {
    window.message.error('Submit failed: Pub ID is required')
    dataConfig.isSubmitBtnLoading = false
    return
  }

  if (dataConfig.adsenseAccountConfig.name === '') {
    window.message.error(`Submit failed: Name is required`)
    dataConfig.isSubmitBtnLoading = false
    return
  }
  dataConfig.isSubmitBtnLoading = true

  if (isAddPage.value) {
    const result = await ctr_account.AddAdsense(payload.value)
    if (result?.status) {
      window.message.success('Add demand account successfully')
      if (feSettings.value.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await ctr_account.UpdateAdsense(id, payload.value)
    if (result?.status) {
      window.message.success('Update demand account successfully')
    }
  }

  dataConfig.isSubmitBtnLoading = false
}
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <BackPage
        v-if="feSettings?.page_list"
        :url="feSettings?.page_list"
        :name="name"
        class="mt-4"
      />
      <div v-show="dataConfig.isLoading">
        <Skeleton />
      </div>
      <div
        v-show="!dataConfig.isLoading"
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card :title="`${textShow} ${name}`" class="card-flex-gap-4">
          <NameAdsenseAccount />

          <StatusAdsenseAccount />

          <GenerationAdsenseEdit />

          <GenerationAdsenseAccount />

          <PubIdAdsenseAccount />

          <ApiKeyAdsenseAccount />

          <ChannelAdsenseAccount />

          <AdsensePosition />

          <n-divider />

          <div class="my-4">
            <template v-if="isLayoutTabLoading">
              <n-spin size="small" />
            </template>
            <div v-else class="w-full layout-tabs">
              <div class="flex justify-between items-center mb-4">
                <h3 class="text-lg font-semibold"></h3>
                <div class="flex items-center gap-2">
                  <FloatingWrapper name="Traffic Source" rounded>
                    <n-select
                      v-model:value="selectedTrafficSources"
                      style="width: 250px"
                      clearable
                      show-checkmark
                      placeholder=""
                      :max-tag-count="1"
                      multiple
                      :options="
                        dataConfig.availableTrafficSourcesForAdd.map(
                          (item) => ({
                            label: item.name,
                            value: item.id,
                          })
                        )
                      "
                      :disabled="
                        dataConfig.availableTrafficSourcesForAdd.length === 0
                      "
                    />
                  </FloatingWrapper>
                  <n-button
                    type="primary"
                    :disabled="
                      !selectedTrafficSources.length || dataConfig.isDisable
                    "
                    @click="handleAddTabs"
                  >
                    <template #icon>
                      <n-icon><Plus /></n-icon>
                    </template>
                    Add
                  </n-button>
                </div>
              </div>

              <!-- Tabs -->
              <n-tabs
                type="card"
                tab-style="min-width: 80px;"
                v-model:value="dataConfig.activeTabName"
                closable
                @close="handleCloseTab"
              >
                <n-tab-pane
                  v-for="(item, index) in dataConfig.activeTabs"
                  :key="index"
                  class="tab-pane-layout"
                  :name="item.name"
                  :tab="item.name"
                  :closable="item.id !== 'default'"
                >
                  <div class="layout-content">
                    <div class="layout-section mb-6">
                      <h3 class="text-lg font-semibold mb-3">N2S Layout</h3>
                      <LayoutN2S />
                    </div>

                    <div class="layout-section">
                      <h3 class="text-lg font-semibold mb-3">S2S Layout</h3>
                      <LayoutS2S />
                    </div>
                  </div>
                </n-tab-pane>
              </n-tabs>

              <div
                v-if="
                  dataConfig.availableTrafficSourcesForAdd.length === 0 &&
                  dataConfig.activeTabs.length === 1
                "
                class="text-center py-4 text-gray-500"
              >
                All traffic sources have been added
              </div>
            </div>
          </div>
        </n-card>
        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :disabled="dataConfig.isDisable"
            :loading="dataConfig.isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
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

.input-custom-width-ads {
  width: calc(100% - 5rem);
}
</style>
