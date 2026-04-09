<script setup lang="ts">
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'

import BackPage from '@/components/common/BackPage.vue'
import useDomainManagerStore from '@/store/details/useDomainManager'
import { ctr_domain } from '@/services/ctr_domain'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const name = 'domain manager'
const domainConfig = useDomainManagerStore()

const id = Number(window.route.params?.id || 0)
const duplicate = Number(window.route?.query?.duplicate) || 0
const isSubmitBtnLoading = ref<boolean>(false)

const payload = computed(() => {
  const obj = helper.clone(domainConfig.dataConfig)
  return obj
})

const isAddPage = computed<boolean>(() => id === 0)
const isEditPage = computed<boolean>(() => {
  return !isAddPage.value
})

const textShow = computed<string>(() => {
  return isAddPage.value ? 'Add' : 'Edit'
})

onMounted(async () => {
  domainConfig.isLoading = true

  try {
    if (isAddPage.value && !duplicate) {
      domainConfig.clearData()
      return
    }

    if (isEditPage.value) {
      const result = await ctr_domain.GetByID(id)
      domainConfig.dataConfig = result?.data || {}
      domainConfig.dataConfig.config = JSON.stringify(
        JSON.parse(result?.data.config),
        null,
        2
      )
      return
    }

    if (duplicate) {
      const result = await ctr_domain.GetByID(duplicate)
      domainConfig.dataConfig = result?.data || {}
      domainConfig.dataConfig.domain = ''
      domainConfig.dataConfig.id = 0
      domainConfig.dataConfig.config = JSON.stringify(
        JSON.parse(result?.data.config),
        null,
        2
      )
      return
    }
  } finally {
    domainConfig.isLoading = false
  }
})

const submitForm = async () => {
  const dectectJson = helper.isValidJSON(domainConfig.dataConfig.config)
  if (domainConfig.dataConfig.domain == '') {
    window.message.error(`Submit failed: Name of ${name} is required`)
    return
  }
  if (dectectJson) {
    domainConfig.dataConfig.config = JSON.stringify(
      JSON.parse(domainConfig.dataConfig.config),
      null,
      2
    )
  }
  isSubmitBtnLoading.value = true

  if (isAddPage.value) {
    const result = await ctr_domain.Add(payload.value)
    if (result?.status) {
      window.message.success(`Add ${name} successfully`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await ctr_domain.Update(id, domainConfig.dataConfig)
    if (result?.status) window.message.success(`Update ${name} successfully`)
  }

  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4 mt-6">
      <BackPage
        :url="feSettings?.page_list"
        :name="name"
        v-if="feSettings?.page_list"
      />
      <div v-show="domainConfig.isLoading">
        <Skeleton />
      </div>

      <div
        v-show="!domainConfig.isLoading"
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card :title="`${textShow} ${name}`" class="card-flex-gap-4">
          <DomainManagerName />
          <DomainManagerStatus />
          <DomainManagerLogo />
          <DomainManagerType />
          <DomainManagerBrand />
          <DomainManagerAdsenseAccountArb />
          <DomainManagerGamId />
          <DomainManagerCustomAds />
          <DomainManagerConfigDomain />
          <div class="flex flex-row-reverse sticky bottom-0 p-2 z-10">
            <n-button
              color="#f43f5e"
              size="medium"
              type="success"
              :disabled="domainConfig.isDisable"
              :loading="isSubmitBtnLoading"
              @click="submitForm"
            >
              Save
            </n-button>
          </div>
        </n-card>
      </div>
    </div>
  </div>
</template>
<style scoped lang="scss">
.tab-pane-pixels {
  border-left: 1px solid rgb(239, 239, 245);
  border-right: 1px solid rgb(239, 239, 245);
  border-bottom: 1px solid rgb(239, 239, 245);
}

.input-custom-width-dm {
  width: calc(100% - 5rem);
}
</style>
