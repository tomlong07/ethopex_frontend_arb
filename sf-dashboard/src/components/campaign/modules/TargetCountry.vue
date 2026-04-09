<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import { ref, computed } from 'vue'
import { campaignTypeClass } from '@/types/components/campaign-v2'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_traffic_source } from '@/services/ctr_traffic_source'
import CustomSwitch from '@/components/common/CustomSwitch.vue'
import { INEX } from '@/enum/campaign'

const props = defineProps({
  campaign: {
    type: Object as () => campaignTypeClass,
    required: true,
  },
})

const targetCountryOptionsRaw = ref<SelectOption[]>([])
const isLoading = ref(false)

const fetchTargetCountry = async () => {
  isLoading.value = true
  const result = await ctr_traffic_source.GetCountries({
    traffic_source: props.campaign.traffic_source,
  })
  targetCountryOptionsRaw.value =
    result?.data?.coutries?.map((item: any) => ({
      label: item.name,
      value: item.value,
    })) || []
  isLoading.value = false
}
const targetCountryOptions = computed(() =>
  targetCountryOptionsRaw.value.filter(opt => opt.value !== 'ALL')
)

// Kiểm tra xem có option nào được chọn chưa
const hasSelectedCountries = computed(() => {
  return (props.campaign.filters?.country?.values?.length ?? 0) > 0
})

watch(
  () => props.campaign.filters?.country?.values?.length,
  (newLength) => {
    const country = props.campaign.filters?.country
    if (!country) return

    if (newLength === 0 && country.operator === INEX.EXCLUDE) {
      country.operator = INEX.INCLUDE
    }
  }
)

onMounted(() => {
  if (!props.campaign.filters) {
    props.campaign.filters = {}
  }

  if (!props.campaign.filters.country) {
    props.campaign.filters.country = {
      values: [],
      operator: INEX.INCLUDE,
    }
  }

  fetchTargetCountry()
})

</script>

<template>
  <div
    v-if="props.campaign.filters && props.campaign.filters?.country"
    class="flex-1 min-w-0 flex items-center gap-2 name-affect-comp"
  >
    <FloatingWrapper name="Target Country">
      <n-select
        v-model:value="props.campaign.filters.country.values"
        :options="targetCountryOptions"
        filterable
        clearable
        multiple
        :loading="isLoading"
        placeholder="All"
      />
    </FloatingWrapper>
    <CustomSwitch
      v-model="props.campaign.filters.country.operator"
      type="inex"
      true-label="Include"
      false-label="Exclude"
      size="small"
      :disabled="!hasSelectedCountries"
    />
  </div>
</template>