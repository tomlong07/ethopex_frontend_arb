<script setup lang="ts">
import Close from '@/assets/icons/Close.vue'
import { ctr_label } from '@/services/ctr_label'
import { ctr_user } from '@/services/ctr_user'
import { useTemplateV2 } from '@/store/templateV2Store'
import { useUserLabel } from '@/store/useUserLabel'
import { SelectOption } from 'naive-ui'

const userLabelStore = useUserLabel()
const templateV2Store = useTemplateV2(helper.truePath())()

const labelNow = ref<string | null>(null)
const isLoading = ref(false)
const isSubmitBtnLoading = ref(false)
const labelOptions = ref<SelectOption[]>([])

const fetchLabel = async () => {
  const labelResult = await ctr_label.GetAll()
  const data = labelResult?.data || []

  labelOptions.value = data.map((el: any) => ({
    ...el,
    id: String(el.id),
  }))

  if (userLabelStore.labelName) {
    const find = labelOptions.value.find(
      (el: any) => el.name === userLabelStore.labelName
    )
    if (find) {
      labelNow.value = String(find.id)
    }
  }
}

watch(
  () => userLabelStore.showModal,
  (newVal) => {
    if (newVal) {
      labelNow.value = null
      fetchLabel()
    }
  }
)

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  const result = await ctr_user.ChangeLabelUser12({
    id: userLabelStore.userId,
    label: labelNow.value,
  })

  if (result?.status) {
    window.message.success('Success')
    userLabelStore.showModal = false

    if (userLabelStore.userId) {
      const selectedLabel = labelOptions.value.find(
        (el) => el.id === labelNow.value
      )
      const labelName = selectedLabel ? String(selectedLabel.name) : ''

      templateV2Store.changeTableInfo({
        conditionKey: { id: userLabelStore.userId },
        key: 'label',
        value: labelName,
      })

      templateV2Store.gridApiV2?.forEachNode((node) => {
        if (node.data.id == userLabelStore.userId) {
          node.setDataValue('label', labelName)
        }
      })
    }
  }

  isSubmitBtnLoading.value = false
}
</script>

<template>
  <n-modal v-model:show="userLabelStore.showModal">
    <n-card
      style="width: 600px; height: 400px"
      title="Assign Label"
      :bordered="false"
      size="huge"
      role="dialog"
      aria-modal="true"
    >
      <template #header-extra>
        <button @click="userLabelStore.showModal = false">
          <n-icon :component="Close" size="24" class="not-filter-icon" />
        </button>
      </template>

      <div class="flex flex-col gap-4">
        {{ userLabelStore.email }}
        <n-select
          v-model:value="labelNow"
          filterable
          clearable
          value-field="id"
          label-field="name"
          :loading="isLoading"
          placeholder="Label"
          :options="labelOptions"
        />

        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          class="ml-auto"
          :loading="isSubmitBtnLoading"
          @click="submitForm"
        >
          Submit
        </n-button>
      </div>
    </n-card>
  </n-modal>
</template>
