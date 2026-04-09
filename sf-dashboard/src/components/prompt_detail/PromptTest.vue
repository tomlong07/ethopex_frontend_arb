<script setup lang="ts">
import { ctr_prompt } from '@/services/ctr_prompt'
import PromtDetail from '@/store/details/PromptDetail'
import { ModeClass } from '@/types/components/base'
import { renderPromptLabel } from '@/utils/labels'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  modeData: {
    type: Object as () => ModeClass,
    required: true,
  },
})

const usePromtDetail = PromtDetail()

const optionsPromptTest = ref<SelectOption[]>([])
const isLoadingPromptTest = ref(false)

const getOptionsPromptTest = async () => {
  isLoadingPromptTest.value = true
  const res = await ctr_prompt.GetAllPromtAi(
    usePromtDetail.permissionSettings.promptTest
  )
  optionsPromptTest.value = res?.data || []

  //Loại bỏ chính nó
  optionsPromptTest.value = optionsPromptTest.value.filter(
    (item) => item.value !== props.modeData.id
  )
  isLoadingPromptTest.value = false
}

onMounted(() => {
  getOptionsPromptTest()
})
</script>
<template>
  <form autocomplete="off">
    <div class="flex items-center">
      <div class="w-full">
        <FloatingWrapper name="Prompt Test">
          <n-select
            value-field="id"
            label-field="name"
            v-model:value="usePromtDetail.dataConfig.prompt_test"
            placeholder=""
            clearable
            filterable
            :options="optionsPromptTest"
            :render-label="renderPromptLabel"
          />
        </FloatingWrapper>
      </div>
    </div>
  </form>
</template>
