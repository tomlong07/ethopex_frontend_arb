<script setup lang="ts">
import DraftConfirm from '@/components/common/DraftConfirm.vue'
import storage from '@/plugins/storage'
import { dataThumb } from '@/types/components/gallery'
import {
  landingTypeClass,
  prelanderConfigs,
  StatusState,
} from '@/types/components/landing'

const { landing, statusData } = defineProps<{
  landing: landingTypeClass
  statusData: StatusState
}>()

const draftConfirm = ref<InstanceType<typeof DraftConfirm>>()

const onStartOver = async () => {
  storage.remove()
  storage.removeBlocks()
  statusData.showModalSaveForm = false
  statusData.isLoading = false
}

const onContinue = async () => {
  const newData = helper.clone(storage.getData())
  if (newData && typeof newData === 'object') {
    const { thumbnails, ...rest } = newData
    Object.assign(landing, rest)
    if (thumbnails && Array.isArray(thumbnails)) {
      landing.thumbnails = thumbnails.map((thumb: any) => {
        const newImage = new dataThumb({ path: thumb.path })
        newImage.SetSuccess()
        return newImage
      })
    } else {
      landing.thumbnails = []
    }

    if (landing.prelander_configs) {
      landing.prelander_configs = new prelanderConfigs(
        landing.prelander_configs
      )
    }
  } else {
    console.warn('No valid draft data found')
  }
  statusData.showModalSaveForm = false
  statusData.isLoading = false
}
</script>

<template>
  <DraftConfirm
    @onContinue="onContinue"
    @onStartOver="onStartOver"
    :statusData="statusData"
    :newVer="true"
    :text="'landing page'"
    ref="draftConfirm"
  />
</template>
