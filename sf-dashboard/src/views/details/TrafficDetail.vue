<script setup lang="ts">
import { SelectOption, TransferOption } from 'naive-ui'

import { macroType, trafficConfigType } from '@/types/components/traffic'

import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import Plus from '@/assets/icons/Plus.vue'

import BackPage from '@/components/common/BackPage.vue'

import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import ctr_demand_source from '@/services/ctr_demand_source'
import Minus from '@/assets/icons/Minus.vue'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const id = Number(window.route.params.id || 0)

const newKeyValue = () => {
  return {
    name: null,
    value: '',
    status: 'on',
  } as macroType
}

const trafficConfig = ref<trafficConfigType>({
  id: 0,
  name: '',
  show_name: '',
  status: 'on',
  demand_accept: [],
  macro: [],
  optimization_event: [],
})
const isAddMode = computed<boolean>(() => id === 0)
const isEditMode = !isAddMode.value
const demandOptions = ref<TransferOption[]>([])
const demand = ref<number[]>([])
const isSubmitBtnLoading = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const isDisableMacros = ref<boolean>(false)
const isDisableDemands = ref<boolean>(false)
const macroKeyOptions = ref<SelectOption[]>([])

onMounted(async () => {
  isLoading.value = true
  if (!isAddMode.value) {
    //get traffic config by id
    const result = await ctr_traffic_source.GetByID(id)
    if (result?.status) {
      trafficConfig.value = result.data
      demand.value = trafficConfig.value.demand_accept
    }
  }
  getListDemandOptions()
  getListMarcosOptions()
  onDisableKey()

  // adding default macro if have no macro in traffic config
  if (trafficConfig.value.macro.length === 0) {
    trafficConfig.value.macro.push(newKeyValue())
  }

  if (trafficConfig.value.optimization_event.length === 0) {
    trafficConfig.value.optimization_event.push(newKeyValue())
  }
  isLoading.value = false
})

