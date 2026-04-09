<script setup lang="ts">
import { ctr_prompt } from '@/services/ctr_prompt'
import PromtDetail from '@/store/details/PromptDetail'
import Text13 from './prompt_13/Text13.vue'
import Image13 from './prompt_13/Image13.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import { ONOFF, TS } from '@/enum/campaign'
import VueJsonPretty from 'vue-json-pretty'

import 'vue-json-pretty/lib/styles.css'
import CopyOutline from '@/assets/icons/CopyOutline.vue'
import PromptWebSource from './PromptWebSource.vue'
import FloatingWrapper from '../common/FloatingWrapper.vue'
import { PromptTest } from '@/class/prompt'
import RemoveButton from '../creative3/RemoveButton.vue'
import { INPUT_JSON, INPUT_MACRO, LANGUAGE_MACRO } from '@/constants/prompt'
import { Input46Macro } from '@/interface/prompt'
import { CreativeContentTypeOptions } from '@/options/prompt'

const usePromtDetail = PromtDetail()
const languageOptions = ref<any[]>([])
const disabledMacrosLanguage = ref(false)
function extractMacros(input: string) {
  const regex = /\{\{\s*([^{}]+?)\s*\}\}/g
  const result: string[] = []
  let m
  while ((m = regex.exec(input)) !== null) {
    result.push(m[0].trim())
  }
  return result
}

function extractUniqueMacros(input: string) {
  return [...new Set(extractMacros(input))]
}

function replaceMacros(
  input: string,
  values: Record<string, string | null>
): string {
  return input.replace(/\{\{\s*([^{}]+?)\s*\}\}/g, (match) => {
    return values[match.trim()] ?? ''
  })
}

onMounted(() => {
  usePromtDetail.testData.model = usePromtDetail.dataConfig.model || null

  if (usePromtDetail.dataConfig.web_source) {
    usePromtDetail.testData.web_source = usePromtDetail.dataConfig.web_source
  }

  if (usePromtDetail.dataConfig.config) {
    usePromtDetail.testData.config = helper.clone(
      usePromtDetail.dataConfig.config
    )
  }

  usePromtDetail.transformPrompt = usePromtDetail.dataConfig.prompt || ''
  disabledMacrosLanguage.value = false

  usePromtDetail.usedMacros = extractUniqueMacros(
    usePromtDetail.transformPrompt || ''
  )

  usePromtDetail.usedMacros.forEach((element) => {
    if (!(element in usePromtDetail.testMacros)) {
      if (isMacroLanguage(element)) {
        usePromtDetail.testMacros[element] = null
        return
      }
      usePromtDetail.testMacros[element] = ''
    }
  })

  Object.keys(usePromtDetail.testMacros).forEach((key) => {
    if (!usePromtDetail.usedMacros.includes(key)) {
      delete usePromtDetail.testMacros[key]
    }
  })

  for (const macro of usePromtDetail.usedMacros) {
    if (isMacroLanguage(macro)) {
      fetchLangue()

      break
    }
  }
})

const promptFinal = computed(() => {
  if (usePromtDetail.usedMacros.includes(INPUT_JSON)) {
    const inputJsonValue = {
      creative_id: 'crefe_' + Date.now().toString(),
      creative_content_type:
        usePromtDetail.inputJsonMacros['creative_content_type'] || '',
      creative_content:
        usePromtDetail.inputJsonMacros['creative_content'] || '',
    }
    usePromtDetail.testMacros[INPUT_JSON] = JSON.stringify(inputJsonValue)
  }

  if (
    usePromtDetail.isPrompt46 &&
    usePromtDetail.usedMacros.includes(INPUT_MACRO)
  ) {
    const cloneData = helper.clone(usePromtDetail.input46Macros) as Input46Macro
    cloneData.creative_id = 'crefe_' + Date.now().toString()

    cloneData.contents = cloneData.contents.filter(
      (c) => c.content.trim() !== ''
    )

    cloneData.contents.map((c, index) => {
      c.text_id = 'text_' + (index + 1).toString()
      return c
    })

    usePromtDetail.testMacros[INPUT_MACRO] = JSON.stringify(cloneData)
  }

  return replaceMacros(
    usePromtDetail.transformPrompt || '',
    usePromtDetail.testMacros
  )
})

const payloadTestPrompt = computed(() => {
  return {
    id: usePromtDetail.dataConfig.id,
    prompt: promptFinal.value,
    ...usePromtDetail.testData,
  }
})

const isSubmitting = ref(false)
const resultTest = ref<any>('')
const responseTest = ref<PromptTest>(new PromptTest())

const formattedJson = computed(() => {
  try {
    return JSON.parse(resultTest.value) // parse string
  } catch {
    return resultTest.value
  }
})

