<script setup lang="ts">
import { CreativeOptionManager } from '@/class/campaign'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import ListStars from '@/assets/icons/ListStars.vue'
import { renderIcon } from '@/utils/utils'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import Grid4 from '@/assets/icons/Grid4.vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'

const props = defineProps({
  name: {
    type: String,
    default: 'Creative',
  },

  class: {
    type: String,
    default: 'w-28',
  },

  disabled: {
    type: Boolean,
    default: false,
  },

  manager: {
    type: Object as () => CreativeOptionManager,
    required: true,
  },
  item: {
    type: Object as () => any,
    required: true,
  },

  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})
const value = defineModel<number>('value')

const copyHandle = (key: string, creative: number) => {
  switch (key) {
    case 'open':
      openCreative(creative)
      break
    case 'name':
      copyName(creative)
      break
    case 'creative_id':
      copyCreativeId(creative)
      break
  }
}
const openCreative = (creative: number) => {
  if (!creative) {
    window.message.warning(`Creative not found!`)
    return
  }
  window.open(`/creative/${creative}`, '_blank')
}

const copyName = (creative: number) => {
  const _creative = props.manager.options.find((item) => item.id === creative)
  if (!_creative || !_creative.name) {
    window.message.warning(`Creative name not found!`)
    return
  }
  helper.copyText(_creative.name)
  window.message.success('Copied!')
}

const copyCreativeId = (creative: number) => {
  if (!creative) {
    window.message.warning(`Creative ID not found!`)
    return
  }
  helper.copyText(creative)
  window.message.success('Copied!')
}

const optionCopy = [
  { key: 'open', label: 'Open', icon: renderIcon(Grid4) },
  { key: 'name', label: 'Copy Name', icon: renderIcon(CopyOutline) },
  { key: 'creative_id', label: 'Copy ID', icon: renderIcon(CopyOutline) },
]
</script>

<template>
  <FloatingWrapper :name="props.name">
    <div class="flex items-center gap-2 flex-1 min-w-0">
      <n-select
        v-model:value="value"
        filterable
        remote
        clearable
        value-field="id"
        label-field="name"
        :loading="props.manager.loading"
        :placeholder="props.name"
        :options="props.manager.options"
        :disabled="props.disabled"
      />
      <n-dropdown
        class="custom-dropdown-adg-creative"
        trigger="hover"
        :options="optionCopy"
        @select="(key:string)=>{copyHandle(key, Number(value))}"
      >
        <n-button class="always-on bg-white hover:!bg-white">
          <template #icon> <n-icon :component="ListStars" /> </template
        ></n-button>
      </n-dropdown>
    </div>
  </FloatingWrapper>
</template>