const getListMarcosOptions = async () => {
  isDisableMacros.value = true
  macroKeyOptions.value = []
  let fetchMacros = await ctr_demand_source.GetMacroByType({ type: 'supply' })
  if (!fetchMacros.status) {
    isDisableMacros.value = true
  } else {
    fetchMacros?.data?.forEach((macro: any) => {
      macroKeyOptions.value.push({
        id: macro.id,
        value: macro.name,
        label: macro.name,
        disabled: false,
      })
    })
    isDisableMacros.value = false
  }
  isDisableMacros.value = false
}
const getListDemandOptions = async () => {
  isDisableDemands.value = true
  let result = await ctr_demand_source.FilterDemand({
    page: 1,
    limit: 1000,
  })

  const newData = result?.data?.demands || []
  newData.forEach((demand: any) => {
    demandOptions.value.push({
      label: demand.show_name,
      value: demand.id,
    })
  })

  isDisableDemands.value = false
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  // submit form
  if (isAddMode.value) {
    const result = await ctr_traffic_source.AddConfig(trafficConfig.value)
    if (result?.status) {
      window.message.success('Add traffic source successfully')
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  } else {
    const result = await ctr_traffic_source.EditConfig(trafficConfig.value)
    if (result?.status) {
      window.message.success('Update traffic source successfully')
    }
  }

  isSubmitBtnLoading.value = false
}
const onDisableKey = () => {
  // disable key of macro if it is selected
  macroKeyOptions.value.forEach((option) => {
    option.disabled = false
    trafficConfig.value.macro.forEach((macro) => {
      if (option.value === macro.name) {
        option.disabled = true
      }
    })
  })
}
const onAddMacro = () => {
  trafficConfig.value.macro.push(newKeyValue())
}

const onAddEvent = () => {
  trafficConfig.value.optimization_event.push(newKeyValue())
}
const onDeleteMacro = (index: number) => {
  trafficConfig.value.macro.splice(index, 1)
}

const onDeleteEvent = async (event: any, index: number) => {
  if (event.name === '' || event.status === 'on') {
    trafficConfig.value.optimization_event.splice(index, 1)
    return
  }
  const payload = {
    event: event.name,
    traffic_source: trafficConfig.value.name,
  }
  const result = await ctr_traffic_source.CheckRemoveEvent(payload)
  if (result?.status) {
    // message.success('Update traffic source successfully');
    trafficConfig.value.optimization_event.splice(index, 1)
  }
}
const onChangeDemandAccept = (value: (string | number)[]) => {
  const numeric = value.map((v) => Number(v))
  demand.value = numeric
  trafficConfig.value.demand_accept = numeric
}

const renderTargetList = (optionPixels: any) => {
  const result = optionPixels?.checkedOptions.map((el: any) =>
    h(
      'a',
      {
        class: 'flex px-4 my-2 hover:underline hover:text-blue-600',
        href: `/demand/edit/${el.value}`,
        target: '_blank',
      },
      { default: () => el.label }
    )
  )
  return result
}
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <BackPage
        :url="feSettings?.page_list"
        name="Traffic"
        v-if="feSettings?.page_list"
        class="mt-6"
      />
      <div v-if="isLoading || isDisableDemands">
        <Skeleton />
      </div>
      <div
        v-show="!isLoading && !isDisableDemands"
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card title="Traffic Source">
          <!-- code of traffic source -->
          <div class="flex my-4">
            <FloatingWrapper name="Name" rounded>
              <n-input
                v-model:value="trafficConfig.name"
                :loading="isLoading"
                :disabled="isEditMode"
                placeholder="Original name of traffic source"
              />
            </FloatingWrapper>
          </div>
          <!-- show name of traffic source -->
          <div class="flex my-4">
            <FloatingWrapper name="Show Name" rounded>
              <n-input
                v-model:value="trafficConfig.show_name"
                :loading="isLoading"
                placeholder="Name of traffic source"
              />
            </FloatingWrapper>
          </div>
          <!-- status of traffic source -->
          <div class="flex my-4 items-center">
            <div class="mr-5 font-medium text-gray-400">Status</div>
            <CustomSwitch
              v-model="trafficConfig.status"
              :loading="isLoading"
              type="onoff"
              true-label="On"
              false-label="Off"
              size="medium"
            />
          </div>
          <!-- macros -->
          <div class="flex my-4 mt-6">
            <FloatingWrapper name="Macros (Key/Value)" rounded>
              <n-card>
                <template v-if="isLoading">
                  <n-spin size="small" />
                </template>
                <div v-else class="flex flex-col space-y-2">
                  <n-input-group
                    v-for="(macro, index) in trafficConfig.macro"
                    :key="index"
                    class="pt-2"
                  >
                    <div class="w-1/4">
                      <FloatingWrapper name="Macro Name" rounded>
                        <n-select
                          v-model:value="macro.name"
                          placeholder=""
                          :loading="isLoading"
                          :disabled="isDisableMacros"
                          :options="macroKeyOptions"
                          @update:value="onDisableKey"
                        />
                      </FloatingWrapper>
                    </div>
                    <div class="w-3/4 pl-2">
                      <FloatingWrapper name="Macro Value" rounded>
                        <n-input
                          v-model:value="macro.value"
                          :loading="isLoading"
                          :disabled="isDisableMacros"
                          placeholder="Enter value of Macro or keep blank to unused!"
                        />
                      </FloatingWrapper>
                    </div>
                    <n-button-group class="pl-2 my-1">
                      <n-button
                        ghost
                        class="dynamic-button"
                        :disabled="
                          (index === 0 && trafficConfig.macro.length === 1) ||
                          isDisableMacros
                        "
                        @click="onDeleteMacro(index)"
                      >
                        <template #icon>
                          <n-icon size="12"><Minus /></n-icon>
                        </template>
                      </n-button>
                      <n-button
                        ghost
                        class="dynamic-button"
                        :disabled="
                          trafficConfig.macro.length ===
                            macroKeyOptions.length || isDisableMacros
                        "
                        @click="onAddMacro"
                      >
                        <template #icon>
                          <n-icon size="12"><Plus /></n-icon>
                        </template>
                      </n-button>
                    </n-button-group>
                  </n-input-group>
                </div>
              </n-card>
            </FloatingWrapper>
          </div>
          <!-- events -->
          <div class="flex my-4">
            <FloatingWrapper name="Events" rounded>
              <n-card>
                <template v-if="isLoading">
                  <n-spin size="small" />
                </template>
                <div v-else class="flex flex-col">
                  <div class="flex">
                    <!-- <n-button-group class="pl-2 invisible">
                      <n-button ghost class="dynamic-button">
                        <template #icon>
                          <n-icon size="12"></n-icon>
                        </template>
                      </n-button>
                      <n-button ghost class="dynamic-button">
                        <template #icon>
                          <n-icon size="12"></n-icon>
                        </template>
                      </n-button>
                    </n-button-group> -->
                  </div>
                  <n-input-group
                    v-for="(event, index) in trafficConfig.optimization_event"
                    :key="index"
                    class="pt-2"
                  >
                    <div class="w-1/4">
                      <FloatingWrapper name="Event Name" rounded>
                        <n-input
                          v-model:value="event.name"
                          class="w-1/4"
                          :disabled="!isAddMode && event.status !== 'on'"
                          :loading="isLoading"
                          placeholder="Event Name"
                        />
                      </FloatingWrapper>
                    </div>
                    <div class="w-3/4 pl-2">
                      <FloatingWrapper name="Event Value" rounded>
                        <n-input
                          v-model:value="event.value"
                          :disabled="!isAddMode && event.status !== 'on'"
                          :loading="isLoading"
                          placeholder="Event Value"
                        />
                      </FloatingWrapper>
                    </div>
                    <n-button-group class="pl-2 my-1">
                      <n-button
                        ghost
                        class="dynamic-button"
                        :disabled="
                          index === 0 && trafficConfig.macro.length === 1
                        "
                        @click="onDeleteEvent(event, index)"
                      >
                        <template #icon>
                          <n-icon size="12"><Minus /></n-icon>
                        </template>
                      </n-button>
                      <n-button
                        ghost
                        class="dynamic-button"
                        :disabled="
                          trafficConfig.macro.length === macroKeyOptions.length
                        "
                        @click="onAddEvent"
                      >
                        <template #icon>
                          <n-icon size="12"><Plus /></n-icon>
                        </template>
                      </n-button>
                    </n-button-group>
                  </n-input-group>
                </div>
              </n-card>
            </FloatingWrapper>
          </div>
          <!-- demand -->
          <div class="flex flex-col items-center mb-4">
            <div class="w-full">
              <FloatingWrapper name="Demand Source" rounded>
                <n-transfer
                  ref="transfer"
                  v-model:value="demand"
                  :options="demandOptions"
                  :disabled="isDisableDemands"
                  :render-target-list="renderTargetList"
                  @update:value="onChangeDemandAccept"
                />
              </FloatingWrapper>
            </div>
          </div>
        </n-card>
        <div class="flex flex-row-reverse sticky bottom-0 p-2">
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
</template>

<style lang="scss">
.dynamic-button {
  padding: 0 0.5rem;
}
</style>
