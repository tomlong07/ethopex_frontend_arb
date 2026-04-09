<script setup lang="ts">
import { LabelModal } from '@/types/components/account-ad'

const props = defineProps({
  dataModalInfo: {
    type: Object as () => LabelModal,
    required: true,
  },
})

const toogleThisItem = async (item: any) => {
  if (!props.dataModalInfo.categories) props.dataModalInfo.categories = []

  for (let index = 0; index < props.dataModalInfo.categories.length; index++) {
    const element = props.dataModalInfo.categories[index]

    if (element === item) {
      props.dataModalInfo.categories.splice(index, 1)
      return
    }
  }

  props.dataModalInfo.categories.push(item)
}

const cateNameById = (id: string) => {
  const res =
    props.dataModalInfo.categoryOptions.find((item) => item.id === id) ||
    undefined

  return res?.name || ''
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <n-spin :show="dataModalInfo.loadingCategory">
      <div class="flex flex-col gap-4 overflow-y-auto" style="height: 500px">
        <n-select
          v-model:value="props.dataModalInfo.categories"
          filterable
          multiple
          :loading="props.dataModalInfo.loadingCategory"
          :options="props.dataModalInfo.categoryOptions"
          value-field="id"
          label-field="name"
        />

        <div
          v-for="(item, index) in props.dataModalInfo.categories"
          :key="index"
          class="flex items-center gap-2 label-tag-element"
        >
          <n-tag
            class="cursor-pointer py-2 w-full rounded hover:brightness-150 transition duration-200"
            size="large"
            type="primary"
            title="Click to remove this category"
            @click="toogleThisItem(item)"
            >{{ cateNameById(item) }}
          </n-tag>
        </div>
      </div>
    </n-spin>
  </div>
</template>
