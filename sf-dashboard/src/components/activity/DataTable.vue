<script setup lang="ts">
import Skeleton from '@/components/skeleton/Skeleton.vue'
import { NTooltip } from 'naive-ui'
import { copyTextToClipboard } from '@/utils'
import { useModalSettingStore } from '@/store/activity/modalSetting'
import { useGroupFilterStore } from '@/store/activity/groupFilter'
import { useDataTableStore } from '@/store/activity/dataTable'
import { addTargetBlankToLinks } from '@/utils/utils'
import { useCkeditorLoader } from '@/composables/useCkeditorLoader'
import {
  HandleDataLogActivity,
  ILogDataType,
  IPayload,
} from '@/types/components/activity'
import DefaultIconAC from '@/assets/icons/activity/DefaultIconAC.vue'
import LogRuleSatisfy from '../common/LogRuleSatisfy.vue'
const CKEditor = defineAsyncComponent(() => import('../common/CKEditor.vue'))

// !! Props
const props = defineProps({
  isModal: {
    type: Boolean,
    default: false,
  },
})

// !! State
const modalSettingStore = useModalSettingStore()
const groupFilterStore = useGroupFilterStore()
const dataTableStore = useDataTableStore()

const { loadCkeditorScript, initEditor } = useCkeditorLoader()
const noteEditorRef = ref<InstanceType<typeof CKEditor>>()
const isLoadMore = ref(false)
const logHelper = new HandleDataLogActivity()

// !! Func
const isRequest = computed(() => {
  return groupFilterStore.isRequest
})

// Lấy và xử lý dữ liệu log history từ API
// Flow: Gọi API → Xử lý qua logHelper.ProcessAllLogs → Cập nhật store
const fetchLogHistory = async () => {
  try {
    const payloadLogHistory = dataTableStore.prepareLogHistoryPayload(
      groupFilterStore.payloadForAPI as IPayload
    )

    const result = await dataTableStore.getLogHistory(payloadLogHistory)

    if (result) {
      // Xử lý toàn bộ log qua logHelper (đã refactor logic vào đây)
      const processedLogs = await logHelper.ProcessAllLogs(
        dataTableStore.activityRawData,
        {
          modalSettingStore,
          dataTableStore,
          objectType: groupFilterStore.payloadForAPI.filter.objectType,
        }
      )

      // Nếu không có log nào sau khi xử lý
      if (!processedLogs.length) {
        dataTableStore.checkDisShowMore(dataTableStore.activityRawData?.length)
        handleCurrentDataLog()
        dataTableStore.textSearchBefore =
          groupFilterStore.payloadForAPI?.filter?.search || ''
        dataTableStore.isFirstTime = false
        return
      }

      // Thêm log đã xử lý vào danh sách
      dataTableStore.dataLogList.push(...processedLogs)

      dataTableStore.checkDisShowMore(dataTableStore.activityRawData?.length)

      handleCurrentDataLog()

      dataTableStore.textSearchBefore =
        groupFilterStore.payloadForAPI?.filter?.search || ''
    }

    dataTableStore.isFirstTime = false
  } catch (e) {
    console.error('fetchLogHistory: ', e)
  }
}

const handleCurrentDataLog = (): void => {
  if (!dataTableStore.curDataLog && dataTableStore.dataLogList?.length) {
    dataTableStore.curDataLog = dataTableStore.dataLogList[0]

    if (dataTableStore.curDataLog?.logic) {
      dataTableStore.convertDataTableLogic(dataTableStore.curDataLog)
    }
    processTableDataLog()
  }
}

const processTableDataLog = async () => {
  try {
    if (!dataTableStore.curDataLog) return

    if (dataTableStore.handleNoteLogIfMatched()) return

    dataTableStore.tableDataLog = dataTableStore.curDataLog.finalShow
  } catch (error) {
    console.error(error)
  }
}

// Check xem log hiện tại có phải là rule_satisfy không
const isTypeRuleSatisfy = computed(() => {
  return (
    dataTableStore.curDataLog &&
    dataTableStore.curDataLog.object === 'rule_satisfy'
  )
})

// Check xem log hiện tại có logic data không (cho rule_satisfy)
const isTypeRuleSatisfyLogic = computed(() => {
  return (
    dataTableStore.curDataLog &&
    dataTableStore.curDataLog.logic &&
    dataTableStore.curDataLog.logic.length > 0
  )
})

const clickChangeDataLog = (item: ILogDataType) => {
  dataTableStore.convertDataTableLogic(item)

  try {
    if (!item || dataTableStore.curDataLog?.id == item.id) return
    dataTableStore.curDataLog = item
    processTableDataLog()
  } catch (err) {
    console.error('clickChangeDataLog: ', err)
  }
}

