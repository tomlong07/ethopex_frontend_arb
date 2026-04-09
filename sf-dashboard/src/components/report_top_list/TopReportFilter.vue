<script setup lang="ts">
import { useReportV2 } from '@/store/report/report-v2'
import SkeletonSelect from '@/components/common/SkeletonSelect.vue'

import { FilterOpts, filterType } from '@/types/state/report'
import { ctr_report } from '@/services/ctr_report'
import { debounceV2 } from '@/utils'
import useReportTopList from '@/store/useReportTopList'

const reportStoreV2 = useReportV2(helper.truePath())()
const originalTitle = document.title
const showFilters = ref(true)
const reportTopListStore = useReportTopList()

const props = defineProps({
  pageType: {
    type: String,
    validator: (value: string) => ['report-top'].includes(value),
  },
})

watch(
  () => reportStoreV2.reportFilterOpts.loading,
  async (newValue, oldValue) => {
    if (!newValue) {
      reportStoreV2.reportFilterOpts.filter?.forEach(async (e) => {
        await fetchOptions(e)

        if (
          e.key &&
          e.documentTitle &&
          reportStoreV2.filter[e.key as keyof filterType]?.length === 1
        ) {
          try {
            // @ts-ignore
            const idNow = reportStoreV2.filter[e.key as keyof filterType][0]

            if (idNow) {
              changeTitle(e, idNow)
            }
          } catch {
            document.title = originalTitle
          }
        }
      })
    }
  }
)

const fetchOptions = async (item: FilterOpts, q?: string) => {
  if (item.options) {
    reportStoreV2.reportFilterState.State[item.key].options = item.options
    return
  }

  reportStoreV2.reportFilterState.State[item.key].loading = true

  const filterNow = reportStoreV2.filter[item.key as keyof filterType]
  const f = filterNow
    ? item.multiple
      ? (filterNow as string[]).join(',')
      : filterNow
    : ''

  let data = undefined

  try {
    if (item.method === 'POST') {
      data = item.payload ? JSON.parse(item.payload) : {}
    }
  } catch {}

  const result = await ctr_report.Ajax({
    url: item.url,
    method: item.method,
    params: {
      fi: '1',
      f: f,
      q: q,
    },

    data: data,
  })

  const dataField = item.dataField || 'data'

  if (dataField) {
    //Bình thường là result.data
    //Hỗ trợ cả nhiều cấp sâu vào
    //Ví dụ: 'data.accounts' -> result['data']['accounts']
    try {
      const dataFieldArr = dataField.split('.')
      let temp = result
      dataFieldArr.forEach((e) => {
        temp = temp[e]
      })
      if (temp && Array.isArray(temp)) {
        reportStoreV2.reportFilterState.State[item.key].options = temp || []
      } else {
        reportStoreV2.reportFilterState.State[item.key].options = []
      }
    } catch {
      reportStoreV2.reportFilterState.State[item.key].options = []
    }
  }

  reportStoreV2.reportFilterState.State[item.key].loading = false
}

const debouncedFetch = debounceV2(
  async (item: FilterOpts, query: string = '') => {
    await fetchOptions(item, query)
    reportStoreV2.reportFilterState.State[item.key].search = true
  },
  300
)

const handleSearch = (item: FilterOpts, query: string = '') => {
  if (item.client) return
  debouncedFetch(item, query) // Gọi debounce đã lưu trước đó
}

const blurHandle = async (item: FilterOpts) => {
  if (item.client) return

  if (reportStoreV2.reportFilterState.State[item.key].search) {
    //Nếu ko chọn gì thì fetch lại để lấy list data
    if (!reportStoreV2.filter[item.key as keyof filterType]?.length) {
      await helper.sleep(300)
      fetchOptions(item)
    }

    reportStoreV2.reportFilterState.State[item.key].search = false
  }
}

const changeTitle = (item: FilterOpts, idNow: any) => {
  try {
    const campName =
      reportStoreV2.reportFilterState.State[item.key].options?.find(
        (item) => item.value === idNow
      )?.label || idNow.toString()

    if (campName) {
      document.title = campName + ' || ' + originalTitle
    }
  } catch {
    document.title = originalTitle
  }
}

const updateSelect = (value: any, item: FilterOpts) => {
  reportStoreV2.filter[item.key as keyof filterType] = value
  if (props.pageType === 'report-top') {
    reportTopListStore.buildQueryReportFilter(value, item)
  }
  if (!item.documentTitle) return

  if (value.length === 1) {
    changeTitle(item, value[0])
  } else {
    document.title = originalTitle
  }
}

const toggleAll = (item: FilterOpts) => {
  if (!item.all || !item.multiple) return

  try {
    const isUnSelectAll =
      reportStoreV2.filter[item.key as keyof filterType]?.length ===
      reportStoreV2.reportFilterState.State[item.key].options?.length

    // @ts-ignore
    reportStoreV2.filter[item.key as keyof filterType] = []

    if (isUnSelectAll) return

    const field = item['value-field'] || 'value'

    reportStoreV2.reportFilterState.State[item.key].options.forEach(
      (element) => {
        // @ts-ignore
        reportStoreV2.filter[item.key as keyof filterType]?.push(element[field])
      }
    )
  } catch (error) {
    console.error(error)
  }
}
</script>
<template>
  <div
    class="flex gap-2 px-4 py-2"
    v-if="reportStoreV2.reportFilterOpts.loading"
  >
    <SkeletonSelect
      class="w-40"
      size="small"
      v-for="(item, index) in Array(7)"
      :key="index"
    />
  </div>
  <div
    class="flex flex-wrap justify-between bg-gray-100 px-4 py-2 report-child-wrapper"
    v-else
  >
    <div class="flex font-bold text-xs text-gray-500 items-center w-full mb-2">
      Filter:
      <n-switch
        v-model:value="showFilters"
        :disabled="reportStoreV2.isFetchingReport"
        class="mx-2"
        size="small"
      />
    </div>
    <n-collapse-transition :show="showFilters">
      <div class="flex flex-wrap justify-start gap-2">
        <template
          v-for="(item, index) in reportStoreV2.reportFilterOpts.filter"
          :key="index"
        >
          <div class="flex flex-col gap-1 w-40">
            <div class="font-bold text-xs text-gray-500">
              {{ item.name }}
            </div>

            <div class="flex month-report-class">
              <n-select
                v-model:value="reportStoreV2.filter[item.key as keyof filterType]"
                filterable
                placeholder="All"
                max-tag-count="responsive"
                size="small"
                :multiple="item.multiple"
                :label-field="item['label-field']"
                :value-field="item['value-field']"
                :clearable="item.clearable"
                :loading="
                  reportStoreV2.reportFilterState.State[item.key].loading
                "
                :options="
                  reportStoreV2.reportFilterState.State[item.key].options
                "
                :consistent-menu-width="false"
                :remote="!item.client"
                @blur="blurHandle(item)"
                @search="(q:string)=>handleSearch(item, q)"
                :on-update:value="(value:any)=>{updateSelect(value, item)}"
              >
                <template #action v-if="item.all && item.multiple"
                  ><div class="flex">
                    <n-button
                      size="small"
                      type="info"
                      @click="toggleAll(item)"
                      class="w-20 ml-auto"
                    >
                      All</n-button
                    >
                  </div>
                </template>
              </n-select>
            </div>
          </div>
        </template>
      </div>
    </n-collapse-transition>
  </div>
</template>
