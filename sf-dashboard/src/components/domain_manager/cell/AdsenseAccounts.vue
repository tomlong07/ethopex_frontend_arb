<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import { ColumnItem } from '@/types/state/general'
import { ctr_domain } from '@/services/ctr_domain'
import ReportGmailerrorredFilled from '@/assets/icons/ReportGmailerrorredFilled.vue'
import { StatusList } from '@/options/domain_manager'
import { TType } from '@/enum/naiveui'
const ConsentStates = defineAsyncComponent(() => import('./ConsentStates.vue'))

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const statusListShow = (status: string) => {
  const cloneList = helper.clone(StatusList)

  if (['submited', 'approved', 'review', 'rejected'].includes(status)) {
    cloneList.forEach((item: any) => {
      item.disabled = item.value !== 'delete'
    })
  }
  if (status === 'processing') {
    cloneList.forEach((item: any) => {
      item.disabled = true
    })
  }

  return cloneList
}

const typeNow = (status: string) => {
  const statusItem = StatusList.find((item) => item.value === status)
  return (statusItem?.type as TType) || undefined
}

const colorTag = (status: string) => {
  const statusItem = StatusList.find((item) => item.value === status)
  return statusItem
    ? statusItem.colorTag
      ? JSON.parse(statusItem.colorTag)
      : undefined
    : undefined
}

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''

const rawData = props.params.data?.domain_account || []

const fullData = reactive(
  rawData.map((item: any) => ({
    ...item,
    showLoading: false,
  }))
)

const renderOption = (option: any) => {
  if (!option) return null

  return h(
    'div',
    {
      style: { display: 'flex', alignItems: 'center', gap: '8px' },
      class: option.color,
    },
    option.label ? [h('span', option.label)] : []
  )
}

const changeStatus = async (newStatus: string, item: any) => {
  if (!urlAction) return

  let ok = true
  if (newStatus === 'delete') {
    ok = window.confirm('Are you sure you want to delete this account?')
  }
  if (!ok) return

  item.showLoading = true

  const result = await ctr_domain.ChangeStatusDomainAccount(urlAction, {
    domain_id: props.params.data?.id,
    account_id: item.account_id,
    status: newStatus,
  })

  if (result?.status) {
    item.status = newStatus
    window.message.success(
      `Status ${newStatus} for ${item.account} successfully!`
    )
  }
  item.showLoading = false
}

const textFull = (text: string) => {
  switch (text) {
    case 'Not found':
      return 'Not found: No ads.txt file was found when the site was last crawled.'
    case 'Unauthorized':
      return `Unauthorized: You publisher ID wasn't found in the ads.txt file, and AdSense can't show ads.`
    case 'Not applicable':
      return `Not applicable: Your publisher ID isn't needed in the ads.txt file.`
  }

  return text
}
</script>
<template>
  <div class="flex gap-1 flex-wrap">
    <div v-for="(item, index) in fullData" :key="index">
      <n-spin :show="item.showLoading" size="small">
        <n-tag
          :type="typeNow(item.status)"
          :color="colorTag(item.status)"
          class="adsense-tag w-32 justify-center relative n-tag-exclude"
          size="large"
        >
          <n-popselect
            class="pop-select-ad-status"
            :value="item.status"
            :options="statusListShow(item.status)"
            :render-label="renderOption"
            :on-update:value="(value:string) => changeStatus(value, item)"
          >
            <span
              class="overflow-hidden text-xs text-ellipsis"
              :title="item.account"
              >{{ item.account || 'N/A' }}</span
            >
          </n-popselect>

          <div class="flex gap-0.5 items-center">
            <n-popover
              trigger="hover"
              :show-arrow="false"
              v-if="
                ['submited', 'approved', 'review'].includes(item.status) &&
                item.status_adstxt !== 'Authorized'
              "
            >
              <template #trigger>
                <n-icon
                  :component="ReportGmailerrorredFilled"
                  color="#FF7F7F"
                  size="14"
                />
              </template>
              <span>{{ textFull(item.status_adstxt) }}</span>
            </n-popover>
            <ConsentStates :data="item" v-if="item.status === 'approved'" />
          </div>
        </n-tag>
      </n-spin>
      <div class="flex"></div>
    </div>
  </div>
</template>

<style lang="scss">
.pop-select-ad-status {
  margin-top: 0px !important;
}

.adsense-tag {
  .n-tag__content {
    overflow: hidden;
    text-overflow: ellipsis;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }
}
</style>
