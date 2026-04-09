<script setup lang="ts">
import { useCrawlFacebookTemplate } from '@/store/details/crawlFacebookTemplate'
import { useCrawlGoogleTemplate } from '@/store/details/crawlGoogleTemplate'
import { useCrawlTaboolaTemplate } from '@/store/details/crawlTaboolaTemplate'
import modalCrawlCamp from '@/store/modalCrawlCamp'

const storeModalCrawl = modalCrawlCamp()
const crawlFacebookTemplateStore = useCrawlFacebookTemplate()
const crawlGoogleTemplateStore = useCrawlGoogleTemplate()
const crawlTaboolaTemplateStore = useCrawlTaboolaTemplate()

const isLoadingInit = ref(true)
const isLoadingSubmit = ref(false)

const emit = defineEmits(['submitValue'])

const initialCrawFacbook = async () => {
  if (!storeModalCrawl.typeDrawerPreset) return

  if (storeModalCrawl.typeDrawerPreset === 'create_preset') {
    crawlFacebookTemplateStore.clearData()
  }

  if (
    storeModalCrawl.typeDrawerPreset === 'edit_preset' &&
    storeModalCrawl.dataCrawlCamp.config_default
  ) {
    await crawlFacebookTemplateStore.fetchFacebookTemplate(
      storeModalCrawl.dataCrawlCamp.config_default
    )
  }
}

const initialCrawGoogle = async () => {
  if (!storeModalCrawl.typeDrawerPreset) return

  if (storeModalCrawl.typeDrawerPreset === 'create_preset') {
    crawlGoogleTemplateStore.clearData()
  }

  if (
    storeModalCrawl.typeDrawerPreset === 'edit_preset' &&
    storeModalCrawl.dataCrawlCamp.config_default
  ) {
    await crawlGoogleTemplateStore.fetchGoogleTemplate(
      storeModalCrawl.dataCrawlCamp.config_default
    )
  }
}

const initialCrawTaboola = async () => {
  if (!storeModalCrawl.typeDrawerPreset) return

  if (storeModalCrawl.typeDrawerPreset === 'create_preset') {
    crawlTaboolaTemplateStore.clearData()
  }

  if (
    storeModalCrawl.typeDrawerPreset === 'edit_preset' &&
    storeModalCrawl.dataCrawlCamp.config_default
  ) {
    await crawlTaboolaTemplateStore.fetchDataTaboola(
      storeModalCrawl.dataCrawlCamp.config_default
    )
  }
}

const onAfterEnter = async () => {
  try {
    isLoadingInit.value = true

    switch (true) {
      case storeModalCrawl.dataCrawlCamp.IsFacebookTS():
        await initialCrawFacbook()
        break
      case storeModalCrawl.dataCrawlCamp.IsGoogleTS():
        await initialCrawGoogle()
        break
      case storeModalCrawl.dataCrawlCamp.IsTaboolaTS():
        await initialCrawTaboola()
        break
      default:
        break
    }
  } catch {
    console.log('error onAfterEnter')
  } finally {
    isLoadingInit.value = false
  }
}

const submitByPlatform = async () => {
  if (storeModalCrawl.dataCrawlCamp.IsFacebookTS())
    return crawlFacebookTemplateStore.submitForm()

  if (storeModalCrawl.dataCrawlCamp.IsGoogleTS())
    return crawlGoogleTemplateStore.submitForm()

  if (storeModalCrawl.dataCrawlCamp.IsTaboolaTS())
    return crawlTaboolaTemplateStore.submitForm()

  throw new Error('Unsupported platform')
}

const handleSubmit = async () => {
  isLoadingSubmit.value = true
  try {
    const result = await submitByPlatform()

    if (result.status && result.data) {
      storeModalCrawl.closeDrawerCampaignPreset()
      emit('submitValue', result.data)
    }
  } catch (e) {
    console.log(e)
  } finally {
    isLoadingSubmit.value = false
  }
}

watch(
  () => storeModalCrawl.showDrawerPreset,
  (show) => {
    if (show) {
      isLoadingInit.value = true
    }
  }
)
</script>
<template>
  <n-drawer
    v-model:show="storeModalCrawl.showDrawerPreset"
    :width="650"
    placement="right"
    @after-enter="onAfterEnter"
  >
    <n-drawer-content
      content-class="relative"
      :title="
        storeModalCrawl.typeDrawerPreset === 'create_preset'
          ? 'Create Campaign Presets'
          : 'Edit Campaign Presets'
      "
    >
      <div v-if="isLoadingInit">
        <Skeleton />
      </div>
      <div v-else class="pressets_drawer">
        <crawl-fb-body v-if="storeModalCrawl.dataCrawlCamp.IsFacebookTS()" />
        <crawl-g-g-body v-if="storeModalCrawl.dataCrawlCamp.IsGoogleTS()" />
        <crawl-t-b-body v-if="storeModalCrawl.dataCrawlCamp.IsTaboolaTS()" />
      </div>

      <div class="flex flex-row-reverse sticky bottom-0">
        <n-button
          color="#f43f5e"
          size="medium"
          type="success"
          @click="handleSubmit"
          :loading="isLoadingSubmit"
        >
          Submit
        </n-button>
      </div>
    </n-drawer-content>
  </n-drawer>
</template>
