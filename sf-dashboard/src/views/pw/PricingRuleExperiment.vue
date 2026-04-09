<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import date2 from '@/utils/date2'

import Plus from '@/assets/icons/Plus.vue'

import DateRanger from '@/components/common/DateRanger.vue'

//@ts-ignore
import pricingRuleExpTemplate from '@/components/html_template/pricing_rule_experiment.html-template'
import Minus from '@/assets/icons/Minus.vue'
import { ctr_tool } from '@/services/ctr_tool'
import {
  ExperimentExchangeOptions,
  ExperimentTypeOptions,
  MetricAutoPauseOptions,
  ExperimentModeOptions,
  TypeAutoPauseOptions,
} from '@/options/pricing_rule_exp'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const isDebug = arb?.debug

const newAutoPause = () => {
  return { type: 'cumulative', metric: 'revenue', amount: isDebug ? 6 : 5 }
}

const showModalCreate = ref<boolean>(false)
const dataConfig = ref<any>({
  version: '1.0' + (isDebug ? ' (debug)' : ''),
  isDebug: isDebug,
  name: isDebug ? 'Hai Test' : 'Experiment',
  mode: 'create',
  admanagerAccount: isDebug ? '22651645586' : null,
  trafficAllocation: isDebug ? 4 : 10,
  date: [date2.tomorrow(), date2.nextDays(15)],
  autoPause: true,
  autoPauseData: [newAutoPause()],
  experimentAction: 'increase',
  experimentAmount: isDebug ? 3 : 5,
  experimentType: 'percent',
})

const dataCreate = ref<any>({
  network_id: '',
  name: '',
  name_in_gam: '',
})

const AdmanagerAccountOptions = ref<SelectOption[]>([])

const isLoading = ref<boolean>(false)

const isCreateMode = computed<boolean>(() => {
  return dataConfig.value.mode === 'create'
})

const invalidDate = computed<boolean>(() => {
  return (
    helper.DiffDays(dataConfig.value.date[0], dataConfig.value.date[1]) <= 7
  )
})

const name = `Pricing Rule Experiment`

const getAdmanagerAccounts = async () => {
  const result = await ctr_tool.AdManagerList()

  if (!result?.status) return

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

  if (!dataConfig.value.date || dataConfig.value.date.length !== 2) {
    window.message.error(`Generate failed: Invalid date, please check!`)
    return
  }

  if (invalidDate.value) {
    window.message.error('End date must be at least 7 days after start date.')
    return
  }

  navigator.clipboard.writeText(generateJSScript())

  window.message.success('Copied code to clipboard!')
}

function generateJSScript(opts: { [key: string]: any } = {}) {
  let dataJS = pricingRuleExpTemplate

  dataJS = dataJS.replaceAll('<script>', '').replaceAll('</' + 'script>', '')

  let objCustom: { [key: string]: any } = {
    dataConfig: JSON.stringify(dataConfig.value),
  }

  dataJS = helper.handleBarsCustom(dataJS, objCustom)

  return dataJS
}

