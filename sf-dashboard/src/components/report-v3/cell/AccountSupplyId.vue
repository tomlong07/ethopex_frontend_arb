<script setup lang="ts">
import GoogleBlack from '@/assets/icons/GoogleBlack.vue'
import { useReportV2 } from '@/store/report/report-v2'
import { TS } from '@/enum/campaign'
import { NTag, NButton, NDropdown, NIcon } from 'naive-ui'
import Promotions from './Promotions.vue'
import { optionsAccountSupply } from '@/options/report'
const props = defineProps({
  value: String,
  link: String,

  linkReport: String,

  account_status: String,
  account_id: String,

  dataProfile: Object,
  rowData: Object,
})

const reportStoreV2 = useReportV2(helper.truePath())()

const oldOcid = props.rowData?.account_supply?.ocid
const traffic_source_id = props.rowData?.campaign_name?.traffic_source_id
const special =
  reportStoreV2.reportPermission?.special &&
  props.rowData?.traffic_source === TS.GOOGLE &&
  props.rowData?.campaign_name?.traffic_source_id &&
  props.rowData?.account_supply?.account_id
    ? true
    : false

const ocid = ref<string>(oldOcid || '')

const buildLink = (linkPlus: string) => {
  return `https://ads.google.com/aw/${linkPlus}?campaignId=${traffic_source_id}&ocid=${ocid.value}`
}

const handleSelect = (key: string) => {
  if (!traffic_source_id) window.message.error('Traffic Source ID is missing')
  if (key === 'promotions') {
    window.open(
      `https://ads.google.com/aw/billing/promotions?ocid=${ocid.value}`,
      '_blank'
    )

    return
  }

  window.open(buildLink(key), '_blank')
}

const classNow = helper.classRender(props.account_status) as any

const copyID = () => {
  if (!props.account_id) return

  helper.copyText(props.account_id)
  window.message.success('ID Copied!')
}
</script>

<template>
  <div class="flex w-full gap-2">
    <div class="flex flex-col w-full overflow-hidden">
      <div size="small" text v-if="props.account_id">
        <a
          class="overflow-hidden text-ellipsis text-blue-500"
          :href="props.linkReport"
          target="_blank"
        >
          {{ value }}
        </a>
      </div>
      <span class="text-xs text-gray-500 w-fit" @click="copyID()">{{
        props.account_id
      }}</span>
    </div>

    <div
      v-if="props.link || props.account_status"
      class="ml-auto flex flex-row gap-2 items-center"
    >
      <n-tag
        round
        v-if="props.account_status"
        size="small"
        :type="classNow"
        class="text-xxs"
        >{{ account_status }}</n-tag
      >

      <template v-if="reportStoreV2.reportPermission?.special">
        <Promotions
          :data="props.rowData?.account_supply"
          :class="
            props.rowData?.account_supply?.account_id &&
            props.rowData?.account_supply?.object_type === 'cp'
              ? ''
              : 'invisible'
          "
        />

        <n-dropdown
          trigger="click"
          :options="optionsAccountSupply"
          @select="handleSelect"
          placement="right-start"
        >
          <n-button
            size="small"
            @click.stop
            text
            :class="special ? '' : 'invisible'"
          >
            <n-icon :component="GoogleBlack" size="16" />
          </n-button>
        </n-dropdown>
      </template>
    </div>
  </div>
</template>
