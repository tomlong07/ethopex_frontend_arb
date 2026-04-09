<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui'
import { useAssetGroupDetail } from '@/store/assetGroupDetail'

const show = ref(false)
const loading = ref(false)
const isLoadingModal = ref(false)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const assetGroupStore = useAssetGroupDetail()

const form = ref({ values: '' })
const rules = {
  values: [
    { required: true, message: 'Please enter IDs', trigger: ['blur', 'input'] },
  ],
}

const normalizeRawText = () => {
  const value = form.value.values.trim()

  const normalized =
    !value.includes('\n') && value.includes(',')
      ? value.replace(/\s*,\s*/g, ',').replace(/\s+/g, ',')
      : value
          .split(/\s*,\s*|\s+|\r?\n/)
          .filter(Boolean)
          .join(',')

  return normalized
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean)
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const accountIds = normalizeRawText()

    const validIds: string[] = []
    const invalidIds: string[] = []

    accountIds.forEach((id) => {
      if (assetGroupStore.adAccountOptions.some((opt) => opt.value === id)) {
        validIds.push(id)
      } else {
        invalidIds.push(id)
      }
    })

    if (invalidIds?.length > 0) {
      window.message.warning(
        `Some account IDs were removed because they are invalid: ${invalidIds.join(
          ', '
        )}`
      )
    }

    if (!validIds.length) {
      window.message.error('Please enter at least one valid ID')
      return
    }

    const trafficSource = assetGroupStore.currentTrafficSource

    assetGroupStore.updateAssetGroupByTrafficSource(
      trafficSource,
      {
        accounts: validIds,
      },
      true
    )
    message.success(`Added ${validIds?.length || 0} Ad Accounts`)

    show.value = false
    form.value.values = ''
  } catch (e: any) {
    message.error(e?.message || 'An error occurred.')
  } finally {
    loading.value = false
  }
}

const openModal = async () => {
  show.value = true
  isLoadingModal.value = true

  try {
    const adAccounts = assetGroupStore.assetEmpty?.accounts || []

    if (adAccounts?.length > 0) {
      form.value.values = adAccounts.join('\n')
    } else {
      form.value.values = ''
    }
  } finally {
    isLoadingModal.value = false
  }
}
</script>
<template>
  <div class="ml-2">
    <n-button size="medium" type="error" ghost @click="openModal"
      >Bulk Entry
    </n-button>
    <n-modal
      v-model:show="show"
      preset="card"
      style="width: 700px"
      title="Bulk Entry Ad Accounts"
    >
      <n-spin :show="isLoadingModal">
        <n-form ref="formRef" :model="form" :rules="rules">
          <n-form-item label="Enter Ad Accounts" path="values">
            <n-input
              v-model:value="form.values"
              type="textarea"
              rows="10"
              placeholder="Enter IDs..."
            />
          </n-form-item>
        </n-form>
      </n-spin>

      <template #footer>
        <div class="flex justify-end space-x-2">
          <n-button @click="show = false">Cancel</n-button>
          <n-button type="primary" :loading="loading" @click="handleSubmit"
            >Add</n-button
          >
        </div>
      </template>
    </n-modal>
  </div>
</template>