const testPrompt = async () => {
  isSubmitting.value = true

  const result = await ctr_prompt.TestPrompt(payloadTestPrompt.value)

  if (result?.data?.content) {
    window.message.success('Success')
    resultTest.value = result?.data?.response_origin || ''
    responseTest.value = new PromptTest(result?.data)
  }

  isSubmitting.value = false
}

const fetchLangue = async () => {
  disabledMacrosLanguage.value = true

  const result = await ctr_traffic_source.GetLanguage(TS.GOOGLE)
  if (result.data) {
    languageOptions.value = result.data?.languages || []
  }

  disabledMacrosLanguage.value = false
}

const isMacroLanguage = (macro: string): boolean => {
  return macro === LANGUAGE_MACRO
}

const copyJson = () => {
  if (!formattedJson.value) {
    window.message.warning(`Result not found!`)
    return
  }

  const textToCopy =
    typeof formattedJson.value === 'object'
      ? JSON.stringify(formattedJson.value, null, 2)
      : String(formattedJson.value)

  helper.copyText(textToCopy)
  window.message.success(`Copied!`)
}

const changeModel = (value: string) => {
  usePromtDetail.testData.model = value

  usePromtDetail.testData.config = {}
  usePromtDetail.configsNow.forEach((element) => {
    usePromtDetail.testData.config[element] = ''
  })

  if (usePromtDetail.isPerplexityTest) {
    usePromtDetail.testData.web_source = ONOFF.OFF
  } else {
    usePromtDetail.testData.web_source = undefined
  }
}

const isInputJson = (str: string): boolean => {
  return str === INPUT_JSON
}
const isInputMacro = (str: string): boolean => {
  return str === INPUT_MACRO
}

function parseCurrency(input: string) {
  const nums = input.replace(/(,|\$|\s)/g, '').trim()
  if (/^\d+(\.\d+)?$/.test(nums)) return Number(nums)
  return nums === '' ? null : Number.NaN
}

function formatCurrency(value: number | null) {
  if (value === null) return ''
  // Giữ nguyên phần thập phân (không làm tròn)
  const [intPart, decimalPart] = value.toString().split('.')
  const formattedInt = Number(intPart).toLocaleString('en-US')
  return `$${
    decimalPart !== undefined ? `${formattedInt}.${decimalPart}` : formattedInt
  }`
}

const onInputNumber = (key: string) => {
  const val = usePromtDetail.testData.config[key] || ''
  usePromtDetail.testData.config[key] = val.replace(/[^0-9]/g, '')
}
</script>

