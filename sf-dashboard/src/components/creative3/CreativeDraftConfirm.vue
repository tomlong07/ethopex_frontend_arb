<script setup lang="ts">
import DraftConfirm from '@/components/common/DraftConfirm.vue'
import storage from '@/plugins/storage'
import {
  creativeTypeClass,
  StatusCreativeManager,
} from '@/types/components/creative-v2'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  statusData: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})

const onStartOver = async () => {
  storage.remove()
  props.statusData.isLoading = false
}

const onContinue = async () => {
  const newData = helper.clone(storage.getData())
  for (const key in newData) {
    if (Object.prototype.hasOwnProperty.call(newData, key)) {
      const element = newData[key]
      ;(props.cre[key as keyof creativeTypeClass] as any) = element
    }
  }

  if (props.cre.images?.length) {
    //Xóa bỏ các media dư của chế độ add multiple creative nếu có
    if (props.cre.IsAcceptMultipleCreatives() && props.cre.images.length > 1) {
      props.cre.images = [props.cre.images[0]]
    }
    props.statusData.previewItem = helper.clone(props.cre.images[0])
  }
  props.statusData.isLoading = false
}
</script>

<template>
  <DraftConfirm
    @onContinue="onContinue"
    @onStartOver="onStartOver"
    :statusData="props.statusData"
    :newVer="true"
    text="creative"
  />
</template>
