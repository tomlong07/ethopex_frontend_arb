<script setup lang="ts">
import QuestionMAds from '@/store/useQuestionManagementAds'
import FloatingWrapper from '../common/FloatingWrapper.vue'
const useQuestionManagementAds = QuestionMAds()
const bulkMccInput = ref('')
const errorMessage = ref('')

const toggleAllMCC = () => {
  if (useQuestionManagementAds.isAllSelected) {
    useQuestionManagementAds.QuestionConfig.apply_mcc = []
    useQuestionManagementAds.mccOptions.forEach((opt) => {
      opt.disabled = false
    })
    useQuestionManagementAds.isAllSelected = false
  } else {
    useQuestionManagementAds.isAllSelected = true
    useQuestionManagementAds.QuestionConfig.apply_mcc =
      useQuestionManagementAds.mccOptions
        .filter((opt) => opt.value !== 'ALL')
        .map((opt) => String(opt.value))
  }
}

const handleMccSelection = (selected: string[]) => {
  if (selected.includes('ALL')) {
    useQuestionManagementAds.QuestionConfig.apply_mcc = ['ALL']
    useQuestionManagementAds.mccOptions.forEach((opt) => {
      opt.disabled = opt.value !== 'ALL'
    })
    useQuestionManagementAds.isAllSelected = true
  } else {
    useQuestionManagementAds.QuestionConfig.apply_mcc = selected
    useQuestionManagementAds.mccOptions.forEach((opt) => {
      opt.disabled = false
    })
    useQuestionManagementAds.isAllSelected =
      selected.length === useQuestionManagementAds.mccOptions.length - 1
  }
}

const openModal = () => {
  useQuestionManagementAds.isShowModalMcc = true
  errorMessage.value = ''
  const currentApplyMcc = useQuestionManagementAds.QuestionConfig.apply_mcc
  if (currentApplyMcc.includes('ALL')) {
    bulkMccInput.value = 'ALL'
  } else {
    bulkMccInput.value = currentApplyMcc.join('\n')
  }
}

const closeModal = () => {
  useQuestionManagementAds.isShowModalMcc = false
  bulkMccInput.value = ''
  errorMessage.value = ''
}

const validateAndProcessInput = () => {
  const inputValue = bulkMccInput.value.trim()

  if (inputValue.toUpperCase() === 'ALL') {
    return ['ALL']
  }
  // Tách chuỗi theo dấu phẩy hoặc xuống dòng
  const inputIds = inputValue
    .split(/[,\n\r]+/) // Tách theo dấu phẩy, xuống dòng
    .map((id) => id.trim()) // Loại bỏ khoảng trắng
    .filter((id) => id !== '') // Loại bỏ chuỗi rỗng

  const processedIds = []
  const invalidIds = []

  for (const id of inputIds) {
    const numericId = id.replace(/\D/g, '')
    if (numericId === '' || numericId !== id) {
      invalidIds.push(id)
    } else {
      processedIds.push(numericId)
    }
  }
  if (invalidIds.length > 0) {
    errorMessage.value = `Invalid ID (numbers only): ${invalidIds.join(', ')}`
    return null
  }
  const uniqueIds = [...new Set(processedIds)]
  if (uniqueIds.length !== processedIds.length) {
    errorMessage.value = 'Mcc Id cannot be duplicate'
    return null
  }
  return uniqueIds
}

const saveIdMcc = () => {
  const processedIds = validateAndProcessInput()

  if (!processedIds) {
    return
  }
  // Cập nhật vào store
  useQuestionManagementAds.QuestionConfig.apply_mcc = processedIds

  // Cập nhật trạng thái select all
  if (processedIds.includes('ALL')) {
    useQuestionManagementAds.mccOptions.forEach((opt) => {
      opt.disabled = opt.value !== 'ALL'
    })
    useQuestionManagementAds.isAllSelected = true
  } else {
    useQuestionManagementAds.mccOptions.forEach((opt) => {
      opt.disabled = false
    })

    const totalOptionsCount = useQuestionManagementAds.mccOptions.filter(
      (opt) => opt.value !== 'ALL'
    ).length
    useQuestionManagementAds.isAllSelected =
      processedIds.length === totalOptionsCount
  }
  closeModal()
}
</script>
<template>
  <div class="flex items-center gap-2">
    <FloatingWrapper name="Apply MCC">
      <n-select
        v-model:value="useQuestionManagementAds.QuestionConfig.apply_mcc"
        filterable
        :loading="useQuestionManagementAds.isMccLoading"
        :clearable="true"
        :max-tag-count="10"
        placeholder="Select Apply MCC"
        multiple
        :options="useQuestionManagementAds.mccOptions"
        @update:value="handleMccSelection"
      />
    </FloatingWrapper>

    <n-button
      :color="useQuestionManagementAds.isAllSelected ? '#f43f5e' : '#2d5cc8'"
      type="default"
      :loading="useQuestionManagementAds.isMccLoading"
      :disabled="useQuestionManagementAds.isMccLoading"
      @click="toggleAllMCC"
    >
      {{
        useQuestionManagementAds.isAllSelected ? 'Deselect All' : 'Select All'
      }}
    </n-button>
    <n-tooltip trigger="hover">
      <template #trigger>
        <n-button class="w-24" color="#f43f5e" @click="openModal()">
          Bulk Entry
        </n-button>
      </template>
      <span>Enter multiple MCC ids separated by commas or lines.</span>
    </n-tooltip>
    <n-modal
      v-model:show="useQuestionManagementAds.isShowModalMcc"
      preset="dialog"
      :closable="false"
      type="success"
      :show-icon="false"
      style="width: 60vw"
    >
      <template #header>
        <div class="flex-row">
          <div>MCC IDs bulk entry</div>
          <span class="text-sm font-normal"
            >Entries should be on separate commas or lines.</span
          >
        </div>
      </template>
      <div>
        <n-input
          v-model:value="bulkMccInput"
          type="textarea"
          placeholder="Ex. 123456, 884628&#10;345678&#10;567890&#10;Or type 'ALL' to select all"
          rows="10"
          :status="errorMessage ? 'error' : undefined"
        />
        <div v-if="errorMessage" class="text-red-500 text-sm mt-2">
          {{ errorMessage }}
        </div>
      </div>
      <template #action>
        <n-button @click="closeModal()"> Cancel </n-button>
        <n-button type="error" @click="saveIdMcc()"> Save </n-button>
      </template>
    </n-modal>
  </div>
</template>
