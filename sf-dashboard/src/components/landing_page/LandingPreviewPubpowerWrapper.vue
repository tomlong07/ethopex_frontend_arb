<script setup lang="ts">
import { SelectOption } from 'naive-ui'
import LandingPreviewPubpower from '@/components/landing_page/cell/LandingPreviewPubpower.vue'
import { landingTypeClass } from '@/types/components/landing'
import { DS } from '@/enum/campaign'
import { ctr_layout } from '@/services/ctr_layout'

const props = defineProps({
  landing: {
    type: Object as () => landingTypeClass,
    required: true,
  },
})

const layoutOptions = ref<SelectOption[]>([])

const fetchLayoutOptions = async () => {
  // const result = await ctr_layout.List({})
  const result = await ctr_layout.Layouts({ demand_source: DS.PUBPOWER })

  const newData = result?.data || []
  layoutOptions.value = newData.map((item: any) => {
    return {
      value: item.id,
      label: item.name,
    }
  })
}

onMounted(() => {
  fetchLayoutOptions()
})
</script>

<template>
  <LandingPreviewPubpower
    :layoutOptions="layoutOptions"
    :preview="props.landing.preview || ''"
  />
</template>
