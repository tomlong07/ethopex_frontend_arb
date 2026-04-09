<script setup lang="ts">
import { ICellRendererParams } from 'ag-grid-community'

import { landing_on_delete } from '@/types/components/campaign'

import { ctr_landing_page } from '@/services/ctr_landing_page'
import { ColumnItem } from '@/types/state/general'
import DuplicateOutline from '@/assets/icons/DuplicateOutline.vue'

import TrashOutline from '@/assets/icons/TrashOutline.vue'
import EyeOutline from '@/assets/icons/EyeOutline.vue'

const showModalRef = ref(false)
const props = defineProps({
  params: {
    type: Object as () => ICellRendererParams,
    default: () => {},
    required: false,
  },
})

const options = (props.params as any).options as ColumnItem
const urlAction = options?.action || ''
const deleteURL = options?.action2

const landingOnDelete = ref<landing_on_delete>({
  idLanding: '',
})

const showOnDelete = showModalRef
const onDeleteClick = async () => {
  if (!deleteURL) return
  if (landingOnDelete.value.idLanding !== '') {
    const payload = {
      id: props.params.data.id,
      id_instead: parseInt(landingOnDelete.value.idLanding),
    }
    const result = await ctr_landing_page.RemoveV2(deleteURL, payload)
    if (result.status) {
      let selectedNode = props.params.node
      let selectedData = selectedNode.data
      ;(props.params.api as any).applyTransaction({ remove: [selectedData] })
      window.message.success(`Remove success!`)
    }
  } else {
    window.message.error(` ID does not exist!`)
  }
  showModalRef.value = false
}
const onCancelDeleteClick = () => {
  window.message.success('Cancel')
  showModalRef.value = false
}

const editUrl = computed(() => {
  if (!urlAction || !props.params?.data?.id) return ''

  return urlAction?.replace(':id', props.params.data.id)
})

const urlDuplicate = '/landing_page/add?duplicate/:id'
const duplicateUrl = computed(() => {
  return urlDuplicate?.replace(':id', props.params.data.id)
})

const isCompany = window.arb.isCompany()
</script>
<template>
  <div class="flex items-center">
    <!-- edit -->
    <a v-if="editUrl" :href="editUrl">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Edit"
        :component="EyeOutline"
      />
    </a>

    <!-- Duplicate -->
    <a v-if="duplicateUrl && isCompany" :href="duplicateUrl">
      <n-icon
        size="35"
        class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
        title="Duplicate"
        :component="DuplicateOutline"
      />
    </a>

    <!-- remove -->
    <n-icon
      v-if="deleteURL"
      size="35"
      class="flex items-center m-1 rounded-full p-2 cursor-pointer bg-gray-200 hover:bg-gray-300"
      title="Remove"
      :component="TrashOutline"
      @click="showOnDelete = true"
    />

    <n-modal
      v-model:show="showOnDelete"
      preset="dialog"
      title="Landing Pages instead"
    >
      <template #header>
        <div>Landing Pages instead</div>
      </template>
      <div>
        <p>Are you sure?</p>
        <n-input
          v-model:value="landingOnDelete.idLanding"
          type="text"
          size="small"
          placeholder="Landing Page ID"
        />
      </div>
      <template #action>
        <div>
          <n-button
            class="mr-2"
            type="info"
            size="small"
            @click="onDeleteClick"
          >
            Confirm
          </n-button>
          <n-button type="tertiary" size="small" @click="onCancelDeleteClick"
            >Cancel</n-button
          >
        </div>
      </template>
    </n-modal>
  </div>
</template>
