<script setup lang="ts">
import { ref, onBeforeMount, onMounted, computed, nextTick } from 'vue'
import { useGroupFilterStore } from '@/store/activity/groupFilter'
import { useModalSettingStore } from '@/store/activity/modalSetting'
import SettingIcon from '@/assets/icons/SettingIcon.vue'
import { FilterItem } from '@/types/state/template'
import { SelectOption } from 'naive-ui'
import DateRanger from '../common/DateRanger.vue'
import { ctr_permission_settings } from '@/services/ctr_permission_settings'

const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
})

// !! State
const modalSettingStore = useModalSettingStore()
const groupFilterStore = useGroupFilterStore()
const dateRangerRef = ref<InstanceType<typeof DateRanger>>()

// !! Func
const submitSearch = async () => {
  groupFilterStore.syncPayloadToURL(props.isModal)
  groupFilterStore.handleRefresh()
}

const isLoading = ref(false)

const defaultDate = computed(() => {
  const start = groupFilterStore.payload.filter.startDate?.split(' ')[0]
  const end = groupFilterStore.payload.filter.endDate?.split(' ')[0]

  if (start && end) {
    return [start, end]
  }

  return groupFilterStore.defaultDate
})

const getExistFilters = async () => {
  isLoading.value = true

  const result = await ctr_permission_settings.PermissionFilters('/activity')

  groupFilterStore.filterSettings = result?.data?.options?.filters || []

  groupFilterStore.initFilters()

  await nextTick()
  groupFilterStore.syncDateRanger()

  isLoading.value = false
}

onBeforeMount(() => {
  const hasQuery = groupFilterStore.parseURLToPayload()

  if (!hasQuery && !props.isModal) {
    nextTick(() => {
      groupFilterStore.syncPayloadToURL()
    })
  }
})

onMounted(async () => {
  groupFilterStore.dateRangerComponent = dateRangerRef.value
  await getExistFilters()
})

const handleSearch = async (item: FilterItem, query: string) => {
  if (item.clientFilter) {
    isLoading.value = true

    const temp = [] as SelectOption[]

    if (groupFilterStore.filterManager[item.key].baseOptions) {
      groupFilterStore.filterManager[item.key].baseOptions?.forEach(
        (source: any) => {
          try {
            if (
              source.label.toLowerCase().includes(query.toLowerCase()) ||
              String(source.value).toLowerCase().includes(query.toLowerCase())
            ) {
              temp.push(helper.clone(source))
            }
          } catch {}
        }
      )
    }

    groupFilterStore.filterManager[item.key].options = temp
    isLoading.value = false
    return
  }

  if (query !== '') {
    isLoading.value = true
    // Hủy bỏ timeout hiện tại nếu có
    if (groupFilterStore.filterManager[item.key].searchTimeout) {
      clearTimeout(
        groupFilterStore.filterManager[item.key]
          .searchTimeout as unknown as number
      )
    }
    // Đặt một timeout mới để chạy đoạn mã sau 3 giây
    groupFilterStore.filterManager[item.key].searchTimeout = setTimeout(() => {
      groupFilterStore.getOneFilter(item, {
        f: groupFilterStore.payload.filter[item.key],
        q: query,
      })

      isLoading.value = false
    }, 500)
  }
}
const formatLabel = (label: string) => {
  if (!label) return ''
  return label
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
}
const formattedOptions = computed(() => {
  const result: Record<string, SelectOption[]> = {}

  for (const item of groupFilterStore.filterSettings) {
    const opts = groupFilterStore.filterManager[item.key]?.options || []
    result[item.key] = opts.map((opt) => {
      const label =
        item.key === 'objectType'
          ? formatLabel(opt.label as string)
          : (opt.label as string)

      return {
        label,
        value: String(opt.value),
      }
    })
  }

  return result
})
</script>

<template>
  <div class="border bg-gray-100 filter px-4">
    <div
      class="flex justify-between items-center flex-1 flex-shrink-0 w-full mx-auto"
    >
      <div class="flex flex-wrap md:flex-nowrap justify-start items-center">
        <div class="py-2 disableTextDateRanger">
          <DateRanger
            ref="dateRangerRef"
            :status="{ isFetching: false }"
            @updateDate="groupFilterStore.updateDatePicker"
            :defaultDate="defaultDate"
            :smallPicker="true"
          />
        </div>
      </div>
    </div>

    <div class="flex flex-wrap justify-between items-center py-2">
      <div class="flex flex-wrap items-center gap-2">
        <div
          class="flex flex-col gap-2"
          v-for="(item, index) in groupFilterStore.filterSettings"
          :key="item.key + index"
        >
          <div class="font-bold text-xs text-gray-500">{{ item.label }}</div>
          <div class="flex month-report-class">
            <n-select
              :remote="!item.clientFilter"
              filterable
              clearable
              class="w-40 special"
              placeholder="All"
              size="small"
              v-model:value="groupFilterStore.payload.filter[item.key]"
              :consistent-menu-width="false"
              :loading="groupFilterStore.filterManager[item.key]?.loading"
              :options="formattedOptions[item.key]"
              @search="(q:string) => handleSearch(item, q)"
            />
          </div>
        </div>
      </div>

      <div
        class="flex justify-end items-center py-2 gap-4"
        v-if="groupFilterStore.payload?.filter"
      >
        <n-button text @click="modalSettingStore.showModal = true">
          <n-icon :component="SettingIcon" size="20" />
        </n-button>
        <n-input
          v-model:value="groupFilterStore.payload.filter.search"
          class="mr-2"
          type="text"
          placeholder="Search"
          size="small"
          :disabled="groupFilterStore.isRequest"
          :style="{ width: '60%' }"
          @keydown.enter="submitSearch"
        />
        <n-button
          color="#f43f5e"
          size="small"
          :disabled="groupFilterStore.isRequest"
          @click="submitSearch"
        >
          Update
        </n-button>
      </div>
    </div>
  </div>
</template>

<style scoped lang="scss">
.filter {
  border-left-width: 1px;
  border-right-width: 1px;
  border-top-width: 1px;
  .label {
    width: 95px;
    height: 52px;
    background: #4a4950;
  }
  .icon-wrapper {
    background: #e5e4e7;
  }
  .icon-wrapper:hover {
    cursor: pointer;
  }
  .form-condition-wrapper {
    background: #f7f7f8;
    border: 1px solid #e5e4e7;
    padding: 4px;
  }
  .n-select {
    width: unset;
    height: unset;
    display: flex;
    .n-base-selection-label {
      padding-left: 8px;
    }
  }
  .select-option {
    width: 150px !important;
  }
  .button-apply {
    background: #f43f5e;
  }
  .select-s2 {
    width: 240px !important;
  }
  .select-condition {
    width: 300px !important;
  }
  .iconSuffix {
    cursor: pointer;
  }
}
</style>
