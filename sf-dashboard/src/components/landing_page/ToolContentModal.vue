<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ctr_landing_page } from '@/services/ctr_landing_page'
import { landingTypeClass, StatusState } from '@/types/components/landing'
import { dataThumb } from '@/types/components/gallery'
import FloatingWrapper from '../common/FloatingWrapper.vue'

import { useLocale } from '@/lang/messages'

const LanguageLanding = useLocale(
  () => import('@/lang/vi/landing'),
  () => import('@/lang/en/landing')
)
import { MAX_THUMB_LANDING } from '@/constants/limits'

const props = defineProps({
  statusState: {
    type: Object as () => StatusState,
    required: true,
  },

  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  title: {
    type: String,
    default: 'Generate Content',
  },
})

const MAX_RETRY_TIME = 7 * 60 * 1000 // 5 phút
const RETRY_INTERVAL = 5000 // 5 giây

const languageOptions = ref<SelectOption[]>([])

const fetchLanguages = async () => {
  const fetchLanguage = await ctr_landing_page.GetAllLanguage()
  if (fetchLanguage?.status) {
    languageOptions.value = fetchLanguage.data
  }
}

const emit = defineEmits<{
  (e: 'saveToCampaign', data: any): void
}>()

const data = ref({
  language: 'en',
  title: '',
  description: '',
})

//Lấy name gửi đi, ko lấy code
const payload = () => {
  let payload = helper.clone(data.value)
  payload.language = languageOptions.value.find(
    (x) => x.value === data.value.language
  )?.name
  return payload
}

const idPending = ref(0)

const generateContent = async () => {
  if (props.statusState.createLanding) {
    if (!data.value.language || !data.value.title) {
      window.message.error('Please fill in all required fields.')
      return
    }
    emit('saveToCampaign', payload())
    props.statusState.changeShowModal(false)
    return
  }
  const messageLoading = window.message.loading('Generating content...', {
    duration: 0,
  })

  if (!props.landing.IsDemandPubPower()) {
    makeThumbs()
  }

  props.statusState.creating = true

  const resultPending = await ctr_landing_page.MakeByGPT(payload())
  if (resultPending?.status) {
    idPending.value = resultPending?.data
    props.landing.log_id = idPending.value

    try {
      const result = await waitForLandingPageAIResponse()
      if (result?.status) {
        window.message.success('Content generated successfully')

        props.landing.language = result?.data?.language || data.value.language

        props.landing.title = result?.data?.title || ''
        props.landing.description = result?.data?.description || ''
        props.landing.content = result?.data?.content || ''
        props.landing.fixed_title = result?.data?.fixedTitle || ''
        props.landing.category_id = result?.data?.category_id || []
        props.landing.category_iab = result?.data?.category_iab || null
        props.landing.main_category = result?.data?.main_category || 0
        props.landing.display_model = result?.data?.display_model || ''
        props.landing.user_selected_model =
          result?.data?.user_selected_model || ''

        props.landing.reason = JSON.stringify(data.value) //log lại cái data

        props.landing.SetCreateByGPT()
        props.landing.t = 1

        props.statusState.updateCKNow()

        props.statusState.changeShowModal(false)
      }
    } catch (err: any) {
      window.message.error(err.message)
    }
  }

  messageLoading?.destroy()

  props.statusState.creating = false
}

const waitForLandingPageAIResponse = async () => {
  const startTime = Date.now()

  while (Date.now() - startTime < MAX_RETRY_TIME) {
    try {
      const result = await ctr_landing_page.ResponseLandingPageByAI({
        id: idPending.value,
      })

      if (result?.data?.status === 'success') {
        const duration = Date.now() - startTime
        console.info(`AI response success after ${duration / 1000}s`)
        return result
      }

      if (!result.status) {
        const duration = Date.now() - startTime
        console.info(`AI response returned error after ${duration / 1000}s`)
        return result
      }
    } catch (err) {
      console.error('Error when calling API:', err)
    }

    await new Promise((resolve) => setTimeout(resolve, RETRY_INTERVAL))
  }

  console.error('Timeout while waiting for AI response (over 5 minutes)')
  throw new Error('Timeout while waiting for AI response')
}

const makeThumbs = async () => {
  props.landing.thumbnails = [] //Clear thumb đã có để ko bị vượt quá max thumbnail
  for (let i = 0; i < MAX_THUMB_LANDING; i++) {
    const newImage = new dataThumb({
      path: '',
      loading: true,
      isAi: true,
      title: data.value.title,
    })
    newImage.SetPending()
    props.landing.thumbnails.push(newImage)
  }
  const result = await ctr_landing_page.GenerateThumbnail({
    title: data.value.title,
    number: 3,
  })

  let isError = false

  if (
    result?.status &&
    result?.data?.thumbnails?.length &&
    props.landing.thumbnails?.length
  ) {
    window.message.success('Thumbnails generated successfully')

    const resultThumbs = result.data.thumbnails
    const landingThumbs = props.landing.thumbnails

    resultThumbs.forEach((thumb: any, index: number) => {
      if (landingThumbs[index]) {
        landingThumbs[index].path = thumb
        landingThumbs[index].SetSuccess()
        landingThumbs[index].EndLoading()
      }
    })

    if (landingThumbs.length > resultThumbs.length) {
      props.landing.thumbnails = landingThumbs.slice(0, resultThumbs.length)
    }
  } else {
    isError = true
  }

  if (isError) {
    window.message.error('Error while generating thumbnails')
    props.landing.thumbnails.forEach((thumb) => {
      thumb.SetError()
      thumb.EndLoading()
    })
  }
}

watch(
  () => props.statusState.showModal,
  (value) => {
    if (value) {
      if (props.statusState.createLanding && props.landing.id) {
        data.value.language = 'en'
        data.value.title = ''
        data.value.description = ''
      }

      fetchLanguages()
    }
  }
)

const placeHolderTitle = `2024 Bank Repossessed Cars Clearance Sale - Lowest Price Ever`
</script>

<template>
  <n-modal
    v-model:show="props.statusState.showModal"
    preset="dialog"
    :show-icon="false"
    style="width: 1280px"
    :title="props.title"
  >
    <n-spin :show="props.statusState.creating">
      <n-card class="my-6 card-flex-gap-4">
        <FloatingWrapper name="Language" required>
          <n-select
            v-model:value="data.language"
            class="mt-1"
            placeholder="Language"
            value-field="value"
            label-field="name"
            filterable
            :options="languageOptions"
        /></FloatingWrapper>
        <FloatingWrapper name="Keywords" required placeholder>
          <n-input
            :placeholder="placeHolderTitle"
            type="textarea"
            maxlength="2000"
            show-count
            clearable
            v-model:value="data.title"
        /></FloatingWrapper>
        <FloatingWrapper name="Content Requirements" placeholder>
          <n-input
            :placeholder="LanguageLanding.toolContentModal"
            type="textarea"
            maxlength="10000"
            show-count
            clearable
            :autosize="{
              minRows: 12,
            }"
            v-model:value="data.description"
        /></FloatingWrapper>
      </n-card>
    </n-spin>

    <div class="flex">
      <div class="ml-auto">
        <n-button
          color="#f43f5e"
          @click="generateContent"
          :loading="props.statusState.creating"
        >
          {{ props.statusState.createLanding ? 'Save' : 'Generate' }}
        </n-button>
      </div>
    </div>
  </n-modal>
</template>
