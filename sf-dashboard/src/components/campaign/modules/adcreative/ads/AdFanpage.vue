<script lang="ts" setup>
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { SelectOptionsManager } from '@/types/components/campaign-v2'
import useAdDataStore from '@/store/adDataStore'
import { debounceV2 } from '@/utils'
import { renderIcon } from '@/utils/utils'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import Edit20Regular from '@/assets/icons/Edit20Regular.vue'
import { optionCopy } from '@/options/campaign'
const adDataStore = useAdDataStore()

const props = defineProps({
  optionsManager: {
    type: Object as () => SelectOptionsManager,
    required: true,
  },

  isEdit: {
    type: Boolean,
    default: false,
  },

  item: {
    type: Object as () => any,
    required: true,
  },
})

const handleSearchFanpage = debounceV2(async (query?: string) => {
  props.optionsManager.fetchFanpageOptions({ q: query })
}, 300)

const copyHandle = (key: string, fanpage: string) => {
  switch (key) {
    case 'id':
      helper.copyText(fanpage)
      window.message.success('Copied!')

      break

    case 'name':
      copyFanpage(fanpage)
      break

    case 'edit_fanpage':
      adDataStore.openModalAd(props.item)
      break
  }
}

const copyFanpage = (fanpage: string) => {
  if (!fanpage) return
  const fp = props.optionsManager.fanpageOptions.find(
    (x) => x.post_id === fanpage
  )
  if (!fp) return

  helper.copyText(fp.name)
  window.message.success('Copied!')
}

const fp = 'Fanpage'
</script>
<template>
  <FloatingWrapper :name="fp" rounded>
    <div class="flex items-center gap-2">
      <n-select
        value-field="post_id"
        label-field="name"
        @search="handleSearchFanpage"
        filterable
        remote
        :value="props.item.fanpage"
        :placeholder="fp"
        :loading="props.optionsManager.loadingFanpage"
        :disabled="props.isEdit ? false : true"
        :options="props.optionsManager.fanpageOptions"
      />

      <n-dropdown
        trigger="hover"
        class="custom-dropdown-adg-creative"
        :options="optionCopy"
        @select="(key:string)=>{copyHandle(key, props.item?.fanpage)}"
      >
        <n-button class="always-on bg-white hover:!bg-white">
          <template #icon> <n-icon :component="ListStars" /> </template
        ></n-button>
      </n-dropdown>
    </div>
  </FloatingWrapper>
</template>
