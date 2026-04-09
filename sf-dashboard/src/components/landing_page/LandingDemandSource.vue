<script setup lang="ts">
import { DS } from '@/enum/campaign'
import ctr_demand_source from '@/services/ctr_demand_source'
import { ModeClassString } from '@/types/components/base'
import {
  landingTypeClass,
  PermissionLandingManage,
} from '@/types/components/landing'
import { SelectOption } from 'naive-ui'
import FloatingWrapper from '../common/FloatingWrapper.vue'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },

  modeData: {
    type: Object as () => ModeClassString,
    required: true,
  },

  permissionLanding: {
    type: Object as () => PermissionLandingManage,
    required: true,
  },
})
const isLoading = ref<boolean>(true)

const demandOptions = ref<SelectOption[]>([])

const fetchDemandOptions = async () => {
  isLoading.value = true

  const result = await ctr_demand_source.GetAllDemandSource()

  demandOptions.value = result?.data?.demand_sources || []

  const selected = props.landing.demand_source

  if (!demandOptions.value.length) {
    props.landing.demand_source = null
  } else {
    const found = demandOptions.value.find((opt) => opt.value === selected)
    if (!found) {
      props.landing.demand_source = demandOptions.value[0].value as DS
    }
  }

  isLoading.value = false
}

onMounted(async () => {
  fetchDemandOptions()
})

const name = `Demand Source`
</script>
<template>
  <FloatingWrapper :name="name" medium rounded required>
    <n-select
      v-model:value="props.landing.demand_source"
      :loading="isLoading"
      :placeholder="name"
      :options="demandOptions"
      label-field="name"
      :disabled="
        props.modeData.isEditPage() ||
        isLoading ||
        props.permissionLanding.isOnlyAcceptAICreate()
      "
    />
  </FloatingWrapper>
</template>
