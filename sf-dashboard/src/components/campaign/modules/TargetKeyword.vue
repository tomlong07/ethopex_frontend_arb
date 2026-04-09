<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import {
  campaignTypeClass,
  StatusCampManager,
} from '@/types/components/campaign-v2'
import { debounceV2 } from '@/utils'
import { ctr_campaign } from '@/services/ctr_campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { INEX } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
  statusData: {
    type: Object as () => StatusCampManager,
    required: true,
  },
})
const targetKeywordOptions = ref<SelectOption[]>([])
const targetKeywordSearchOpts = ref<SelectOption[]>([])
const isShowBulkTargetKeyword = ref<boolean>(false)
const bulkKeywordInput = ref('')
const errorMessage = ref('')
const isLoading = ref<boolean>(false)

const fetchTargetKeyword = async (value: string = '') => {
  isLoading.value = true

  const result = await ctr_campaign.SearchTargetKeyword({ search: value })

  const isSelectedOpts = result?.data?.length
    ? result.data.map((item: any) => ({
        label: item,
        value: item,
      }))
    : []

  const isSearch = value !== ''
  if (isSearch) {
    const merged = [...targetKeywordOptions.value, ...isSelectedOpts]
    // Lọc trùng value
    targetKeywordOptions.value = merged.filter(
      (v, i, arr) => arr.findIndex((x) => x.value === v.value) === i
    )

    targetKeywordSearchOpts.value = isSelectedOpts
    console.log(targetKeywordSearchOpts.value)
  } else {
    targetKeywordOptions.value = isSelectedOpts
  }

  isLoading.value = false
}

const handleUpdateTargetKeyword = (val: string[]) => {
  const filters = props.campaign.filters

  if (filters && filters.keyword) {
    filters.keyword.values = val.filter((tgk) => tgk.trim() !== '')
  }
}

watch(
  () => props.statusData?.IsTabCampaign(),
  (v) => {
    if (v) {
      fetchTargetKeyword()
    }
  },
  { deep: true }
)

onMounted(() => {
  if (!props.campaign.filters) {
    props.campaign.filters = {}
  }

  if (!props.campaign.filters.keyword) {
    props.campaign.filters.keyword = {
      values: [],
      operator: INEX.INCLUDE,
    }
  }
})

const handleSearch = debounceV2((value: any) => {
  fetchTargetKeyword(value)
}, 300)

const openModal = () => {
  isShowBulkTargetKeyword.value = true
  errorMessage.value = ''
  const currentKeywords = props.campaign.filters?.keyword?.values || []
  bulkKeywordInput.value = currentKeywords.join('\n')
}

const closeModal = () => {
  isShowBulkTargetKeyword.value = false
  bulkKeywordInput.value = ''
  errorMessage.value = ''
}

const validateAndProcessInput = () => {
  const inputValue = bulkKeywordInput.value.trim()

  if (inputValue === '') {
    errorMessage.value = 'Please enter at least one keyword'
    return null
  }

  const inputKeywords = inputValue
    .split(/[,\n\r]+/) // Tách theo dấu phẩy, xuống dòng
    .map((keyword) => keyword.trim()) // Loại bỏ khoảng trắng
    .filter((keyword) => keyword !== '') // Loại bỏ chuỗi rỗng

  if (inputKeywords.length === 0) {
    errorMessage.value = 'No valid keywords found'
    return null
  }

  // Loại bỏ trùng lặp
  const uniqueKeywords = [...new Set(inputKeywords)]

  if (uniqueKeywords.length !== inputKeywords.length) {
    errorMessage.value = 'Keyword cannot be duplicate'
    return null
  }

  return uniqueKeywords
}

const saveKeywords = () => {
  const processedKeywords = validateAndProcessInput()

  if (!processedKeywords) {
    return
  }

  if (props.campaign.filters && props.campaign.filters.keyword) {
    props.campaign.filters.keyword.values = processedKeywords
  }

  closeModal()
}
const name = 'Target Keyword'
</script>

<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper
      :name="name"
      v-if="props.campaign.filters && props.campaign.filters?.keyword"
    >
      <n-select
        v-model:value="props.campaign.filters.keyword.values"
        filterable
        clearable
        multiple
        tag
        :loading="isLoading"
        placeholder="All"
        :options="targetKeywordOptions"
        @search="(q:string)=>handleSearch(q)"
        @update:value="handleUpdateTargetKeyword"
      >
        <template #empty>Enter text to add new target keyword</template>
      </n-select>
    </FloatingWrapper>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button class="w-20" size="small" @click="openModal()">
          Bulk Entry
        </n-button>
      </template>
      <span>Enter multiple keywords separated by commas or lines.</span>
    </n-tooltip>
    <n-modal
      v-model:show="isShowBulkTargetKeyword"
      preset="dialog"
      :closable="false"
      type="success"
      :show-icon="false"
      style="width: 60vw"
    >
      <template #header>
        <div class="flex-row">
          <div>Target Keywords bulk entry</div>
          <span class="text-sm font-normal"
            >Entries should be on separate commas or lines.</span
          >
        </div>
      </template>
      <div>
        <n-input
          v-model:value="bulkKeywordInput"
          type="textarea"
          placeholder="Ex. keyword1, keyword2&#10;keyword3&#10;keyword4"
          rows="10"
          :status="errorMessage ? 'error' : undefined"
        />
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </div>
      </div>
      <template #action>
        <n-button @click="closeModal()"> Cancel </n-button>
        <n-button type="error" @click="saveKeywords()"> Save </n-button>
      </template>
    </n-modal>
  </div>
</template>
