<script setup lang="ts">
import { ctr_landing_page } from '@/services/ctr_landing_page'
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import { SelectOption } from 'naive-ui'
import useLandingStoreNew from '@/store/details/landingNewStore'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const landingNewStore = useLandingStoreNew()

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  permissionLanding: {
    type: Object as () => PermissionLandingManage,
    required: true,
  },
})
const isShow = computed<boolean>(() => {
  if (landingNewStore.permissions.landingSpecial) return false

  return props.landing.prelander === 'off'
})

const languageAdsense = ref<SelectOption[]>([])

const fetchLanguages = async () => {
  const fetchLanguage = await ctr_landing_page.GetAllLanguage()
  if (fetchLanguage?.status) {
    languageAdsense.value = fetchLanguage.data
  }
}

watch(
  () => isShow.value,
  (newValue, oldValue) => {
    if (newValue) {
      fetchLanguages()
    } else {
      props.landing.language = undefined
    }
  }
)

onMounted(() => {
  if (isShow.value) {
    fetchLanguages()
  }
})

const name = 'Language'
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <n-select
      v-model:value="props.landing.language"
      value-field="value"
      label-field="name"
      filterable
      :disabled="
        props.permissionLanding.isOnlyAcceptAICreate() &&
        props.landing.IsShowContentDescription()
      "
      :options="languageAdsense"
    />
  </FloatingWrapper>
</template>
