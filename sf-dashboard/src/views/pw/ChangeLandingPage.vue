<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { AgGridVue } from 'ag-grid-vue3'

import { GridApi, themeAlpine } from 'ag-grid-community'
import { ctr_campaign } from '@/services/ctr_campaign'
import { ctr_filter } from '@/services/ctr_filter'
import { ctr_landing_page } from '@/services/ctr_landing_page'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const name = 'Change Landing Page'
const isLoading = ref(false)
const isLoadingCampaign = ref(false)
const isLoadingLandingPage = ref(false)

const campaignOptions = ref<SelectOption[]>([])
const showModal = ref<boolean>(false)
const campaignRef = ref<number[]>([])
const typeModal = ref<string>('Review Campaign')
const isSubmitBtnLoading = ref(false)
const infomationError = ref<any>({})

const showErr = computed(() => {
  const _errors = infomationError.value?.errors || []

  return _errors.reduce((acc: any, err: any) => {
    acc[err.id] = err.message
    return acc
  }, {} as Record<string, string>)
})

const modalText = computed(() => {
  if (typeModal.value != '') {
    return helper.capitalizeFirstLetter(typeModal.value)
  }

  return ''
})

const renderLabel = (option: SelectOption) => {
  return h('span', {
    title: option.name,
    innerHTML: option.name,
  })
}

let searchTimeout: ReturnType<typeof setTimeout>

const fetchCampaigns = async (q = '') => {
  isLoadingCampaign.value = true

  const tempOptions = [] as SelectOption[]

  //set options for special filter campaign, publisher, section
  const response = await ctr_filter.FilterCampaign({
    params: { q: q, type: 'change_landing_page' },
  })

  response?.data?.forEach((campaign: any) => {
    tempOptions.push({
      name: campaign.name,
      id: campaign.id,
    })
  })

  //tìm các campaign đã chọn, nếu chưa có trong tempOptions thì thêm vào (nếu có trong campaignOptions thì lấy từ campaignOptions)
  if (campaignRef.value && campaignRef.value.length) {
    campaignRef.value.forEach((element) => {
      if (!tempOptions.some((obj) => obj.id === element)) {
        if (campaignOptions.value.some((obj) => obj.id === element)) {
          tempOptions.push(
            campaignOptions.value.find(
              (obj) => obj.id === element
            ) as SelectOption
          )
        } else {
          tempOptions.push({
            id: element,
            name: `${element}`,
          })
        }
      }
    })
  }

  campaignOptions.value = tempOptions

  isLoadingCampaign.value = false
}

const handleSearch = async (query: string) => {
  if (query !== '') {
    isLoadingCampaign.value = true
    // Hủy bỏ timeout hiện tại nếu có
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    // Đặt một timeout mới để chạy đoạn mã sau 3 giây
    searchTimeout = setTimeout(async () => {
      await fetchCampaigns(query)
      isLoadingCampaign.value = false
    }, 500)
  }
}

const onChangeCampaign = (value: number[]) => {
  campaignRef.value = value
  const campaigns = [] as number[]
  campaignOptions.value.forEach((item: any) => {
    if (value.includes(item.id)) {
      campaigns.push(item.id)
    }
  })
  dataConfig.value.campaigns = campaigns
}

const onChangeLandingPage = (value: number) => {
  dataConfig.value.landing_page = value
}

const isDebug = arb?.debug

const dataConfig = ref<any>({
  version: '1.0' + (isDebug ? ' (debug)' : ''),
  campaigns: [],
  landing_page: 0,
})

onMounted(async () => {
  isLoading.value = true

  initSetupEnvironment()
  isLoading.value = false
})

const initSetupEnvironment = async () => {
  isLoading.value = true
  try {
    await Promise.all([fetchCampaigns(), fetchLandingPageByDemand()])
  } catch (error) {
    console.error(error)
  }

  isLoading.value = false
}

const landingOptions = ref<any[]>([])

