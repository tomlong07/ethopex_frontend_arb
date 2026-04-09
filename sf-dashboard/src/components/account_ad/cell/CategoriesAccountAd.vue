<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useAccountAd from '@/store/useAccountAd'

const accountAdStore = useAccountAd()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const UpdateCategoryAccountAd = () => {
  if (!props.params.data.id) return

  accountAdStore.dataCategories = {
    id: props.params?.data?.id,
    categories: props.params.value ? helper.clone(props.params.value) : [],
  }
  accountAdStore.type = 'categories'
  accountAdStore.showModal = true
}

const itemsNow = computed(() => {
  try {
    return JSON.parse(JSON.stringify(props.params.value)) || []
  } catch {
    return []
  }
})

const nameNow = computed(() => {
  const names: string[] = []

  itemsNow.value.forEach((element: string) => {
    for (
      let index = 0;
      index < accountAdStore.categoryOptions.length;
      index++
    ) {
      if (element === accountAdStore.categoryOptions[index].id) {
        names.push(accountAdStore.categoryOptions[index].name as string)
        break
      }
    }
  })

  return names
})

const titleNow = computed(() => {
  return nameNow.value.map((item: any) => item.label).join(', ')
})
</script>
<template>
  <div class="cursor-pointer" @click="UpdateCategoryAccountAd">
    <div
      v-if="itemsNow.length"
      class="flex gap-2 overflow-hidden"
      :title="titleNow"
    >
      <div
        v-for="(item, index) in nameNow"
        :key="index"
        class="flex items-center gap-2"
      >
        <n-tag
          round
          class="cursor-pointer py-2 rounded"
          size="medium"
          type="primary"
        >
          {{ item }}
        </n-tag>
      </div>
    </div>
    <span v-else>Click to set</span>
  </div>
</template>
