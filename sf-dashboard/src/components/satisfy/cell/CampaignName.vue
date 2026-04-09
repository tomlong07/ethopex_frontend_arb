<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import BarCharLine from '@/assets/icons/BarCharLine.vue'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const createdTime = computed(() => {
  return helper.convertTimeV2(props.params.data.created_at)
})

const data = props.params.data
</script>
<template>
  <div class="flex items-center w-full overflow-hidden gap-2">
    <div class="flex flex-col name-col-wrapper-camp">
      <a
        class="text-xs cursor-pointer text-blue-500 font-medium overflow-hidden text-ellipsis"
        target="_blank"
        :href="`/campaign/${data.traffic_source}/${data.id}`"
        :title="props.params.data.name"
      >
        {{ props.params.data.name }}
      </a>
      <div class="text-xs text-gray-400 overflow-hidden text-ellipsiss">
        {{ props.params.data.email }}
      </div>
    </div>
    <div class="flex items-center ml-auto gap-2">
      <a
        target="_blank"
        :href="`/?plk=${props.params.data.plk}`"
        title="Open report in new tab"
      >
        <n-icon :component="BarCharLine" size="16" color="green"></n-icon>
      </a>

      <!-- tooltip error message -->
      <n-tooltip v-if="props.params.data.error" trigger="hover">
        <template #trigger>
          <n-icon size="24" color="red">
            <ReportGmailerrorredFilled />
          </n-icon>
        </template>
        <div>{{ props.params.data.error }}</div>
      </n-tooltip>
      <n-tooltip trigger="hover">
        <template #trigger>
          <n-icon size="20" class="!mt-0">
            <InformationCircleOutline />
          </n-icon>
        </template>
        <div>CPC: ${{ props.params.data.cpc }}</div>
        <div>Budget: ${{ props.params.data.budget }}</div>
        <div>Bidding: {{ props.params.data.bidding }}</div>
        <div>
          Creative:
          <a href="/creative/edit?id=1885" target="_blank">
            {{ props.params.data.creative }}
          </a>
        </div>
        <div>
          Landing Pages:
          <a :href="`${props.params.data.landing_pages}`" target="_blank">
            {{ props.params.data.landing_pages }}
          </a>
        </div>
        <div>CreateAt: {{ createdTime }}</div>
      </n-tooltip>
    </div>
  </div>
</template>

<style>
.name-col-wrapper-camp {
  width: calc(100% - 3.5rem);

  /* w-5 + gap-2 */
}
</style>
