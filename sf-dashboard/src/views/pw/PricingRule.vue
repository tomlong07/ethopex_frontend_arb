<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import date2 from '@/utils/date2'

//@ts-ignore
import pricingRuleTemplate from '@/components/html_template/pricing_rule.html-template'
import { AsyncSettings } from './base'
import { ctr_tool } from '@/services/ctr_tool'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'
import { ModeStyleManagerOptions } from '@/options/style_manager'
import { PricingOptions } from '@/options/pricing_rule'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const isDebug = arb?.debug

const version = '1.1' + (isDebug ? ' (debug)' : '')

const showModal = ref<boolean>(false)
const showModalCreate = ref<boolean>(false)
const dataConfig = ref<any>({
  name: 'Rule ' + date2.today(),
  mode: 'update',
  admanagerAccount: isDebug ? 22853158016 : null,
  pricing: 'CPM',
  updateIds: isDebug ? ['63087151', '63381857'] : [],
  ids: '',
  data: isDebug
    ? '[{ "country": "Romania, United Kingdom, Canada", "deviceCategory": "Smartphone, Desktop", "adUnit": "jamilacuisine.ro_vli21195 (22951968415), dailytrust.com_21639 (23089762795), toolzu.com_vli89236 (22999626577)", "countryId": "2642, 2826, 2124", "deviceCategoryId": "30001, 30000", "adUnitId": "vli21195, 21639, vli89236", "adUnitId2": "22951968415, 23089762795, 22999626577", "impressions": 475476, "revenue": 1052.69, "eCpm": 2.2139708418511135, "adRequests": 1319432, "fillRate": "36.04%", "step": 2.2199999999999966, "id": 1, "cucumulatedRevenue": 1052.69, "cucumulatedRevenuePercent": "18.08%" }, { "country": "Indonesia, Ukraine, Senegal, India, United States, Honduras, Romania, Maldives, Bolivia, Nicaragua, Kenya, New Zealand, Japan, Saudi Arabia, Nepal, China, Taiwan, Peru, Argentina, Switzerland, Singapore, Morocco, Spain", "deviceCategory": "Smartphone, Desktop, Tablet", "adUnit": "snaptik.app_16256 (22974943693), pubpower_21583 (23089477600), pubpower_21581 (23089477729), tektutorialshub.com_vli50355 (22951879254), swotandpestleanalysis.com_17821 (23006221824), how2shout.com_vli101061 (22952661728), gptgo.ai_15550 (22959835610), pubpower_21582 (23089477252), sketchok.com_vli30879 (22952100010), sketchok.com_vli30884 (22952110807), how2shout.com_vli101058 (22952036629), how2shout.com_vli61209 (22952613953), how2shout.com_vli111372 (22983455590), snapsave.app_15553 (22960983905), sketchok.com_vli107683 (22952036797), ggmeo.com_17924 (23080051071)", "countryId": "2360, 2804, 2686, 2356, 2840, 2340, 2642, 2462, 2068, 2558, 2404, 2554, 2392, 2682, 2524, 2156, 2158, 2604, 2032, 2756, 2702, 2504, 2724", "deviceCategoryId": "30001, 30000, 30002", "adUnitId": "16256, 21583, 21581, vli50355, 17821, vli101061, 15550, 21582, vli30879, vli30884, vli101058, vli61209, vli111372, 15553, vli107683, 17924", "adUnitId2": "22974943693, 23089477600, 23089477729, 22951879254, 23006221824, 22952661728, 22959835610, 23089477252, 22952100010, 22952110807, 22952036629, 22952613953, 22983455590, 22960983905, 22952036797, 23080051071", "impressions": 1129512, "revenue": 458.27999999999975, "eCpm": 0.40573274121921654, "adRequests": 1264924, "fillRate": "89.29%", "step": 0.4100000000000002, "id": 2, "cucumulatedRevenue": 1510.9699999999998, "cucumulatedRevenuePercent": "25.95%" }]'
    : '',
})

