<script setup lang="ts">
import { SelectOption } from 'naive-ui'

import { accountCategoryConfigType } from '@/types/components/accountcategory'
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'

import CategoryInput from '@/components/category/CategoryInput.vue'
import PixelInput from '@/components/category/PixelInput.vue'
import ShowNameCategory from '@/components/category/ShowNameCategory.vue'
import { ctr_account_category } from '@/services/ctr_account_category'
import { useFeSettings } from '@/composables/feSettings'
import { FeSettings } from '@/class/fe_settings'

const ad_account = (window.route.params.ad_account as string) || ''

const feSettings = ref(new FeSettings())

useFeSettings(feSettings, window.route?.meta?.url as string)

const isDisable = ref(false)
const isLoading = ref(false)
const isSubmitBtnLoading = ref<boolean>(false)
const pixelOptions = ref<SelectOption[]>([])
const pixelCategoryOptions = ref<SelectOption[]>([])

const AccountcategoryConfig = ref<accountCategoryConfigType>({
  ad_account: ad_account,
  categories: [],
  pixels: [],
})

onMounted(async () => {
  isLoading.value = true
  const result = await ctr_account_category.GetAdAccount(ad_account)
  if (result?.status) {
    AccountcategoryConfig.value = result.data

    const toSelectOptions = (items: any[]) =>
      items.length > 0 ? items.map((item) => item.id) : []

    AccountcategoryConfig.value.pixels = toSelectOptions(result.data.pixels)
    pixelOptions.value = AccountcategoryConfig.value.pixels

    AccountcategoryConfig.value.categories = toSelectOptions(
      result.data.categories
    )
    pixelCategoryOptions.value = AccountcategoryConfig.value.categories
  } else {
    isDisable.value = true
  }

  isLoading.value = false
})

const submitForm = async () => {
  isSubmitBtnLoading.value = true
  // Log để kiểm tra dữ liệu trước khi submit
  const result = await ctr_account_category.Submit(
    ad_account,
    AccountcategoryConfig.value
  )

  if (result?.status) {
    window.message.success('Edit account category successfully')
  }
  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base mb-12 flex-1 gap-4">
      <BackPage
        v-if="feSettings?.page_list"
        :url="feSettings?.page_list"
        name="Account Category"
        class="mt-4"
      />
      <div v-show="isLoading">
        <Skeleton />
      </div>
      <div
        v-show="!isLoading"
        class="flex flex-col w-full lg:w-2/3 bg-base gap-4 mx-auto max-w-[1300px]"
      >
        <n-card title="Account Category" class="card-flex-gap-4">
          <!-- show name -->
          <div>
            <ShowNameCategory :accountcategoryConfig="AccountcategoryConfig" />
          </div>
          <!-- Ad Account -->
          <div>
            <CategoryAdAccount :accountcategoryConfig="AccountcategoryConfig" />
          </div>
          <!-- Categories -->
          <div>
            <CategoryInput :accountcategoryConfig="AccountcategoryConfig" />
          </div>
          <!-- Pixels -->
          <div>
            <PixelInput :accountcategoryConfig="AccountcategoryConfig" />
          </div>
        </n-card>
        <div class="flex flex-row-reverse sticky bottom-0 p-2">
          <n-button
            color="#f43f5e"
            size="medium"
            type="success"
            :loading="isSubmitBtnLoading"
            @click="submitForm"
          >
            Submit
          </n-button>
        </div>
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
.pixel-elm {
  .n-input:not(.n-input--autosize) {
    width: 25%;
  }
  .dynamic-button {
    padding: 0 0.5rem;
  }
}
</style>