const handleLandingSearch = async (query: string) => {
  isLoadingLandingPage.value = true
  await fetchLandingPageByDemand(query)
  isLoadingLandingPage.value = false
}

const fetchLandingPageByDemand = async (q: string = '') => {
  const landingResult = await ctr_landing_page.GetLandingPages({
    q: q,
    demand_source: 'adsense',
    // ad_account: search_ad_account.value || campaign.value.account,
  })
  if (landingResult?.status) {
    landingOptions.value = landingResult?.data?.landing_pages || []
  }
}

const renderLandingLabel = (option: any) => {
  if (String(option.id) === option.label) {
    return option.label
  }

  return h('div', { class: 'flex justify-between w-full' }, [
    h('div', {
      innerHTML: `${
        (option.name as any).match(/^\d/)
          ? option.name
          : `${option.id}: ${option.name}`
      }`,
      style:
        'width: 80%; text-overflow: ellipsis;white-space: nowrap;overflow: hidden;',
    }),
    h('div', {
      innerHTML: `${option?.cvr ? option?.cvr?.toFixed(2) : 0}%`,
    }),
  ])
}

const editLandingPage = () => {
  if (!dataConfig.value.landing_page) {
    return
  }

  window.open(`/landing_page/${dataConfig.value.landing_page}`, '_blank')
}

const submitForm = async () => {
  try {
    isSubmitBtnLoading.value = true
    const result = await ctr_campaign.SubmitChangeLandingPageCampaign(
      dataConfig.value
    )
    if (result.status) {
      showModal.value = false
      window.message.success(`Submit success!`)
      localStorage.removeItem('saveData1')
      window.router.push({ path: dataConfig.value })
    } else {
      window.message.error(`Submit failed: ${result.message}`)
    }
    isSubmitBtnLoading.value = false
  } catch (error) {
    console.error(error)

    isSubmitBtnLoading.value = false
  }
}

const reviewSubmit = async () => {
  try {
    isSubmitBtnLoading.value = true
    const result = await ctr_campaign.ReviewChangeLandingPageCampaign(
      dataConfig.value
    )
    if (result.status) {
      window.message.success(`Review success!`)
      reviewData.value = result.data
      showModal.value = true
    } else {
      window.message.error(`Review failed: ${result.message}`)
      infomationError.value = result
    }
    isSubmitBtnLoading.value = false
  } catch (error) {
    console.error(error)

    isSubmitBtnLoading.value = false
  }
}

const gridApi = ref<GridApi | null>(null) // Optio
const gridOptions = {
  rowHeight: 50,
  enableRangeSelection: true, // Kích hoạt chọn nhiều ô
  enableFillHandle: true, // Cho phép tính năng sao chép bằng cách kéo chuột
  suppressCopySingleCellRanges: false, // Kích hoạt sao chép một ô đơn lẻ
}
const columnDefs = computed(() => {
  return [
    {
      headerName: 'Campaign ID',
      field: 'id',
      flex: 0.1,
    },
    {
      headerName: 'LandingPage Old',
      field: 'landing_page_old',
      flex: 0.1,
    },
    {
      headerName: 'LandingPage New',
      field: 'landing_page_new',
      flex: 0.1,
    },
    {
      headerName: 'Url Old',
      field: 'url_old',
      flex: 0.35,
      editable: true,
    },
    {
      headerName: 'Url New',
      field: 'url_new',
      flex: 0.35,
      editable: true,
    },
  ]
})

const onGridReady = (params: any) => {
  gridApi.value = params.api
  if (gridApi.value) {
    gridApi.value.sizeColumnsToFit()
  }
}

const defaultColDef = computed(() => {
  return {
    // set every column width
    // suppressSizeToFit: true,
    resizable: true,
  }
})

const reviewData = ref<any>({
  campaigns: [],
  landing_page_old: 0,
  landing_page_new: 0,
})

