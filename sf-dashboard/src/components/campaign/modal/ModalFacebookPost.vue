<script setup lang="ts">
import useFacebookPostsModal from '@/store/useFacebookPostsModal'
import { SelectOption } from 'naive-ui'
import RemoveButton from '@/components/creative3/RemoveButton.vue'

import { AgGridVue } from 'ag-grid-vue3' // the AG Grid Vue Component

import FacebookPost from '@/components/campaign/cell/facebook/FacebookPost.vue'
import FacebookLink from '@/components/campaign/cell/facebook/FacebookLink.vue'
import FacebookPostID from '@/components/campaign/cell/facebook/FacebookPostID.vue'
import { debounceV2 } from '@/utils'
import CardImage from '@/assets/icons/CardImage.vue'
import Close2 from '@/assets/icons/Close2.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import {
  GridReadyEvent,
  RowSelectionOptions,
  themeAlpine,
  type SortDirection,
} from 'ag-grid-community'
const fbPostModal = useFacebookPostsModal()

const offModal = () => {
  fbPostModal.changeShowModal(false)
}

const defaultColDef = {
  // set every column width
  minWidth: 100,
  resizable: true,
  sortingOrder: ['desc', 'asc'] as SortDirection[],
}

const rowHeight = 100

const columnDefs = [
  {
    headerName: 'ID',
    field: 'id',
    flex: 0.1,
  },

  {
    headerName: 'Facebook post',
    field: 'name',
    cellRenderer: FacebookPost,
    flex: 0.4,
  },
  {
    headerName: 'Post ID',
    field: 'post_id',
    cellRenderer: FacebookPostID,
    minWidth: 200,
    flex: 0.1,
  },
  {
    headerName: 'Link',
    field: 'link',
    cellRenderer: FacebookLink,
    flex: 0.2,
  },
  {
    headerName: 'Date created',
    field: 'created_at',
    flex: 0.2,
  },
]

const loadingPost = ref<boolean>(false)

const postOptions = ref<SelectOption[]>([])

const postSelected = ref<SelectOption | undefined>(undefined)

const onRowSelected = (event: any) => {
  if (!event.node.__selected) return

  if (fbPostModal.dataModal) {
    postSelected.value = event.node.data
  }
}

const removeSelectedPost = () => {
  if (fbPostModal.dataModal) {
    fbPostModal.dataModal.post_id = undefined
  }
}

const submitPost = () => {
  if (fbPostModal.dataModal && postSelected.value) {
    fbPostModal.dataModal.post_id = postSelected.value.post_id as any

    fbPostModal.savePost(postSelected.value)

    if (fbPostModal.dataModal.AdCreative) {
      fbPostModal.dataModal.AdCreative.post_id = postSelected.value
        .post_id as any
    }
  }

  offModal()
}

const fetchPostByFanpage = async (query: string) => {
  loadingPost.value = true
  const result = await ctr_traffic_source.GetFacebookPost({
    page_id: fbPostModal.fanpage,
    search: query || '',
  })

  postOptions.value = result?.data || []

  loadingPost.value = false
}

const handleSearchPost = debounceV2(async (query: string = '') => {
  fetchPostByFanpage(query)
}, 300)

watch(
  () => fbPostModal.showModal,
  (newVal, oldVal) => {
    if (newVal) {
      postSelected.value = { post_id: fbPostModal.dataModal?.post_id }
      fetchPostByFanpage('')
    }
  }
)
const rowSelection = ref<RowSelectionOptions | 'single' | 'multiple'>({
  mode: 'singleRow',
  checkboxes: false,
  enableClickSelection: true,
})
const onGridReady = (params: GridReadyEvent) => {
  params.api.sizeColumnsToFit()
}
const customTheme = themeAlpine.withParams({
  oddRowBackgroundColor: '#f9fafb',
})
</script>

<template>
  <div>
    <n-modal
      v-model:show="fbPostModal.showModal"
      class="overflow-auto"
      style="width: 95vw; max-width: 1920px"
    >
      <div>
        <n-card title="&nbsp;" :bordered="false">
          <template #header-extra>
            <n-icon
              @click="offModal"
              size="24"
              :component="Close2"
              class="button-close cursor-pointer"
          /></template>

          <div
            style="max-height: 60vh; overflow: auto"
            class="flex gap-2 flex-col"
          >
            <n-input
              maxlength="1000"
              :on-input="handleSearchPost"
              :clearable="true"
              :placeholder="'Search Facebook post'"
            ></n-input>
            <n-spin :show="loadingPost">
              <ag-grid-vue
                :theme="customTheme"
                :rowSelection="rowSelection"
                :animate-rows="true"
                dom-layout="autoHeight"
                :columnDefs="columnDefs"
                :row-height="rowHeight"
                :rowData="postOptions"
                :default-col-def="defaultColDef"
                :enable-cell-text-selection="true"
                :server-side-sorting="false"
                :suppress-multi-sort="true"
                :pagination="true"
                :suppress-pagination-panel="true"
                @rowSelected="onRowSelected"
                @grid-ready="onGridReady"
              >
              </ag-grid-vue>
            </n-spin>
          </div>

          <template #footer>
            <div class="flex flex-col gap-2">
              <div
                class="flex flex-col border relative p-4 shadow-md"
                v-if="postSelected"
              >
                Selected Facebook post

                <div class="flex flex-row items-center">
                  <div
                    class="flex justify-center items-center w-24 h-24 border"
                  >
                    <img
                      v-if="postSelected?.media"
                      :src="postSelected?.media as string"
                      class="w-full h-full"
                    />

                    <n-icon v-else :component="CardImage" />
                  </div>

                  <div class="flex flex-col gap-2 p-4">
                    <div
                      class="overflow-hidden text-ellipsis text-nowrap max-w-[70vw]"
                    >
                      {{ postSelected?.name || '' }}
                    </div>

                    <div class="text-xs text-gray-500">
                      Posted
                      {{ postSelected?.created_at || 'N/A' }}.
                      {{ postSelected?.likes || '0' }} likes,
                      {{ postSelected?.comments || '0' }}
                      comments,
                      {{ postSelected?.shares || '0' }}
                      shares.
                    </div>
                  </div>
                </div>

                <RemoveButton
                  v-if="postSelected"
                  @onClick="() => removeSelectedPost()"
                  class="z-10 shadow-md"
                  text=""
                />
              </div>

              <div class="flex flex-col border relative p-4 shadow-md" v-else>
                &nbsp;
                <div class="flex flex-row items-center">
                  <div class="flex justify-center items-center w-24 h-24"></div>
                </div>
              </div>
              <div class="ml-auto flex gap-2">
                <n-button @click="offModal">Cancel</n-button>
                <n-button
                  type="primary"
                  :disabled="!postSelected"
                  @click="() => submitPost()"
                  >Continue</n-button
                >
              </div>
            </div>
          </template>
        </n-card>
      </div>
    </n-modal>
  </div>
</template>