<template>
  <div class="flex flex-col gap-4 relative p-1">
    <div>
      <div class="w-44 font-bold text-xs mb-1">Used Macros</div>
      <div class="flex-1 min-w-0 flex gap-4 flex-wrap">
        <n-tag
          type="info"
          v-for="item in usePromtDetail.usedMacros"
          :key="item"
          @click="usePromtDetail.copyMacro(item)"
          class="cursor-copy rounded-full n-tag-exclude"
        >
          {{ item }}
        </n-tag>
        <div
          v-if="usePromtDetail.usedMacros.length === 0"
          class="text-gray-400 italic text-xs"
        >
          No macros found
        </div>
      </div>
    </div>

    <div class="flex flex-col items-center gap-2">
      <FloatingWrapper name="Model">
        <n-select
          :loading="usePromtDetail.selectData.loadingModel"
          v-model:value="usePromtDetail.testData.model"
          :options="usePromtDetail.selectData.models"
          :render-label="usePromtDetail.selectData.renderLabel"
          filterable
          class="w-full flex-1 min-w-0"
          :on-update:value="changeModel"
        />
      </FloatingWrapper>

      <div class="grid grid-cols-3 gap-4 w-full">
        <div
          v-for="(config, key, index) in usePromtDetail.testData.config"
          :key="key + index"
          class="flex items-center"
        >
          <FloatingWrapper :name="key" class="flex-1 min-w-0">
            <n-input
              v-model:value="usePromtDetail.testData.config[key]"
              class="flex-1"
              @input="onInputNumber(key)"
            />
          </FloatingWrapper>
        </div>
      </div>
    </div>

    <PromptWebSource
      v-if="usePromtDetail.isPerplexityTest"
      v-model:value="usePromtDetail.testData.web_source"
    />

    <PromptLandingPage
      :data="usePromtDetail.testData"
      v-if="usePromtDetail.isPrompt13"
    />

    <!-- Inputs for testMacros -->
    <div
      class="flex flex-col gap-2"
      v-if="usePromtDetail.usedMacros.length > 0"
    >
      <div
        v-for="item in usePromtDetail.usedMacros"
        :key="item"
        class="flex items-center gap-2"
      >
        <FloatingWrapper :name="item" v-if="isMacroLanguage(item)">
          <n-select
            v-model:value="usePromtDetail.testMacros[item]"
            :options="languageOptions"
            :disabled="disabledMacrosLanguage"
            placeholder=""
            filterable
            value-field="name"
            label-field="name"
            class="flex-1 min-w-0"
            clearable
          />
        </FloatingWrapper>

        <div v-else-if="isInputJson(item)" class="flex gap-2 flex-col w-full">
          <FloatingWrapper name="creative_content_type">
            <n-select
              v-model:value="
                usePromtDetail.inputJsonMacros['creative_content_type']
              "
              :options="CreativeContentTypeOptions"
              placeholder=""
              clearable
            />
          </FloatingWrapper>
          <FloatingWrapper name="creative_content">
            <n-input
              v-model:value="usePromtDetail.inputJsonMacros['creative_content']"
              placeholder="Enter value"
              type="textarea"
            />
          </FloatingWrapper>
        </div>

        <div
          v-else-if="usePromtDetail.isPrompt46 && isInputMacro(item)"
          class="w-full flex flex-col gap-4"
        >
          <div class="font-bold text-xs">Input Macro</div>
          <FloatingWrapper
            v-for="(item, index) in usePromtDetail.input46Macros.contents"
            :name="'content [' + (index + 1) + ']'"
            :key="index"
            class="!w-[calc(100%-12px)]"
          >
            <n-input
              v-model:value="item.content"
              placeholder="Enter value"
              type="textarea"
            />
            <RemoveButton
              text="Remove"
              @onClick="usePromtDetail.input46Macros.contents.splice(index, 1)"
            />
          </FloatingWrapper>

          <n-button @click="usePromtDetail.addContentInput46()" class="w-14"
            >Add</n-button
          >
        </div>
        <FloatingWrapper v-else :name="item">
          <n-input
            v-model:value="usePromtDetail.testMacros[item]"
            placeholder="Enter value"
            class="flex-1 min-w-0"
            type="textarea"
          />
        </FloatingWrapper>
      </div>
    </div>

    <Image13
      v-if="usePromtDetail.isPrompt13 || usePromtDetail.isPrompt52Media"
    />

    <Text13 v-if="usePromtDetail.isPrompt13" />

    <div class="flex items-center gap-2">
      <!-- <div class="w-44 font-bold">&nbsp;</div> -->
      <div class="flex-1 min-w-0 text-gray-500 text-xs italic">
        Macros will be replaced when you click Test Now.
      </div>
    </div>

    <div class="flex items-center gap-2">
      <div class="flex-1 min-w-0">
        <FloatingWrapper name="Prompt">
          <n-input
            v-model:value="usePromtDetail.transformPrompt"
            :loading="usePromtDetail.statusData.isLoading"
            type="textarea"
            placeholder="prompt"
            :autosize="{
              minRows: 10,
              maxRows: 35,
            }"
            style="resize: both"
            maxlength="50000"
            show-count
          />
        </FloatingWrapper>
      </div>
    </div>

    <div class="flex flex-col gap-4">
      <div class="font-bold text-xs">Result</div>

      <div
        class="flex-1 min-w-0 border border-gray-200 px-3 pb-3 rounded max-h-[500px] overflow-y-scroll"
        style="scrollbar-width: thin"
        v-if="formattedJson"
      >
        <div class="sticky top-0 text-end py-2 ml-auto z-10">
          <button @click="copyJson">
            <n-icon :component="CopyOutline" size="18" />
          </button>
        </div>
        <vue-json-pretty
          :indent="8"
          class="whitespace-pre"
          showIcon
          :showLine="false"
          :data="formattedJson"
        />
      </div>

      <div v-else class="flex-1 min-w-0 text-gray-400 italic text-xs">
        No result found
      </div>

      <FloatingWrapper name="Cost">
        <n-input-number
          v-model:value="responseTest.cost"
          readonly
          placeholder="Cost"
          :show-button="false"
          :parse="parseCurrency"
          :format="formatCurrency"
        />
      </FloatingWrapper>

      <FloatingWrapper name="User Select Model">
        <n-input v-model:value="responseTest.user_selected_model" readonly />
      </FloatingWrapper>

      <FloatingWrapper name="Display Model">
        <n-input v-model:value="responseTest.display_model" readonly />
      </FloatingWrapper>
    </div>

    <div class="ml-auto sticky bottom-0 z-10 p-2">
      <n-button
        size="medium"
        type="warning"
        :loading="isSubmitting"
        @click="testPrompt"
      >
        Test Now
      </n-button>
    </div>
  </div>
</template>
<style scoped>
:deep(.vjs-value-string) {
  color: #4e9a06 !important;
}
:deep(.vjs-tree) {
  font-family: inherit;
}
</style>