const campaigns = computed(() => {
  return reviewData.value.campaigns || []
})
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
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
                      <div>{{ modalText }}</div>
                    </div>
                  </template>

                  <div class="w-full">
                    <!-- header of table -->
                    <div
                      class="flex justify-between bg-card text-start font-semibold border-l border-r border-t"
                    ></div>
                    <ag-grid-vue
                      id="myGrid"
                      :theme="customTheme"
                      :animate-rows="true"
                      dom-layout="autoHeight"
                      :grid-options="gridOptions"
                      :column-defs="columnDefs"
                      :row-data="campaigns"
                      :default-col-def="defaultColDef"
                      @grid-ready="onGridReady"
                      row-selection="multiple"
                      :enable-cell-text-selection="true"
                      :suppress-multi-sort="true"
                      :suppress-pagination-panel="true"
                    >
                    </ag-grid-vue>
                  </div>
                  <template #action>
                    <n-button @click="showModal = false"> Cancel</n-button>
                    <n-button
                      class="ms-2"
                      color="#f43f5e"
                      size="medium"
                      type="success"
                      :loading="isSubmitBtnLoading"
                      @click="submitForm"
                    >
                      Submit
                    </n-button>
                  </template>
                </n-modal>
                <n-card :title="name">
                  <template #header-extra>
                    <n-popover trigger="hover">
                      <template #trigger>
                        <span class="custom-text-style-manager">
                          Version {{ dataConfig.version }}
                        </span>
                      </template>
                      <span>Version of js code create / update {{ name }}</span>
                    </n-popover>
                  </template>
                  <FloatingWrapper
                    :name="'Campaigns'"
                    :required="true"
                    :error="showErr['campaigns']"
                  >
                    <div class="flex flex-row my-4">
                      <div class="w-full flex flex-col">
                        <div
                          class="flex items-center width-change-landing-page"
                        >
                          <n-select
                            v-model:value="campaignRef"
                            multiple
                            filterable
                            clearable
                            placeholder=""
                            value-field="id"
                            label-field="name"
                            :render-label="renderLabel"
                            :loading="isLoadingCampaign"
                            :options="campaignOptions"
                            max-tag-count="responsive"
                            @search="handleSearch"
                            @update:value="onChangeCampaign"
                          />
                        </div>
                        <!--                  <n-button-->
                        <!--                    class="w-24 ml-1"-->
                        <!--                    :disabled="isLoading"-->
                        <!--                    color="#49a0f9"-->
                        <!--                    @click="handleAll"-->
                        <!--                  >{{ textAll }} All-->
                        <!--                  </n-button>-->

                        <!--                  <BulkEntry @clickAction="initShowModal" />-->
                      </div>
                    </div>
                  </FloatingWrapper>
                  <FloatingWrapper :name="'Landing Page'">
                    <div class="flex flex-row my-4">
                      <div class="w-full flex flex-col">
                        <div class="flex items-center">
                          <n-input-group>
                            <n-select
                              v-model:value="dataConfig.landing_page"
                              filterable
                              remote
                              clearable
                              placeholder=""
                              value-field="id"
                              :loading="isLoadingLandingPage"
                              :render-label="renderLandingLabel"
                              :options="landingOptions"
                              @search="handleLandingSearch"
                              @update:value="onChangeLandingPage"
                            />

                            <n-button
                              v-if="dataConfig.landing_page != 0"
                              color="#f43f5e"
                              type="default"
                              @click="editLandingPage"
                            >
                              Edit
                            </n-button>
                          </n-input-group>
                        </div>
                      </div>
                    </div>
                  </FloatingWrapper>

                  <div
                    class="flex flex-row-reverse sticky bottom-0"
                    x-gap="12"
                    cols="1 2800:2"
                  >
                    <n-button
                      color="#f43f5e"
                      size="medium"
                      type="success"
                      :loading="isSubmitBtnLoading"
                      @click="reviewSubmit"
                    >
                      Review
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
<style>
.width-change-landing-page {
  width: calc(100%);
  max-width: calc(100%);
}

.n-base-select-option__content {
  width: 100%;
}
</style>