const clickLoadMoreDataLog = async () => {
  if (dataTableStore.isDisShowMore || groupFilterStore.isRequest) return
  isLoadMore.value = true
  groupFilterStore.payload.page++
  nextTick(() => {
    const container = document.getElementById('data-log-container')
    if (container) {
      container.scrollTop = container.scrollHeight
    }
  })
  await fetchLogHistory()
  isLoadMore.value = false
}

const onChangeNoteEditor = (content: string) => {
  if (dataTableStore.curDataLog) {
    dataTableStore.curDataLog.note = addTargetBlankToLinks(content)
  }
}

const loadNoteDataEditor = async () => {
  try {
    await loadCkeditorScript()
    initEditor(noteEditorRef)
  } catch (error) {
    console.error('CKEditor load failed', error)
  }
}

const handleRefreshDataTable = async (isRefresh = false) => {
  groupFilterStore.isRequest = true
  if (isRefresh) {
    Object.assign(dataTableStore, {
      isDisShowMore: false,
      dataLogList: [],
      tableDataLog: [],
      curDataLog: null,
    })
    groupFilterStore.payload.page = 1
  }

  groupFilterStore.payload.page = dataTableStore.page
  groupFilterStore.payload.size = dataTableStore.pageSize

  await fetchLogHistory()
  groupFilterStore.isRequest = false
}

// !! Lifecycle hook
watch(
  [
    () => groupFilterStore.numRefresh,
    () => dataTableStore.page,
    () => dataTableStore.pageSize,
  ],
  async ([numRefresh], [prevRefresh]) => {
    const isRefreshTriggered = numRefresh !== prevRefresh
    await handleRefreshDataTable(isRefreshTriggered)
  },
  { immediate: true }
)

watch(
  () => dataTableStore.curDataLog?.note,
  (newVal) => {
    if (newVal) {
      loadNoteDataEditor()
    }
  },
  { immediate: true }
)

onMounted(async () => {
  modalSettingStore.fetchSettings()
})
</script>

