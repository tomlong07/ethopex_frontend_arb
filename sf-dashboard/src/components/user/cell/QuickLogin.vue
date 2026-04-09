<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import Settings20Regular from '@/assets/icons/Settings20Regular.vue'

import useGeneralStore from '@/store/useGeneralStore'
import LogInOutline from '@/assets/icons/LogInOutline.vue'
import { ColumnItem } from '@/types/state/general'
import { quickLogin } from '@/composables/user'
import BusinessCenter from '@/assets/icons/BusinessCenter.vue'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

const generalStore = useGeneralStore()

const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})
const options = (props.params as any).options as ColumnItem

const editUrl = options?.action?.replace(':id', props.params.data?.id) || ''

const permissionDuplicate = options?.duplicate

const showName = computed<string>(() => {
  if (!props.params.data.name.trim()) {
    return props.params.data.email
  }
  return `${props.params.data.email} (${props.params.data.name})`
})

const copyShowName = () => {
  helper.copyText(showName.value)
  window.message.success('Copied!')
}

const isComp = window.arb.isCompany()
const isAdmin = window.arb.isAdmin()
</script>
<template>
  <div class="flex flex-col gap-2">
    <!-- edit -->
    <div class="flex flex-col">
      <span
        class="cursor-copy text-sm font-semibold text-blue-500 hover:text-blue-700 block overflow-hidden text-ellipsis"
        @click="copyShowName"
        :title="showName"
      >
        {{ showName }}
      </span>

      <span class="text-xs text-gray-400 overflow-hidden text-ellipsis">
        {{ props.params.data?.account_manager }}</span
      >
    </div>
    <div class="flex">
      <a :href="editUrl" v-if="editUrl">
        <n-icon
          size="32"
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
          title="Edit"
          :component="Settings20Regular"
        />
      </a>
      <!-- quick login -->
      <div class="quick-login-dark-mode">
        <n-icon
          size="33"
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
          title="Quick Login"
          :component="LogInOutline"
          @click="
            quickLogin(props.params.data, {
              quickLoginURL: generalStore.quickLoginURL,
              hostURL: generalStore.hostURL,
              confirm: true,
            })
          "
        />
      </div>

      <a
        :href="`/asset-group/get-by-publisher/${props.params?.data?.email}`"
        v-if="isComp"
        target="_blank"
      >
        <n-icon
          size="33"
          :component="BusinessCenter"
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 icon-small-user justify-center"
          title="Asset Group"
        />
      </a>
      <a
        :href="`/user/add?duplicate=${props.params?.data?.id}`"
        v-if="permissionDuplicate"
        target="_blank"
      >
        <n-icon
          size="33"
          :component="DuplicateOutline"
          class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300 icon-small-user justify-center"
          title="Duplicate"
        />
      </a>
    </div>
  </div>
</template>

<style lang="scss">
.icon-small-user.n-icon svg {
  height: 0.6em !important;
  width: 0.6em !important;
}
</style>
