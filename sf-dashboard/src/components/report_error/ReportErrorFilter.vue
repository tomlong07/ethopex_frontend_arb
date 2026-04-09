<script setup lang="ts">
import { useReportError } from '@/store/report-error'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import SettingsReportErr from './modal/SettingsReportErr.vue'
import DropCustom from '../common/DropCustom.vue'
import { AxiosRequestConfig } from 'axios'
import { FilterType } from '@/types/components/types'
import { debounceV2 } from '@/utils'
import TopDemension from './TopDemension.vue'
import { general } from '@/services/general'
import { TIME_OUT_SEARCH } from '@/constants/app'

const reportErrorStore = useReportError()

// Thêm các ref cần thiết
const dropCustomRefs = ref<InstanceType<typeof DropCustom>[]>([])
const dropCustomTimeOut = ref<Array<ReturnType<typeof setTimeout> | null>>([])

const selectDropTitle = computed(() => reportErrorStore.selectDropTitle)
const selectDropList = computed(
  () => reportErrorStore.reportParams.selectDropList
)
const selectOptions = computed(() => reportErrorStore.selectOptions)
const selectList = computed(() => reportErrorStore.selectList)
const ajaxObject = computed(() => reportErrorStore.ajaxObject)

onMounted(async () => {
  ajaxSelectHandle()
})

// Cleanup khi component bị unmount
onUnmounted(() => {
  dropCustomTimeOut.value.forEach((timeout) => {
    if (timeout) clearTimeout(timeout)
  })
})

// Các helper functions để kiểm tra config
const isHasAjax = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].ajax)
}

const isRemote = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].remote)
}

const isMultiple = (key: string) => {
  return !!(ajaxObject.value[key] && ajaxObject.value[key].multiple)
}

// Xử lý ajax cho tất cả select items
const ajaxSelectHandle = async () => {
  let ajaxList = [] as Promise<void>[]

  for (let index = 0; index < selectList.value.length; index++) {
    const item = selectList.value[index]

    if (!isHasAjax(item)) {
      continue
    }

    ajaxList.push(
      newAjaxFilter({ item: item, index: index, loading: true, first: true })
    )
  }

  await Promise.all(ajaxList)

  // Khởi tạo timeout array
  for (let index = 0; index < selectList.value.length; index++) {
    dropCustomTimeOut.value.push(null)
  }
}

// Hàm chính gọi API filter
const newAjaxFilter = async (options: FilterType) => {
  const element = ajaxObject.value[options.item]
  const opts: AxiosRequestConfig = {
    url: element.ajax,
    method: element.method || 'GET',
  }

  opts.params = {}

  // Thêm search query nếu có
  if (options.q) {
    opts.params.q = options.q
  }

  // Thêm filter values nếu có
  if (element.remote && selectDropList.value[options.item]) {
    const filterValue = selectDropList.value[options.item]

    // Kiểm tra nếu là array và có length > 0
    if (Array.isArray(filterValue) && filterValue.length > 0) {
      opts.params.f = filterValue.join(',')
    }
    // Nếu là string và không phải 'All'
    else if (
      typeof filterValue === 'string' &&
      filterValue !== 'All' &&
      filterValue !== ''
    ) {
      opts.params.f = filterValue
    }
  }

  // First load indicator
  if (element.remote && options.first) {
    opts.params.fi = '1'
  }

  // Set loading state
  if (options.loadingSearch) {
    dropCustomRefs.value[options.index].changeLoadingSearch(true)
  }

  try {
    const result = await general.fetchDataByOpts(opts)

    let data = []
    if (result?.status && result?.data) {
      data = result?.data
    }

    // Update options trong store
    reportErrorStore.changeOptionsByKey(options.item, data)
  } catch (error) {
    console.error('Error fetching filter data:', error)
  } finally {
    // Reset loading states
    if (options.loading) {
      if (dropCustomRefs.value[options.index]) {
        dropCustomRefs.value[options.index].changeLoading(false)
      }
    }

    if (options.loadingSearch) {
      dropCustomRefs.value[options.index].changeLoadingSearch(false)
    }
  }
}

// Debounced search cho remote filtering
const debouncedSearch = debounceV2(
  async (q: string, item: string, index: number) => {
    await newAjaxFilter({
      item,
      index,
      q,
      loadingSearch: true,
    })
  },
  TIME_OUT_SEARCH
)

// Xử lý search event
const handleSearch = (q: string, item: string, index: number) => {
  if (!isRemote(item)) return
  debouncedSearch(q, item, index)
}

// Update select dropdown values
const updateSelectDropList = (item: string, value: any) => {
  reportErrorStore.changeSelectDropListByKey(item, value)
}
</script>

<template>
  <div class="flex flex-wrap justify-between bg-gray-100 border-b filter">
    <div class="flex flex-wrap justify-start mx-2 my-2 gap-2">
      <DropCustom
        ref="dropCustomRefs"
        :name="reportErrorStore.valueById(item, 'name') as string || ''"
        :title="selectDropTitle[item]"
        :defaultValue="selectDropList[item]"
        :valueOptions="selectOptions[item] || []"
        v-for="(item, index) in selectList"
        v-memo="[item, selectDropList[item], selectOptions[item]]"
        :key="item"
        size="small"
        class="w-40"
        :isAjax="isHasAjax(item)"
        :remote="isRemote(item)"
        :multiple="isMultiple(item)"
        :clearable="true"
        :rawKey="item"
        @updateValue="(value:any) => updateSelectDropList(item, value)"
        @handleSearch="(q:string) => handleSearch(q, item, index)"
      />
    </div>
    <div class="flex items-center justify-end px-2 py-2 gap-4">
      <TopDemension />
      <ReportErrorOrderBy />
      <n-button
        quaternary
        circle
        @click="reportErrorStore.showSettingModal = true"
        class="hover:bg-gray-200 bg-white border border-gray-300 shadow-sm"
      >
        <template #icon>
          <n-icon size="22">
            <Settings20Regular />
          </n-icon>
        </template>
      </n-button>
    </div>
  </div>
  <SettingsReportErr />
</template>

<style scoped lang="scss">
.filter {
  border-left-width: 1px;
  border-right-width: 1px;
}
</style>