const isLoadingAdmInfo = ref(false)

const asyncSettings = ref<AsyncSettings>()

const getAsyncSettings = async () => {
  isLoadingAdmInfo.value = true

  const result = await ctr_permission_settings.PermissionAsync(
    window.route?.meta?.url as string
  )

  asyncSettings.value = new AsyncSettings(result?.data || {})

  isLoadingAdmInfo.value = false
}

const dataCreate = ref<any>({
  network_id: '',
  name: '',
  name_in_gam: '',
})

const AdmanagerAccountOptions = ref<SelectOption[]>([])

const styleByAccountOptions = ref<SelectOption[]>([])

const isLoading = ref<boolean>(false)

const isCreateMode = computed<boolean>(() => {
  return dataConfig.value.mode === 'create'
})

const isUpdateMode = computed<boolean>(() => {
  return dataConfig.value.mode === 'update'
})

const updateIdsString = computed<string>(() => {
  if (isCreateMode.value) {
    return JSON.stringify([])
  }
  const stringArray = dataConfig.value.updateIds.map((num: number) =>
    num.toString()
  )

  return JSON.stringify(stringArray)
})

const name = `Pricing Rule`

const getAdmanagerAccounts = async () => {
  const result = await ctr_tool.AdManagerList()

  if (!result?.status) {
    return
  }

  if (result.data && result.data.length) {
    result.data.forEach((element: any) => {
      AdmanagerAccountOptions.value.push({
        label: element.name + ' - ' + element.name_in_gam,
        value: element.network_id,
      })
    })
  }
}

onMounted(async () => {
  getAsyncSettings()
  isLoading.value = true
  await getAdmanagerAccounts()
  isLoading.value = false
})

const generateJS = async () => {
  if (!dataConfig.value.admanagerAccount) {
    window.message.error(
      `Generate failed: Invalid admanager account, please check!`
    )
    return
  }

  if (isUpdateMode.value && !dataConfig.value.updateIds.length) {
    window.message.error(`Generate failed: Invalid ids, please check!`)
    return
  }

  if (!dataConfig.value.data) {
    window.message.error(`Generate failed: Invalid data, please check!`)
    return
  }

  navigator.clipboard.writeText(generateJSScript())

  window.message.success('Copied code to clipboard!')
}

function generateJSScript(opts: { [key: string]: any } = {}) {
  let dataJS = pricingRuleTemplate

  dataJS = dataJS.replaceAll('<script>', '').replaceAll('</' + 'script>', '')

  let objCustom: { [key: string]: any } = {
    import_admanager_account: dataConfig.value.admanagerAccount,
    import_pricing: dataConfig.value.pricing,
    import_version: version,
    import_name: dataConfig.value.name,
    import_update_ids: updateIdsString.value,
    import_debug: isDebug,
    import_data: dataConfig.value.data,
    import_hlink: asyncSettings.value?.admInfo?.hLink,
    import_hname: asyncSettings.value?.admInfo?.hName,
    import_hvalue: asyncSettings.value?.admInfo?.hValue,
    import_mode: dataConfig.value.mode,
  }

  dataJS = helper.handleBarsCustom(dataJS, objCustom)

  return dataJS
}

const initShowModal = () => {
  dataConfig.value.ids = dataConfig.value.updateIds.join('\n')
  showModal.value = true
}

const initShowModalCreate = () => {
  showModalCreate.value = true
}

const submitBulkIds = () => {
  if (!dataConfig.value.ids) {
    window.message.error(`Submit failed: Invalid ids, please check!`)
    return
  }
  dataConfig.value.updateIds = dataConfig.value.ids
    .replace(/\n/g, ',') // Thay thế tất cả các xuống dòng bằng dấu phẩy
    .split(',') // Tách theo dấu phẩy
    .map((key: any) => key.trim()) // Loại bỏ khoảng trắng xung quanh mỗi keyword
    .filter((key: any) => key) // Loại bỏ các keyword trống
  dataConfig.value.ids = Object.values(dataConfig.value.updateIds).join(',')
  showModal.value = false
}

