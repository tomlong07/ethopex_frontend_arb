<script setup lang="ts">
import { landingTypeClass, StatusState } from '@/types/components/landing'
import { SelectOption } from 'naive-ui'
import useLandingStoreNew from '@/store/details/landingNewStore'
import { ctr_category } from '@/services/ctr_category'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const landingNewStore = useLandingStoreNew()
const props = defineProps({
  statusState: {
    type: Object as () => StatusState,
    required: true,
  },

  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const isLoading = ref(false)
const categoryOptions = ref<SelectOption[]>([])

const isShow = computed(() => {
  if (landingNewStore.permissions.landingLite) return false

  return true
})

const autoTier = () => {
  if (!props.landing.category_iab) return
  const selectedOption = categoryOptions.value.find(
    (option) => option.id === props.landing.category_iab
  )
  if (selectedOption) {
    changeTier(props.landing.category_iab, selectedOption)
  } else {
    if (isShow.value) {
      window.message.error(
        `Main category "${props.landing.category_iab}" was not found in the options.`
      )
    }
  }
}

const getCategoryTier = async () => {
  isLoading.value = true

  const result = await ctr_category.getCategoryIAB()

  categoryOptions.value = result?.data || []

  autoTier()

  isLoading.value = false
}

const changeTier = (value: number, option: SelectOption) => {
  props.landing.category_iab = value
  props.landing.tier_1 = (option.tier_1 as string) || ''
  props.landing.tier_2 = (option.tier_2 as string) || ''
  props.landing.tier_3 = (option.tier_3 as string) || ''
  props.landing.tier_4 = (option.tier_4 as string) || ''
}

onMounted(() => {
  if (isShow.value) {
    getCategoryTier()
  }
})

const name = `Main Category`

const tiers = computed(() => [
  props.landing.tier_1,
  props.landing.tier_2,
  props.landing.tier_3,
  props.landing.tier_4,
])

watch(
  () => props.statusState.showModal,
  (newValue) => {
    if (!newValue && isShow.value) {
      autoTier()
    }
  }
)
</script>
<template>
  <FloatingWrapper :name="name" medium rounded v-if="isShow">
    <div class="flex items-center gap-2">
      <n-select
        v-model:value="props.landing.category_iab"
        filterable
        value-field="id"
        label-field="name"
        :placeholder="name"
        :loading="isLoading"
        :options="categoryOptions"
        :on-update:value="changeTier"
      />
    </div>
  </FloatingWrapper>

  <div
    class="flex flex-wrap justify-between flex-1 gap-2"
    v-if="isShow && props.landing.category_iab"
  >
    <div
      v-for="(value, idx) in tiers"
      :key="idx"
      class="flex flex-col w-[calc(25%-12px)] min-w-[120px] p-3 rounded-lg border bg-white shadow-sm"
    >
      <div class="text-sm font-semibold text-gray-500 mb-1">
        Tier {{ idx + 1 }}
      </div>
      <div class="text-gray-800">{{ value }}</div>
    </div>
  </div>
</template>