const initShowModalCreate = () => {
  showModalCreate.value = true
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

const updateDate = (date: string[]) => {
  if (!date || date.length != 2) {
    console.error(
      'PricingRuleExperiment->updateDate: date is not correct',
      date
    )
  }

  dataConfig.value.date = date

  if (invalidDate.value) {
    window.message.warning('End date must be at least 7 days after start date.')
  }
}

const onDeleteAutoPause = (i: number) => {
  dataConfig.value.autoPauseData.splice(i, 1)
}

const onAddAutoPause = () => {
  dataConfig.value.autoPauseData.push(newAutoPause())
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
                      <template #trigger>
                        Version {{ dataConfig.version }}
                      </template>
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
                          :options="ExperimentModeOptions"
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
                        />
                      </div>
                    </div>
                  </FloatingWrapper>

                  <div class="my-4">
                    <div class="font-bold text-xs mb-1">Price settings</div>
                    <div class="flex flex-row text-xs">
                      The tool will automatically follow active pricing rules in
                      Google ad manager
                    </div>
                  </div>

                  <div class="my-4">
                    <div class="font-bold text-xs mb-2">Experiment price</div>
                    <div class="w-full flex flex-row gap-2">
                      <FloatingWrapper :name="'Action'">
                        <n-select
                          v-model:value="dataConfig.experimentAction"
                          tag
                          filterable
                          value-field="value"
                          label-field="name"
                          :options="ExperimentTypeOptions"
                        />
                      </FloatingWrapper>

                      <FloatingWrapper :name="'Value'">
                        <n-input-number
                          placeholder=""
                          v-model:value="dataConfig.experimentAmount"
                          min="0"
                        >
                        </n-input-number>
                      </FloatingWrapper>

                      <FloatingWrapper :name="'Type'">
                        <n-select
                          v-model:value="dataConfig.experimentType"
                          tag
                          filterable
                          value-field="value"
                          label-field="name"
                          :options="ExperimentExchangeOptions"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>
                  <div class="my-4">
                    <div class="w-full flex flex-row">
                      <FloatingWrapper :name="'Experiment period'">
                        <DateRanger
                          :status="{ isFetching: false }"
                          :defaultDate="dataConfig.date"
                          classLabel="hidden"
                          @updateDate="updateDate"
                          :minDate="date2.today()"
                        />
                      </FloatingWrapper>
                    </div>
                  </div>
                  <FloatingWrapper :name="'Traffic allocation'">
                    <div class="flex items-center my-4">
                      <div class="w-full flex flex-row">
                        <n-input-number
                          class="w-64"
                          v-model:value="dataConfig.trafficAllocation"
                          min="1"
                          max="100"
                        >
                          <template #suffix> % </template>
                        </n-input-number>
                      </div>
                    </div>
                  </FloatingWrapper>

                  <div class="my-4">
                    <div class="font-bold text-xs mb-1">
                      Auto-pause experiment
                    </div>

                    <div class="flex flex-col">
                      <n-checkbox v-model:checked="dataConfig.autoPause">
                        Set auto-pause conditions
                      </n-checkbox>
                      <div
                        class="flex my-4 flex-col"
                        v-if="dataConfig.autoPause"
                      >
                        <n-input-group
                          v-for="(miniData, ind) in dataConfig.autoPauseData"
                          :key="ind"
                          class="py-2 flex flex-row gap-2"
                        >
                          <FloatingWrapper :name="'Aggregation Type'">
                            <n-select
                              v-model:value="miniData.type"
                              clearable
                              tag
                              filterable
                              value-field="value"
                              label-field="name"
                              placeholder="Type"
                              :options="TypeAutoPauseOptions"
                            />
                          </FloatingWrapper>

                          <FloatingWrapper :name="'Metric'">
                            <n-select
                              v-model:value="miniData.metric"
                              clearable
                              tag
                              filterable
                              value-field="value"
                              label-field="name"
                              placeholder="Metric"
                              :options="MetricAutoPauseOptions"
                            />
                          </FloatingWrapper>
                          <span
                            class="w-[90px] content-center whitespace-nowrap"
                            >decreases by</span
                          >
                          <FloatingWrapper :name="'Value'">
                            <n-input-number
                              v-model:value="miniData.amount"
                              min="1"
                              max="100"
                            >
                              <template #suffix> % </template>
                            </n-input-number>
                          </FloatingWrapper>

                          <div style="width: 96px">
                            <FloatingWrapper>
                              <n-button-group>
                                <n-button
                                  ghost
                                  class="dynamic-button"
                                  :disabled="
                                    ind === 0 &&
                                    dataConfig.autoPauseData.length === 1
                                  "
                                  @click="onDeleteAutoPause(Number(ind))"
                                >
                                  <template #icon>
                                    <n-icon size="12"><Minus /></n-icon>
                                  </template>
                                </n-button>
                                <n-button
                                  ghost
                                  class="dynamic-button"
                                  @click="onAddAutoPause"
                                >
                                  <template #icon>
                                    <n-icon size="12"><plus /></n-icon>
                                  </template>
                                </n-button>
                              </n-button-group>
                            </FloatingWrapper>
                          </div>
                        </n-input-group>
                      </div>
                    </div>
                  </div>

                  <div class="flex flex-row-reverse sticky bottom-0 gap-2">
                    <n-button
                      color="#0D6EFD"
                      size="medium"
                      type="success"
                      class="mt-4"
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
