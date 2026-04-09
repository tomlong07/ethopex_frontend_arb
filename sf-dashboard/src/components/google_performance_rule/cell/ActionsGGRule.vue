<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'
import { ColumnItem } from '@/types/state/general'
import Power from '@/assets/icons/Power.vue'
import MagicIcon from '@/assets/icons/MagicIcon.vue'
import Detail from '@/assets/icons/Detail.vue'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import TrashOutline from '@/assets/icons/TrashOutline.vue'

const useGooglePerformanceRule = GooglePerformanceRule()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const replaceQuery = options?.replace || ':id'
const editUrl = computed(() => {
  if (!urlAction) return ''

  const field = replaceQuery.replaceAll(':', '')

  const data = props.params.data

  if (!data[field]) return ''

  return urlAction?.replace(replaceQuery, data[field])
})
const id = props.params.data.id
const statusRule = props.params.data.status
const openModal = async (recordId: number, statusRule: string) => {
  // hàm SatisfyRule sẽ bật modal và get dữ liệu satisfy về
  await useGooglePerformanceRule.satisfyRule(recordId, statusRule)
}
</script>

<template>
  <div class="flex w-full h-full items-center" v-if="editUrl">
    <router-link :to="editUrl">
      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-icon
            size="32"
            class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
            :component="Settings20Regular"
          />
        </template>
        Edit
      </n-tooltip>
    </router-link>

    <div class="flex">
      <n-popconfirm
        positive-text="Start!"
        @positive-click="useGooglePerformanceRule.startRule(id, true)"
      >
        <template #trigger>
          <n-tooltip placement="top-end" trigger="hover">
            <template #trigger>
              <n-icon
                size="32"
                class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
                :component="Power"
              />
            </template>
            Start Rule
          </n-tooltip>
        </template>
        Confirm To Start Rule
      </n-popconfirm>

      <n-popconfirm
        v-if="!props.params.data.auto_apply"
        positive-text="Apply!"
        @positive-click="useGooglePerformanceRule.applyRule(id)"
      >
        <template #trigger>
          <n-tooltip placement="top-end" trigger="hover">
            <template #trigger>
              <n-icon
                size="32"
                class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
                :component="MagicIcon"
              />
            </template>
            Apply Rule
          </n-tooltip>
        </template>
        Confirm to Apply Rule
      </n-popconfirm>

      <n-tooltip placement="top-end" trigger="hover">
        <template #trigger>
          <n-icon
            size="32"
            class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
            :component="Detail"
            @click="openModal(id, statusRule)"
          />
        </template>
        Satisfy
      </n-tooltip>

      <n-popconfirm
        positive-text="Remove!"
        @positive-click="useGooglePerformanceRule.removeRule(id)"
      >
        <template #trigger>
          <n-tooltip placement="top-end" trigger="hover">
            <template #trigger>
              <n-icon
                size="32"
                class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
                :component="TrashOutline"
              />
            </template>
            Remove Rule
          </n-tooltip>
        </template>
        Confirm to Remove Rule
      </n-popconfirm>
    </div>
  </div>
</template>