const updateChildStyles = async (value: string) => {
  if (!value) {
    return
  }

  dataConfig.value.admanagerAccount = value

  const result = await ctr_tool.GetPricingRuleIdsByNetworkId(
    dataConfig.value.admanagerAccount
  )

  if (!result?.status) {
    return
  }

  styleByAccountOptions.value = []
  dataConfig.value.updateIds = []

  if (result.data && result.data.length) {
    result.data.forEach((element: any) => {
      styleByAccountOptions.value.push({
        label: element,
        value: element,
      })

      dataConfig.value.updateIds.push(element)
    })
  }
}

const clearUpdateIds = (value: string) => {
  dataConfig.value.mode = value
  dataConfig.value.updateIds = []
  dataConfig.value.ids = ''
}

const createNewAdManager = async () => {
  if (
    !dataCreate.value.network_id ||
    !dataCreate.value.name ||
    !dataCreate.value.name_in_gam
  ) {
    window.message.error(`Create failed: Invalid data, please check!`)
    return
  }

  let newId = Number(dataCreate.value.network_id)
  if (!newId || isNaN(newId)) {
    window.message.error(`Create failed: Invalid id, please check!`)
    return
  }

  const result = await ctr_tool.AdManagerAdd(dataCreate.value)

  if (result?.status) {
    window.message.success('Create new ad manager account successfully!')
    await getAdmanagerAccounts()

    showModalCreate.value = false
  }
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center items-start">
      <div class="w-full max-w-[923px]">
        <n-spin :show="isLoading">
          <div class="flex justify-center mt-6 items-center">
            <div class="w-full 5xl:w-1/2">
              <div class="flex flex-wrap gap-4 mt-6">
                <n-modal
                  v-model:show="showModal"
                  preset="dialog"
                  :closable="false"
                  type="success"
                  :show-icon="false"
                  style="width: 60vw"
                >
                  <template #header>
                    <div class="flex-row">
                      <div>Ids bulk entry</div>
                      <span class="text-sm font-normal"
                        >Entries should be on separate commas or lines.</span
                      >
                    </div>
                  </template>
                  <div>
                    <n-input
                      v-model:value="dataConfig.ids"
                      type="textarea"
                      placeholder="Eg. id 1, id 2...."
                      rows="10"
                    />
                  </div>
                  <template #action>
                    <n-button @click="showModal = false"> Cancel </n-button>
                    <n-button type="error" @click="submitBulkIds">
                      Save
                    </n-button>
                  </template>
                </n-modal>

                <n-modal
                  v-model:show="showModalCreate"
                  preset="dialog"
                  :closable="false"
                  type="success"
                  :show-icon="false"
                  style="width: 60vw"
                >
                  <template #header>
                    <div class="flex-row">
                      <div>Create new ad manager account</div>
                    </div>
                  </template>
                  <div class="flex gap-4 flex-col">
                    <FloatingWrapper :name="'Network Id'">
                      <div class="flex flex-row">
                        <div class="w-full flex flex-col">
                          <n-input v-model:value="dataCreate.network_id" />
                        </div>
                      </div>
                    </FloatingWrapper>
                    <FloatingWrapper :name="'Name'">
                      <div class="flex flex-row">
                        <div class="w-full flex flex-col">
                          <n-input v-model:value="dataCreate.name" />
                        </div>
                      </div>
                    </FloatingWrapper>
                    <FloatingWrapper :name="'Name in GAM'">
                      <div class="flex flex-row">
                        <div class="w-full flex flex-col">
                          <n-input v-model:value="dataCreate.name_in_gam" />
                        </div>
                      </div>
                    </FloatingWrapper>
                  </div>

                  <template #action>
                    <n-button @click="showModalCreate = false">
                      Cancel
                    </n-button>
                    <n-button type="error" @click="createNewAdManager">
                      Create
                    </n-button>
                  </template>
                </n-modal>

                <n-card :title="name">
                  <template #header-extra>
                    <n-popover trigger="hover">
                      <template #trigger> Version {{ version }} </template>
                      <span>Version of js code create / update {{ name }}</span>
                    </n-popover></template
                  >

                  <FloatingWrapper :name="'Name'">
                    <div class="flex my-4">
                      <div class="w-full flex flex-col">
                        <n-input
                          v-model:value="dataConfig.name"
                          :placeholder="`Name of ${name}`"
                          class="mb-2"
                        />
                      </div>
                    </div>
                  </FloatingWrapper>

                  <div class="flex my-4">
                    <div class="w-full flex items-center flex-row">
                      <FloatingWrapper :name="'Mode'">
                        <n-select
                          v-model:value="dataConfig.mode"
                          tag
                          :options="ModeStyleManagerOptions"
                          :on-update:value="clearUpdateIds"
                        />
                      </FloatingWrapper>

                      <n-tooltip trigger="hover" v-if="isCreateMode">
                        <template #trigger>
                          <n-button
                            class="ml-2"
                            color="#f43f5e"
                            @click="initShowModalCreate"
                          >
                            Create New
                          </n-button>
                        </template>
                        <span>Create new ad manager account.</span>
                      </n-tooltip>
                    </div>
                  </div>

                  <FloatingWrapper :name="'Admanager Account'">
                    <div class="flex my-4">
                      <div class="w-full flex flex-row">
                        <n-select
                          v-model:value="dataConfig.admanagerAccount"
                          placeholder=""
                          tag
                          :options="AdmanagerAccountOptions"
                          :on-update:value="updateChildStyles"
                        />
                      </div>
                    </div>
                  </FloatingWrapper>
                  <FloatingWrapper :name="'Pricing Option'">
                    <div class="flex my-4">
                      <div class="w-full flex flex-row">
                        <n-select
                          v-model:value="dataConfig.pricing"
                          tag
                          :options="PricingOptions"
                        />
                      </div>
                    </div>
                  </FloatingWrapper>
                  <div class="flex my-4" v-show="isUpdateMode">
                    <div class="w-full flex items-center flex-row">
                      <FloatingWrapper :name="'Ids'">
                        <n-select
                          v-model:value="dataConfig.updateIds"
                          filterable
                          multiple
                          clearable
                          placeholder=""
                          tag
                          :max-tag-count="10"
                          :options="styleByAccountOptions"
                        />
                      </FloatingWrapper>
                      <n-tooltip trigger="hover">
                        <template #trigger>
                          <n-button
                            class="ml-2"
                            color="#f43f5e"
                            @click="initShowModal"
                          >
                            Bulk Entry
                          </n-button>
                        </template>
                        <span
                          >Enter multiple ids separated by commas or
                          lines.</span
                        >
                      </n-tooltip>
                    </div>
                  </div>

                  <FloatingWrapper :name="'Data'">
                    <div class="flex my-4">
                      <div class="w-full flex flex-col">
                        <n-input
                          type="textarea"
                          v-model:value="dataConfig.data"
                          rows="7"
                          class="mb-2"
                        />
                      </div>
                    </div>
                  </FloatingWrapper>

                  <div class="flex flex-row-reverse sticky bottom-0 gap-2">
                    <n-button
                      color="#0D6EFD"
                      size="medium"
                      type="success"
                      class="mt-4"
                      :disabled="isLoadingAdmInfo"
                      @click="generateJS"
                    >
                      Copy JS
                    </n-button>
                  </div>
                </n-card>
              </div>
            </div>
          </div>
        </n-spin>
      </div>
    </div>
  </div>
</template>