<template>
  <div v-show="groupFilterStore.isRequest">
    <Skeleton :numberLoop="props.isModal ? 4 : undefined" />
  </div>
  <div
    v-show="dataTableStore.dataLogList?.length"
    class="flex flex-wrap md:flex-nowrap w-full bg-gray-100"
  >
    <div class="w-full md:w-4/12 bg-white">
      <div
        class="md:sticky"
        :class="props.isModal ? 'md:top-[20px]' : 'md:top-[70px]'"
        :style="
          props.isModal
            ? 'height: calc(100vh - 380px)'
            : 'height: calc(100vh - 80px)'
        "
      >
        <div
          class="overflow-y-auto border-l border-l-[#e9ecef] scroll-smooth custom-bg-activity"
          :style="props.isModal ? 'height: 60vh' : 'height: 70vh'"
          style="scrollbar-width: thin"
          id="data-log-container"
        >
          <div
            v-for="(item, key) of dataTableStore.dataLogList"
            :key="`${item.id}_${key}`"
            class="px-1 py-3 md:px-6 border border-[#e9ecef] border-l-0 cursor-pointer"
            :class="{
              'bg-blue-100': dataTableStore.isWorkerBlurItem(item),
              'bg-yellow-50': dataTableStore.curDataLog?.id == item.id,
            }"
            @click="clickChangeDataLog(item)"
          >
            <div class="flex items-start">
              <div class="flex flex-shrink-0 mx-auto pr-3">
                <template v-if="dataTableStore.isWorkerBlurItem(item)">
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <component
                        :is="dataTableStore.typeMapIcon.CHANGE_BID.icon"
                      />
                    </template>
                    <span>{{
                      dataTableStore.typeMapIcon[item.type.toUpperCase()]
                        .tooltip
                    }}</span>
                  </NTooltip>
                </template>
                <template
                  v-else-if="
                    dataTableStore.typeMapIcon[item.type.toUpperCase()]
                  "
                >
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <component
                        :is="
                          dataTableStore.typeMapIcon[item.type.toUpperCase()]
                            .icon
                        "
                      />
                    </template>
                    <span>{{
                      dataTableStore.typeMapIcon[item.type.toUpperCase()]
                        .tooltip
                    }}</span>
                  </NTooltip>
                </template>
                <template v-else>
                  <NTooltip trigger="hover">
                    <template #trigger>
                      <DefaultIconAC />
                    </template>
                  </NTooltip>
                </template>
              </div>
              <div
                class="flex-1 flex-shrink-0"
                :class="{ 'opacity-50': dataTableStore.isBlurItem(item) }"
              >
                <div class="pb-2 text-xs" v-html="item.title"></div>
                <div
                  class="flex flex-wrap items-center justify-between text-gray-600"
                >
                  <div class="text-xs leading-tight">
                    {{ item.user.email || '' }}
                  </div>
                  <div class="text-xs leading-tight" :title="item.timeTooltip">
                    {{ item.time }}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div v-if="isLoadMore" class="flex justify-center py-4">
            <n-spin size="small" />
          </div>
        </div>

        <div
          class="inline-flex items-center justify-center w-full border border-[#e9ecef] bg-white h-[60px]"
        >
          <div
            v-if="!dataTableStore.isDisShowMore"
            class="cursor-pointer border border-gray-800 hover:border-blue-500 hover:text-blue-500 rounded-md text-md text-gray-700 m-2 px-4 pt-2 pb-3 font-semibold max-w-xs max-h-12"
            @click="clickLoadMoreDataLog()"
          >
            {{ isRequest ? 'Loading...' : 'Load more' }}
          </div>
        </div>
      </div>
    </div>

    <div class="w-full md:w-8/12">
      <div class="flex justify-between items-center custom-header-activity">
        <div class="border-0 text-xl font-semibold pt-4 px-6">
          History:
          <span
            v-if="!dataTableStore.curDataLog?.rule_id"
            v-html="dataTableStore.curDataLog?.title"
          ></span>
          <a
            v-else
            :href="`/rule/edit/${dataTableStore.curDataLog?.rule_id}`"
            target="_blank"
            rel="noopener noreferrer"
            class="text-[#3361c4] hover:text-[#3361c4b2]"
          >
            <span v-html="dataTableStore.curDataLog?.title"></span>
          </a>
        </div>
        <div
          class="pt-4 px-6 cursor-pointer"
          @click="copyTextToClipboard(dataTableStore.curDataLog?.id)"
        >
          CopyID
        </div>
      </div>
      <div
        v-if="dataTableStore.curDataLog && dataTableStore.curDataLog?.reason"
        class="border-0 text-sm pt-4 px-6"
      >
        Reason: {{ dataTableStore.curDataLog?.reason }}
      </div>
      <div class="p-6" style="scrollbar-width: thin">
        <!-- Tắt ngày 09/10/2025 -> Theo logic mới -->
        <!-- <n-card
          v-if="
            dataTableStore.curDataLog?.logic &&
            dataTableStore.dataLogics.length > 0 &&
            dataTableStore.columnLogics &&
            !isTypeRuleSatisfy
          "
          class="mb-3"
          title="Logic"
        >
          <n-data-table
            :columns="dataTableStore.columnLogics"
            :data="dataTableStore.dataLogics"
          />
        </n-card> -->
        <n-card v-if="isTypeRuleSatisfy || isTypeRuleSatisfyLogic" class="mb-3">
          <template #header>
            <div class="flex justify-between items-center w-full">
              <span class="font-medium">Log Rule Satisfy</span>
              <span
                class="italic text-gray-400 font-normal text-sm"
                v-if="dataTableStore.curDataLog?.campaign_id"
              >
                Campaign ID: {{ dataTableStore.curDataLog?.campaign_id }}
              </span>
            </div>
          </template>

          <LogRuleSatisfy :data="dataTableStore.curDataLog" />
        </n-card>

        <n-card
          v-if="dataTableStore.curDataLog?.type !== 'note'"
          :title="isTypeRuleSatisfyLogic ? 'Change Log' : ''"
        >
          <div class="w-full overflow-x-auto scroll-smooth">
            <n-data-table
              :columns="dataTableStore.columnsV2"
              :data="dataTableStore.tableDataLog"
              :pagination="false"
              :bordered="true"
              :max-height="480"
              striped
              :style="{ minWidth: dataTableStore.totalTableWidth + 'px' }"
              class="w-full"
            />
          </div>
        </n-card>

        <n-card
          class="mt-4 border p-4 flex"
          title="Note"
          v-if="dataTableStore.curDataLog?.note"
        >
          <template #header-extra>
            <n-button @click="dataTableStore.saveNote()">Save</n-button>
          </template>
          <CKEditor
            :key="dataTableStore.curDataLog?.id"
            id="noteEditor"
            ref="noteEditorRef"
            :initData="dataTableStore.curDataLog?.note"
            :autoInit="false"
            @changeEditor="onChangeNoteEditor"
            title="Note Data"
            :isOpenTool="false"
            :onlyColorToolbar="true"
          />
        </n-card>
        <n-card
          class="mt-4 border flex"
          title="Description"
          v-if="dataTableStore.curDataLog?.description"
        >
          <n-scrollbar class="max-h-20 w-full">
            <pre
              class="whitespace-pre-wrap bg-gray-100 p-4"
              v-text="dataTableStore.curDataLog?.description"
            />
          </n-scrollbar>
        </n-card>
      </div>
    </div>
  </div>
</template>
