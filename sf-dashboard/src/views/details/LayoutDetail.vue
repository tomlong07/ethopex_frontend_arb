<script setup lang="ts">
import { FormInst, FormRules } from 'naive-ui'
import Skeleton from '@/components/skeleton/skeletonDetailFull.vue'
import BackPage from '@/components/common/BackPage.vue'
import 'codemirror/theme/monokai.css' // 🌙 Theme xám tối (có thể đổi thành "dracula")

import LayoutDetail from '@/store/details/LayoutDetail'
import { LayoutItem } from '@/store/useLayoutStore'
import { ctr_layout } from '@/services/ctr_layout'
import { FeSettings } from '@/class/fe_settings'
import { useFeSettings } from '@/composables/feSettings'
import Html from '@/components/layout_detail/LayoutHtml.vue'
import Name from '@/components/layout_detail/LayoutName.vue'
import RunOnNetwork from '@/components/layout_detail/LayoutRunOnNetwork.vue'
import Prelander from '@/components/layout_detail/Prelander.vue'
import Type from '@/components/layout_detail/LayoutType.vue'
import Vue from '@/components/layout_detail/LayoutVue.vue'
const useLayoutDetail = LayoutDetail()
if (useLayoutDetail.isAddPage) {
  useLayoutDetail.clearData()
}

const name = `layout`
const tabNow = ref('configs')
const duplicateId = Number(window.route.query.duplicate || 0)

const textShow = computed<string>(() => {
  return useLayoutDetail.isAddPage ? 'Add' : 'Edit'
})

const feSettings = ref<FeSettings>()
useFeSettings(feSettings, window.route?.meta?.url as string)

const formRef = ref<FormInst | null>(null)

const rules = computed<FormRules>(() => {
  return {
    name: [
      {
        required: true,
        message: `Please input ${name} name`,
        trigger: ['input', 'blur'],
      },
    ],

    content: [
      {
        required:
          useLayoutDetail.layoutConfig.type == 'content' ||
          useLayoutDetail.layoutConfig.type == 'search',
        message: `Please input ${name} content`,
        trigger: ['input', 'blur'],
      },
    ],
    search: [
      {
        required: useLayoutDetail.isOnSearch,
        message: `Please input ${name} search`,
        trigger: ['input', 'blur'],
      },
    ],

    config: [
      {
        required: true,
        message: `Please input ${name} config`,
        trigger: ['input', 'blur'],
      },
    ],
  }
})

const submitForm = async () => {
  useLayoutDetail.isSubmitBtnLoading = true

  try {
    await formRef.value?.validate()

    if (useLayoutDetail.isAddPage) {
      const result = await ctr_layout.Add(useLayoutDetail.layoutConfig)

      if (result?.status) {
        window.message.success(`Add ${name} successfully`)

        if (feSettings.value?.page_list) {
          window.router.push({ path: feSettings.value.page_list })
        }
      } else {
        useLayoutDetail.infomationError = result
      }
    }

    if (useLayoutDetail.isEditPage) {
      const result = await ctr_layout.Edit(
        useLayoutDetail.id,
        useLayoutDetail.layoutConfig
      )

      if (result?.status) {
        window.message.success(`Update ${name} successfully`)
        getById()
        return
      } else {
        useLayoutDetail.infomationError = result
      }
    }
  } finally {
    useLayoutDetail.isSubmitBtnLoading = false
  }
}

const getById = async () => {
  useLayoutDetail.isLoading = true

  const idReq = useLayoutDetail.isEditPage ? useLayoutDetail.id : duplicateId

  const result = await ctr_layout.Get(idReq)

  useLayoutDetail.layoutConfig = new LayoutItem(result?.data || {})

  useLayoutDetail.domains =
    (useLayoutDetail.layoutConfig.domain_config?.map(
      (config) => config.domain
    ) as string[]) || []

  useLayoutDetail.isLoading = false
}

onMounted(async () => {
  if (useLayoutDetail.isEditPage || duplicateId !== 0) {
    getById()
  }
})
</script>

<template>
  <div class="min-h-screen flex flex-col bg-base px-3 flex-1">
    <div class="flex justify-center mt-6">
      <div class="2xl:w-4/6 xl:w-full lg:w-full md:w-full sm:w-full">
        <BackPage
          :url="feSettings?.page_list"
          :name="name"
          v-if="feSettings?.page_list"
        />
        <Skeleton v-if="useLayoutDetail.isLoading" />
        <div v-else class="flex flex-wrap gap-4 my-6">
          <n-card :title="`${textShow} ${name}`" class="rounded-xl">
            <n-form
              ref="formRef"
              :model="useLayoutDetail.layoutConfig"
              :rules="rules"
            >
              <div class="mx-auto bg-white sm:w-full flex flex-col gap-4">
                <Name />
                <RunOnNetwork />
                <Prelander />
                <Type />
                <div class="sm:flex pt-5" v-if="useLayoutDetail.isEditPage">
                  <n-tabs
                    v-model:value="tabNow"
                    type="card"
                    tab-style="min-width: 80px;"
                    class="custom-text-layout"
                  >
                    <n-tab-pane
                      name="html"
                      tab="Layout HTML"
                      v-if="useLayoutDetail.layoutConfig.IsContent()"
                    >
                      <Html />
                    </n-tab-pane>
                    <!-- <n-tab-pane
                      name="vue"
                      tab="Layout Vue"
                      v-if="useLayoutDetail.layoutConfig.IsContent()"
                    >
                      <Vue />
                    </n-tab-pane> -->

                    <n-tab-pane
                      name="configs"
                      tab="Domain Configs"
                      v-if="useLayoutDetail.isEditPage"
                    >
                      <LayoutDomainConfigs v-if="!useLayoutDetail.isLoading" />
                    </n-tab-pane>
                  </n-tabs>
                </div>
              </div>
            </n-form>
            <div class="flex flex-row-reverse sticky bottom-0">
              <n-button
                color="#f43f5e"
                size="medium"
                :loading="useLayoutDetail.isSubmitBtnLoading"
                @click="submitForm"
              >
                Submit
              </n-button>
            </div>
          </n-card>
        </div>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.disabled-notify {
  .n-form-item-feedback-wrapper {
    opacity: 0;
  }
}

/* 📌 Tăng kích thước chữ và khoảng cách dòng */
.code-editor-layout .CodeMirror {
  font-size: 14px;
  /* Chữ to hơn */
  line-height: 1.6;
  /* Dễ đọc hơn */
}
</style>
<style scoped>
.h-500 {
  height: 500px;
}
</style>
