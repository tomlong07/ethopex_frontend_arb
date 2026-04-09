<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import InformationCircleOutline from '@/assets/icons/InformationCircleOutline.vue'
import ErrorIcon from '@/assets/icons/ErrorIcon.vue'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const data = props.params.data

const createdTime = computed(() => {
  return helper.convertTimeV2(data?.created_at)
})

const widthNow = computed(() => {
  let icons = 0
  if (errorMessage) icons++
  if (warningMessage) icons++
  if (isCompany) icons++
  // Mỗi icon khoảng 1.6rem, cộng 0.4rem cho gap và margin
  return `${icons * 1.6 + 0.4}rem`
})

let errorMessage = props.params.data.error
let warningMessage = props.params.data.warning

if (errorMessage.includes('Status Link -')) errorMessage = ''

const isCompany = window.arb.isCompany()
</script>
<template>
  <div class="flex items-center w-full overflow-hidden gap-2">
    <div
      class="flex flex-col name-col-wrapper-camp"
      :style="{ width: `calc(100% - ${widthNow})` }"
    >
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
    <div class="flex items-center ml-auto gap-2 not-color-icon">
      <!-- tooltip error message -->
      <n-tooltip
        v-if="errorMessage"
        trigger="hover"
        :style="{ maxWidth: '400px' }"
      >
        <template #trigger>
          <n-icon size="20" color="red" class="!mt-0">
            <ErrorIcon />
          </n-icon>
        </template>
        <div>{{ errorMessage }}</div>
      </n-tooltip>
      <n-tooltip v-if="warningMessage" trigger="hover">
        <template #trigger>
          <n-icon size="20" color="orange" class="!mt-0">
            <ErrorIcon />
          </n-icon>
        </template>
        Recommendations:
        <div v-for="msg in warningMessage" :key="msg" class="italic text-xs">
          {{ msg }}
        </div>
      </n-tooltip>
      <n-tooltip trigger="hover" v-if="isCompany">
        <template #trigger>
          <n-icon
            size="20"
            class="!mt-0"
            :component="InformationCircleOutline"
          />
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
