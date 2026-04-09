<script setup lang="ts">
import { LabelModal } from '@/types/components/account-ad'
import { colorList, Color } from '@/components/account_ad/color'
import useAccountAd from '@/store/useAccountAd'
import Plus from '@/assets/icons/Plus.vue'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'

const accountAdStore = useAccountAd()

const props = defineProps({
  dataModalInfo: {
    type: Object as () => LabelModal,
    required: true,
  },
})

const isChooseThisLabel = (item: any): boolean => {
  if (!props.dataModalInfo.labels) return false

  for (let index = 0; index < props.dataModalInfo.labels.length; index++) {
    const element = props.dataModalInfo.labels[index]

    if (element.label === item.label) {
      return true
    }
  }

  return false
}

const toogleThisLabelToLabels = async (item: any) => {
  if (!props.dataModalInfo.labels) props.dataModalInfo.labels = []

  for (let index = 0; index < props.dataModalInfo.labels.length; index++) {
    const element = props.dataModalInfo.labels[index]

    if (element.label === item.label) {
      // if (props.dataModalInfo.labels.length === 1) {
      //   window.message.warning(arb.mess('one_lb'))

      //   return
      // }
      //vấn đề bị reference object
      props.dataModalInfo.labels.splice(index, 1)
      return
    }
  }

  props.dataModalInfo.labels.push(helper.clone(item))
}

const colorNow = (color?: string): Color => {
  if (!color) return {}
  return colorList[color]
}

const editThisLabel = (item: any) => {
  props.dataModalInfo.label = item.label
  props.dataModalInfo.color = item.color

  props.dataModalInfo.isUpdate = true
  props.dataModalInfo.hasLabelUpdate = true
  accountAdStore.showModalCreateLabel = true
}

const showModalCreate = () => {
  // Default color is pink when opened
  props.dataModalInfo.color = 'pink'
  props.dataModalInfo.label = ''
  props.dataModalInfo.isUpdate = false

  accountAdStore.showModalCreateLabel = true
}
</script>

<template>
  <div class="flex flex-col gap-4 h-full">
    <n-spin :show="dataModalInfo.loadingLabel">
      <div class="flex flex-col gap-4 overflow-y-auto" style="height: 500px">
        <div
          v-for="(item, index) in dataModalInfo.labelOptions"
          :key="index"
          class="flex items-center gap-2 label-tag-element"
        >
          <n-checkbox
            :checked="isChooseThisLabel(item)"
            @click="toogleThisLabelToLabels(item)"
          >
          </n-checkbox>
          <n-tag
            class="cursor-pointer py-2 w-full rounded hover:brightness-150 transition duration-200 n-tag-exclude"
            size="large"
            :color="{
            color: colorNow(item.color as string).color,
            textColor: colorNow(item.color as string).textColor,
          }"
            type="primary"
            @click="toogleThisLabelToLabels(item)"
          >
            {{ item.label }}
          </n-tag>

          <n-button quaternary @click="editThisLabel(item)"
            ><template #icon
              ><n-icon :component="Edit20Regular" size="14" /></template
          ></n-button>
        </div>
      </div>
    </n-spin>
    <n-tag class="cursor-pointer justify-center" @click="showModalCreate">
      Create a new label
      <template #icon>
        <n-icon :component="Plus" size="12" />
      </template>
    </n-tag>
  </div>
</template>
