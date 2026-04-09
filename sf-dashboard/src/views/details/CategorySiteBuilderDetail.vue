<script lang="ts" setup>
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/Skeleton.vue'
import useCategorySite from '@/store/useCategorySite'
import { storeToRefs } from 'pinia'
import { categorySiteCls } from '@/types/components/category_site'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'
import CategorySiteKeywordSet from '@/components/category_site/CategorySiteKeywordSet.vue'

const categorySiteStore = useCategorySite()
const { categorySite, isAddPage, isEditPage, isLoading } =
  storeToRefs(categorySiteStore)

const name = 'category site builder'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const kwSetComp = ref<InstanceType<typeof CategorySiteKeywordSet>>()

const textShow = computed<string>(() => {
  return isAddPage.value ? 'Add' : 'Edit'
})

onMounted(async () => {
  categorySiteStore.isLoadingPage = true
  categorySite.value = new categorySiteCls()
  if (isEditPage.value) await categorySiteStore.getCategoryById()

  categorySiteStore.isLoadingPage = false
})

const handleSubmit = async () => {
  categorySite.value.keyword_set = kwSetComp.value?.getDataKwSet()

  if (categorySite.value.name == '' || !categorySite.value.name) {
    window.message.error(`Submit failed: Name is required`)
    return
  }

  if (isAddPage.value) {
    const result = await categorySiteStore.create(categorySite.value)
    if (result?.status) {
      window.message.success(`Add ${name} successfully`)
      if (feSettings.value?.page_list) {
        window.router.push({ path: feSettings.value?.page_list })
      }
    }
  }

  if (isEditPage.value) {
    const result = await categorySiteStore.update(categorySite.value)
    if (result?.status) window.message.success(`Update ${name} successfully`)
  }
}
</script>

<template>
  <div class="wrapper flex flex-col bg-base px-6 flex-1">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full max-w-6xl">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
        />

        <div v-show="categorySiteStore.isLoadingPage" class="pt-4">
          <Skeleton />
        </div>
        <div
          v-show="!categorySiteStore.isLoadingPage"
          class="flex flex-col pt-4 gap-4"
        >
          <n-card :title="`${textShow} ${name}`" class="card-flex-gap-4">
            <CategorySiteName />
            <CategorySiteSlug v-if="isEditPage" />

            <CategorySiteType />

            <CategorySiteParentCategories
              v-if="categorySite.IsTypeCategory()"
            />
            <CategorySiteChildrenCategories
              v-if="categorySite.IsTypeCategory()"
            />

            <CategorySiteShowInHome />

            <CategorySiteUploadIcon v-if="categorySite.IsTypeCategory()" />

            <CategorySiteTitle />
            <CategorySiteDescription />

            <CategorySiteUploadThumb />
          </n-card>

          <CategorySiteListPosts />

          <CategorySiteKeywordSet
            :isInCateSiteBuilder="true"
            v-if="categorySite.IsTypeTrending()"
            ref="kwSetComp"
          />
        </div>
        <div class="flex flex-row-reverse sticky bottom-2 pt-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isLoading"
            :disabled="isLoading"
            @click="handleSubmit"
            class="ml-2"
          >
            Submit
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>
