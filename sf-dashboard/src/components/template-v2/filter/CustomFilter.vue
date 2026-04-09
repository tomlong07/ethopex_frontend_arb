<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ReportManagerCenter } from '@/types/components/report-v2'
import { useTemplateV2 } from '@/store/templateV2Store'
import { ctr_custom_filter } from '@/services/ctr_custom_filter'

const templateV2Store = useTemplateV2(helper.truePath())()

const props = defineProps({
  reportManager: {
    type: Object as () => ReportManagerCenter,
    required: true,
  },
})

const isDev = window.arb.isDev()

const customFilterOptions = ref<SelectOption[]>([])
const miniOptions = ref<{ [key: string]: SelectOption[] }>({})

const fetchCustomOptions = async () => {
  const result = await ctr_custom_filter.GetList({
    path: templateV2Store.baseConfigs.AjaxAPI(),
    path_url: helper.truePath(),
  })

  fmt.Println(result)

  customFilterOptions.value = result?.data?.options || []

  miniOptions.value = result?.data?.select_options || []
}

const labelNow = (value: string) => {
  const label = customFilterOptions.value.find((e) => e.value === value) as any
  return label?.label || value
}

const labelOptionNow = (key: string, value: string) => {
  const label = miniOptions.value[key].find((e) => e.value === value) as any
  return label?.label || value
}

const compareNow = (value: string, valueShow: string, html: boolean = true) => {
  const option = customFilterOptions.value.find((e) => e.value === value) as any

  if (miniOptions.value[option?.value]) {
    valueShow = labelOptionNow(option?.value, valueShow)
  }

  const valueShowNow = html
    ? `<span class="font-bold">${valueShow}</span>`
    : valueShow

  if (miniOptions.value[option?.value]) {
    const compare = isDev ? '=' : 'is'
    return labelNow(value) + ` ${compare} ` + valueShowNow
  }
  if (option?.type == 'number') {
    const compare = isDev ? '=' : 'is'
    return labelNow(value) + ` ${compare} ` + valueShowNow
  }

  if (isDev) {
    return labelNow(value) + ` LIKE '%${valueShowNow}%'`
  }

  return labelNow(value) + ` CONTAINS '${valueShowNow}'`
}

const copyThis = (value: string, valueShow: string) => {
  if (!isDev) return
  helper.copyText(compareNow(value, valueShow, false))
  window.message.success('Copied')
}

const customFilterColumn = ref()
const customFilterValue = ref<any>()

const queryNow = computed(() => {
  const queryNow = customFilterOptions.value.find(
    (e) => e.value === customFilterColumn.value
  ) as any

  return queryNow || {}
})

const isNumber = computed(() => {
  return queryNow.value?.type === 'number'
})

const selectOptionsNow = computed(() => {
  if (miniOptions.value[queryNow.value?.value]) {
    return miniOptions.value[queryNow.value.value] || []
  }

  return []
})

const handlePlk = (plkData: any) => {
  let lastData = { key: '', value: '' }
  loop1: for (const key in plkData) {
    if (Object.prototype.hasOwnProperty.call(plkData, key)) {
      for (let index = 0; index < customFilterOptions.value.length; index++) {
        if (customFilterOptions.value[index].value === key) {
          templateV2Store.customFilterV2[key] = plkData[key]

          lastData = { key, value: plkData[key] }
          continue loop1
        }
      }
    }
  }

  if (lastData?.key) {
    customFilterColumn.value = lastData.key
    customFilterValue.value = lastData.value
  }
}

watch(
  () => props.reportManager.initCustom,
  async (newValue, oldValue) => {
    await fetchCustomOptions()

    handlePlk(props.reportManager.plkCustomFilterData)
  }
)

const addCustomFilter = () => {
  templateV2Store.customFilterV2[customFilterColumn.value] =
    customFilterValue.value
}
const deleteThisCustom = (key: string) => {
  delete templateV2Store.customFilterV2[key]
}
const changeFilterColumn = (value: string) => {
  customFilterColumn.value = value
  customFilterValue.value = null
}

const textButtonNow = computed(() => {
  if (templateV2Store.customFilterV2[customFilterColumn.value]) {
    return 'Update'
  }

  return 'Add'
})
</script>

<template>
  <div
    class="flex p-2 bg-gray-100 main-group-child px-4 flex-col gap-2"
    v-if="customFilterOptions.length"
  >
    <div class="flex gap-2 items-center text-xs">
      <div class="flex flex-col my-2 w-40">
        <n-select
          v-model:value="customFilterColumn"
          :options="customFilterOptions"
          class="small-select-dropdown"
          :menu-props="{ class: 'small-select-dropdown' }"
          :placeholder="'Custom Filter'"
          size="small"
          :consistent-menu-width="false"
          filterable
          :on-update:value="changeFilterColumn"
        />
      </div>
      <div class="flex flex-col w-40 my-2">
        <n-select
          size="small"
          v-if="selectOptionsNow.length"
          :options="selectOptionsNow"
          class="small-select-dropdown"
          :menu-props="{ class: 'small-select-dropdown' }"
          v-model:value="customFilterValue"
        >
        </n-select>
        <n-input-number
          v-else-if="isNumber"
          v-model:value="customFilterValue"
          :show-button="false"
          size="small"
        />
        <n-input v-model:value="customFilterValue" size="small" v-else />
      </div>

      <n-button
        type="primary"
        size="small"
        @click="addCustomFilter"
        :disabled="!customFilterColumn || !customFilterValue"
      >
        {{ textButtonNow }}</n-button
      >
    </div>

    <div class="flex flex-wrap gap-2">
      <n-tag
        closable
        v-for="(value, key) in templateV2Store.customFilterV2"
        @close="deleteThisCustom(key as string)"
        @click="copyThis(key as string, value)"
        :class="{ 'cursor-copy': isDev }"
        :key="key"
      >
        <span class="flex max-w-80">
          <span
            class="overflow-hidden text-ellipsis text-xs"
            v-html="compareNow(key as string, value)"
          >
          </span>
        </span>
      </n-tag>
    </div>
  </div>
</template>
