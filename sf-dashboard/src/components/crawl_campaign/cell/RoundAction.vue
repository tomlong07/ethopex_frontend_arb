<script setup lang="ts">
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import { ICellRendererParams } from 'ag-grid-community'

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const selectedValue = ref(props.params?.value)
const show = ref(false)
const options = props.params?.colDef?.cellRendererParams?.options?.options || []
const actionURL =
  props.params?.colDef?.cellRendererParams?.options?.action || ''

const classNow = computed<any>(() => {
  return helper.classRender(props.params?.value || '')
})

const styleNow = computed<any>(() => {
  const value = props.params?.value.toLowerCase()
  switch (value) {
    case 'queue':
      return { color: 'white', textColor: '#48abf7', borderColor: '#48abf7' }

    case 'notfound':
      return {
        color: 'rgb(104, 97, 206)',
        textColor: 'white',
      }

    case 'running':
      return {
        color: 'rgb(0, 123, 255, 0.7)',
        textColor: 'white',
      }
  }

  return undefined
})

const handleUpdate = async (newValue: any) => {
  if (!props.params?.colDef?.field || !actionURL || !props.params.data.id)
    return
  show.value = true

  const result = await ctr_crawl_campaign.ChangeStatus(actionURL, {
    id: props.params.data.id,
    status: newValue,
  })

  if (result.status) {
    props.params.node.setDataValue(props.params?.colDef?.field, newValue)
    window.message.success('Success')
    selectedValue.value = newValue
  }

  show.value = false
}
</script>
<template>
  <div
    class="flex h-full items-center"
    v-if="props.params?.value && props.params?.value !== ''"
  >
    <n-spin :show="show" size="small">
      <n-popselect
        :value="selectedValue"
        :options="options"
        trigger="click"
        @update:value="handleUpdate"
      >
        <n-tag
          size="small"
          class="cursor-pointer"
          round
          :type="classNow"
          :color="styleNow"
        >
          {{ selectedValue?.toUpperCase() || '' }}
        </n-tag>
      </n-popselect>
    </n-spin>
  </div>
</template>
<style lang="scss">
.ag-cell-wrapper {
  height: 100%;
}
</style>
