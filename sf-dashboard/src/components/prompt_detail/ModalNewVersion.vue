<script lang="ts" setup>
import PromtDetail from '@/store/details/PromptDetail'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import RemoveButton from '../creative3/RemoveButton.vue'
import { SelectOption } from 'naive-ui'
const usePromtDetail = PromtDetail()

const versionInput = ref('')
const promptInput = ref('')

const changeVersion = () => {
  if (!versionInput.value || !promptInput.value) {
    window.message.error('Version and prompt are required')
    return
  }

  const exists = usePromtDetail.selectData.versionOptions.some(
    (item) => item.value === versionInput.value
  )

  if (exists) return

  usePromtDetail.selectData.versionOptions.push({
    label: versionInput.value,
    value: versionInput.value,
    prompt: promptInput.value,
    time: new Date().toISOString(),
  })
}

const updateThisVersion = () => {
  if (!versionInput.value || !promptInput.value) {
    window.message.error('Version and prompt are required')
    return
  }

  const index = usePromtDetail.selectData.versionOptions.findIndex(
    (item) => item.value === versionInput.value
  )

  if (index === -1) {
    window.message.error('Version does not exist')
    return
  }

  usePromtDetail.selectData.versionOptions[index].prompt = promptInput.value
  window.message.success('Update success')
}

const removeVersion = (version: string) => {
  usePromtDetail.selectData.versionOptions =
    usePromtDetail.selectData.versionOptions.filter(
      (item) => item.value !== version
    )

  // Nếu xoá version đang chọn thì reset prompt và version
  if (usePromtDetail.dataConfig.version === version) {
    usePromtDetail.dataConfig.version = ''
    usePromtDetail.dataConfig.prompt = ''
  }
}

const setPrompt = (item: SelectOption) => {
  versionInput.value = item.value as string
  promptInput.value = (item as any).prompt || ''
}

const isShowConfirm = computed(() => {
  const exists = usePromtDetail.selectData.versionOptions.some(
    (item) => item.value === versionInput.value
  )
  return exists
})

const isDisabled = computed(() => {
  return !versionInput.value || !promptInput.value
})
</script>

<template>
  <n-modal
    v-model:show="usePromtDetail.showModal"
    preset="card"
    style="width: 800px"
    title="Versions Manage"
  >
    <div class="flex flex-col gap-4">
      <div class="flex flex-col gap-2">
        <FloatingWrapper name="Version" required
          ><n-input v-model:value="versionInput" clearable
        /></FloatingWrapper>

        <FloatingWrapper name="Prompt" required>
          <n-input
            v-model:value="promptInput"
            type="textarea"
            placeholder="Enter prompt"
            :autosize="{
              minRows: 10,
              maxRows: 35,
            }"
            clearable
            style="resize: both"
            maxlength="50000"
            show-count
          />
        </FloatingWrapper>
      </div>

      <div
        class="flex gap-4 flex-wrap"
        v-if="usePromtDetail.selectData.versionOptions?.length"
      >
        <n-button
          @click="setPrompt(item)"
          class="w-32"
          v-for="(item, index) in usePromtDetail.selectData.versionOptions"
          :key="index"
          ><div class="truncate">{{ item.value }}</div>
          <RemoveButton
            class="z-10"
            size="14"
            text="Remove"
            @onClick="() => removeVersion(item.value as string)"
          />
        </n-button>
      </div>
    </div>

    <template #footer>
      <div class="flex justify-end space-x-2">
        <n-button @click="usePromtDetail.showModal = false" size="small"
          >Close</n-button
        >

        <n-popconfirm
          @positive-click="updateThisVersion"
          :negative-text="null"
          v-if="isShowConfirm"
        >
          <template #trigger>
            <n-button type="primary" size="small" :disabled="isDisabled"
              >Submit</n-button
            >
          </template>
          Update prompt for this version?
        </n-popconfirm>

        <n-button
          type="primary"
          @click="changeVersion"
          size="small"
          v-else
          :disabled="isDisabled"
          >Submit</n-button
        >
      </div>
    </template>
  </n-modal>
</template>
