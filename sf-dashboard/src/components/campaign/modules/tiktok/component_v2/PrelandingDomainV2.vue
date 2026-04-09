<script setup lang="ts">
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ONOFF } from '@/enum/campaign'
import { ctr_domain } from '@/services/ctr_domain'
import { CampaignContext } from '@/types/components/campaign-v2'
import { SelectOption } from 'naive-ui'

const props = defineProps({
  data: {
    type: Object as () => CampaignContext,
    required: true,
  },
})
const isShow = computed(() => {
  return props.data.campaign.prelanding === ONOFF.ON
})

const isLoading = ref(false)
const options = ref<SelectOption[]>()

const fetchDomains = async () => {
  isLoading.value = true

  const result = await ctr_domain.GetPrelanderDomain()

  options.value = result?.data || []

  isLoading.value = false
}

const autoSelectFirst = () => {
  if (!props.data.campaign?.prelanding_domain && options.value?.length) {
    props.data.campaign.prelanding_domain = options.value[0].value as string
  }
}

watch(
  () => isShow.value,
  async (newValue) => {
    if (newValue) {
      await fetchDomains()
      autoSelectFirst()
    } else {
      props.data.campaign.prelanding_domain = null
    }
  }
)

onMounted(async () => {
  if (isShow.value) {
    await fetchDomains()
    autoSelectFirst()
  }
})

const name = `Prelanding Domain`
</script>
<template>
  <FloatingWrapper :name="name" rounded v-if="isShow">
    <n-select
      v-model:value="props.data.campaign.prelanding_domain"
      :placeholder="name"
      class="mt-1"
      filterable
      clearable
      :loading="isLoading"
      :options="options"
    />
  </FloatingWrapper>
</template>
