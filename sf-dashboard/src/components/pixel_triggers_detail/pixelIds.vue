<script setup lang="ts">
import { ctr_pixel } from '@/services/ctr_pixel'

import PixelTriggersDetail from '@/store/details/usePixelTriggersDetail'
import { SelectOption, TransferRenderTargetLabel } from 'naive-ui'
const usePixelTriggersDetail = PixelTriggersDetail()
const optionPixels = ref<[]>()
const pixels = ref<SelectOption[]>([])
const isPixelLoading = ref<boolean>(false)

interface CustomTransferOption {
  label: string
  value: string | number
  status?: string
}

const renderSourceLabel: TransferRenderTargetLabel = function ({ option }) {
  return renderLabel(option)
}
const renderTargetLabel: TransferRenderTargetLabel = function ({ option }) {
  return renderLabel(option, true)
}

const renderLabel = (option: CustomTransferOption, target: boolean = false) => {
  let tag = 'div'
  if (target) {
    tag = 'a'
  }
  const customOption = option as CustomTransferOption

  const link = {
    href: `/pixel/edit/${customOption.value}`,
    target: '_blank',
  }

  const isOff = customOption.status === 'off'

  return h(
    'div',
    {
      class: 'flex items-center',
    },
    {
      default: () => [
        h(
          'div',
          { class: 'flex gap-2 items-center' + (isOff ? ' opacity-50' : '') },
          [
            h(tag, link, customOption.label),
            isOff
              ? h(
                  'div',
                  { class: 'text-xs text-red-500' },
                  { default: () => customOption.status?.toUpperCase() }
                )
              : null,
          ]
        ),
        h(
          'a',
          {
            class: 'ml-auto pr-4 text-blue-500',
            ...link,
          },
          'Open'
        ),
      ],
    }
  )
}

const getListPixel = async () => {
  isPixelLoading.value = true
  pixels.value = []
  // fetch list traffic source
  let data = await ctr_pixel.GetAll({ mode: 'all-status' })
  if (data.status) {
    if (data?.data) {
      pixels.value = pixels.value.concat(data.data || [])
      const option = data.data.map((item: any) => ({
        value: item.id,
        label: item.name,
        status: item.status,
        // disabled: item.status === 'off',
      }))
      optionPixels.value = option
    }
  }
  isPixelLoading.value = false
}
onMounted(async () => {
  await getListPixel()
})
</script>
<template>
  <div class="flex">
    <n-transfer
      v-model:value="usePixelTriggersDetail.pixelConfig.pixel_ids"
      multiple
      value-field="id"
      label-field="name"
      source-filterable
      :disabled="isPixelLoading || usePixelTriggersDetail.isLoading"
      :options="optionPixels"
      virtual-scroll
      :render-source-label="renderSourceLabel"
      :render-target-label="renderTargetLabel"
    />
  </div>
</template>
