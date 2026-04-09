<script setup lang="ts">
import { FormInst, useMessage } from 'naive-ui'
import { useAssetGroupDetail } from '@/store/assetGroupDetail'

const show = ref(false)
const loading = ref(false)
const formRef = ref<FormInst | null>(null)
const message = useMessage()
const assetGroupStore = useAssetGroupDetail()

const form = ref({ values: '' })
const rules = {
  values: [
    { required: true, message: 'Please enter IDs', trigger: ['blur', 'input'] },
  ],
}

const parseIds = (raw: string): string[] =>
  raw
    .split('\n')
    .map((v) => v.trim())
    .filter(Boolean)

const addFanpages = (ids: string[]) => {
  const existing = assetGroupStore.fanpageOptions || []
  const currentGroup = assetGroupStore.getCurrentAssetGroup
  const matched = new Map<string, any>()
  const unmatched: string[] = []

  ids.forEach((val) => {
    const found = existing.find((opt) => {
      const postId = String(opt.post_id ?? '')
      const id = String(opt.id ?? '')
      return (
        postId === val ||
        id === val ||
        postId.includes(val) ||
        val.includes(postId)
      )
    })
    if (found) matched.set(val, found)
    else unmatched.push(val)
  })

  const allIds = [
    ...(currentGroup.fanpages ?? []),
    ...unmatched,
    ...Array.from(matched.values()).map((opt) => opt.post_id || opt.id),
  ]

  const uniqueIds = [...new Set(allIds)]
  assetGroupStore.updateAssetGroupByTrafficSource(
    assetGroupStore.currentTrafficSource,
    {
      fanpages: uniqueIds,
    }
  )

  const newOptions = unmatched.map((val) => ({
    post_id: val,
    id: val,
    name: val,
    label: val,
    value: val,
  }))

  const updatedOptions = [
    ...existing,
    ...newOptions.filter(
      (opt) =>
        !existing.some(
          (exist) => exist.post_id === opt.post_id || exist.id === opt.post_id
        )
    ),
  ]

  assetGroupStore.fanpageOptions = updatedOptions
}

const handleSubmit = async () => {
  loading.value = true
  try {
    const ids = parseIds(form.value.values)
    if (!ids.length) {
      message.error('Please enter at least one ID')
      return
    }

    const trafficSource = assetGroupStore.currentTrafficSource
    if (!trafficSource) {
      message.error('Please select a traffic source first')
      return
    }

    addFanpages(ids)

    message.success(`Added ${ids.length} Fanpages`)
    show.value = false
    form.value.values = ''
  } catch (e: any) {
    message.error(e?.message || 'An error occurred.')
  } finally {
    loading.value = false
  }
}
</script>
<template>
  <div class="ml-2">
    <n-button size="medium" type="error" ghost @click="show = true"
      >Bulk Entry
    </n-button>
    <n-modal
      v-model:show="show"
      preset="card"
      style="width: 700px"
      title="Bulk Entry Fanpages"
    >
      <n-form ref="formRef" :model="form" :rules="rules">
        <n-form-item label="Enter IDs (one per line)" path="values">
          <n-input
            v-model:value="form.values"
            type="textarea"
            rows="10"
            placeholder="Enter IDs..."
          />
        </n-form-item>
      </n-form>
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
