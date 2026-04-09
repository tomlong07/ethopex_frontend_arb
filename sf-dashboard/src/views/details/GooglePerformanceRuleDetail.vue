<script setup lang="ts">
import BackPage from '@/components/common/BackPage.vue'
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import { ModeClass } from '@/types/components/base'
import GooglePerformanceRule from '@/store/useGooglePerformanceRule'
import { useDrafting } from '@/composables/useDrafting'
import useModalStore from '@/store/useModalStore'
import { ctr_google_performance_rule } from '@/services/ctr_google_performance_rule'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'

const useGooglePerformanceRule = GooglePerformanceRule()
const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const modeData = helper.deepFreeze(new ModeClass(window.route)) as ModeClass

const id = Number(window.route.params.id || 0)
const modalStore = useModalStore()

const { draftingData, remove } = useDrafting('google_perform')
const isLoadingDraft = computed(() => modalStore.isLoading || false)
modalStore.title = 'Google Performance Rule'

onMounted(async () => {
  useGooglePerformanceRule.isLoadingSkeleton = true
  await useGooglePerformanceRule.loadConfig()
  try {
    if (modeData.isEditPage()) {
      const response = await ctr_google_performance_rule.GetByID(id)
      await useGooglePerformanceRule.setData(response.data)
    } else {
      useGooglePerformanceRule.clearData()
    }
  } catch (error) {
    window.message.error(`An error loading data: ${error}`)
  } finally {
    useGooglePerformanceRule.isLoadingSkeleton = false
  }
})

watch(
  () => modalStore.result,
  (v) => {
    if (v) {
      useGooglePerformanceRule.QuestionConfig = v
    }
  }
)

watch(
  () => useGooglePerformanceRule.QuestionConfig,
  (v) => {
    draftingData(toRef(v))
  },
  { immediate: true }
)
const formatDate = (isoString: any) => {
  return isoString.split('T')[0]
}

// Hàm xử lý submit form
const submitForm = async () => {
  useGooglePerformanceRule.isLoading = true

  if (!useGooglePerformanceRule.QuestionConfig) {
    useGooglePerformanceRule.isLoading = false
    return
  }

  const { QuestionConfig } = useGooglePerformanceRule

  QuestionConfig.logic_operators.forEach((item) => {
    item.conditions.forEach((condition) => {
      if (condition.condition_type === 'created_at') {
        condition.condition_value = formatDate(condition.condition_value)
      }
    })
  })

  try {
    const payload = {
      ...QuestionConfig,
    }

    // Xác định API call dựa trên chế độ (thêm mới hoặc cập nhật)
    const isAddMode = modeData.isAddPage()
    const apiCall = isAddMode
      ? await ctr_google_performance_rule.Add(payload)
      : await ctr_google_performance_rule.Update(payload)

    const result = await apiCall

    if (result?.status) {
      window.message.success(isAddMode ? 'Submit success!' : 'Update success!')
      if (isAddMode) {
        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      } else {
        const response = await ctr_google_performance_rule.GetByID(id)
        await useGooglePerformanceRule.setData(response.data)
      }
      remove()
    } else {
      useGooglePerformanceRule.infomationError = result
    }
  } catch (error) {
    window.message.error(`An error occurred, please try again! ${error}`)
  } finally {
    useGooglePerformanceRule.isLoading = false
  }
}
</script>
<template>
  <div class="wrapper flex flex-col bg-base px-3 flex-1">
    <div class="h-screen flex flex-col bg-base my-6 flex-1 gap-4">
      <BackPage
        :url="feSettings?.page_list"
        :name="useGooglePerformanceRule.name"
        v-if="feSettings?.page_list"
      />
      <div class="flex justify-center items-start">
        <div class="w-full max-w-[923px]">
          <Skeleton
            v-if="useGooglePerformanceRule.isLoadingSkeleton || isLoadingDraft"
          />
          <!-- Form chính của Google Performance Rule -->
          <template v-else>
            <n-grid
              v-if="useGooglePerformanceRule.QuestionConfig"
              x-gap="14"
              y-gap="14"
              cols="1 1366:2"
              class="mt-2"
            >
              <n-gi class="flex flex-col">
                <n-card class="flex flex-col h-full card-flex-gap-4">
                  <GGPerformanceName />
                  <GGPerformanceDescription />
                </n-card>
              </n-gi>
              <n-gi class="flex flex-col">
                <GroupButon v-if="modeData.isEditPage()" />

                <n-card class="flex flex-col h-full card-flex-gap-4">
                  <GGPerformanceStatus v-if="modeData.isEditPage()" />
                  <GGPerformanceStatusRunDaily />
                  <GGPerformanceAutoApply />
                  <GGPerformanceStatusApply />
                </n-card>
              </n-gi>
            </n-grid>
            <n-card
              v-show="!useGooglePerformanceRule.isLoadingSkeleton"
              title=""
              class="gap-1"
            >
              <!-- Conditions -->
              <GGPerformanceConditions
            /></n-card>

            <div class="flex flex-row-reverse sticky bottom-0 py-2">
              <div class="flex items-center gap-4">
                <n-button
                  color="#f43f5e"
                  size="medium"
                  type="success"
                  :disabled="useGooglePerformanceRule.isLoading"
                  :loading="useGooglePerformanceRule.isLoading"
                  @click="submitForm"
                >
                  Save
                </n-button>
              </div>
            </div>
          </template>
        </div>
      </div>
    </div>
  </div>
</template>
