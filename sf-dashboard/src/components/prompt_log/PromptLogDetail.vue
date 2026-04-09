<script setup lang="ts">
import AIComponent from './AIComponent.vue'
import HumanComponent from './HumanComponent.vue'
import { ctr_prompt } from '@/services/ctr_prompt'
import BaseInput from './BaseInput.vue'
import { PromptLogData } from '@/class/prompt_logs'
import Example from './Example.vue'
import ArrowRight from '@/assets/icons/ArrowRight.vue'
import Skeleton from '../skeleton/Skeleton.vue'

const props = defineProps({
  isLoading: {
    type: Boolean,
    required: false,
  },

  isModal: {
    type: Boolean,
  },
})

//Cần thêm lớp data để sử dụng chung component AIComponent, HumanComponent
//lớp thứ nhất aggrid đã dùng mất nên cần sang lớp 2 để ko bị lỗi
const dataLog = ref<{ data: PromptLogData }>({
  data: new PromptLogData({}),
})

const changeDataLog = (data: any) => {
  dataLog.value = { data: data }
}

defineExpose({
  changeDataLog,
})

const payload = computed(() => {
  return {
    id: dataLog.value?.data?.id,
    manual_review: {
      creative_id: dataLog.value?.data?.creative_id,
      decision: dataLog.value?.data?.human_decision,
      explanation: dataLog.value?.data?.human_explanation,
      language: dataLog.value?.data?.language,
      rule_violated: dataLog.value?.data?.human_rule_violated,
    },
  }
})

const copyToHuman = () => {
  dataLog.value.data.human_decision = dataLog.value.data.ai_decision
  dataLog.value.data.human_explanation = dataLog.value.data.ai_explanation
  dataLog.value.data.human_rule_violated = dataLog.value.data.ai_rule_violated
}

const emit = defineEmits<{
  (e: 'changeLoading', value: boolean): void
  (e: 'changeShowModal', value: boolean): void
  (e: 'callbackDeleteRow'): void
  (e: 'callbackUpdateRow', data: any): void
}>()

const submitPromptLog = async () => {
  if (!payload.value.id) return
  emit('changeLoading', true)

  try {
    const result = await ctr_prompt.ReviewVerifyKeyword(payload.value)
    if (result?.status) {
      window.message.success(result?.data)
      emit('callbackDeleteRow')

      emit('changeShowModal', false)
    }
  } finally {
    emit('changeLoading', false)
  }
}

const retryThisLog = async () => {
  if (!dataLog.value?.data?.id) return
  emit('changeLoading', true)

  try {
    const result = await ctr_prompt.ReVerifyKeyword({
      id: dataLog.value?.data?.id,
    })

    if (result?.status && result?.data) {
      window.message.success('Success')

      emit('callbackUpdateRow', result?.data)

      //Cache lại, lưu các đoạn user đang sửa
      const humanObject = {
        human_decision: dataLog.value.data?.human_decision,
        human_explanation: dataLog.value.data?.human_explanation,
        human_rule_violated: dataLog.value.data?.human_rule_violated,
      }
      dataLog.value = { data: new PromptLogData(result?.data) }
      Object.assign(dataLog.value.data, humanObject)
    }
  } finally {
    emit('changeLoading', false)
  }
}
</script>

<template>
  <n-card size="small" role="dialog" aria-modal="true" :bordered="false">
    <Skeleton v-if="props.isLoading" />

    <div
      class="flex flex-col gap-4 overflow-x-auto scroll-thin-custom"
      :class="
        props.isModal ? 'max-h-[calc(90vh-140px)]' : 'max-h-[calc(90vh-60px)]'
      "
      v-else
    >
      <n-card class="rounded-lg card-flex-gap-4">
        <div class="flex gap-4">
          <div class="flex flex-col gap-2" v-if="dataLog.data.hasMedia()">
            <iframe
              class="flex items-center shadow-md media-cre w-[400px]"
              style="aspect-ratio: 16/9"
              :src="dataLog.data.buildEmbedUrl()"
              title="YouTube video player"
              frameborder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
              referrerpolicy="strict-origin-when-cross-origin"
              allowfullscreen
              v-if="dataLog.data.isYoutube()"
            ></iframe>
            <n-image
              width="100"
              v-else-if="dataLog.data.isImage()"
              :src="dataLog.data.media_url"
            />

            <video
              v-if="dataLog.data.isVideo()"
              class="flex items-center w-[200px]"
              controls
            >
              <source :src="dataLog.data.media_url" type="video/mp4" />
            </video>
          </div>
          <div class="flex gap-4 flex-col w-full">
            <BaseInput
              name="Creative Content"
              v-model:value="dataLog.data.creative_content"
              size="medium"
              readonly
              type="textarea"
              float
            />

            <template class="flex gap-2">
              <BaseInput
                name="Language"
                v-model:value="dataLog.data.language"
                size="medium"
                float />

              <BaseInput
                name="Version"
                v-model:value="dataLog.data.version"
                size="medium"
                readonly
                float
            /></template>

            <template class="flex gap-2">
              <BaseInput
                name="Select Model"
                v-model:value="dataLog.data.model_select"
                size="medium"
                readonly
                float
              />
              <BaseInput
                name="Display Model"
                v-model:value="dataLog.data.model_display"
                size="medium"
                readonly
                float
              />
            </template>
          </div>
        </div>
      </n-card>

      <div class="flex items-center">
        <n-card title="AI" class="rounded-lg">
          <AIComponent
            :params="dataLog as any"
            readonly
            size="medium"
            type="textarea"
            float
          />
        </n-card>
        <div class="justify-center flex">
          <n-popover trigger="hover">
            <template #trigger>
              <n-button class="w-12" @click="copyToHuman()" text
                ><n-icon size="20"><ArrowRight /></n-icon
              ></n-button>
            </template>
            <span>Copy to Human</span>
          </n-popover>
        </div>
        <n-card title="Human" class="rounded-lg">
          <HumanComponent
            :params="dataLog as any"
            size="medium"
            type="textarea"
            openDecision
            float
          >
          </HumanComponent>
        </n-card>
      </div>

      <n-card class="rounded-lg">
        <Example name="Example" :value="dataLog.data.ExampleJSON()" readonly />
      </n-card>
      <div class="flex bg-white sticky bottom-0 z-50">
        <n-button
          type="warning"
          :loading="props.isLoading"
          @click="retryThisLog()"
        >
          Retry
        </n-button>

        <n-button
          class="button-apply ml-auto"
          color="#f43f5e"
          :loading="props.isLoading"
          @click="submitPromptLog()"
        >
          Submit
        </n-button>
      </div>
    </div>
  </n-card>
</template>
