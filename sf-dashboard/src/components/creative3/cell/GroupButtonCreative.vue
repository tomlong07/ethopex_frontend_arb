<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Clone from '@/assets/icons/Clone.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

import TrashOutline from '@/assets/icons/TrashOutline.vue'
import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import { useTemplateV2 } from '@/store/templateV2Store'
import { ActionInfo, ColumnItem } from '@/types/state/general'
import { ctr_creative } from '@/services/ctr_creative'
const templateV2Store = useTemplateV2(helper.truePath())()

const isCloning = ref(false)

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const actionInfo = options?.actionInfo || []

const onDelete = async (item: ActionInfo) => {
  if (!item.action) return
  const messageConfirm = `Are you sure you want to delete creative ${props.params.data.name}?`
  const confirm = window.confirm(messageConfirm)
  if (!confirm) {
    window.message.info('Canceled')

    return
  }

  const result = await ctr_creative.RemoveV2(item.action, {
    id: props.params.data.creative_id,
  })
  if (result?.status) {
    window.message.success('Delete creative successfully')
    templateV2Store.removeRowFromTable(
      'creative_id',
      props.params.data.creative_id
    )
  }
}
const onClone = async (item: ActionInfo) => {
  if (!item.action) return

  const messageConfirm = `Are you sure you want to clone creative ${props.params.data.name}?`
  const confirm = window.confirm(messageConfirm)
  if (!confirm) {
    window.message.info('Canceled')
    return
  }

  isCloning.value = true
  try {
    const result = await ctr_creative.CloneV2(item.action, {
      id: props.params.data.id,
    })

    if (result?.status) {
      window.message.success('Clone creative successfully')
      templateV2Store.reInitTable()
    }
  } finally {
    isCloning.value = false
  }
}

const urlNow = (item: ActionInfo) => {
  if (!item.url || !props.params?.data?.id) return ''

  return item.url?.replace(':id', props.params.data.id)
}

const handleClick = (item: ActionInfo) => {
  if (!item.action) return

  if (item.delete) {
    onDelete(item)
  }

  if (item.clone) {
    onClone(item)
  }
}

const tagNow = (item: ActionInfo) => {
  if (!item.url) return 'div'
  if (item.aTag) return 'a'

  return 'router-link'
}

const toNow = (item: ActionInfo) => {
  if (!item.url) return undefined
  if (item.aTag) return undefined
  return urlNow(item)
}

const hrefNow = (item: ActionInfo) => {
  if (item.aTag || item.url) return urlNow(item)
  return undefined
}

const targetNow = (item: ActionInfo) => {
  if (!item.url) return undefined
  if (item.aTag) return '_blank'
  return undefined
}
</script>
<template>
  <div class="flex w-full h-full items-center" style="margin-top: -2px">
    <component
      :is="tagNow(item)"
      :to="toNow(item)"
      :href="hrefNow(item)"
      :target="targetNow(item)"
      v-for="(item, index) in actionInfo"
      :key="index"
      @click="handleClick(item)"
    >
      <n-icon
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        :class="{ 'opacity-50 pointer-events-none': isCloning && item.clone }"
        :title="item.title"
        size="35"
      >
        <n-spin v-if="item.clone && isCloning" :size="20" />
        <Settings20Regular v-else-if="item.icon === 'edit'" />
        <TrashOutline v-else-if="item.icon === 'remove'" />
        <DuplicateOutline v-else-if="item.icon === 'duplicate'" />
        <Clone v-else-if="item.icon === 'clone'" />
      </n-icon>
    </component>
  </div>
</template>
