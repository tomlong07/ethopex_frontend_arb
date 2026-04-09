<script setup lang="ts">
import Plus from '@/assets/icons/Plus.vue'
import useDomainManagerStore from '@/store/useDomainManagerStore'
import { DomainManagerModal } from '@/types/components/domain-manager'
import { ctr_domain } from '@/services/ctr_domain'
import { useTemplateV2 } from '@/store/templateV2Store'

const templateV2Store = useTemplateV2(helper.truePath())()

const domainManagerStore = useDomainManagerStore()

const dataModalInfo = ref<DomainManagerModal>(new DomainManagerModal())
const isSubmitting = ref(false)
const inputRef = ref<HTMLInputElement | null>(null)

const showInput = ref(false)

const search = ref('')

const labelShow = computed(() => {
  const keyword = search.value.trim().toLowerCase()
  if (!keyword) return dataModalInfo.value.labelOptions

  return dataModalInfo.value.labelOptions.filter((opt) => {
    const label = String(opt).toLowerCase()
    return label.includes(keyword)
  })
})

const isChooseThisItem = (item: any): boolean => {
  if (!dataModalInfo.value.labels) return false

  for (let index = 0; index < dataModalInfo.value.labels.length; index++) {
    const element = dataModalInfo.value.labels[index]

    if (element === item) {
      return true
    }
  }

  return false
}

const toogleThisItem = async (item: any) => {
  if (!dataModalInfo.value.labels) dataModalInfo.value.labels = []

  for (let index = 0; index < dataModalInfo.value.labels.length; index++) {
    const element = dataModalInfo.value.labels[index]

    if (element === item) {
      dataModalInfo.value.labels.splice(index, 1)
      return
    }
  }

  dataModalInfo.value.labels.push(item)
}

const submitForm = async () => {
  isSubmitting.value = true

  const result = await ctr_domain.SubmitLabel({
    domain_id: dataModalInfo.value.id,
    label: dataModalInfo.value.labels,
  })

  if (result?.status) {
    window.message.success('Update labels successfully')

    if (dataModalInfo.value.id) {
      templateV2Store.gridApiV2?.forEachNode((node) => {
        if (node.data.id === dataModalInfo.value.id) {
          node.setData({
            ...node.data,
            label: dataModalInfo.value.labels,
          })
        }
      })
    }

    domainManagerStore.showModal = false
  }
  isSubmitting.value = false
}

watch(
  () => domainManagerStore.showModal,
  async (newValue, oldValue) => {
    if (newValue) {
      dataModalInfo.value = new DomainManagerModal()
      dataModalInfo.value.id = domainManagerStore.dataLabels.id
      dataModalInfo.value.labels = domainManagerStore.dataLabels.labels || []

      dataModalInfo.value.updateSelectOptions()
    }
  }
)

const showInputNew = async () => {
  showInput.value = true
  await helper.sleep(0)

  inputRef.value?.focus()
}
const addNewLabel = (value: string) => {
  if (dataModalInfo.value.labelOptions?.includes(value)) {
    window.message.warning('This label is already exist')
    return
  }
  dataModalInfo.value.labelOptions?.push(value)

  dataModalInfo.value.labels?.push(value)
  showInput.value = false
}
</script>

<template>
  <n-modal v-model:show="domainManagerStore.showModal">
    <n-card
      style="width: 600px; height: 720px"
      :title="`Update Labels`"
      size="huge"
      role="dialog"
      aria-modal="true"
      :bordered="false"
    >
      <div class="flex flex-col gap-4 h-full">
        <n-input
          v-if="showInput"
          :on-change="addNewLabel"
          ref="inputRef"
          placeholder="Add new label"
          size="medium"
        ></n-input>
        <n-tag
          class="cursor-pointer justify-center"
          @click="showInputNew"
          size="large"
          v-else
        >
          Create a new label
          <template #icon>
            <n-icon :component="Plus" size="12" />
          </template>
        </n-tag>
        <n-spin :show="dataModalInfo.loadingLabel">
          <div
            class="flex flex-col gap-4 overflow-y-auto"
            style="height: 500px"
          >
            <n-input placeholder="Search" v-model:value="search" clearable />
            <div v-if="!labelShow.length" class="text-center font-bold mt-4">
              No Labels
            </div>
            <div
              v-for="(item, index) in labelShow"
              :key="index"
              class="flex items-center gap-2 label-tag-element"
            >
              <n-checkbox
                :checked="isChooseThisItem(item)"
                @click="toogleThisItem(item)"
              >
              </n-checkbox>
              <n-tag
                class="cursor-pointer py-2 w-full rounded hover:brightness-150 transition duration-200"
                size="large"
                type="primary"
                @click="toogleThisItem(item)"
              >
                {{ item }}
              </n-tag>
            </div>
          </div>
        </n-spin>
      </div>
      <template #footer>
        <div class="flex justify-end">
          <n-button
            class="button-apply"
            color="#f43f5e"
            :loading="isSubmitting"
            @click="submitForm()"
          >
            Submit
          </n-button>
        </div>
      </template>
    </n-card>
  </n-modal>
</template>
