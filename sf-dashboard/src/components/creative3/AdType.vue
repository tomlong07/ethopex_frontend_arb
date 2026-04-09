<script setup lang="ts">
import {
  CreativeStateManager,
  StatusCreativeManager,
} from '@/types/components/creative-v2'
import { creativeTypeClass } from '@/types/components/creative-v2'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import {
  DemandGenAdTypeOptions,
  FBAdTypeOptions,
  GoogleDisplayAdTypeOptions,
  NewsbreakAdTypeOptions,
  PocPocBanerAdTypeOptions,
  TiktokAdTypeOptions,
} from '@/options/creative'

const props = defineProps({
  cre: {
    type: Object as () => creativeTypeClass,
    required: true,
  },

  stateManager: {
    type: Object as () => CreativeStateManager,
    required: true,
  },

  status: {
    type: Object as () => StatusCreativeManager,
    required: true,
  },
})
const adTypeOptions = computed<SelectOption[]>(() => {
  if (props.cre.IsDemandGen()) {
    return DemandGenAdTypeOptions.map((opt) => ({
      ...opt,
      disabled:
        opt.value === 'video' && props.cre.creative_media ? true : false,
    }))
  }

  if (props.cre.IsFacebook()) return FBAdTypeOptions

  if (props.cre.IsTikTok())
    return TiktokAdTypeOptions.map((opt) => ({
      ...opt,
      disabled: props.stateManager.isModalMode(),
    }))

  if (props.cre.IsPocpocBanner()) return PocPocBanerAdTypeOptions

  if (props.cre.IsNewsbreak()) return NewsbreakAdTypeOptions

  if (props.cre.IsGoogleDisplay()) return GoogleDisplayAdTypeOptions

  return []
})

const isShow = computed<boolean>(() => {
  return (
    props.cre.IsDemandGen() ||
    props.cre.IsFacebook() ||
    props.cre.IsPocpocBanner() ||
    props.cre.IsTikTok() ||
    props.cre.IsNewsbreak() ||
    props.cre.IsGoogleDisplay()
  )
})

watch(
  () => props.cre.type,
  async (newValue, oldValue) => {
    if (props.stateManager.isEditPage()) {
      return
    }

    switch (true) {
      case props.cre.IsDemandGen():
      case props.cre.IsFacebook():
      case props.cre.IsPocpocBanner():
      case props.cre.IsTikTok():
      case props.cre.IsNewsbreak():
      case props.cre.IsGoogleDisplay():
        props.cre.ad_type = adTypeOptions.value[0].value as string
        break
      default:
        props.cre.ad_type = undefined
        break
    }
  }
)
onMounted(() => {
  if (
    props.cre.IsGoogleDisplay() &&
    props.stateManager.isEditPage() &&
    !props.cre.ad_type
  ) {
    props.cre.ad_type = adTypeOptions.value[0].value as string
  }
})
watch(
  () => props.cre.ad_type,
  async (newValue, oldValue) => {
    if (
      props.stateManager.isEditPage() ||
      !isShow.value ||
      !props.cre.images ||
      !props.cre.images.length
    ) {
      return
    }
    if (!props.cre.creative_media) {
      props.status.previewItem = undefined
      props.cre.images = []
    }
  }
)
</script>

<template>
  <FloatingWrapper name="Ad Type" small rounded required v-if="isShow">
    <n-select
      v-model:value="props.cre.ad_type"
      :disabled="props.stateManager.isDisableType()"
      :options="adTypeOptions"
  /></FloatingWrapper>
</template>
