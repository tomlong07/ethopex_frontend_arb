<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import {
  creativeTypeClass,
  defaultTitleItem,
  CreativeStateManager,
  defaultTitleItemFB,
} from '@/types/components/creative-v2'
import { ctr_filter_v2 } from '@/services/ctr_filter_v2'
import { ctr_creative } from '@/services/ctr_creative'
import { TS } from '@/enum/campaign'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import QuestionCircleRegular from '@/assets/icons/QuestionCircleRegular.vue'

import { useLocale } from '@/lang/messages'

const creativeAdd = useLocale(
  () => import('@/lang/vi/creative_add'),
  () => import('@/lang/en/creative_add')
)

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },
})

const emit = defineEmits<{
  (
    e: 'update-suggestions',
    value: { PrimaryText: string[]; Headline: string[] }
  ): void
  (e: 'open-ai-suggest'): void
  (e: 'generate-and-open'): void
}>()

const isLoadBtnFb = ref(false)
const isFirstClick = ref(true)

const handleChangeType = (value: string) => {
  props.cre.type = value as typeof props.cre.type

  if (props.cre.IsFacebook()) {
    props.cre.titles = [defaultTitleItemFB()]
    props.cre.call_to_action = 'LEARN_MORE'

    return
  }

  props.cre.titles = [defaultTitleItem()]
}

watch(
  () => props.cre.type,
  () => {
    if (
      props.cre.IsDemandGen() ||
      props.cre.IsPMax() ||
      props.cre.IsGoogleSearch() ||
      props.cre.IsGoogleDisplay()
    ) {
      if (!props.cre.site_icon) {
        props.cre.SetIconDefault()
      }
    } else {
      //Nếu show icon ko pải demand gen và là icon default của demand gen thì xóa bỏ
      if (props.cre.IsShowIcon() && props.cre.IsIconDefault()) {
        props.cre.site_icon = ''
      }
    }
    if (props.cre.IsSnapchat() && props.cre.creative_media == undefined) {
      props.cre.images = []
    }
    if (props.cre.IsNewsbreak()) {
    }
  }
)

const change = () => {
  const titles = props.cre.titles
  const primaryText: string[] = []
  const headline: string[] = []
  titles.forEach((t: any) => {
    if (t.ttArray && t.ttArray.length > 0) {
      const validHeadlines = t.ttArray.filter(
        (item: string) => item && item.trim() !== ''
      )
      headline.push(...validHeadlines)
    }
    if (t.lhArray && t.lhArray.length > 0) {
      const validTitles = t.lhArray.filter(
        (item: string) => item && item.trim() !== ''
      )
      primaryText.push(...validTitles)
    }
  })
  if (primaryText.length === 0 || headline.length === 0) {
    window.message.error(creativeAdd.value.valid)
    return null
  }
  return {
    primary_text: primaryText,
    headline: headline,
    traffic_source: TS.FACEBOOK,
  }
}

const handleButtonClick = async () => {
  const payload = change()
  if (!payload) return

  isLoadBtnFb.value = true
  try {
    const result = await ctr_creative.ToolAIGeneratedSuggest(payload)
    if (result && result.status && result.data) {
      emit('update-suggestions', {
        PrimaryText: result.data.PrimaryText,
        Headline: result.data.Headline,
      })
    } else {
      throw new Error()
    }
  } finally {
    isLoadBtnFb.value = false
  }
}

const handleOpenAISuggest = () => {
  if (isFirstClick.value) {
    emit('generate-and-open')
    isFirstClick.value = false // Đánh dấu đã nhấn lần đầu
  } else {
    emit('open-ai-suggest') // Từ lần sau: Chỉ mở drawer
  }
}
defineExpose({
  handleGenerateSuggestions: handleButtonClick,
})
onMounted(() => {
  getTypeCreative()
})

const isLoadingOptions = ref(false)
const typeOptions = ref<SelectOption[]>([])

// Computed để hiển thị tooltip khi ở modal mode
const showTypeTooltip = computed(() => {
  return props.stateManager.isModalMode() && props.stateManager.dataModal?.type
})

const typeTooltipText = computed(() => {
  const currentType = props.stateManager.dataModal?.type
  const typeLabel = typeOptions.value.find(opt => opt.value === currentType)?.label || currentType
  return `Creative type is locked to "${typeLabel}" to match the campaign type`
})

const getTypeCreative = async () => {
  isLoadingOptions.value = true
  const result = await ctr_filter_v2.GetCreativeType()

  typeOptions.value = result?.data || []

  const google = ['gg_search', 'gg_display', 'demand_gen', 'performance_max']

  if (props.stateManager.isModalMode()) {
    const currentType = props.stateManager.dataModal?.type
    const isGoogleType = currentType && google.includes(currentType as string)

    typeOptions.value = typeOptions.value.map((option) => {
      if (isGoogleType && option.value === currentType) {
        return option
      }

      if (!isGoogleType && option.value === currentType) {
        return option
      }

      return {
        ...option,
        disabled: true,
      }
    })
  }

  if (props.cre.type) {
    if (typeOptions.value?.length) {
      if (props.stateManager.isAddPage()) {
        const isValidType = typeOptions.value.some(
          (opt) => opt.value === props.cre.type
        )

        if (!isValidType) {
          props.cre.type = typeOptions.value[0].value as any
        }
      }
    } else {
      props.cre.type = null
    }
  }

  isLoadingOptions.value = false

  if (props.stateManager.isAddPage() && !props.stateManager.isDuplicatePage()) {
    handleChangeType(props.cre.type || '')
  }
}
</script>

<template>
  <div class="flex items-center">
    <FloatingWrapper name="Type" small rounded required>
      <template #extra>
        <n-tooltip trigger="hover" v-if="showTypeTooltip">
          <template #trigger>
            <n-icon size="12">
              <QuestionCircleRegular />
            </n-icon>
          </template>
          <div>{{ typeTooltipText }}</div>
        </n-tooltip>
      </template>

      <n-select
        v-model:value="props.cre.type"
        :disabled="props.stateManager.isDisableType()"
        :options="typeOptions"
        :on-update:value="handleChangeType"
    /></FloatingWrapper>

    <n-button
      class="ml-[10px]"
      type="primary"
      v-if="props.cre.IsFacebook() && props.cre.CheckButon()"
      @click="handleOpenAISuggest"
      >Open AI Suggest</n-button
    >
  </div>
</template>
