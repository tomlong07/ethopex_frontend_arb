<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''

const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''
  return urlAction?.replace(':id', props.params.data.id)
})
</script>
<template>
  <div class="flex items-center w-full overflow-hidden gap-2">
    <div class="flex flex-col w-full">
      <a
        class="cursor-pointer text-blue-500 font-medium overflow-hidden text-ellipsis"
        target="_blank"
        :class="{ 'cursor-not-allowed': !editUrl }"
        :href="editUrl"
        :title="props.params.data?.name"
        v-if="editUrl && props.params.data.id"
      >
        {{ props.params.data?.name }}
      </a>
      <div class="text-xs text-gray-400 overflow-hidden text-ellipsis">
        {{ props.params.data?.user || props.params.data?.publisher }}
      </div>
    </div>
    <div class="flex items-center ml-auto w-5">
      <n-tooltip
        v-if="props.params.data?.total_account_suspended > 0"
        trigger="hover"
      >
        <template #trigger>
          <n-icon size="20" color="red">
            <ReportGmailerrorredFilled />
          </n-icon>
        </template>
        <div>
          Account Ads SUSPENDED:
          {{ props.params.data?.total_account_suspended }}
        </div>
      </n-tooltip>
    </div>
  </div>
</template>
