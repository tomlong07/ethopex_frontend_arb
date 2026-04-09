<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { audienceSegmentData } from '@/types/components/audience-segment'
import { useMessage } from 'naive-ui'
import { SelectOption } from 'naive-ui'
import { useRoute } from 'vue-router'
import api_v2 from '@/core/api_v2'
import { ModalStateSegment } from '@/types/components/modal'
import useSegmentStore from '@/store/useSegmentModal'
import { ctr_audience } from '@/services/ctr_audience'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ctr_report } from '@/services/ctr_report'
import { SegmentTypeOptions } from '@/options/segment'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import BackPage from '@/components/common/BackPage.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'

const segmentStore = useSegmentStore()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const props = defineProps({
  dataModal: {
    type: Object as () => ModalStateSegment,
    required: false,
  },
})

const isModal = computed<boolean>(() => {
  return props.dataModal ? true : false
})

const message = useMessage()
const isSubmitBtnLoading = ref(false)
const route = useRoute()

const audienceConfig = ref<audienceSegmentData>({
  name: '',
  segment_type: 'SEARCH',
  type: 'custom',
  keyword: '',
  account_id: props.dataModal?.supply_account_id || undefined,
  traffic_source: 'google',
  keyword_search: '',
  segment: 'custom',
  lookalike_segment: '',
})

const duplicateId = Number(isModal.value ? 0 : route.query.duplicate || 0)
const isLoading = ref<boolean>(true)
const id = Number(
  isModal.value ? props.dataModal?.id || 0 : route.params.id || 0
)

const countKeywordPlan = computed<number>(() => {
  let input = audienceConfig.value.keyword || ''
  let parts = input.split(/[,\n]+/)
  let result = parts.map((part) => part.trim()).filter((part) => part !== '')
  return result.length || 0
})

const isAddPage = computed<boolean>(() => id === 0)

const isDisableKeywordPlan = computed<boolean>(() => {
  return (
    !audienceConfig.value.location ||
    !audienceConfig.value.language ||
    !audienceConfig.value.account_id
  )
})
const isEditPage = computed<boolean>(() => {
  return !isAddPage.value
})
const isCustomType = computed<boolean>(() => {
  return audienceConfig.value.type === 'custom'
})

const accountOptions = ref<SelectOption[]>([])
const languageOptions = ref<SelectOption[]>([])
const countriesOptions = ref<SelectOption[]>([])
const isLoadingKeywordPlan = ref<boolean>(false)

const fetchCountriesByTraffic = async () => {
  const countriesOptionsResult = await api_v2.request({
    url: 'traffic-source/get-country',

    params: { traffic_source: 'google' },
  })
  if (countriesOptionsResult?.status) {
    countriesOptions.value = countriesOptionsResult.data?.coutries || []
  }
}

const fetchDemandAccountOptions = async () => {
  const result = await ctr_traffic_source.GetAccount('google', '', 0)
  accountOptions.value = result?.data?.accounts || []
}
const arrKeyword = computed<string[]>(() => {
  let input = audienceConfig.value.keyword || ''
  let parts = input.split(/[,\n]+/)
  let result = parts.map((part) => part.trim()).filter((part) => part !== '')

  // Lọc bỏ các keyword trùng nhau không phân biệt chữ hoa/thường
  let uniqueKeywords = Array.from(
    new Map(
      result.map((keyword) => [keyword.toLowerCase(), keyword]) // Tạo map với key là chữ thường
    ).values()
  )

  return uniqueKeywords
})

const showKeyWord = computed<string>(() => {
  try {
    let keywordggsearch = ''
    let count = JSON.parse(audienceConfig.value.keyword || '')
    for (let index = 0; index < count.length; index++) {
      let element = count[index].trim()
      if (element !== '') {
        keywordggsearch += element
        if (index < count.length - 1) {
          keywordggsearch += '\n'
        }
      }
    }
    return keywordggsearch
  } catch {
    return ''
  }
})

const payload = computed<any>(() => {
  return { ...audienceConfig.value, keyword: JSON.stringify(arrKeyword.value) }
})

const addKeywordPlan = async () => {
  isLoadingKeywordPlan.value = true
  if (audienceConfig.value.keyword_search == '') {
    return
  }

  const keywordPlanResult = await ctr_report.GetKeyWordPlan({
    keyword: audienceConfig.value.keyword_search,
    account: audienceConfig.value.account_id,
    language: audienceConfig.value.language,
    location: audienceConfig.value.location
      ? audienceConfig.value.location
      : '',
  })
  if (keywordPlanResult?.status) {
    let keywordggsearch = ''
    let seenElements = new Set()
    for (let index = 0; index < keywordPlanResult.data.length; index++) {
      let element = keywordPlanResult.data[index].text.trim()
      if (element !== '' && !seenElements.has(element)) {
        seenElements.add(element)
        keywordggsearch += element
        if (index < keywordPlanResult.data.length - 1) {
          keywordggsearch += '\n'
        }
      }
    }
    audienceConfig.value.keyword = keywordggsearch
  }
  isLoadingKeywordPlan.value = false
}

