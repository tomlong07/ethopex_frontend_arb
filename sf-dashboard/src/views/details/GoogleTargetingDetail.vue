<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'

import { ctr_google_targeting } from '@/services/ctr_google_targeting'
import useGgTargetStore from '@/store/details/useGgTargetStore'
import DataSourceSelect from '@/components/google_targeting/DataSourceSelect.vue'
import TypeSelect from '@/components/google_targeting/TypeSelect.vue'
import DomainInput from '@/components/google_targeting/DomainInput.vue'
import SellerInput from '@/components/google_targeting/SellerInput.vue'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const dataConfig = useGgTargetStore()
const isSubmitBtnLoading = ref(false)

onBeforeMount(() => {
  dataConfig.clearData()
})
const submitForm = async () => {
  isSubmitBtnLoading.value = true

  // Kiểm tra xem domains có dữ liệu và là một chuỗi không
  if (
    typeof dataConfig.googleTargetingConfig.domains === 'string' &&
    dataConfig.googleTargetingConfig.domains.trim()
  ) {
    // Chuyển đổi chuỗi thành mảng chuỗi dựa trên dấu phẩy và xuống dòng
    dataConfig.googleTargetingConfig.domains =
      dataConfig.googleTargetingConfig.domains
        .split(/,|\n/) // Tách theo dấu phẩy hoặc xuống dòng
        .map((domain) => domain.trim()) // Loại bỏ khoảng trắng xung quanh mỗi domain
        .filter((domain) => domain) // Loại bỏ các domain trống

    //xóa bỏ params thừa của app
    for (
      let index = 0;
      index < dataConfig.googleTargetingConfig.domains.length;
      index++
    ) {
      const element = dataConfig.googleTargetingConfig.domains[index]

      if (
        element.includes('itunes.apple.com') ||
        element.includes('apps.apple.com')
      ) {
        if (dataConfig.googleTargetingConfig.domains[index].includes('?')) {
          dataConfig.googleTargetingConfig.domains[index] =
            dataConfig.googleTargetingConfig.domains[index].split('?')[0]
        } else {
          if (dataConfig.googleTargetingConfig.domains[index].includes('&')) {
            dataConfig.googleTargetingConfig.domains[index] =
              dataConfig.googleTargetingConfig.domains[index].split('&')[0]
          }
        }

        dataConfig.googleTargetingConfig.domains[index] =
          dataConfig.googleTargetingConfig.domains[index].replace(/\n/g, '')
      }

      if (element.includes('play.google.com')) {
        if (dataConfig.googleTargetingConfig.domains[index].includes('&')) {
          dataConfig.googleTargetingConfig.domains[index] =
            dataConfig.googleTargetingConfig.domains[index].split('&')[0]
        }

        dataConfig.googleTargetingConfig.domains[index] =
          dataConfig.googleTargetingConfig.domains[index].replace(/\n/g, '')
      }
    }
  } else {
    // Không cần convert nếu domain rỗng hoặc không phải là chuỗi
    dataConfig.googleTargetingConfig.domains = []
  }

  const result = await ctr_google_targeting.Add(
    dataConfig.googleTargetingConfig
  )
  if (result.status) {
    if (feSettings.value?.page_list) {
      window.router.push({ path: feSettings.value.page_list })
    }
    window.message.success('Submit successfully!')
  } else {
    dataConfig.infomationError = result
  }

  isSubmitBtnLoading.value = false
}
</script>
<template>
  <div class="min-h-screen flex flex-col bg-base px-3 flex-1 mt-4">
    <div class="flex justify-center mt-6 items-center">
      <div class="w-full 5xl:w-1/2">
        <BackPage
          :url="feSettings?.page_list"
          :name="'Google Targeting'"
          v-if="feSettings?.page_list"
        />
        <div class="flex justify-center items-start">
          <div class="w-full max-w-[923px]">
            <div class="flex justify-center mt-6">
              <n-card title="Google Targeting" class="rounded-xl">
                <DataSourceSelect />
                <TypeSelect />
                <DomainInput />
                <SellerInput />
              </n-card>
            </div>
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
    </div>
  </div>
</template>
<style lang="scss"></style>
