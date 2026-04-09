<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { ctr_filter } from '@/services/ctr_filter'
import { ctr_campaign } from '@/services/ctr_campaign'
import { useLocale } from '@/lang/messages'
import { useKeywordSetStore } from '@/store/details/kwsetStore'
const Message = useLocale(
  () => import('@/lang/vi/messages'),
  () => import('@/lang/en/messages')
)

const props = defineProps({
  id: {
    type: Number,
    required: true,
  },
})

const renderLabel = (option: SelectOption) => {
  return h('span', {
    title: option.name,
    innerHTML: option.name,
  })
}
const kwsetStore = useKeywordSetStore()
const campaignRef = ref<number[]>([])
const campaignRefID = ref<string>('')
const isLoadingCampaign = ref<boolean>(false)
const isSubmitBtnLoading = ref<boolean>(false)

const campaignOptions = ref<SelectOption[]>([])

const statusAll = computed<boolean>(() => {
  if (
    campaignRef.value &&
    campaignRef.value.length === campaignOptions.value.length
  ) {
    return false
  }

  return true
})

const textAll = computed<string>(() => {
  if (statusAll.value) {
    return 'Select'
  }

  return 'Unselect'
})

const isShowSelectCampaign = ref<boolean>(true)
const isShowCampaignId = ref<boolean>(true)

const onChangeCampaign = (value: number[]) => {
  campaignRef.value = value
}
const onChangeCampaignID = (value: string) => {
  campaignRefID.value = value
  const splitArray = campaignRefID.value.split(',')
  const finalArray = splitArray
    .map((item) => Number(item.trim()))
    .filter(Number)
  campaignRef.value = finalArray
}

const handleAll = () => {
  if (statusAll.value) {
    campaignRef.value = campaignOptions.value.map((a) => a.id) as number[]
    onChangeCampaign(campaignRef.value)
  } else {
    campaignRef.value = []
    onChangeCampaign(campaignRef.value)
  }
}

let searchTimeout: ReturnType<typeof setTimeout>

const handleSearch = async (query: string) => {
  if (query !== '') {
    isLoadingCampaign.value = true
    // Hủy bỏ timeout hiện tại nếu có
    if (searchTimeout) {
      clearTimeout(searchTimeout)
    }
    // Đặt một timeout mới để chạy đoạn mã sau 3 giây
    searchTimeout = setTimeout(async () => {
      await fetchCampaigns(query)
      isLoadingCampaign.value = false
    }, 500)
  }
}

const fetchCampaigns = async (q = '') => {
  isLoadingCampaign.value = true

  const tempOptions = [] as SelectOption[]

  //set options for special filter campaign, publisher, section
  const response = await ctr_filter.FilterCampaign({
    params: { q: q },
  })

  response?.data?.forEach((campaign: any) => {
    tempOptions.push({
      name: campaign.name,
      id: campaign.id,
    })
  })

  //tìm các campaign đã chọn, nếu chưa có trong tempOptions thì thêm vào (nếu có trong campaignOptions thì lấy từ campaignOptions)
  if (campaignRef.value && campaignRef.value.length) {
    campaignRef.value.forEach((element) => {
      if (!tempOptions.some((obj) => obj.id === element)) {
        if (campaignOptions.value.some((obj) => obj.id === element)) {
          tempOptions.push(
            campaignOptions.value.find(
              (obj) => obj.id === element
            ) as SelectOption
          )
        } else {
          tempOptions.push({
            id: element,
            name: `${element}`,
          })
        }
      }
    })
  }

  campaignOptions.value = tempOptions

  isLoadingCampaign.value = false
}

watch([campaignRef, campaignRefID], () => {
  if (campaignRef.value) {
    isShowSelectCampaign.value = true
    isShowCampaignId.value = false
  }
  if (campaignRefID.value) {
    isShowSelectCampaign.value = false
    isShowCampaignId.value = true
  }
})

onMounted(async () => {
  fetchCampaigns()
})

const submitForm = async () => {
  if (!campaignRef.value.length) {
    window.message.error('Please select campaigns')
    return
  }
  isSubmitBtnLoading.value = true

  await ctr_campaign.ChangeKeywordSet(props.id, campaignRef.value)
  // emit('updateTable')
  kwsetStore.fetchCampaignsUsed()

  isSubmitBtnLoading.value = false
}

const emit = defineEmits<{
  (e: 'updateTable'): void
}>()
</script>

<template>
  <n-card title="Add Keyword set to campaigns" class="mb-4">
    <div class="w-full flex gap-2" v-if="isShowSelectCampaign">
      <n-select
        v-model:value="campaignRef"
        multiple
        filterable
        clearable
        remote
        value-field="id"
        label-field="name"
        :render-label="renderLabel"
        :loading="isLoadingCampaign"
        :options="campaignOptions"
        :max-tag-count="0"
        @search="handleSearch"
        @update:value="onChangeCampaign"
      />
      <n-button
        class="w-24"
        :disabled="isLoadingCampaign"
        color="#2080f0"
        @click="handleAll"
        >{{ textAll }} All
      </n-button>
      <n-popconfirm @positive-click="submitForm">
        <template #trigger>
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isSubmitBtnLoading"
          >
            Save
          </n-button>
        </template>

        {{ Message.kwset }}
      </n-popconfirm>
    </div>

    <div
      class="w-full flex gap-2"
      style="margin-top: 20px"
      v-if="isShowCampaignId"
    >
      <n-input
        v-model:value="campaignRefID"
        :loading="isLoadingCampaign"
        :placeholder="Message.listcamp"
        class="mb-2"
        @change="onChangeCampaignID"
      />

      <n-popconfirm @positive-click="submitForm">
        <template #trigger>
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isSubmitBtnLoading"
          >
            Save
          </n-button>
        </template>
        {{ Message.kwset }}
      </n-popconfirm>
    </div>
  </n-card>
</template>
