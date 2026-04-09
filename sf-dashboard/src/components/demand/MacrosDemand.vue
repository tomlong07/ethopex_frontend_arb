<script setup lang="ts">
import demainStore from '@/store/details/useDemainStore'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { macrosTraffics } from '@/types/components/demand'
import Plus from '@/assets/icons/Plus.vue'
import ctr_demand_source from '@/services/ctr_demand_source'
import Minus from '@/assets/icons/Minus.vue'
import { SelectOption } from 'naive-ui'

const dataConfig = demainStore()
const macroValueOptions: Record<string, SelectOption[]> = {}
const id = Number(window.route.params.id || 0)
const isAddMode = computed<boolean>(() => id === 0)
const onDeleteMacro = (i: number, sup: string) => {
  dataConfig.demandConfig.macros.forEach((macros, index) => {
    if (macros.supply == sup) {
      macros.macro.splice(i, 1)
    }
  })
}

onMounted(async () => {
  dataConfig.clearData()
  dataConfig.isLoading = true
  if (!isAddMode.value) {
    dataConfig.isDisable = true
    //get demand config by id
    const result = await ctr_demand_source.GetByID(id)
    if (result?.status) {
      dataConfig.demandConfig = result.data
      dataConfig.isDisable = false
    } else {
      dataConfig.isDisable = true
    }
  } else {
    dataConfig.isDisable = false
  }
  // fetch list traffic source
  await getListTrafficSource()
  dataConfig.isLoading = false
})

const getListTrafficSource = async () => {
  dataConfig.isTabLoading = true
  // Reset tất cả trạng thái liên quan
  dataConfig.listTraffics = []
  dataConfig.arrayTrafficAllowed = []
  // dataConfig.demandConfig.macros = [];
  dataConfig.listTraffics.push({
    supply: 'default',
    name: 'Default',
    macro: [
      {
        name: '',
        value: '',
      },
    ],
  })
  // fetch list traffic source
  let result = await ctr_traffic_source.TrafficSourceAccept({
    demand: dataConfig.demandConfig.id,
  })

  const newData = result?.data?.traffic_sources || []

  newData.forEach((traffic: any) => {
    dataConfig.listTraffics.push({
      supply: traffic.value,
      name: traffic.name,
      macro: [
        {
          name: '',
          value: '',
        },
      ],
    })
  })

  onAddListMacroForTrafficSource()
  //prepare list macros
  handleMarcosByTrafficSource()
  dataConfig.isTabLoading = false
}

const getTotalMacros = (sup: string) => {
  if (macroValueOptions[sup]) {
    return macroValueOptions[sup].length
  }

  return 0
}

const handleMarcosByTrafficSource = async () => {
  dataConfig.isLoadingMacros = true
  let fetchMacros = await ctr_demand_source.GetMacroByType({ type: 'demand' })
  if (!fetchMacros.status) {
    dataConfig.isDisableMacros = true
  } else {
    dataConfig.listTraffics.forEach((traffic) => {
      macroValueOptions[traffic.supply] = []
      fetchMacros?.data?.forEach((macro: any) => {
        macroValueOptions[traffic.supply].push({
          id: macro.id,
          value: macro.name,
          label: `${macro.name}`,
          disabled: false,
        })
      })
    })
    dataConfig.isDisableMacros = false
  }
  dataConfig.isLoadingMacros = false
}

const onAddListMacroForTrafficSource = () => {
  dataConfig.listTraffics.forEach((tff: any) => {
    let obj = dataConfig.demandConfig.macros.find(
      (o) => o.supply === tff.supply
    )
    if (obj) {
      obj.name = tff.name as string
      dataConfig.arrayTrafficAllowed.push(obj)
    } else {
      dataConfig.arrayTrafficAllowed.push(tff as macrosTraffics)
    }
  })
  dataConfig.demandConfig.macros = dataConfig.arrayTrafficAllowed
}

const onAddMacro = (sup: string) => {
  dataConfig.demandConfig.macros.forEach((macros, index) => {
    if (macros.supply == sup) {
      macros.macro.push({
        name: '',
        value: '',
      })
    }
  })
}
</script>

<template>
  <div class="my-4 mt-5">
    <div class="w-full mb-4 font-medium text-gray-400">Macros (Key/Value)</div>
    <template v-if="dataConfig.isTabLoading">
      <n-spin size="small" />
    </template>
    <div v-else class="w-full macro">
      <n-tabs
        v-show="!dataConfig.isTabLoading"
        type="card"
        tab-style="min-width: 80px;"
      >
        <n-tab-pane
          v-for="(item, index) in dataConfig.demandConfig.macros"
          :key="index"
          class="tab-pane-macros"
          :name="item.name"
          :tab="item.name"
          :index="item.supply"
        >
          <n-input-group
            v-for="(macro, ind) in item.macro"
            :key="ind"
            class="pb-3 pt-2"
            :dfghjgdf="JSON.stringify(macro)"
          >
            <n-input
              v-model:value="macro.name"
              :disabled="dataConfig.isDisableMacros || dataConfig.isDisable"
              placeholder="Enter key of Macro!"
            />
            <n-select
              v-model:value="macro.value"
              clearable
              tag
              filterable
              :loading="dataConfig.isLoadingMacros"
              :disabled="dataConfig.isDisableMacros || dataConfig.isDisable"
              :options="macroValueOptions[item.supply]"
            />
            <n-button-group class="pl-2">
              <n-button
                ghost
                class="dynamic-button"
                :loading="dataConfig.isLoadingMacros"
                :disabled="
                  (ind === 0 && item.macro.length === 1) ||
                  dataConfig.isDisable ||
                  dataConfig.isDisableMacros
                "
                @click="onDeleteMacro(ind, item.supply)"
              >
                <template #icon>
                  <n-icon size="12"><Minus /></n-icon>
                </template>
              </n-button>
              <n-button
                ghost
                class="dynamic-button"
                :loading="dataConfig.isLoadingMacros"
                :disabled="
                  item.macro.length >= getTotalMacros(item.supply) ||
                  dataConfig.isDisable ||
                  dataConfig.isDisableMacros
                "
                @click="onAddMacro(item.supply)"
              >
                <template #icon>
                  <n-icon size="12"><plus /></n-icon>
                </template>
              </n-button>
            </n-button-group>
          </n-input-group>
        </n-tab-pane>
      </n-tabs>
    </div>
  </div>
</template>
