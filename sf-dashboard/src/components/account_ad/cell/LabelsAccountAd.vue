<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useAccountAd from '@/store/useAccountAd'
import { colorList, Color } from '@/components/account_ad/color'

const accountAdStore = useAccountAd()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const UpdateLabelAccountAd = () => {
  if (!props.params.data.id) return

  accountAdStore.dataLabel = {
    id: props.params?.data?.id,
    labels: helper.clone(props.params.value),
  }
  accountAdStore.type = 'labels'
  accountAdStore.showModal = true
}

const labelsNow = computed(() => {
  return props.params.value || []
})

const titleNow = computed(() => {
  return labelsNow.value.map((item: any) => item.label).join(', ')
})
const colorNow = (color?: string): Color => {
  if (!color) return {}
  return colorList[color]
}

//Lấy màu ở store để realtime hiển thị theo màu label, nếu nó được update sẽ cập nhật tất cả row
const colorNowV2 = (item: any): Color => {
  if (!item?.label) return {}
  const color = accountAdStore.colorMap[item.label] || item.color
  return colorNow(color)
}
</script>
<template>
  <div class="cursor-pointer" @click="UpdateLabelAccountAd">
    <div
      v-if="labelsNow.length"
      class="flex gap-2 overflow-hidden"
      :title="titleNow"
    >
      <div
        v-for="(item, index) in labelsNow"
        class="flex items-center gap-2"
        :key="index"
      >
        <n-tag
          round
          class="cursor-pointer py-2 rounded"
          size="medium"
          :color="{
            color: colorNowV2(item).color,
            textColor: colorNowV2(item).textColor,
          }"
          type="primary"
        >
          {{ item.label }}
        </n-tag>
      </div>
    </div>
    <span v-else>Click to set</span>
  </div>
</template>
