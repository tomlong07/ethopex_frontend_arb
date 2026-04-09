<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import useAccountAd from '@/store/useAccountAd'
import { ctr_supply_account } from '@/services/ctr_supply_account'

const accountAdStore = useAccountAd()

const isShowModel = ref<boolean>(false)
const isLoading = ref<boolean>(false)
const formData = ref({
  accounts: '',
  labels: [],
})

const selectOptions = ref<SelectOption[]>([])

const fetLabel = async () => {
  try {
    const response = await ctr_supply_account.GetLabel()
    selectOptions.value = response.data.map((item: { label: string }) => ({
      label: item.label,
      value: item.label,
    }))
  } catch (error) {
    console.error('Failed to fetch labels:', error)
  }
}

// const processedAccountId = computed(() => {
//   if (!formData.value.accounts) return ''

//   const items = formData.value.accounts
//     .split(/[\n,]/)
//     .map((item) => item.trim())
//     .filter((item) => item !== '')

//   return items.join('\n')
// })

// Chuyển đổi accountId thành mảng
const processedAccountIdArray = computed(() => {
  if (!formData.value.accounts) return []

  const items = formData.value.accounts
    .split(/[\n,]/)
    .map((item) => item.trim())
    .filter((item) => item !== '')

  return items
})

const handleSubmit = async () => {
  isLoading.value = true
  let loadingMessage = window.message.loading('Processing update labels...', {
    duration: 0,
  })

  try {
    const payload = {
      accounts: processedAccountIdArray.value,
      labels: formData.value.labels,
    }

    const response = await ctr_supply_account.UpdateLabelsForAccountAds(payload)

    if (response.status) {
      window.message.success('Account labels added successfully!')
      handleCancel()

      loadingMessage.destroy()
      loadingMessage = window.message.loading('Reloading table data...', {
        duration: 0,
      })

      await accountAdStore.GetAccountAdsDetail()
    }
  } catch {
    window.message.error('Failed to add account labels. Please try again.')
  } finally {
    loadingMessage.destroy()
    isLoading.value = false
  }
}

const handleCancel = () => {
  isShowModel.value = false
  formData.value = {
    accounts: '',
    labels: [],
  }
}

// Xử lý khi blur khỏi textarea
const handleBlur = () => {
  if (processedAccountIdArray.value.length > 0) {
    formData.value.accounts = processedAccountIdArray.value.join('\n')
  }
}

onMounted(() => {
  fetLabel()
})
</script>

<template>
  <n-button type="primary" size="small" @click="isShowModel = true">
    {{ 'Set Account Labels' }}
  </n-button>

  <!-- Modal popup -->
  <n-modal v-model:show="isShowModel">
    <n-card
      style="width: 1000px"
      title="Set Account Labels"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="pb-[20px]">
        <n-form :model="formData" label-placement="top">
          <n-form-item label="Label" path="label">
            <n-select
              v-model:value="formData.labels"
              :options="selectOptions"
              placeholder="Choose labels"
              clearable
              filterable
              multiple
              max-tag-count="responsive"
            />
          </n-form-item>

          <n-form-item label="Account ID" path="Accounts">
            <n-input
              v-model:value="formData.accounts"
              type="textarea"
              placeholder="Enter List Ad Account ID..."
              :rows="6"
              @blur="handleBlur"
            />
          </n-form-item>

          <div class="text-xs text-red-500 italic">
            New labels will be added to the existing ones.
          </div>

          <n-form-item>
            <div class="flex justify-end gap-3 w-full">
              <n-button @click="handleCancel" :disabled="isLoading">
                Cancel
              </n-button>
              <n-button
                type="primary"
                @click="handleSubmit"
                :disabled="
                  !processedAccountIdArray.length ||
                  !formData.labels.length ||
                  isLoading
                "
                :loading="isLoading"
              >
                Submit
              </n-button>
            </div>
          </n-form-item>
        </n-form>
      </div>
    </n-card>
  </n-modal>
</template>