const submitForm = async () => {
  isSubmitBtnLoading.value = true

  if (duplicateId && audienceConfig.value.type !== 'custom') return

  if (isAddPage.value) {
    const result = await ctr_audience.AddAudienceSegment(payload.value)
    if (result?.status) {
      message.success(`Submit success!`)

      if (isModal.value) {
        segmentStore.changeResult(result)
        segmentStore.changeShowModal(false)
        return
      }
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await ctr_audience.EditAudienceSegment(payload.value)
    if (result?.status) {
      message.success(`Submit success!`)

      if (isModal.value) {
        segmentStore.changeResult({ id: id })
        segmentStore.changeShowModal(false)
        return
      }
    }
  }

  isSubmitBtnLoading.value = false
}

const fetchLanguageByTraffic = async () => {
  const result = await ctr_traffic_source.GetLanguage('google')

  languageOptions.value = result?.data?.languages || []
}

onMounted(async () => {
  await Promise.all([
    fetchDemandAccountOptions(),
    fetchCountriesByTraffic(),
    fetchLanguageByTraffic(),
  ])

  if (isEditPage.value || duplicateId) {
    const idFetch = isEditPage.value ? id : duplicateId ? duplicateId : 0
    const result = await ctr_audience.GetAudienceSegmentByID(idFetch)

    try {
      let newData = result?.data || {}

      if (duplicateId) {
        newData.id = undefined
      }

      audienceConfig.value = newData
      audienceConfig.value.keyword = showKeyWord.value
    } catch (error) {
      console.error(error)
    }
  }

  isLoading.value = false
})
</script>
<template>
  <n-spin :show="isLoading">
    <div
      class="flex flex-col bg-base px-3 flex-1"
      :class="[isModal ? '' : 'wrapper']"
    >
      <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4 mt-3">
        <BackPage
          :url="feSettings?.page_list"
          :name="'Segment'"
          v-if="feSettings?.page_list && !isModal"
        />
        <div
          class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
        >
          <n-card title="Audience Segments">
            <!-- Data Source -->
            <div class="flex items-center my-4">
              <FloatingWrapper name="Segments name" rounded>
                <n-input
                  :disabled="isEditPage && !isCustomType"
                  v-model:value="audienceConfig.name"
                  placeholder="Segments Name"
                />
              </FloatingWrapper>
            </div>

            <div class="flex items-center my-4">
              <FloatingWrapper name="Google Account" rounded>
                <n-select
                  :disabled="isEditPage || isModal"
                  v-model:value="audienceConfig.account_id"
                  filterable
                  value-field="id"
                  label-field="name"
                  placeholder="Select traffic account"
                  :options="accountOptions"
                />
              </FloatingWrapper>
            </div>

            <div>
              <!-- Type -->
              <div class="flex items-center my-4">
                <FloatingWrapper name="Segment Type" rounded>
                  <n-select
                    :disabled="isEditPage"
                    v-model:value="audienceConfig.segment_type"
                    placeholder="Select"
                    filterable
                    :options="SegmentTypeOptions"
                  />
                </FloatingWrapper>
              </div>
              <div class="flex items-center my-4">
                <FloatingWrapper name="Language" rounded>
                  <n-select
                    v-model:value="audienceConfig.language"
                    filterable
                    value-field="value"
                    label-field="name"
                    :disabled="isEditPage && !isCustomType"
                    :options="languageOptions"
                    :clearable="true"
                  />
                </FloatingWrapper>
              </div>

              <div class="flex items-center my-4">
                <FloatingWrapper name="Location" rounded>
                  <n-select
                    v-model:value="audienceConfig.location"
                    filterable
                    clearable
                    value-field="value"
                    label-field="name"
                    :options="countriesOptions"
                    :disabled="isEditPage && !isCustomType"
                  />
                </FloatingWrapper>
              </div>
              <!-- Domain -->
              <div class="flex items-center my-4">
                <div class="w-full flex items-center gap-2">
                  <FloatingWrapper name="Keyword Search" rounded>
                    <n-input
                      v-model:value="audienceConfig.keyword_search"
                      :disabled="
                        (isEditPage || isDisableKeywordPlan) && !isCustomType
                      "
                      placeholder="Enter placement URLs line by line, or paste in a list."
                      type="textarea"
                      :autosize="{
                        minRows: 1,
                        maxRows: 5,
                      }"
                    />
                  </FloatingWrapper>

                  <n-button
                    color="#f43f5e"
                    type="default"
                    @click="addKeywordPlan"
                    :loading="isLoadingKeywordPlan"
                    :disabled="
                      (isEditPage || isDisableKeywordPlan) && !isCustomType
                    "
                  >
                    Add
                  </n-button>
                </div>
              </div>
              <div class="flex items-center my-4">
                <div class="w-full flex flex-col">
                  <FloatingWrapper name="Keyword" rounded>
                    <n-input
                      v-model:value="audienceConfig.keyword"
                      :disabled="isEditPage && !isCustomType"
                      placeholder="Enter placement URLs line by line, or paste in a list."
                      type="textarea"
                      row="7"
                    />
                  </FloatingWrapper>
                  <div style="margin-top: 10px">
                    <span class="font-xs italic text-gray-400"
                      >{{ countKeywordPlan }} Keywords
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div class="flex flex-row-reverse sticky bottom-0">
              <n-button
                color="#f43f5e"
                size="medium"
                type="success"
                :loading="isSubmitBtnLoading"
                :disabled="isEditPage && !isCustomType"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </n-spin>
</template>
<style lang="scss"></style>
