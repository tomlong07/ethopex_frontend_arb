<script setup lang="ts">
import ListStars from '@/assets/icons/ListStars.vue'
import FloatingWrapper from '@/components/common/FloatingWrapper.vue'
import { ctr_crawl_campaign } from '@/services/ctr_crawl_campaign'
import modalCrawlCamp from '@/store/modalCrawlCamp'

const storeModalCrawl = modalCrawlCamp()

const loading = ref(false)

const getConfigDefaultOptions = async () => {
  if (!storeModalCrawl.dataCrawlCamp.traffic_source) return
  loading.value = true

  const result = await ctr_crawl_campaign.GetAllConfigDefault(
    storeModalCrawl.dataCrawlCamp.traffic_source
  )

  storeModalCrawl.configDefaultOptions = result?.data || []
  loading.value = false
}

watch(
  () => storeModalCrawl.dataCrawlCamp.traffic_source,
  (newValue) => {
    if (newValue) {
      getConfigDefaultOptions()
    }
  }
)

const updateConfigDefault = async (value: number) => {
  storeModalCrawl.dataCrawlCamp.config_default = value
  storeModalCrawl.getConfigDefaultByID(value)
}

onMounted(() => {
  getConfigDefaultOptions()
})

const menuOptions = computed(() => [
  {
    label: 'Create campaign preset',
    key: 'create_preset',
  },
  {
    label: 'Edit campaign preset',
    key: 'edit_preset',
    disabled: !storeModalCrawl.dataCrawlCamp.config_default,
  },
])

const handleMenu = (key: 'create_preset' | 'edit_preset') => {
  storeModalCrawl.openDrawerCampaignPreset(key)
}

const handleReceviePreset = async (data: any) => {
  if (!data) return
  updateConfigDefault(Number(data))
  await getConfigDefaultOptions()
}
</script>

<template>
  <div class="flex gap-3 items-center">
    <FloatingWrapper name="Campaign Preset" :required="true">
      <n-select
        v-model:value="storeModalCrawl.dataCrawlCamp.config_default"
        filterable
        value-field="id"
        label-field="name"
        placeholder=""
        :clearable="true"
        :options="storeModalCrawl.configDefaultOptions"
        :loading="loading"
        :disabled="loading || !storeModalCrawl.dataCrawlCamp.traffic_source"
        :on-update:value="updateConfigDefault"
      />
    </FloatingWrapper>
    <n-dropdown
      trigger="hover"
      :options="menuOptions"
      @select="handleMenu"
      class="custom-dropdown-adg-creative"
    >
      <n-button color="#f43f5e" type="default"><ListStars /></n-button>
    </n-dropdown>
    <PresetDrawer @submit-value="handleReceviePreset" />
  </div>
</template>
