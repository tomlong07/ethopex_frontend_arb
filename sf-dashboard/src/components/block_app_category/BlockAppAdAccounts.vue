<script lang="ts" setup>
import { useBlockAppCategory } from '@/store/details/blockAppCategory'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
const blockAppCategoryStore = useBlockAppCategory()
const name = `Accounts`

const handleSearchAccounts = (query: string) => {
  blockAppCategoryStore.accountLoading = true
  const temp = [] as SelectOption[]

  blockAppCategoryStore.accountBaseOptions?.forEach((source: any) => {
    try {
      const realQuery = query.toLowerCase().replaceAll('-', '')

      if (
        source.name.toLowerCase().replaceAll('-', '').includes(realQuery) ||
        String(source.value)
          .toLowerCase()
          .replaceAll('-', '')
          .includes(realQuery)
      ) {
        temp.push(helper.clone(source))
      }

      blockAppCategoryStore.accountOptions = temp
    } catch {}
  })

  blockAppCategoryStore.accountLoading = false
}

onMounted(() => {
  blockAppCategoryStore.fetchAccounts()
})

const openModal = () => {
  blockAppCategoryStore.modalData =
    blockAppCategoryStore.blockAppCategoryData.accounts?.join('\n') || ''
  blockAppCategoryStore.showModal = true
}

const toggleAll = () => {
  if (
    blockAppCategoryStore.blockAppCategoryData.accounts?.length ===
    blockAppCategoryStore.accountBaseOptions.length
  ) {
    blockAppCategoryStore.blockAppCategoryData.accounts = []
  } else {
    blockAppCategoryStore.blockAppCategoryData.accounts =
      blockAppCategoryStore.accountBaseOptions.map((a) => a.value as string) ||
      []
  }
}

const resetOptions = async () => {
  await helper.sleep(200)
  blockAppCategoryStore.accountOptions = helper.clone(
    blockAppCategoryStore.accountBaseOptions
  )
}
</script>

<template>
  <div class="flex items-center">
    <div class="w-full flex items-center gap-2">
      <FloatingWrapper
        :name="name"
        :required="true"
        :error="blockAppCategoryStore.showErr['accounts']"
      >
        <n-select
          v-model:value="blockAppCategoryStore.blockAppCategoryData.accounts"
          filterable
          remote
          multiple
          value-field="value"
          label-field="name"
          :loading="blockAppCategoryStore.accountLoading"
          placeholder=""
          :options="blockAppCategoryStore.accountOptions"
          clearable
          :on-blur="resetOptions"
          :max-tag-count="10"
          @search="handleSearchAccounts"
        />
      </FloatingWrapper>

      <n-button type="info" @click="toggleAll">All</n-button>
      <n-button color="#f43f5e" @click="openModal">Bulk Entry</n-button>
    </div>
  </div>
</template>
