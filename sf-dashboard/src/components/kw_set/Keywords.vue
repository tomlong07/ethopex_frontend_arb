<template>
  <div class="flex flex-col gap-4">
    <div class="flex items-center gap-4">
      <div class="font-bold">Keywords</div>
      <div class="flex flex-row gap-2" v-if="kwsetStore.isEditPage">
        <n-tag type="info" class="n-tag-exclude">
          Total: {{ kwsetStore.dataConfig.keywords.length || 'N/A' }}
        </n-tag>
        <n-tag type="success" class="n-tag-exclude">
          On:
          {{
            kwsetStore.dataConfig.keywords.filter((k) => k.status == 'on')
              .length || '0'
          }}
        </n-tag>
        <n-tag type="error" class="n-tag-exclude">
          Off:
          {{
            kwsetStore.dataConfig.keywords.filter((k) => k.status == 'off')
              .length || '0'
          }}
        </n-tag>
      </div>
    </div>

    <!-- Action buttons -->
    <div
      class="flex flex-col gap-2"
      :class="{
        'cursor-not-allowed':
          kwsetStore.isDisable || kwsetStore.isSubmitBtnLoading,
      }"
    >
      <div class="pb-2">
        <div
          class="flex items-center gap-4 flex-wrap"
          v-if="kwsetStore.isEditPage"
          :class="{
            'pointer-events-none':
              kwsetStore.isDisable || kwsetStore.isSubmitBtnLoading,
          }"
        >
          <DateRanger
            :status="{ isFetching: false }"
            :defaultDate="dateSearchArray"
            classContainer="flex-row"
            @updateDate="updateDate"
          />
          <div class="flex flex-wrap items-center gap-2 mr-auto">
            <n-button
              size="medium"
              type="info"
              :disabled="kwsetStore.isDisable"
              :loading="kwsetStore.isSubmitBtnLoading"
              @click="copySelectedKeyword()"
            >
              Copy Selected Keywords
            </n-button>
            <n-button
              size="medium"
              type="success"
              :disabled="kwsetStore.isDisable"
              :loading="kwsetStore.isSubmitBtnLoading"
              @click="changeMultipleStatus('on')"
            >
              Active
            </n-button>
            <n-button
              size="medium"
              type="warning"
              :disabled="kwsetStore.isDisable"
              :loading="kwsetStore.isSubmitBtnLoading"
              @click="changeMultipleStatus('off')"
            >
              Deactive
            </n-button>
          </div>
        </div>
      </div>

      <!-- Table -->
      <div
        class="custom-scrollbar overflow-x-auto"
        :class="{
          'pointer-events-none opacity-50': kwsetStore.isSubmitBtnLoading,
        }"
      >
        <n-table
          :single-line="false"
          striped
          id="table-keywords"
          :class="
            kwsetStore.isEditPage && !props.isInModal ? 'min-w-[1440px]' : ''
          "
        >
          <thead>
            <tr>
              <th
                v-if="kwsetStore.isEditPage"
                style="width: calc(10% * (100% - 40px))"
                :class="{ 'checkbox-col': notifyCheckBox }"
              >
                <n-checkbox
                  v-model:checked="isCheckAll"
                  @click="handleClickAll"
                >
                </n-checkbox>
              </th>
              <th
                v-for="(header, index) in dataHeader"
                :key="index"
                :width="header.width"
                @click="sortTable(index + 1, header)"
                :class="{
                  'sorted-asc':
                    kwsetStore.isEditPage &&
                    sortKey === header.key &&
                    sortOrder === 'asc',
                  'sorted-desc':
                    kwsetStore.isEditPage &&
                    sortKey === header.key &&
                    sortOrder === 'desc',
                  'cursor-pointer': !header.offSort && kwsetStore.isEditPage,
                }"
              >
                {{ header.name }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="(data, index) in kwsetStore.dataConfig.keywords"
              :key="index"
            >
              <td
                v-if="kwsetStore.isEditPage"
                :class="{ 'checkbox-col': notifyCheckBox }"
              >
                <n-checkbox
                  v-model:checked="keywordCheckBoxes[data.keyword]"
                  :on-update:checked="(value:boolean)=>updateCheckBox(value, data.keyword)"
                >
                </n-checkbox>
              </td>
              <td class="text-center align-middle" v-if="isComp">
                <div
                  class="relative h-[3rem] w-[3rem] cursor-pointer"
                  v-if="kwsetStore.dataConfig.keywords[index].image"
                  @click="editModalUpload(index, 'keywords')"
                  title="Click to change image"
                >
                  <n-image
                    :src="src(kwsetStore.dataConfig.keywords[index].image)"
                    class="h-full w-full shadow-md"
                    object-fit="fill"
                    preview-disabled
                  ></n-image>

                  <div @click.stop>
                    <RemoveButton
                      class="absolute top-1 right-1 z-10"
                      size="14"
                      @onClick="() => onRemoveImage(index, 'keywords')"
                      :text="`Remove Image`"
                      :placement="'top-end'"
                    />
                  </div>
                </div>

                <n-button
                  v-else
                  size="small"
                  type="info"
                  ghost
                  class="dynamic-button"
                  :loading="kwsetStore.isLoading"
                  :disabled="kwsetStore.isDisable"
                  @click="openModalUpload(index, 'keywords')"
                >
                  <template #icon>
                    <n-icon size="12"><Upload /></n-icon>
                  </template>
                </n-button>
              </td>
              <td>
                <FloatingWrapper>
                  <n-input
                    v-model:value="
                      kwsetStore.dataConfig.keywords[index].keyword
                    "
                    type="textarea"
                    placeholder="Enter keyword one by one or paste multiple keywords separated by commas or lines."
                    rows="1"
                    :on-input="
                      (value:any) =>
                        kwsetStore.updateKeyword(index, 'keywords', value)
                    "
                  />
                </FloatingWrapper>
              </td>
              <td
                v-if="kwsetStore.isEditPage"
                class="cursor-pointer"
                @click="copyKeyword(data.keyword)"
              >
                <Copy />
              </td>
              <td v-if="kwsetStore.isEditPage">{{ data.created_at }}</td>
              <td v-if="kwsetStore.isEditPage">
                {{ kwsetStore.dataConvert(data.page_view) || '' }}
              </td>
              <td v-if="kwsetStore.isEditPage">
                {{ kwsetStore.dataConvert(data.conversion) || '' }}
              </td>
              <td v-if="kwsetStore.isEditPage">
                {{ kwsetStore.getMoneyCurrency(data.rpm) }}
              </td>
              <td v-if="kwsetStore.isEditPage">
                {{ kwsetStore.getMoneyCurrency(data.rpc) }}
              </td>
              <td>
                <CustomSwitch
                  v-model="data.status"
                  type="onoff"
                  :disabled="
                    kwsetStore.isSubmitBtnLoading ||
                    kwsetStore.isLoading ||
                    kwsetStore.isDisable ||
                    isChangingStatus != null
                  "
                  trueLabel="On"
                  falseLabel="Off"
                  size="small"
                  :loading="isChangingStatus == index"
                  @update:modelValue="(value: any) => updateStatusByKeyword(value, index)"
                >
                </CustomSwitch>
              </td>
              <td>
                <n-button-group>
                  <n-button
                    ghost
                    size="tiny"
                    class="dynamic-button"
                    :loading="kwsetStore.isLoading"
                    :disabled="
                      (index === 0 &&
                        kwsetStore.dataConfig.keywords.length === 1) ||
                      kwsetStore.isDisable
                    "
                    @click="kwsetStore.deleteKeyword(index, 'keywords')"
                  >
                    <template #icon>
                      <n-icon size="10"><minus /></n-icon>
                    </template>
                  </n-button>
                  <n-button
                    ghost
                    size="tiny"
                    class="dynamic-button"
                    :loading="kwsetStore.isLoading"
                    :disabled="kwsetStore.isDisable"
                    @click="kwsetStore.addKeyword('keywords')"
                  >
                    <template #icon>
                      <n-icon size="10"><plus /></n-icon>
                    </template>
                  </n-button>
                </n-button-group>
              </td>
            </tr>
          </tbody>
        </n-table>
      </div>
    </div>
  </div>

  <div class="flex items-center">
    <FloatingWrapper name="Limit Page View">
      <n-input-number
        v-model:value="kwsetStore.dataConfig.limit_page_view"
        :disabled="kwsetStore.isLoading || kwsetStore.isDisable"
        min="0"
      />
    </FloatingWrapper>
  </div>

  <div class="flex items-center">
    <FloatingWrapper name="Limit Keyword">
      <n-input-number
        v-model:value="kwsetStore.dataConfig.limit_keyword"
        :disabled="kwsetStore.isLoading || kwsetStore.isDisable"
      />
    </FloatingWrapper>
  </div>

  <!-- Modal sẽ được xử lý ở component cha -->
</template>

<script setup lang="ts">
import { useKeywordSetStore } from '@/store/details/kwsetStore'
import { KeyWordElement } from '@/types/components/keyword_set'
import { HeaderKeywordSetType } from '@/types/components/types'
import DateRanger from '../common/DateRanger.vue'
import Copy from '@/assets/icons/Copy.vue'
import Minus from '@/assets/icons/Minus.vue'
import Plus from '@/assets/icons/Plus.vue'
import Upload from '@/assets/icons/Upload.vue'
import RemoveButton from '@/components/creative3/RemoveButton.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import CustomSwitch from '../common/CustomSwitch.vue'

const isChangingStatus = ref<number | null>(null)
const props = defineProps({
  isInModal: {
    type: Boolean,
    default: false,
  },
})

const kwsetStore = useKeywordSetStore()
const keywordCheckBoxes = ref<{ [key: string]: boolean }>({})
const isCheckAll = ref(false)

const sortKey = ref('status') // Key used for sorting
const sortOrder = ref('desc') // Sorting order: 'asc' or 'desc'

// Sửa lại hàm editModalUpload - khi click vào ảnh có sẵn (sử dụng store)
const editModalUpload = (index: number, type: 'keywords' = 'keywords') => {
  kwsetStore.selectedKeywordIndex = index
  kwsetStore.selectedKeywordType = type

  // Gán đường dẫn ảnh hiện tại vào biến
  kwsetStore.currentEditImagePath =
    kwsetStore.dataConfig[type][index]?.image || ''

  kwsetStore.showModalUpload = true // Mở modal upload để preview ảnh
}

// Sửa lại hàm openModalUpload - khi click button Upload (sử dụng store)
const openModalUpload = (index: number, type: 'keywords' = 'keywords') => {
  kwsetStore.selectedKeywordIndex = index
  kwsetStore.selectedKeywordType = type
  kwsetStore.showModalUpload = true // Mở modal upload
  kwsetStore.currentEditImagePath =
    kwsetStore.dataConfig[type][index]?.image || ''
}

const onRemoveImage = (index: number, type: 'keywords') => {
  if (type === 'keywords') {
    delete kwsetStore.dataConfig.keywords[index].image
  }
}

const src = (path: string | undefined) => {
  return helper.src(path)
}

const dateSearchArray = computed<string[]>(() => {
  return [kwsetStore.dateSearch.startDate, kwsetStore.dateSearch.endDate]
})

const notifyCheckBox = ref<boolean>(false)
const firstTime = ref<boolean>(true)

const isComp = window.arb.isCompany()

const dataHeader = computed<HeaderKeywordSetType[]>(() => {
  if (kwsetStore.isEditPage) {
    let arr: any[] = []

    if (isComp) {
      arr.push({ name: 'Image', width: '40px', offSort: true })
    }
    arr = arr.concat([
      { name: 'Keyword', width: '500px', offSort: true },
      { name: 'Copy', width: '40px', offSort: true },
      {
        name: 'Created At (UTC)',
        width: '180px',
        key: 'created_at',
      },
      {
        name: 'Page View',
        width: '120px',
        key: 'page_view',
      },
      {
        name: 'Conversion',
        width: '120px',
        key: 'conversion',
      },
      {
        name: 'RPM',
        width: '80px',
        key: 'rpm',
      },
      {
        name: 'RPC',
        width: '80px',
        key: 'rpc',
      },
      { name: 'Status', width: '80px', key: 'status' },
      { name: 'Action', width: '40px', offSort: true },
    ])
    return arr
  }
  let arr: any[] = []

  if (isComp) {
    arr.push({ name: 'Image', width: '40px' })
  }
  arr = arr.concat([
    { name: 'Keyword', width: 'calc(100% - 160px)' },
    { name: 'Status', width: '80px', key: 'status' },
    { name: 'Action', width: '40px' },
  ])
  return arr
})

const copySelectedKeyword = () => {
  if (!keywordsInCheckBox.value.length) {
    kwsetStore.errorNotify('Please select at least one keyword to copy.')
    helper.hightlightDiv(notifyCheckBox)
    return
  }

  helper.copyText(keywordsInCheckBox.value.join(','))
  window.message.success('Copied!')
}

const updateDate = async (date: string[]) => {
  if (firstTime.value) {
    firstTime.value = false
    return
  }

  if (!date || date.length != 2) {
    console.error('updateDate: date is not correct', date)
    return
  }

  kwsetStore.dateSearch = {
    startDate: date[0],
    endDate: date[1],
  }

  await kwsetStore.updateTable()
}

const copyKeyword = (keyword: string) => {
  if (!keyword) {
    return
  }

  helper.copyText(keyword)
  window.message.success('Copied!')
}

const changeMultipleStatus = async (status: string) => {
  if (!keywordsInCheckBox.value.length) {
    kwsetStore.errorNotify(
      'Please select at least one keyword to change status.'
    )
    helper.hightlightDiv(notifyCheckBox)
    return
  }

  const stop = kwsetStore.validateKW(kwsetStore.dataConfig.keyword_ab_test)
  if (stop) {
    return
  }

  kwsetStore.isSubmitBtnLoading = true
  let tempData = helper.clone(kwsetStore.dataConfig)
  tempData.keywords.forEach((item: KeyWordElement) => {
    if (keywordsInCheckBox.value.includes(item.keyword)) {
      item.status = status
    }
  })

  const result = await kwsetStore.updateData(kwsetStore.id, tempData)

  if (result?.status) {
    kwsetStore.dataConfig.keywords = tempData.keywords
  }
  kwsetStore.isSubmitBtnLoading = false
}

const updateCheckBox = (value: boolean, keyword: string) => {
  keywordCheckBoxes.value[keyword] = value
}

const keywordsInCheckBox = computed(() => {
  return Object.keys(keywordCheckBoxes.value).filter(
    (key) => keywordCheckBoxes.value[key] === true
  )
})

const handleClickAll = () => {
  kwsetStore.dataConfig.keywords.forEach((element) => {
    keywordCheckBoxes.value[element.keyword] = isCheckAll.value
  })
}

const sortTable = (n: number, dataHeader: HeaderKeywordSetType) => {
  if (dataHeader.offSort || !dataHeader.key) {
    return
  }

  try {
    //Nếu sort theo key đang được sort thì đổi chiều sort
    if (sortKey.value === dataHeader.key) {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      return
    }

    //Nếu không thì set key mới và sort theo key mới (default desc)
    sortKey.value = dataHeader.key as keyof KeyWordElement
    sortOrder.value = 'desc' // Default to ascending order when sorting by a new key
  } finally {
    kwsetStore.sortKeyword(
      dataHeader.key as keyof KeyWordElement,
      sortOrder.value
    )
  }
}

const updateStatusByKeyword = async (value: string, index: number) => {
  if (kwsetStore.isAddPage) {
    //Cập nhật luôn, ko gửi ajax
    kwsetStore.dataConfig.keywords[index].status = value
    return
  }
  const stop = kwsetStore.validateKW(kwsetStore.dataConfig.keyword_ab_test)
  if (stop) {
    return
  }

  isChangingStatus.value = index
  kwsetStore.isSubmitBtnLoading = true
  let tempData = helper.clone(kwsetStore.dataConfig)
  tempData.keywords[index].status = value

  const result = await kwsetStore.updateData(kwsetStore.id, tempData)

  if (result?.status) {
    kwsetStore.dataConfig.keywords[index].status = value
  }
  kwsetStore.isSubmitBtnLoading = false
  isChangingStatus.value = null
}
</script>
