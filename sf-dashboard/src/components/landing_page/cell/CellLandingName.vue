<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'
import useModalLandingLink from '@/store/landing/modalLink'
import { DS } from '@/enum/campaign'
import Link45Deg from '@/assets/icons/Link45Deg.vue'
import { ColumnItem } from '@/types/state/general'

const modalLandingLinkStore = useModalLandingLink()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action?.replace(':id', props.params.data.id) || ''

const openModalLandingLink = () => {
  modalLandingLinkStore.openModal()
  modalLandingLinkStore.setData({
    landing_id: props.params.data?.id,
    landing_name: props.params.data?.name,
    slug: props.params.data?.slug,
    user_id: props.params.data?.user_id,
  })
}
</script>
<template>
  <div class="flex justify-between items-center">
    <div class="flex flex-col w-0 flex-1 overflow-hidden">
      <a
        class="text-xs cursor-pointer text-blue-500 font-medium overflow-hidden text-ellipsis whitespace-nowrap"
        target="_blank"
        :class="{ 'cursor-not-allowed': !urlAction }"
        :href="urlAction"
        :title="props.params.data.name"
        v-if="props.params.data.id"
      >
        {{ props.params.data.name }}
      </a>
      <div
        class="text-xs text-gray-400 overflow-hidden text-ellipsis whitespace-nowrap"
      >
        {{ props.params.data.user || props.params.data.publisher }}
      </div>
    </div>

    <n-popover
      trigger="hover"
      :show-arrow="false"
      v-if="
        props.params.data?.demand === DS.PUBPOWER &&
        props.params.data?.slug &&
        props.params.data?.status === 'on'
      "
    >
      <template #trigger>
        <button
          class="ml-auto text-xs text-gray-400 rounded hover:text-blue-300 whitespace-nowrap"
          @click="openModalLandingLink()"
        >
          <n-icon :component="Link45Deg" size="20" />
        </button>
      </template>
      Get Link
    </n-popover>
  </div>
</template>
